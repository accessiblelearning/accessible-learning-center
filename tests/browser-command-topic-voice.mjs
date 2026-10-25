// Native Chromium focus and speech-request checks; not a real screen-reader test.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';
import {extname} from 'node:path';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const root=new URL('../',import.meta.url),origin='https://command-voice.example';
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],executablePath:process.env.ALC_CHROMIUM_PATH});
const errors=[];
try {
 const page=await browser.newPage();page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/*',async route=>{
  const url=new URL(route.request().url());if(url.origin!==origin)return route.abort();
  try {await route.fulfill({body:await readFile(new URL('.'+url.pathname,root)),contentType:{'.js':'text/javascript','.css':'text/css','.html':'text/html','.png':'image/png'}[extname(url.pathname)]||'application/octet-stream'});}
  catch {await route.fulfill({status:404,body:''});}
 });
 await page.addInitScript(()=>{
  window.heard=[];window.resumes=0;
  window.SpeechSynthesisUtterance=class {constructor(text){this.text=text;}};
  Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},resume(){window.resumes++;},speak(u){window.heard.push(u.text);}}});
 });
 await page.goto(origin+'/command-practice.html');
 const toggle=page.locator('#missionVoiceToggle'),topics=page.locator('#commandTopicsMenu a');
 assert.equal(await toggle.getAttribute('aria-pressed'),'true','first visit offers site voice');
 const count=await topics.count();assert.ok(count>10);
 for(let i=0;i<count+1;i++){
  await page.evaluate(()=>heard.length=0);await page.keyboard.press('ArrowDown');
  const selected=await page.evaluate(()=>document.activeElement.dataset.description);
  assert.deepEqual(await page.evaluate(()=>heard),[selected+'. Press Enter to start.']);
 }
 for(const key of ['ArrowUp','Home','Home','End','End']){
  await page.evaluate(()=>heard.length=0);await page.keyboard.press(key);
  assert.equal((await page.evaluate(()=>heard)).length,1,key+' announces even at a boundary');
 }
 const focused=await page.evaluate(()=>document.activeElement.id);
 await page.keyboard.press('Control+Alt+ArrowDown');
 assert.equal(await page.evaluate(()=>document.activeElement.id),focused,'AT modifiers pass through');
 assert.ok(await page.evaluate(()=>resumes)>count);
 await toggle.click();assert.equal(await toggle.getAttribute('aria-pressed'),'false');
 await topics.first().focus();await page.evaluate(()=>heard.length=0);await page.keyboard.press('ArrowDown');
 assert.deepEqual(await page.evaluate(()=>heard),[]);
 assert.equal(await page.locator('#commandTopicsStatus').getAttribute('aria-live'),'polite');
 assert.match(await page.locator('#commandTopicsStatus').textContent(),/Press Enter/);
 await page.reload();assert.equal(await toggle.getAttribute('aria-pressed'),'false','saved own-reader choice remains off');
 await toggle.click();
 await page.waitForFunction(()=>document.activeElement.closest('#commandTopicsMenu'));
 await page.evaluate(()=>heard.length=0);await page.keyboard.press('ArrowDown');
 assert.equal((await page.evaluate(()=>heard)).length,1,'arrow navigation works immediately after enabling voice');
 await page.reload();assert.equal(await toggle.getAttribute('aria-pressed'),'true');
 await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw Error('Fixture storage unavailable');};});
 await toggle.click();await toggle.click();await page.waitForFunction(()=>document.activeElement.closest('#commandTopicsMenu'));
 await page.keyboard.press('Enter');await page.waitForURL('**/command-practice-session.html?**');
 assert.equal(new URL(page.url()).searchParams.get('spoken'),'1');
 assert.deepEqual(errors,[]);
 console.log('PASS: every topic, Up/Down/Home/End, voice toggle focus, saved own-reader choice, storage failure, speech handoff. No real AT/audio test.');
} finally {await browser.close();}
