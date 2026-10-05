import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {handleAccounts,accountGate} from '../accounts/account-api.mjs';
import {prepareLocalImport,validateProgress,progressKey} from '../accounts/progress.mjs';
import {missionIds,commandIds} from '../accounts/registry.mjs';
const sql=readFileSync(new URL('../accounts/migrations/0001_accounts.sql',import.meta.url),'utf8');
function fixture(){
 const db=new DatabaseSync(':memory:');db.exec(sql);
 for(const [id,role] of [['alice','learner'],['bob','learner'],['admin','admin']]) db.prepare('INSERT INTO accounts (id,issuer,subject,display_name,role,pilot_allowed) VALUES (?,?,?,?,?,1)').run(id,'fictional-issuer',id,id+' Sample',role);
 const binding={prepare(text){return {bind(...args){return {first:async()=>db.prepare(text).get(...args),all:async()=>({results:db.prepare(text).all(...args)}),run:()=>db.prepare(text).run(...args)};}};},async batch(statements){db.exec('BEGIN');try{const out=statements.map(s=>s.run());db.exec('COMMIT');return out;}catch(e){db.exec('ROLLBACK');throw e;}}};
 const env={ACCOUNT_MODE:'pilot',ACCOUNT_ENVIRONMENT:'test',ACCOUNT_ISSUER:'fictional-issuer',ACCOUNT_AUDIENCE:'fictional-audience',ACCOUNT_ORIGIN:'https://preview.example',ACCOUNT_ADMIN_ENABLED:'true',ACCOUNT_DB:binding,ACCOUNT_IDENTITY:{async fetch(url,opts){return Response.json({subject:opts.headers.Authorization.replace('Bearer fictional-',''),issuer:'fictional-issuer',audience:'fictional-audience',expiresAt:Date.now()/1000+60,role:'admin'});}}};
 const request=(path,actor='alice',body,headers={})=>new Request('https://preview.example'+path,{method:body===undefined?'GET':'POST',headers:{Authorization:'Bearer fictional-'+actor,...(body!==undefined?{'Content-Type':'application/json'}:{}),...headers},body:body===undefined?undefined:JSON.stringify(body)});
 return {db,env,request,call:(path,actor,body,headers)=>handleAccounts(request(path,actor,body,headers),env)};
}
const record=(path='both',lesson=1)=>({area:'typing',curriculumId:'typing-v1',activityId:'lesson-'+lesson,path,accuracy:98,wpm:12,completed:true});
test('account routes are off by default and production flags cannot enable them',async()=>{
 for(const env of [{},{ACCOUNT_MODE:'on'},{ACCOUNT_MODE:'pilot',ACCOUNT_ENVIRONMENT:'production'}]){
   env.ACCOUNT_DB={prepare(){throw Error('DB must not be touched');}};
   assert.equal(accountGate(env),'off');
   for(const path of ['/api/accounts/progress','/api/admin/accounts','/api/accounts/sign-in']) assert.equal((await handleAccounts(new Request('https://example.test'+path),env)).status,404);
   assert.deepEqual(await (await handleAccounts(new Request('https://example.test/api/accounts/config'),env)).json(),{enabled:false,mode:'off',publicLogin:false});
 }
 assert.equal(await handleAccounts(new Request('https://example.test/progress'),{}),null);
});
test('missing provider or database fails closed even in explicit pilot mode',async()=>{
 const f=fixture();for(const key of ['ACCOUNT_IDENTITY','ACCOUNT_DB','ACCOUNT_ISSUER','ACCOUNT_AUDIENCE','ACCOUNT_ORIGIN']){const env={...f.env};delete env[key];assert.equal((await handleAccounts(f.request('/api/accounts/me'),env)).status,503);}f.db.close();
});
test('session errors, expiry, wrong issuer and audience cannot read data',async()=>{
 const f=fixture();
 for(const overrides of [{expiresAt:0},{issuer:'other'},{audience:'other'},{subject:''},{subject:'unknown'}]){
  f.env.ACCOUNT_IDENTITY.fetch=async()=>Response.json({subject:'alice',issuer:'fictional-issuer',audience:'fictional-audience',expiresAt:Date.now()/1000+60,...overrides});
  assert.ok([401,403].includes((await f.call('/api/accounts/progress')).status));
 }
 f.env.ACCOUNT_IDENTITY.fetch=async()=>{throw Error('provider unavailable');};assert.equal((await f.call('/api/accounts/me')).status,401);
 assert.equal((await f.call('/api/accounts/me','alice',undefined,{Authorization:''})).status,401);f.db.close();
});
test('authenticated identity owns records; client selectors and supplied roles are rejected',async()=>{
 const f=fixture();assert.equal((await f.call('/api/accounts/progress','alice',{records:[record('left')]})).status,200);
 assert.equal((await (await f.call('/api/accounts/progress','bob')).json()).records.length,0);
 assert.equal((await (await f.call('/api/accounts/progress','alice')).json()).records.length,1);
 assert.equal((await f.call('/api/accounts/progress?account_id=bob')).status,400);
 assert.equal((await f.call('/api/accounts/progress','bob',{account_id:'alice',records:[record()]})).status,400);
 assert.equal((await f.call('/api/accounts/progress','bob',{records:[{...record(),role:'admin'}]})).status,400);
 assert.equal((await f.call('/api/admin/accounts','alice')).status,403);f.db.close();
});
test('all 150 typing activities are valid and paths remain independent',async()=>{
 const f=fixture();for(const path of ['both','left','right'])for(let lesson=1;lesson<=50;lesson++)assert.equal(validateProgress(record(path,lesson)).path,path);
 await f.call('/api/accounts/import','alice',{records:['both','left','right'].map(path=>record(path,50))});
 assert.equal((await (await f.call('/api/accounts/progress')).json()).records.length,3);
 for(const bad of [{...record(),activityId:'lesson-51'},{...record(),path:'left-ish'},{...record(),accuracy:101},{...record(),wpm:-1},{...record(),completed:'true'},{...record(),area:'braille'}])assert.throws(()=>validateProgress(bad));f.db.close();
});
test('stable mission and command IDs validate; unknown activities and private Braille stay unavailable',()=>{
 assert.equal(missionIds.length,18);assert.equal(missionIds[3],'word-risky-edit');
 for(const id of missionIds)validateProgress({area:'topic-mission',curriculumId:'missions-v1',activityId:id,path:'none',completed:true});
 for(const [id,commands] of Object.entries(commandIds))validateProgress({area:'command-practice',curriculumId:id,activityId:commands[0],path:'none',completed:true});
 assert.throws(()=>validateProgress({area:'command-practice',curriculumId:'anything',activityId:'cmd-1',path:'none',completed:true}));
});
test('imports are idempotent and cannot become verified results',async()=>{
 const f=fixture();for(let n=0;n<2;n++)assert.equal((await f.call('/api/accounts/import','alice',{records:[record(),record('left')]})).status,200);
 const rows=(await (await f.call('/api/accounts/progress')).json()).records;assert.equal(rows.length,2);assert.ok(rows.every(r=>r.verification==='imported'));
 assert.equal((await f.call('/api/accounts/import','alice',{records:[{...record(),verification:'verified'}]})).status,400);
 assert.equal(await progressKey(record()),await progressKey({...record(),wpm:12}));f.db.close();
});
test('local import preserves sources, handles current hand prefixes, and rejects legacy ownership claims',()=>{
 const snapshot={alcKeyboardingProgressV1:{completed:['en:both:1','en:left:one-hand-v1:50','en:right:one-hand-v1:2','en:left:7'],sessions:[{lesson:3}]},missionControlCompleted:[3,12,17,999],'accessibleLearningQuizResults:someone-else':[{score:100}]};
 const original=JSON.stringify(snapshot),out=prepareLocalImport(snapshot);assert.equal(JSON.stringify(snapshot),original);assert.equal(out.records.length,6);assert.equal(out.verification,'imported');assert.equal(out.sourcePreserved,true);assert.equal(out.skipped.length,4);assert.deepEqual(out.records.slice(0,3).map(r=>r.path),['both','left','right']);
});
test('only a server-authorized administrator can list or change accounts',async()=>{
 const f=fixture();assert.equal((await f.call('/api/admin/accounts','bob')).status,403);
 assert.equal((await (await f.call('/api/admin/accounts?q=bob','admin')).json()).accounts.length,1);
 assert.equal((await f.call('/api/admin/accounts/alice/progress','admin')).status,200);
 assert.equal((await f.call('/api/admin/accounts/alice/status','admin',{status:'suspended',reason:'Fictional support test'})).status,200);
 assert.equal(f.db.prepare('SELECT status FROM accounts WHERE id=?').get('alice').status,'suspended');assert.equal(f.db.prepare('SELECT count(*) AS n FROM account_audit').get().n,1);
 assert.equal((await f.call('/api/accounts/me','alice')).status,403);
 assert.equal((await f.call('/api/admin/accounts/alice/status','admin',{status:'active',reason:'Fictional restored access'})).status,200);
 assert.equal((await f.call('/api/accounts/me','alice')).status,200);
 assert.equal((await f.call('/api/admin/accounts/admin/status','admin',{status:'suspended',reason:'Cannot suspend own admin'})).status,403);
 f.env.ACCOUNT_ADMIN_ENABLED='false';assert.equal((await f.call('/api/admin/accounts','admin')).status,403);f.db.close();
});
test('audit failure rolls back account status; service errors reveal no internals',async()=>{
 const f=fixture();f.db.exec("CREATE TRIGGER fail_audit BEFORE INSERT ON account_audit BEGIN SELECT RAISE(ABORT, 'private database detail'); END;");
 const res=await f.call('/api/admin/accounts/alice/status','admin',{status:'suspended',reason:'Fictional support test'});assert.equal(res.status,503);assert.doesNotMatch(await res.text(),/private database/);assert.equal(f.db.prepare('SELECT status FROM accounts WHERE id=?').get('alice').status,'active');f.db.close();
});
test('recovery never pretends to send, cross-origin requests fail, and payload limits apply',async()=>{
 const f=fixture();for(const path of ['/api/accounts/sign-up','/api/accounts/sign-in','/api/accounts/recovery','/api/admin/accounts/bob/recovery']){const response=await f.call(path,'admin',{});assert.equal(response.status,503);assert.match(await response.text(),/No .* (sent|created)/);}
 assert.equal((await f.call('/api/accounts/progress','alice',undefined,{Origin:'https://other.example'})).status,403);
 assert.equal((await f.call('/api/accounts/import','alice',{records:Array(41).fill(record())})).status,400);
 assert.equal((await f.call('/api/accounts/import','alice',{records:['x'.repeat(70000)]})).status,413);
 const response=await f.call('/api/accounts/progress');assert.equal(response.headers.get('Cache-Control'),'no-store');assert.equal(response.headers.get('Access-Control-Allow-Origin'),null);f.db.close();
});
test('inactive previews have no public navigation links or credential submission',()=>{
 const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
 for(const page of ['account-preview.html','admin-preview.html']){assert.match(read(page),/noindex,nofollow/);assert.match(read(page),/fictional data/);}
 assert.match(read('account-preview.html'),/<fieldset disabled>/);assert.doesNotMatch(read('account-preview.js'),/\b(fetch|localStorage|sessionStorage)\s*[.(]/);
 for(const file of ['index.html','accessibility.js','mission-catalog.js'])assert.doesNotMatch(read(file),/href=["'](?:account|admin)-preview/);
 const worker=read('worker.js');assert.ok(worker.indexOf('await handleAccounts')<worker.indexOf('request.method === "OPTIONS"'));assert.doesNotMatch(read('wrangler.toml'),/ACCOUNT_/);
});
