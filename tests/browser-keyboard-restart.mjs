// Local fictional sessions. Chromium input checks, not physical one-hand testing.
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
 const page=await browser.newPage({viewport:{width:1100,height:850}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
 await page.addInitScript(()=>{window.testSpeech=[];speechSynthesis.speak=u=>testSpeech.push(u.text);speechSynthesis.cancel=()=>{};});
 await page.clock.install();await page.clock.pauseAt(new Date());
 const fixture=await readFile(join(root,'tests/keyboarding-one-hand.test.mjs'),'utf8');
 const code=fixture.match(/get\('previewCode'\)\.value = '([^']+)'; p\.get\('unlockForm'\)\.fire\('submit'\);\n    assert.equal\(p.get\('unlockPanel'\).hidden, true/)[1];
 async function typeLesson(){
  await page.keyboard.press('Enter');
  for(let i=0;i<400;i++){
   const marker=page.locator('.kb-char-current');
   if(!(await marker.count()))return;
   const key=(await marker.textContent()).replace(/\u00a0/g,' ');
   await page.keyboard.press(key===' '?'Space':key);
  }
  throw Error('Lesson did not reach its final character');
 }
 for(const hand of ['both','left','right']){
  await page.goto(base+'/keyboarding-preview.html');
  await page.evaluate(()=>{localStorage.removeItem('alcKeyboardingProgressV1');});
  if(await page.locator('#unlockPanel').isVisible()){await page.locator('#previewCode').fill(code);await page.locator('#unlockForm button').click();}
  await page.locator('[data-main-action="settings"]').click();
  while(await page.locator('#handSetting').inputValue()!==hand)await page.locator('[data-setting="hand"]').click();
  if(await page.locator('#menuSaveValue').textContent()==='Off')await page.locator('[data-setting="save"]').click();
  await page.keyboard.press('Escape');await page.clock.runFor(1);
  await page.locator('[data-main-action="lesson"]').click();await page.clock.runFor(1);
  await typeLesson();
  assert.equal(await page.locator('#resultsPanel').isVisible(),false);
  await page.keyboard.press('Escape');await page.clock.runFor(1);
  await page.locator('[data-main-action="lesson"]').click();await page.clock.runFor(250);
  assert.equal(await page.locator('#practicePanel').isVisible(),true,hand+' restart remains open');
  assert.equal(await page.locator('#resultsPanel').isVisible(),false);
  assert.equal(await page.evaluate(()=>localStorage.getItem('alcKeyboardingProgressV1')),null);
  assert.equal(await page.locator('#targetPrompt').textContent(),'Press any key to start');
  await typeLesson();await page.clock.runFor(250);
  assert.equal(await page.locator('#resultsPanel').isVisible(),true);
  assert.equal(await page.locator('#accuracyResult').textContent(),'100%');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('alcKeyboardingProgressV1')));
  assert.equal(saved.sessions.length,1);assert.equal(saved.sessions[0].hand,hand);assert.equal(saved.sessions[0].accuracy,100);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'resultAction');
  assert.ok(await page.evaluate(()=>testSpeech.at(-1).includes('Lesson 1')));
  console.log(hand+': quick exit/restart does not finish or save a new session; ordinary completion saves one accurate result and focuses the next action.');
 }
 assert.deepEqual(errors,[]);console.log('No JavaScript errors. No real screen-reader, Safari or physical one-handed testing.');
}finally{await browser?.close();await new Promise(r=>server.close(r));}
