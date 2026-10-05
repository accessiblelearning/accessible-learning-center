// Simulated NVDA commands in Chromium, not an actual NVDA session.
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {join,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const dir=process.env.BROWSER_QA_ROOT;if(!dir)throw Error('Set BROWSER_QA_ROOT to existing tooling.');
const require=createRequire(join(dir,'fixture.cjs')),{chromium}=require('playwright-core'),mod=require('@sparticuz/chromium'),runtime=mod.default||mod;
const root=fileURLToPath(new URL('../',import.meta.url));
const server=createServer(async(req,res)=>{try{const p=decodeURIComponent(req.url.split('?')[0]),body=await readFile(join(root,p));res.writeHead(200,{'Content-Type':{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(p)]||'application/octet-stream'});res.end(body);}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;let browser;
try{
 browser=await chromium.launch({executablePath:join(dir,'chromium'),args:[...runtime.args.filter(a=>!a.startsWith('--use-gl=')&&!a.startsWith('--use-angle=')),'--disable-gpu','--disable-software-rasterizer']});
 const page=await browser.newPage({viewport:{width:1100,height:850}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
 await page.addInitScript(()=>{window.testSpeech=[];window.testUtterances=[];speechSynthesis.speak=u=>{testSpeech.push(u.text);testUtterances.push(u);};speechSynthesis.cancel=()=>{};});
 await page.clock.install();
 const aliases={'Down Arrow':'ArrowDown','Up Arrow':'ArrowUp','Left Arrow':'ArrowLeft','Right Arrow':'ArrowRight','Page Up':'PageUp','Page Down':'PageDown'};
 for(const voice of [1,0]){
  const url=base+'/command-practice-session.html?category=NVDA%20commands&style=guided&length=all&spoken='+voice+'&sounds=0';
  await page.goto(url);await page.keyboard.press('Space');
  const items=await page.evaluate(()=>CommandPracticeCourses['NVDA commands']);assert.equal(items.length,93);let mistakes=0;
  for(const [i,item] of items.entries()){
   assert.equal(await page.locator('#commandDetailedExplanation').textContent(),item[2]);
   assert.equal(await page.locator('#commandExplanationDetails').evaluate(e=>e.open),false);
   assert.equal((await page.locator('#commandPrompt').textContent()).includes(item[2]),false);
   if(voice)assert.equal(await page.evaluate(note=>testSpeech.at(-1).includes(note),item[2]),false);
   if(voice&&['Insert+Space','Alt+Down Arrow','Alt+Insert+R'].includes(item[0])){
    await page.locator('#commandExplanationDetails summary').focus();await page.keyboard.press('Enter');
    await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    if(process.env.AXE_PATH){if(!await page.evaluate(()=>!!window.axe))await page.addScriptTag({path:process.env.AXE_PATH});assert.deepEqual(await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id)),[]);}
    await page.setViewportSize({width:1100,height:850});
   }
   await page.locator('#keyCapture').focus();
   if(item[0]==='Alt+Down Arrow'){
    await page.keyboard.press('x');mistakes++;assert.equal(await page.locator('#practiceScore').textContent(),`Correct: ${i} · Attempts: ${i+mistakes}`);
    await page.keyboard.press('Control');assert.match(voice?await page.evaluate(()=>testSpeech.at(-1)):await page.locator('#practiceStatus').textContent(),/Word or Outlook/);
    await page.keyboard.press('Tab');assert.notEqual(await page.evaluate(()=>document.activeElement.id),'keyCapture');await page.locator('#keyCapture').focus();
   }
   for(const step of item[4].steps)for(const key of step.split('+'))await page.keyboard.press(aliases[key]||key);
   assert.equal(await page.locator('#practiceScore').textContent(),`Correct: ${i+1} · Attempts: ${i+1+mistakes}`,item[0]);
   assert.equal(page.url(),url);assert.equal(page.context().pages().length,1);
   if(voice)await page.evaluate(()=>testUtterances.at(-1).dispatchEvent(new Event('end')));else await page.clock.fastForward(2500);
  }
  assert.equal(await page.locator('#commandResults').isVisible(),true);assert.equal(await page.locator('#commandCorrectResult').textContent(),'93');assert.equal(await page.locator('#commandAttemptResult').textContent(),'94');
  assert.equal(await page.evaluate(()=>document.activeElement.id),'practiceMissed');
  if(voice)for(const stage of ['Starting with basic','Moving to intermediate','Moving to advanced'])assert.ok(await page.evaluate(s=>testSpeech.some(t=>t.includes(s)),stage));
  else assert.equal(await page.evaluate(()=>testSpeech.length),0);
  await page.keyboard.press('Escape');await page.waitForURL('**/command-practice.html');
  console.log('NVDA simulated course: all 93 tasks, optional explanations, recovery/repeat, score, stages and completion; site voice='+voice);
 }
 assert.deepEqual(errors,[]);console.log('No JavaScript errors. Real NVDA and Safari remain untested.');
}finally{await browser?.close();await new Promise(r=>server.close(r));}
