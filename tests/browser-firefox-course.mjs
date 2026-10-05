// Chromium checks of Firefox command rehearsal; this does not control Firefox.
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
 const page=await browser.newPage({viewport:{width:1100,height:850}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
 await page.addInitScript(()=>{window.testSpeech=[];window.testUtterances=[];speechSynthesis.speak=u=>{testSpeech.push(u.text);testUtterances.push(u);};speechSynthesis.cancel=()=>{};});
 await page.clock.install();
 const aliases={'Page Up':'PageUp','Page Down':'PageDown','Left Arrow':'ArrowLeft','Right Arrow':'ArrowRight',Equals:'='};
 for(const voice of [1,0]){
  const url=base+'/command-practice-session.html?category=Firefox%20browser&style=guided&length=all&spoken='+voice+'&sounds=0';
  await page.goto(url);await page.keyboard.press('Space');
  const items=await page.evaluate(()=>CommandPracticeCourses['Firefox browser']);assert.equal(items.length,39);
  let mistakes=0;
  for(const [i,entry] of items.entries()){
   assert.equal(await page.locator('#commandDetailedExplanation').textContent(),entry[2]);
   assert.equal(await page.locator('#commandExplanationDetails').evaluate(e=>e.open),false);
   if(voice&&entry[0]==='Control+Shift+K'){
    await page.locator('#commandExplanationDetails summary').focus();await page.keyboard.press('Enter');
    await page.setViewportSize({width:390,height:844});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    if(process.env.AXE_PATH){await page.addScriptTag({path:process.env.AXE_PATH});assert.deepEqual(await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id)),[]);}
    await page.screenshot({path:join(dir,'firefox-explanation-narrow.png'),fullPage:true});
    await page.locator('#commandExplanationDetails summary').focus();await page.keyboard.press('Enter');
    await page.setViewportSize({width:1100,height:850});
   }
   await page.locator('#keyCapture').focus();
   if(['Control+Shift+O','Control+Shift+A'].includes(entry[0])){
    await page.keyboard.press('Control');await page.keyboard.press(entry[0].split('+').at(-1));mistakes++;
    assert.equal(await page.locator('#practiceScore').textContent(),`Correct: ${i} · Attempts: ${i+mistakes}`);
   }
   if(entry[0]==='Control+Shift+Page Up'){
    await page.keyboard.press('Control');await page.keyboard.press('PageUp');mistakes++;
    assert.equal(await page.locator('#practiceScore').textContent(),`Correct: ${i} · Attempts: ${i+mistakes}`);
    await page.keyboard.press('Control');await page.keyboard.press('Control');
    assert.match(voice?await page.evaluate(()=>testSpeech.at(-1)):await page.locator('#practiceStatus').textContent(),/Next: press and release Shift/);
    await page.keyboard.press('Tab');assert.notEqual(await page.evaluate(()=>document.activeElement.id),'keyCapture');
    await page.locator('#keyCapture').focus();
   }
   for(const step of entry[4].steps){
    if(entry[3]==='safe')for(const key of step.split('+'))await page.keyboard.press(aliases[key]||key);
    else await page.keyboard.press(step);
   }
   assert.equal(await page.locator('#practiceScore').textContent(),`Correct: ${i+1} · Attempts: ${i+1+mistakes}`,entry[0]);
   assert.equal(page.url(),url,'Practice must not navigate away');assert.equal(page.context().pages().length,1,'Practice must not open tabs');
   if(voice)await page.evaluate(()=>testUtterances.at(-1).dispatchEvent(new Event('end')));
   else await page.clock.fastForward(2500);
  }
  assert.equal(await page.locator('#commandResults').isVisible(),true);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'practiceMissed');
  if(voice)for(const stage of ['Starting with basic','Moving to intermediate','Moving to advanced'])assert.ok(await page.evaluate(s=>testSpeech.some(t=>t.includes(s)),stage));
  else assert.equal(await page.evaluate(()=>testSpeech.length),0);
  await page.keyboard.press('Escape');await page.waitForURL('**/command-practice.html');
  console.log('Firefox rehearsal: 39 tasks, scoring, repeat, missing-modifier recovery, Tab exit, completion and stage transitions; site voice='+voice);
 }
 assert.deepEqual(errors,[]);console.log('No JavaScript errors. Chromium simulation only; real Firefox/Safari/assistive technology untested.');
}finally{await browser?.close();await new Promise(r=>server.close(r));}
