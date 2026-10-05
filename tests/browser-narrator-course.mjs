// Chromium checks of the simulated course, not a real Narrator session.
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
 await page.addInitScript(()=>{window.testSpeech=[];window.testUtterances=[];window.testKeypad=[];speechSynthesis.speak=u=>{testSpeech.push(u.text);testUtterances.push(u);};speechSynthesis.cancel=()=>{};document.addEventListener('keydown',e=>{if(e.code==='Numpad5')testKeypad.push({key:e.key,code:e.code,location:e.location});},true);});
 await page.clock.install();
 const aliases={'Left Arrow':'ArrowLeft','Right Arrow':'ArrowRight','Up Arrow':'ArrowUp','Down Arrow':'ArrowDown',Windows:'Meta'};
 const steps=item=>item[4].practiceSteps||item[4].steps;
 async function enterKeys(item){for(const step of steps(item))for(const key of step.split('+'))await page.keyboard.press(aliases[key]||key);}
 async function build(step){
  await page.locator('#courseBuilderPanel').evaluate(e=>{e.open=true;});
  const parts=step.split('+');
  for(const name of ['Control','Alt','Shift','Windows','Insert','CapsLock'])await page.locator('#courseMod'+name).setChecked(parts.slice(0,-1).includes(name));
  await page.locator('#courseFinalKey').selectOption(parts.at(-1));
  await page.locator('#courseCommandBuilder button[type="submit"]').click();
 }
 async function advance(voice){if(voice)await page.evaluate(()=>testUtterances.at(-1).dispatchEvent(new Event('end')));else await page.clock.fastForward(2500);}
 for(const voice of [1,0]){
  const url=base+'/command-practice-session.html?category=Narrator%20commands&style=guided&length=all&spoken='+voice+'&sounds=0';
  await page.goto(url);await page.keyboard.press('Space');
  const items=await page.evaluate(()=>CommandPracticeCourses['Narrator commands']);assert.equal(items.length,73);
  let mistakes=0;
  for(const [i,item] of items.entries()){
   assert.equal(await page.locator('#commandDetailedExplanation').textContent(),item[2]);
   assert.equal(await page.locator('#commandExplanationDetails').evaluate(e=>e.open),false);
   assert.equal((await page.locator('#commandPrompt').textContent()).includes(item[2]),false);
   if(voice)assert.equal(await page.evaluate(note=>testSpeech.at(-1).includes(note),item[2]),false);
   if(voice&&['Control+Insert+D','Insert+R','Insert+F','Alt+Insert+Down Arrow'].includes(item[0])){
    // Expanded teaching is keyboard-reachable, optional and confined to the
    // current task. Leave it open so the next task must collapse it again.
    await page.locator('#commandExplanationDetails summary').focus();await page.keyboard.press('Enter');
    assert.equal(await page.locator('#commandDetailedExplanation').isVisible(),true);
    await page.setViewportSize({width:390,height:844});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    if(process.env.AXE_PATH){
     if(!await page.evaluate(()=>Boolean(window.axe)))await page.addScriptTag({path:process.env.AXE_PATH});
     assert.deepEqual(await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id)),[]);
    }
    if(item[0]==='Control+Insert+D')await page.screenshot({path:join(dir,'narrator-reading-teaching-narrow.png'),fullPage:true});
    await page.setViewportSize({width:1100,height:850});await page.locator('#keyCapture').focus();
   }
   const keypad=Boolean(item[4].practiceSteps);
   if(keypad){
    assert.match(await page.locator('#commandPrompt').textContent(),/numeric keypad 5/);
    assert.equal(await page.locator('#courseFinalKey option[value="Numpad5"]').textContent(),'numeric keypad 5');
    for(const key of item[4].steps[0].split('+'))await page.keyboard.press(key);
    mistakes++;assert.equal(await page.locator('#practiceScore').textContent(),`Correct: ${i} · Attempts: ${i+mistakes}`);
    assert.match(await page.locator('#practiceStatus').textContent(),/numeric keypad.*Build the command/);
    await build(item[4].steps[0]);mistakes++;
    assert.equal(await page.locator('#practiceScore').textContent(),`Correct: ${i} · Attempts: ${i+mistakes}`);
    await page.locator('#courseBuilderPanel').evaluate(e=>{e.open=false;});
    await page.locator('#keyCapture').focus();
    for(const key of steps(item)[0].split('+').slice(0,-1))await page.keyboard.press(key);
    await page.keyboard.press('Control');
    assert.match(voice?await page.evaluate(()=>testSpeech.at(-1)):await page.locator('#practiceStatus').textContent(),/Next: press and release numeric keypad 5/);
    await page.keyboard.press('Tab');assert.notEqual(await page.evaluate(()=>document.activeElement.id),'keyCapture');
    if(voice&&item[0]==='Insert+5'){
     await page.locator('#commandExplanationDetails summary').focus();await page.keyboard.press('Enter');
     await page.setViewportSize({width:390,height:844});
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
     if(process.env.AXE_PATH){await page.addScriptTag({path:process.env.AXE_PATH});assert.deepEqual(await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id)),[]);}
     await page.screenshot({path:join(dir,'narrator-keypad-narrow.png'),fullPage:true});
     await page.locator('#commandExplanationDetails summary').focus();await page.keyboard.press('Enter');await page.setViewportSize({width:1100,height:850});
    }
    await page.locator('#keyCapture').focus();
   }
   if(keypad&&!voice)await build(steps(item)[0]);else await enterKeys(item);
   assert.equal(await page.locator('#practiceScore').textContent(),`Correct: ${i+1} · Attempts: ${i+1+mistakes}`,item[0]);
   assert.equal(page.url(),url);assert.equal(page.context().pages().length,1);
   if(keypad&&voice)assert.match(await page.evaluate(()=>testSpeech.at(-1)),/plus numeric keypad 5/);
   await advance(voice);
  }
  assert.equal(await page.locator('#commandResults').isVisible(),true);assert.equal(await page.evaluate(()=>document.activeElement.id),'practiceMissed');
  assert.equal(await page.locator('#commandCorrectResult').textContent(),'73');assert.equal(await page.locator('#commandAttemptResult').textContent(),'77');
  assert.equal(await page.locator('#commandReviewList li').count(),2);
  assert.ok((await page.locator('#commandReviewList').textContent()).includes('numeric keypad 5'));
  if(voice){
   for(const stage of ['Starting with basic','Moving to intermediate','Moving to advanced'])assert.ok(await page.evaluate(s=>testSpeech.some(t=>t.includes(s)),stage));
   assert.ok(await page.evaluate(()=>testKeypad.length===2&&testKeypad.every(k=>k.code==='Numpad5'&&k.location===3)));
  }else assert.equal(await page.evaluate(()=>testSpeech.length),0);
  // Retry the two genuine misses, preserving the corrected physical-key teaching.
  await page.keyboard.press('Enter');
  for(const item of items.filter(item=>item[4].practiceSteps)){await build(steps(item)[0]);await advance(voice);}
  assert.equal(await page.locator('#commandCorrectResult').textContent(),'2');assert.equal(await page.locator('#commandAccuracyResult').textContent(),'100%');
  await page.keyboard.press('Escape');await page.waitForURL('**/command-practice.html');
  console.log('Narrator rehearsal: all 73 tasks, optional teaching, numeric-keypad distinction, recovery/repeat, builder, missed-task retry, scoring, focus and completion; site voice='+voice);
 }
 assert.deepEqual(errors,[]);console.log('No JavaScript errors. Chromium and speech-request checks only; real Narrator/Safari untested.');
}finally{await browser?.close();await new Promise(r=>server.close(r));}
