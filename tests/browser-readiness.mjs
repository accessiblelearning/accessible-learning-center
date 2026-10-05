// Public-page audit on a local server. Does not authenticate or read learner data.
import {createServer} from 'node:http';
import {readFile,readdir} from 'node:fs/promises';
import {join,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const dir=process.env.BROWSER_QA_ROOT,axePath=process.env.AXE_PATH;
if(!dir||!axePath)throw Error('Set BROWSER_QA_ROOT and AXE_PATH to existing local tooling.');
const require=createRequire(join(dir,'fixture.cjs')),{chromium}=require('playwright-core'),mod=require('@sparticuz/chromium'),runtime=mod.default||mod;
const root=fileURLToPath(new URL('../',import.meta.url)),files=(await readdir(root)).filter(f=>f.endsWith('.html')).sort();
const server=createServer(async(req,res)=>{try{const path=decodeURIComponent(req.url.split('?')[0]),body=await readFile(join(root,path));res.writeHead(200,{'Content-Type':{'.js':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json'}[extname(path)]||'application/octet-stream'});res.end(body);}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;let browser;
try{
 browser=await chromium.launch({executablePath:join(dir,'chromium'),args:[...runtime.args.filter(a=>!a.startsWith('--use-gl=')&&!a.startsWith('--use-angle=')),'--disable-gpu','--disable-software-rasterizer']});
 let cursor=0,checked=0;const failures=[];
 await Promise.all(Array.from({length:3},async()=>{
  const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage();let errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
  await page.addInitScript(()=>{speechSynthesis.speak=()=>{};speechSynthesis.cancel=()=>{};});
  while(cursor<files.length){
   const file=files[cursor++];errors=[];
   try{
    await page.goto(base+'/'+file,{waitUntil:'load'});await page.addScriptTag({path:axePath});
    const result=await page.evaluate(async()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,violations:(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))}));
    if(result.overflow||result.violations.length||errors.length)failures.push({file,...result,errors:[...errors]});
   }catch(error){failures.push({file,error:error.message});}
   checked++;if(checked%50===0)console.log('Checked '+checked+' of '+files.length+' public pages.');
  }
  // This Chromium build uses a single process; closing one context can close
  // the other workers' pages. Close the browser only after all workers finish.
 }));
 console.log(JSON.stringify({pages:files.length,failures},null,2));
 assert.deepEqual(failures,[]);
 console.log('All public pages: 390-pixel reflow, no uncaught page errors and no detected scoped Axe violations. Not a real screen-reader test.');
}finally{await browser?.close();await new Promise(r=>server.close(r));}
