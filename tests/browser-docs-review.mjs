// Local Command Practice simulation only; this does not operate Google Docs.
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
 async function capture(){await page.locator('#courseBuilderPanel').evaluate(e=>{e.open=false;});await page.locator('#keyCapture').focus();}
 async function build(step){
  await page.locator('#courseBuilderPanel').evaluate(e=>{e.open=true;});
  const parts=step.split('+');
  for(const name of ['Control','Alt','Shift','Windows','Insert','CapsLock'])await page.locator('#courseMod'+name).setChecked(parts.slice(0,-1).includes(name));
  await page.locator('#courseFinalKey').selectOption(parts.at(-1));
  await page.locator('#courseCommandBuilder button[type="submit"]').click();
 }
 async function advance(voice){if(voice)await page.evaluate(()=>testUtterances.at(-1).dispatchEvent(new Event('end')));else await page.clock.fastForward(2500);}
 async function optionalTeaching(item){
  await page.locator('#commandExplanationDetails summary').focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('#commandDetailedExplanation').isVisible(),true);
  await page.setViewportSize({width:390,height:844});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  if(process.env.AXE_PATH){
   if(!await page.evaluate(()=>Boolean(window.axe)))await page.addScriptTag({path:process.env.AXE_PATH});
   assert.deepEqual(await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id)),[]);
  }
  if(item[0]==='R')await page.screenshot({path:join(dir,'docs-comment-teaching-narrow.png'),fullPage:true});
  await page.setViewportSize({width:1100,height:850});await capture();
 }
 for(const voice of [1,0]){
  const url=base+'/command-practice-session.html?category=Google%20Docs%20and%20applications&style=guided&length=all&spoken='+voice+'&sounds=0';
  await page.goto(url);await page.keyboard.press('Space');
  const items=await page.evaluate(()=>CommandPracticeCourses['Google Docs and applications']);assert.equal(items.length,199);
  let mistakes=0,layered=0;const missed=[];
  for(const [i,item] of items.entries()){
   assert.equal(await page.locator('#commandPosition').textContent(),`Command ${i+1} of 199`);
   assert.equal(await page.locator('#commandDetailedExplanation').textContent(),item[2]);
   assert.equal(await page.locator('#commandExplanationDetails').evaluate(e=>e.open),false);
   assert.equal((await page.locator('#commandPrompt').textContent()).includes(item[2]),false);
   if(voice)assert.equal(await page.evaluate(note=>testSpeech.at(-1).includes(note),item[2]),false);
   if(voice&&['Control+Alt+Y','R','Control+Alt+A then Control+Alt+A'].includes(item[0]))await optionalTeaching(item);
   if(item[0]==='Shift+Escape'){
    assert.match(await page.locator('#commandPrompt').textContent(),/Press and release Shift/);
    await build('Escape');mistakes++;missed.push(item);
    assert.equal(await page.locator('#practiceScore').textContent(),`Correct: ${i} · Attempts: ${i+mistakes}`);
    await capture();await page.keyboard.press('Shift');await page.keyboard.press('Control');
    assert.match(voice?await page.evaluate(()=>testSpeech.at(-1)):await page.locator('#practiceStatus').textContent(),/Next: press and release Escape/);
    await page.keyboard.press('Escape');
   }else if(item[1].startsWith('Rotate ')){
    await capture();
    for(const key of item[0].split('+'))await page.keyboard.press({'Left Arrow':'ArrowLeft','Right Arrow':'ArrowRight'}[key]||key);
   }else if(item[4].stepGoals?.length===2){
    layered++;
    await build(item[4].steps[0]);
    const goal=item[4].stepGoals[1];
    assert.ok((await page.locator('#commandPrompt').textContent()).includes(goal));
    assert.ok((await page.locator('#practiceStatus').textContent()).includes(goal));
    if(voice)assert.ok(await page.evaluate(goal=>testSpeech.at(-1).includes(goal),goal));
    await capture();await page.keyboard.press('Control');
    assert.ok((voice?await page.evaluate(()=>testSpeech.at(-1)):await page.locator('#practiceStatus').textContent()).includes(goal));
    if(item[1]==='Enter current comment.'){
     await page.keyboard.press('Alt+C');mistakes++;missed.push(item);
     assert.equal(await page.locator('#practiceScore').textContent(),`Correct: ${i} · Attempts: ${i+mistakes}`);
     assert.ok((await page.locator('#commandPrompt').textContent()).includes(goal));
    }
    await build(item[4].steps[1]);
   }else for(const step of item[4].steps)await build(step);
   assert.equal(await page.locator('#practiceScore').textContent(),`Correct: ${i+1} · Attempts: ${i+1+mistakes}`,item[0]+' '+item[1]);
   assert.equal(page.url(),url);assert.equal(page.context().pages().length,1);
   await advance(voice);
  }
  assert.equal(layered,11);assert.equal(mistakes,2);
  assert.equal(await page.locator('#commandResults').isVisible(),true);
  assert.equal(await page.locator('#commandCorrectResult').textContent(),'199');
  assert.equal(await page.locator('#commandAttemptResult').textContent(),'201');
  assert.equal(await page.locator('#commandReviewList li').count(),2);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'practiceMissed');
  if(voice)for(const stage of ['Starting with basic','Moving to intermediate','Moving to advanced'])assert.ok(await page.evaluate(s=>testSpeech.some(t=>t.includes(s)),stage));
  else assert.equal(await page.evaluate(()=>testSpeech.length),0);
  await page.keyboard.press('Enter');
  for(const item of missed){for(const step of item[4].steps)await build(step);await advance(voice);}
  assert.equal(await page.locator('#commandCorrectResult').textContent(),'2');
  assert.equal(await page.locator('#commandAccuracyResult').textContent(),'100%');
  await page.keyboard.press('Escape');await page.waitForURL('**/command-practice.html');
  console.log('Docs: 199 tasks, 11 layered directions, protected drawing exit/rotations, missing-modifier recovery, repeat, scoring, retry and completion focus; site voice='+voice);
 }
 assert.deepEqual(errors,[]);console.log('No JavaScript errors. Browser simulation and speech requests only; real Google Docs/screen readers/Safari untested.');
}finally{await browser?.close();await new Promise(r=>server.close(r));}
