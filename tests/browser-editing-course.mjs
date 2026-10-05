// Browser simulation: this does not operate Microsoft Word or a screen reader.
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
 async function build(step){
  await page.locator('#courseBuilderPanel').evaluate(e=>{e.open=true;});
  const parts=step.split('+');
  for(const name of ['Control','Alt','Shift','Windows','Insert','CapsLock'])await page.locator('#courseMod'+name).setChecked(parts.slice(0,-1).includes(name));
  await page.locator('#courseFinalKey').selectOption(parts.at(-1));
  await page.locator('#courseCommandBuilder button[type="submit"]').click();
 }
 async function advance(voice){if(voice)await page.evaluate(()=>testUtterances.at(-1).dispatchEvent(new Event('end')));else await page.clock.fastForward(2500);}
 for(const [category,count] of [['General editing',17],['Microsoft Word and documents',214]])for(const voice of [1,0]){
  const url=base+'/command-practice-session.html?category='+encodeURIComponent(category)+'&style=guided&length=all&spoken='+voice+'&sounds=0';
  await page.goto(url);await page.keyboard.press('Space');
  const items=await page.evaluate(name=>CommandPracticeCourses[name],category);assert.equal(items.length,count);
  const seen=[],missed=[];let mistakes=0;
  for(const [i,item] of items.entries()){
   assert.equal(await page.locator('#commandPosition').textContent(),`Command ${i+1} of ${count}`);
   if(item[4].practiceSteps){
    await build(item[4].steps[0]);mistakes++;missed.push(item);
    assert.equal(await page.locator('#practiceScore').textContent(),`Correct: ${i} · Attempts: ${i+mistakes}`);
    await page.locator('#courseBuilderPanel').evaluate(e=>{e.open=false;});await page.locator('#keyCapture').focus();
    if(voice){
     for(const key of item[4].practiceSteps[0].split('+').slice(0,-1))await page.keyboard.press(key);
     await page.keyboard.press('Control');assert.match(await page.evaluate(()=>testSpeech.at(-1)),/Next: press and release numeric keypad minus/);
     await page.keyboard.press('NumpadSubtract');
    }else await build(item[4].practiceSteps[0]);
   }else if(item[4].mainKeyboardKey==='-'){
    await page.locator('#keyCapture').focus();await page.keyboard.press('Control+Alt+NumpadSubtract');mistakes++;missed.push(item);
    assert.equal(await page.locator('#practiceScore').textContent(),`Correct: ${i} · Attempts: ${i+mistakes}`);
    await page.keyboard.press('Control+Alt+-');
   }else if(['Control+E','Control+L','Control+R'].includes(item[0])){
    seen.push(item[0]);
    if(item[0]==='Control+E'){
     await build('Control+J');mistakes++;missed.push(item);
     assert.equal(await page.locator('#practiceScore').textContent(),`Correct: ${i} · Attempts: ${i+mistakes}`);
     await page.locator('#courseBuilderPanel').evaluate(e=>{e.open=false;});
    }
    await page.locator('#keyCapture').focus();
    await page.keyboard.press('Control');
    assert.match(voice?await page.evaluate(()=>testSpeech.at(-1)):await page.locator('#practiceStatus').textContent(),/Control.*[ELR]/);
    if(item[3]==='safe'){
     // Repeat may arm Control when it is the next practice key; finish that key sequence.
     await page.keyboard.press(item[0].split('+').at(-1));
    }else await page.keyboard.press(item[0]);
   }else for(const step of item[4].practiceSteps||item[4].steps)await build(step);
   assert.equal(await page.locator('#practiceScore').textContent(),`Correct: ${i+1} · Attempts: ${i+1+mistakes}`,item[0]);
   assert.equal(page.url(),url);assert.equal(page.context().pages().length,1);
   await advance(voice);
  }
  assert.deepEqual(seen,['Control+E','Control+L','Control+R']);
  assert.equal(await page.locator('#commandResults').isVisible(),true);
  assert.equal(await page.locator('#commandCorrectResult').textContent(),String(count));
  assert.equal(await page.locator('#commandAttemptResult').textContent(),String(count+mistakes));
  assert.equal(await page.locator('#commandReviewList li').count(),missed.length);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'practiceMissed');
  if(voice)for(const stage of ['Starting with basic','Moving to intermediate','Moving to advanced'])assert.ok(await page.evaluate(s=>testSpeech.some(t=>t.includes(s)),stage));
  else assert.equal(await page.evaluate(()=>testSpeech.length),0);
  await page.keyboard.press('Enter');
  for(const item of missed){for(const step of item[4].practiceSteps||item[4].steps)await build(step);await advance(voice);}
  assert.equal(await page.locator('#commandCorrectResult').textContent(),String(missed.length));
  assert.equal(await page.locator('#commandAccuracyResult').textContent(),'100%');
  await page.keyboard.press('Escape');await page.waitForURL('**/command-practice.html');
  console.log(category+': '+count+' tasks, one of each alignment, keypad/main-minus distinction, recovery, retry, totals, stages and completion focus; site voice='+voice);
 }
 assert.deepEqual(errors,[]);console.log('No JavaScript errors. No actual Word, screen-reader or Safari test.');
}finally{await browser?.close();await new Promise(r=>server.close(r));}
