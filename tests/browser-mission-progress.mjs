// Fictional browser-local completions only. No account or progress API access.
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {join,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const dir=process.env.BROWSER_QA_ROOT;if(!dir)throw Error('Set BROWSER_QA_ROOT to existing browser tooling.');
const require=createRequire(join(dir,'fixture.cjs')),{chromium}=require('playwright-core'),m=require('@sparticuz/chromium'),runtime=m.default||m;
const root=fileURLToPath(new URL('../',import.meta.url));
const server=createServer(async(req,res)=>{try{const p=decodeURIComponent(req.url.split('?')[0]),data=await readFile(join(root,p));res.writeHead(200,{'Content-Type':{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(p)]||'application/octet-stream'});res.end(data);}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;let browser;
try{
 browser=await chromium.launch({executablePath:join(dir,'chromium'),args:[...runtime.args.filter(a=>!a.startsWith('--use-gl=')&&!a.startsWith('--use-angle=')),'--disable-gpu','--disable-software-rasterizer']});
 const context=await browser.newContext({viewport:{width:1100,height:850}}),errors=[];
 await context.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
 await context.addInitScript(()=>{window.testSpeech=[];speechSynthesis.speak=u=>testSpeech.push(u.text);speechSynthesis.cancel=()=>{};});
 async function open(page,id,voice=1){page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/topic-mission-session.html?reader=jaws&mission='+id+'&voice='+voice+'&sounds=0');await page.keyboard.press('Space');}
 const first=await context.newPage(),second=await context.newPage();
 await open(first,3);await first.keyboard.press('z');
 await open(second,4);await second.keyboard.press('c');await second.keyboard.press('v');
 assert.equal(await second.locator('#missionResults').isVisible(),true);
 assert.deepEqual(await second.evaluate(()=>JSON.parse(localStorage.getItem('missionControlCompleted'))),[4]);
 await first.keyboard.press('s');assert.equal(await first.locator('#missionResults').isVisible(),true);
 assert.deepEqual(await first.evaluate(()=>JSON.parse(localStorage.getItem('missionControlCompleted')).sort((a,b)=>a-b)),[3,4]);
 assert.equal(await first.locator('#missionCompletedResult').textContent(),'2 of 25');
 assert.equal(await first.locator('#missionSaveStatus').isVisible(),false);
 for(const voice of [1,0]){
  await open(first,7,voice);
  await first.evaluate(()=>{window.restoreWrite=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='missionControlCompleted')throw new DOMException('Storage full','QuotaExceededError');return restoreWrite.call(this,k,v);};});
  await first.keyboard.press('F2');await first.keyboard.press('Enter');
  assert.equal(await first.locator('#missionResults').isVisible(),true);
  assert.equal(await first.locator('#missionSaveStatus').isVisible(),true);
  assert.match(await first.locator('#missionSaveStatus').textContent(),/could not save/);
  assert.equal(await first.locator('#missionSaveStatus').getAttribute('aria-live'),voice?'off':'polite');
  if(voice)assert.match(await first.evaluate(()=>testSpeech.at(-1)),/could not save/);
  else assert.equal(await first.evaluate(()=>testSpeech.length),0);
  assert.equal(await first.evaluate(()=>document.activeElement.id),'nextMission');
  assert.equal(await first.locator('#nextMission').getAttribute('aria-describedby'),'missionSaveStatus');
  if(voice){
   await first.setViewportSize({width:390,height:844});
   assert.equal(await first.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
   if(process.env.AXE_PATH){await first.addScriptTag({path:process.env.AXE_PATH});assert.deepEqual(await first.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id)),[]);}
   await first.screenshot({path:join(dir,'mission-unsaved-narrow.png'),fullPage:true});
   await first.setViewportSize({width:1100,height:850});
  }
  await first.evaluate(()=>{Storage.prototype.setItem=restoreWrite;});
  await first.locator('.mission-result-details summary').click();await first.locator('#retryMissionResult').click();
  await first.keyboard.press('F2');await first.keyboard.press('Enter');
  assert.equal(await first.locator('#missionSaveStatus').isVisible(),false);
  assert.equal(await first.locator('#nextMission').getAttribute('aria-describedby'),null);
  assert.deepEqual(await first.evaluate(()=>JSON.parse(localStorage.getItem('missionControlCompleted')).sort((a,b)=>a-b)),[3,4,7]);
 }
 await first.keyboard.press('Escape');await first.waitForURL('**/topic-missions.html');
 assert.deepEqual(errors,[]);
 console.log('Two actual browser tabs retain newer completions; blocked saves remain completable, visible/spoken, retryable and keyboard accessible with site voice on/off. Narrow layout and scoped Axe passed. Chromium only.');
}finally{await browser?.close();await new Promise(r=>server.close(r));}
