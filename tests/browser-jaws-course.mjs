// Chromium practice checks; no real JAWS instance is involved.
import {createServer} from 'node:http';
import {readFile,writeFile,chmod} from 'node:fs/promises';
import {brotliDecompressSync} from 'node:zlib';
import {join,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const tooling=process.env.BROWSER_QA_ROOT;
if(!tooling)throw Error('Set BROWSER_QA_ROOT to the existing browser tooling.');
const require=createRequire(join(tooling,'fixture.cjs'));
const {chromium:playwright}=require('playwright-core'),module=require('@sparticuz/chromium'),chromium=module.default||module;
const root=fileURLToPath(new URL('../',import.meta.url));
await writeFile(join(tooling,'chromium'),brotliDecompressSync(await readFile(join(tooling,'node_modules/@sparticuz/chromium/bin/chromium.br'))));
await chmod(join(tooling,'chromium'),0o755);
const server=createServer(async(req,res)=>{
 try{const path=decodeURIComponent(req.url.split('?')[0]);res.writeHead(200,{'Content-Type':{'.js':'text/javascript','.css':'text/css','.html':'text/html'}[extname(path)]||'application/octet-stream'});res.end(await readFile(join(root,path)));}
 catch{res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;let browser;
try{
 browser=await playwright.launch({args:[...chromium.args.filter(a=>!a.startsWith('--use-gl=')&&!a.startsWith('--use-angle=')),'--disable-gpu','--disable-software-rasterizer'],executablePath:join(tooling,'chromium')});
 const page=await browser.newPage({viewport:{width:1100,height:850}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
 await page.addInitScript(()=>{window.testSpeech=[];window.testUtterances=[];speechSynthesis.speak=u=>{testSpeech.push(u.text);testUtterances.push(u);};speechSynthesis.cancel=()=>{};});
 await page.clock.install();
 for(const voice of [1,0]){
  await page.goto(base+'/command-practice-session.html?category=JAWS%20commands&style=guided&length=all&spoken='+voice+'&sounds=0');
  await page.keyboard.press('Space');
  const items=await page.evaluate(()=>CommandPracticeCourses['JAWS commands']);assert.equal(items.length,32);
  let mistakes=0;
  for(const [i,entry] of items.entries()){
   assert.equal(await page.locator('#commandDetailedExplanation').textContent(),entry[2]);
   assert.equal(await page.locator('#commandExplanationDetails').evaluate(e=>e.open),false);
   if(voice&&entry[0]==='Insert+Space then O then D'){
    await page.locator('#commandExplanationDetails summary').focus();await page.keyboard.press('Enter');
    await page.setViewportSize({width:390,height:844});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    if(process.env.AXE_PATH){
     await page.addScriptTag({path:process.env.AXE_PATH});
     assert.deepEqual(await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id)),[]);
    }
    await page.screenshot({path:join(tooling,'jaws-ocr-explanation-narrow.png'),fullPage:true});
    await page.locator('#commandExplanationDetails summary').focus();await page.keyboard.press('Enter');
    await page.setViewportSize({width:1100,height:850});
   }
   await page.locator('#keyCapture').focus();
   for(const [s,step] of entry[4].steps.entries()){
    if(entry[4].stepGoals){
     await page.keyboard.press('Control');
     assert.ok((voice?await page.evaluate(()=>testSpeech.at(-1)):await page.locator('#practiceStatus').textContent()).includes(entry[4].stepGoals[s]));
    }
    if(entry[0]==='Insert+Space then O then D'&&s===1){
     await page.keyboard.press('x');mistakes++;
     assert.equal(await page.locator('#practiceScore').textContent(),`Correct: ${i} · Attempts: ${i+mistakes}`);
     await page.keyboard.press('Control');
     assert.match(voice?await page.evaluate(()=>testSpeech.at(-1)):await page.locator('#practiceStatus').textContent(),/Choose Convenient OCR/);
     await page.keyboard.press('Tab');assert.notEqual(await page.evaluate(()=>document.activeElement.id),'keyCapture');
     await page.locator('#keyCapture').focus();
    }
    for(const key of step.split('+'))await page.keyboard.press({'Down Arrow':'ArrowDown'}[key]||key);
   }
   assert.equal(await page.locator('#practiceScore').textContent(),`Correct: ${i+1} · Attempts: ${i+1+mistakes}`,entry[0]);
   if(voice)await page.evaluate(()=>testUtterances.at(-1).dispatchEvent(new Event('end')));
   else await page.clock.fastForward(2500);
  }
  assert.equal(await page.locator('#commandResults').isVisible(),true);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'practiceMissed');
  if(voice){for(const stage of ['Starting with basic','Moving to intermediate','Moving to advanced'])assert.ok(await page.evaluate(stage=>testSpeech.some(t=>t.includes(stage)),stage));}
  else assert.equal(await page.evaluate(()=>testSpeech.length),0);
  await page.keyboard.press('Escape');await page.waitForURL('**/command-practice.html');
  console.log('JAWS: all 32 tasks, separated keys, current-step repeat, wrong-layer recovery, Tab exit and completion passed; site voice='+voice);
 }
 assert.deepEqual(errors,[]);console.log('No JavaScript errors. This tests the Chromium webpage, not JAWS or Safari.');
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
