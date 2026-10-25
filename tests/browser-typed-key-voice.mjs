// Real keyboard/input events with a controllable speech queue. No live accounts.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';
import {extname} from 'node:path';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const root=new URL('../',import.meta.url),origin='https://typing-voice.example';
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],executablePath:process.env.ALC_CHROMIUM_PATH});
const errors=[];
try {
 const page=await browser.newPage({viewport:{width:1100,height:850}});page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/*',async route=>{
  const url=new URL(route.request().url());if(url.origin!==origin)return route.abort();
  try {await route.fulfill({body:await readFile(new URL('.'+url.pathname,root)),contentType:{'.js':'text/javascript','.css':'text/css','.html':'text/html','.png':'image/png'}[extname(url.pathname)]||'application/octet-stream'});}
  catch {await route.fulfill({status:404,body:''});}
 });
 await page.addInitScript(()=>{
  sessionStorage.setItem('alcKeyboardingPreview','open');
  window.heard=[];window.requested=[];window.speechQueue=[];
  window.SpeechSynthesisUtterance=class {constructor(text){this.text=text;}};
  window.drainSpeech=()=>{let limit=0;while(speechQueue.length){if(++limit>2000)throw Error('Speech loop');const u=speechQueue.shift();heard.push(u.text.trim());u.onend?.();}};
  Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[],addEventListener(){},cancel(){const old=speechQueue.splice(0);old.forEach(u=>u.onerror?.({error:'canceled'}));},speak(u){requested.push(u.text.trim());speechQueue.push(u);}}});
 });
 await page.goto(origin+'/keyboarding-preview.html');
 await page.locator('#setupPanel').waitFor({state:'visible'});
 const settings=async()=>{await page.locator('[data-main-action="settings"]').click();};
 const clear=()=>page.evaluate(()=>{drainSpeech();heard.length=0;requested.length=0;});
 const heard=()=>page.evaluate(()=>{drainSpeech();return heard;});
 const key=async()=> (await page.locator('.kb-char-current').textContent()).replaceAll('\u00a0',' ');
 const press=ch=>page.keyboard.press(ch===' '?'Space':ch);
 const name=ch=>ch===' '?'space':ch;
 const leave=()=>page.keyboard.press('Escape');
 await settings();
 const echo=page.locator('[data-setting="speak-typed-keys"]');
 assert.equal(await echo.getAttribute('aria-pressed'),'false');
 await echo.focus();assert.match((await page.evaluate(()=>requested)).at(-1),/including mistakes/);
 assert.ok(await page.locator('#speakTypedKeysHelp').evaluate(el=>el.getBoundingClientRect().height<=1));
 await echo.click();assert.equal(await echo.getAttribute('aria-pressed'),'true');await leave();
 for(const hand of ['both','left','right']){
  await page.locator('#handSetting').selectOption(hand,{force:true});
  await page.locator('[data-main-action="lesson"]').click();await page.keyboard.press('Enter');await clear();
  const entered=[];
  for(let i=0;i<6;i++){const ch=await key();entered.push(name(ch));await press(ch);}
  const messages=await heard();assert.equal(messages.length,entered.length);
  entered.forEach((ch,i)=>assert.ok(messages[i].startsWith(ch+'.'),hand+': each queued character survives'));
  const expected=await key();await clear();await page.keyboard.press('z');
  assert.equal(await key(),expected);assert.match((await heard())[0],/^z\. /,'echo the mistaken key before correction');
  await clear();await press(expected);await leave();
  const afterExit=await heard();assert.ok(afterExit.every(text=>!text.startsWith(name(expected)+'.')),'Escape cancels pending echoes');
 }
 await page.locator('[data-main-action="practice"]').click();await page.locator('[data-practice-mode="free"]').click();await clear();
 await page.keyboard.press('a');await page.keyboard.type('A 7;');await page.keyboard.press('Enter');
 assert.deepEqual(await heard(),['a.','capital A.','space.','number 7.','semicolon.','new line.']);
 await clear();await page.keyboard.press('Backspace');await page.keyboard.press('Control+a');
 await page.locator('#freeTypeInput').evaluate(el=>el.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertFromPaste',data:'pasted'})));
 assert.deepEqual(await heard(),[],'no echoes for deletions, shortcuts or pasted text');
 await page.keyboard.press('b');await page.locator('#voiceToggle').click();await clear();
 await page.locator('#freeTypeInput').focus();await page.keyboard.press('c');assert.deepEqual(await heard(),[],'site voice off suppresses echo');
 await page.locator('#voiceToggle').click();await leave();
 // Finish a whole lesson without draining speech between characters, including
 // group boundaries and the delayed result focus that used to cancel speech.
 await page.locator('#handSetting').selectOption('both',{force:true});
 await page.locator('[data-main-action="lesson"]').click();await page.keyboard.press('Enter');await clear();
 const entered=[];
 for(let i=0;i<400&&await page.locator('.kb-char-current').count();i++){const ch=await key();entered.push(name(ch));await press(ch);}
 await page.locator('#resultsPanel').waitFor({state:'visible'});await page.waitForFunction(()=>document.activeElement.id==='resultAction');
 const all=await heard();assert.equal(all.length,entered.length+1);
 entered.forEach((ch,i)=>assert.ok(all[i].startsWith(ch+'.'),'completion retains character '+i));
 assert.match(all.at(-1),/Lesson/);await leave();
 // The private course also has next-key guidance. Test both settings together.
 await settings();
 if(await page.locator('[data-setting="next-key-guidance"]').count()){
  await page.locator('[data-setting="next-key-guidance"]').click();await leave();
  await page.locator('[data-main-action="lesson"]').click();await page.keyboard.press('Enter');await clear();
  const typed=await key();await press(typed);const next=await key();
  assert.deepEqual(await heard(),[name(typed)+'.',name(next)+'.'],'typed key is heard before the next-key cue');
  await leave();await settings();await page.locator('[data-setting="next-key-guidance"]').click();await leave();
  await page.locator('[data-main-action="lesson"]').click();await page.keyboard.press('Enter');await clear();
  const paused=await key();await press(paused);assert.deepEqual(await heard(),[name(paused)+'.']);
  await page.waitForTimeout(3100);assert.equal((await heard()).at(-1),name(await key())+'.');
  await leave();await settings();await page.locator('[data-setting="next-key-guidance"]').click();
 }
 await page.reload();await settings();assert.equal(await echo.getAttribute('aria-pressed'),'true','choice persists');
 await echo.click();await page.reload();await settings();assert.equal(await echo.getAttribute('aria-pressed'),'false');
 await leave();await page.locator('[data-main-action="lesson"]').click();await page.keyboard.press('Enter');await clear();
 await press(await key());assert.deepEqual(await heard(),[],'Off restores quiet correct-key feedback');
 await leave();await settings();
 await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw Error('Storage unavailable');};});
 await echo.click();assert.equal(await echo.getAttribute('aria-pressed'),'true','works for visit without storage');
 assert.deepEqual(errors,[]);
 console.log('PASS: default Off, focus help, all hand modes, queued keys, mistakes, free typing, spaces/capitals/numbers/punctuation, completion, Escape/voice-off, guidance coexistence, persistence and blocked storage. Speech simulation, not real audio/AT.');
} finally {await browser.close();}
