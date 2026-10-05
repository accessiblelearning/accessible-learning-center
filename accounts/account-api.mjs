import { accountStore } from './store.mjs';
import { validateProgress, progressKey } from './progress.mjs';
const reply=(status,body)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const fail=(status,message)=>{throw Object.assign(new Error(message),{status});};
export function accountGate(env) {
  // Deliberately no production mode. Browser flags cannot change these server bindings.
  if (env.ACCOUNT_MODE !== 'pilot' || !['test','pilot'].includes(env.ACCOUNT_ENVIRONMENT)) return 'off';
  if (!env.ACCOUNT_IDENTITY?.fetch || !env.ACCOUNT_DB?.prepare || !env.ACCOUNT_DB?.batch || !env.ACCOUNT_ISSUER || !env.ACCOUNT_AUDIENCE || !env.ACCOUNT_ORIGIN) return 'unconfigured';
  return 'pilot';
}
async function readBody(request) {
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) fail(415,'Use JSON.');
  const reader=request.body?.getReader(); if (!reader) fail(400,'Missing request.');
  const chunks=[]; let length=0;
  while (true) { const {value,done}=await reader.read(); if(done) break; length+=value.length; if(length>65536){await reader.cancel();fail(413,'Request too large.');} chunks.push(value); }
  const bytes=new Uint8Array(length); let offset=0; for(const part of chunks){bytes.set(part,offset);offset+=part.length;}
  try { return JSON.parse(new TextDecoder().decode(bytes)); } catch { fail(400,'Invalid JSON.'); }
}
async function identify(request,env,store) {
  const authorization=request.headers.get('Authorization') || '';
  if (!/^Bearer [A-Za-z0-9._~-]{10,8192}$/.test(authorization)) fail(401,'Sign-in required.');
  let response, identity;
  try {
    // A future provider adapter must verify signatures, issuer/audience, expiry and revocation.
    // This trusted service binding is intentionally absent from current deployment config.
    response=await env.ACCOUNT_IDENTITY.fetch('https://identity.internal/verify',{method:'POST',headers:{Authorization:authorization}});
    if(!response.ok) fail(401,'Session unavailable.');
    identity=await response.json();
  } catch { fail(401,'Session unavailable.'); }
  if (!identity || typeof identity.subject !== 'string' || !identity.subject || identity.subject.length>200 || identity.issuer !== env.ACCOUNT_ISSUER || identity.audience !== env.ACCOUNT_AUDIENCE || !Number.isFinite(identity.expiresAt) || identity.expiresAt<=Date.now()/1000) fail(401,'Invalid or expired session.');
  const account=await store.identity(identity.issuer,identity.subject);
  if (!account || account.status!=='active' || account.pilot_allowed!==1) fail(403,'Account is not enabled for this pilot.');
  return account;
}
export async function handleAccounts(request,env) {
  const url=new URL(request.url), path=url.pathname;
  if (!path.startsWith('/api/accounts/') && !path.startsWith('/api/admin/')) return null;
  const gate=accountGate(env);
  if (path==='/api/accounts/config' && request.method==='GET') return reply(200,{enabled:gate==='pilot',mode:gate,publicLogin:false});
  if (gate!=='pilot') return reply(gate==='off'?404:503,{error:'Accounts are unavailable.'});
  // Same-origin deployment only in this foundation. No permissive legacy CORS headers.
  if (request.headers.get('Origin') && request.headers.get('Origin')!==env.ACCOUNT_ORIGIN) return reply(403,{error:'Origin is not allowed.'});
  if (request.method==='OPTIONS') return reply(403,{error:'Cross-origin accounts are not configured.'});
  try {
    if (['/api/accounts/sign-in','/api/accounts/sign-up','/api/accounts/recovery'].includes(path)) return reply(503,{error:'Identity delivery is not configured. No account or email was created.'});
    const store=accountStore(env.ACCOUNT_DB), actor=await identify(request,env,store);
    if(path==='/api/accounts/me' && request.method==='GET') return reply(200,{id:actor.id,displayName:actor.display_name,role:actor.role});
    if(path==='/api/accounts/progress' && request.method==='GET') {
      if(url.search) fail(400,'Account selectors are not accepted.');
      return reply(200,{records:await store.progress(actor.id),limit:200});
    }
    if(['/api/accounts/progress','/api/accounts/import'].includes(path) && request.method==='POST') {
      const body=await readBody(request);
      if(!body || Object.keys(body).some(k=>k!=='records') || !Array.isArray(body.records) || !body.records.length || body.records.length>40) fail(400,'Supply 1 to 40 progress records.');
      let records; try { records=body.records.map(validateProgress); } catch(e) { fail(400,e.message); }
      const rows=await Promise.all(records.map(async record=>({key:await progressKey(record),record})));
      const verification=path.endsWith('/import')?'imported':'practice';
      await store.insert(actor.id,rows,verification);
      return reply(200,{accepted:rows.length,verification,sourcePreserved:true,message:'Repeated identical records are retained once. These are learner-reported practice records, not verified certificates.'});
    }
    if(path.startsWith('/api/admin/')) {
      if(env.ACCOUNT_ADMIN_ENABLED!=='true' || actor.role!=='admin') fail(403,'Administrator access unavailable.');
      if(path==='/api/admin/accounts' && request.method==='GET') {
        const q=url.searchParams.get('q')||''; if(q.length>100) fail(400,'Search is too long.');
        return reply(200,{accounts:await store.list(q),limit:50});
      }
      const route=/^\/api\/admin\/accounts\/([a-zA-Z0-9_-]{1,100})\/(progress|status|recovery)$/.exec(path);
      if(route) {
        const target=await store.account(route[1]); if(!target) fail(404,'Account not found.');
        if(route[2]==='progress' && request.method==='GET') return reply(200,{account:target,records:await store.progress(target.id),limit:200});
        if(route[2]==='recovery' && request.method==='POST') return reply(503,{error:'Provider recovery is unavailable. No message was sent.'});
        if(route[2]==='status' && request.method==='POST') {
          if(target.role!=='learner' || target.id===actor.id) fail(403,'This support action is limited to learner accounts.');
          const body=await readBody(request);
          if(!body || Object.keys(body).some(k=>!['status','reason'].includes(k)) || !['active','suspended'].includes(body.status) || typeof body.reason!=='string' || body.reason.trim().length<5 || body.reason.length>200) fail(400,'Supply status and a brief support reason, without sensitive information.');
          await store.status(actor.id,target.id,body.status,body.reason.trim());
          return reply(200,{status:body.status,audited:true});
        }
      }
    }
    return reply(404,{error:'Account route not found.'});
  } catch(error) { return reply(error.status||503,{error:error.status?error.message:'Account service unavailable. Try again later.'}); }
}
