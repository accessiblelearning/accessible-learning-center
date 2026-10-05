import {createServer} from 'node:http';
import {readFile,writeFile,chmod} from 'node:fs/promises';
import {brotliDecompressSync} from 'node:zlib';
import {join,extname} from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const b=process.env.BROWSER_QA_ROOT;
if(!b) throw Error('Set BROWSER_QA_ROOT to a local folder with playwright-core and @sparticuz/chromium installed.');
const require=createRequire(join(b,'fixture.cjs'));
const {chromium:playwright}=require('playwright-core');
const chromiumModule=require('@sparticuz/chromium');
const chromium=chromiumModule.default || chromiumModule;
const root=fileURLToPath(new URL('../',import.meta.url));
await writeFile(b+'/chromium',brotliDecompressSync(await readFile(b+'/node_modules/@sparticuz/chromium/bin/chromium.br')));
await chmod(b+'/chromium',0o755);
const mime={'.js':'text/javascript','.css':'text/css','.html':'text/html'};
const server=createServer(async(req,res)=>{try{const path=decodeURIComponent(req.url.split('?')[0]),body=await readFile(join(root,path));res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream'});res.end(body);}catch{res.writeHead(404);res.end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
let browser;
try{
 browser=await playwright.launch({args:[...chromium.args.filter(a=>!a.startsWith("--use-gl=")&&!a.startsWith("--use-angle=")),"--disable-gpu","--disable-software-rasterizer"],executablePath:b+'/chromium'});
 const page=await browser.newPage({viewport:{width:1100,height:850}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));

 await page.addInitScript(()=>{window.testSpeech=[];window.testSpeechUtterances=[];speechSynthesis.speak=u=>{window.testSpeech.push(u.text);window.testSpeechUtterances.push(u);};speechSynthesis.cancel=()=>{};});

 for(const voice of [1,0]) {
  await page.goto(base+'/topic-mission-session.html?reader=jaws&mission=3&voice='+voice+'&sounds=0');
  await page.keyboard.press('Space');
  await page.keyboard.press('Control+z');
  assert.match(await page.locator('#missionProblem').textContent(),/Now save/);
  assert.match(await page.locator('#transcript').textContent(),/Step 2 of 2.*save/);
  if(voice) assert.match(await page.evaluate(()=>testSpeech.at(-1)),/Step 2 of 2.*save/);
  await page.keyboard.press('Control');
  assert.match(await page.locator('#transcript').textContent(),/^Step 2 of 2.*save/);
  await page.keyboard.press('Control+z');
  assert.match(await page.locator('#transcript').textContent(),/already restored.*Save the corrected document/);
  assert.match(await page.locator('#transcript').textContent(),/Step 2 of 2.*save/);
  await page.keyboard.press('F1');
  assert.match(await page.locator('#transcript').textContent(),/Control plus S/);
  await page.screenshot({path:b+'/word-save-step-'+voice+'.png'});
  await page.keyboard.press('Control+s');
  assert.equal(await page.locator('#missionResults').isVisible(),true);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'nextMission');
  assert.match(await page.locator('#transcript').textContent(),/Mission complete/);
  console.log('Native Word mission, repeat, hint, recovery, completion passed; voice='+voice);
 }

 await page.goto(base+'/topic-mission-session.html?reader=jaws&mission=12&voice=0&sounds=0');
 await page.keyboard.press('Space');
 await page.keyboard.down('Enter'); await page.keyboard.down('Enter');
 assert.equal(await page.locator('#missionProgress').getAttribute('value'),'1');
 assert.equal(await page.locator('#missionResults').isVisible(),false);
 await page.keyboard.up('Enter'); await page.keyboard.press('Enter');
 assert.equal(await page.locator('#missionAttemptResult').textContent(),'2');
 console.log('Held Enter cannot skip the second task.');
 await page.goto(base+'/topic-mission-session.html?reader=jaws&mission=11&voice=0&sounds=0');
 await page.keyboard.press('Space');
 await page.keyboard.press('Alt'); await page.keyboard.press('b');
 await page.keyboard.press('Alt'); await page.keyboard.press('Shift+b');
 assert.equal(await page.locator('#missionResults').isVisible(),true);
 assert.equal(await page.locator('#missionAttemptResult').textContent(),'2');
 assert.equal(await page.locator('#missionReviewResult').textContent(),'0');
 console.log('Native protected Alt, Shift+B completes without a false mistake.');
 await page.goto(base+'/command-practice-session.html?category=Google%20Docs%20and%20applications&style=guided&length=all&spoken=0&sounds=0');
 await page.keyboard.press('Space');
 assert.match(await page.locator('#commandPrompt').textContent(),/copies highlighted text/);
 assert.ok((await page.locator('body').textContent()).includes('copy a name so you can paste it elsewhere'));
 console.log('Short command prompt retained; expanded teaching note loaded.');

 for (const [id,keys] of [[13,['Control','t','Control','d']],[14,['F2','Enter','Control+s']],[15,['Control+m','Control+z','Control+s']],[16,['m','ArrowRight','Space']],[17,['ArrowRight','ArrowLeft']],[18,['Control+z','ArrowLeft','Control+c','ArrowRight','v','v','Enter','Control+s']],[19,['Alt','F10','F6','ArrowDown','Space','f','Control+s']]]) {
   await page.goto(base+'/topic-mission-session.html?reader=jaws&mission='+id+'&voice=1&sounds=0');
   await page.keyboard.press('Space');
   await page.keyboard.press('q');
   assert.match(await page.locator('#transcript').textContent(),/Step 1/);
   await page.keyboard.press('F1');
   assert.ok((await page.locator('#transcript').textContent()).length>30);
   for (const key of keys) await page.keyboard.press(key);
   assert.equal(await page.locator('#missionResults').isVisible(),true,'Mission '+id);
   assert.equal(await page.evaluate(()=>document.activeElement.id),'nextMission');
   assert.match(await page.evaluate(()=>testSpeech.at(-1)),/Mission complete/);
   console.log('New mission '+id+': native keys, hint, recovery, completion and speech request passed.');
 }
 for(const [id,keys] of [[20,['g','F6','l','c','F6']],[21,['ArrowDown','ArrowRight','Space','ArrowUp','ArrowRight','Space']],[22,['c','w','r','Delete','a','s']],[24,['b','Home','ArrowRight','5','Enter']]]) {
  await page.goto(base+'/topic-mission-session.html?reader=jaws&mission='+id+'&voice=1&sounds=0');
  await page.keyboard.press('Space');
  for(let i=0;i<keys.length;i++) {
   await page.keyboard.press('q');
   assert.equal(await page.locator('#missionProgress').getAttribute('value'),String(i));
   assert.match(await page.locator('#transcript').textContent(),/That command did not complete this step/);
   await page.keyboard.press('Control');
   assert.match(await page.locator('#transcript').textContent(),new RegExp('Step '+(i+1)+' of '+keys.length));
   await page.keyboard.press('F1');
   assert.match(await page.locator('#transcript').textContent(),/Strategy hint/);
   if(i===1) {
    await page.keyboard.press('Tab');assert.notEqual(await page.evaluate(()=>document.activeElement.id),'missionControlStation');
    await page.locator('#missionControlStation').focus();
    await page.setViewportSize({width:390,height:844});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    assert.ok(await page.locator('#transcript').evaluate(e=>e.getBoundingClientRect().bottom<=innerHeight),'Short mission feedback stays in the first narrow screen');
    if(process.env.AXE_PATH) {
     await page.addScriptTag({path:process.env.AXE_PATH});
     const violations=await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})));
     assert.deepEqual(violations,[],'Mission '+id+' accessibility scan');
    }
    await page.screenshot({path:b+'/mission-'+id+'-narrow.png'});
    await page.setViewportSize({width:1100,height:850});
   }
   await page.keyboard.press(keys[i]);
   if(i<keys.length-1)assert.match(await page.evaluate(()=>testSpeech.at(-1)),new RegExp('Step '+(i+2)+' of '+keys.length));
  }
  assert.equal(await page.locator('#missionResults').isVisible(),true);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'nextMission');
  assert.equal(await page.locator('#missionAttemptResult').textContent(),String(keys.length*2));
  assert.match(await page.evaluate(()=>testSpeech.at(-1)),/Mission complete/);
  console.log('Mission '+id+': all state transitions, errors, repeat, hints, native Tab, narrow layout and completion passed.');
 }
 await page.goto(base+'/topic-mission-session.html?reader=jaws&mission=24&voice=0&sounds=0');
 await page.keyboard.press('Space');
 for(const key of ['.','Home','Space','5'])await page.keyboard.press(key);
 assert.equal(await page.locator('#missionResults').isVisible(),false);
 await page.keyboard.press('Control');assert.match(await page.locator('#transcript').textContent(),/number 5.*Confirm/);
 await page.keyboard.press('Enter');assert.equal(await page.locator('#missionResults').isVisible(),true);
 assert.equal(await page.evaluate(()=>testSpeech.length),0);
 await page.keyboard.press('Escape');await page.waitForURL('**/topic-missions.html');
 await page.goto(base+'/topic-mission-session.html?reader=jaws&mission=24&voice=0&sounds=0');
 await page.keyboard.press('Space');await page.keyboard.press('Escape');await page.waitForURL('**/topic-missions.html');
 console.log('Slideshow period/Space alternatives, numeric confirmation, own-reader mode and Escape exit passed.');
 for(const voice of [0,1])for(const closeFirst of [false,true]) {
  await page.goto(base+'/topic-mission-session.html?reader=jaws&mission=23&voice='+voice+'&sounds=0');
  await page.keyboard.press('Space');
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#missionProgress').getAttribute('value'),'0');
  if(closeFirst) {await page.keyboard.press('Alt');await page.keyboard.press('F4');}
  else await page.keyboard.press('Control+s');
  const state=closeFirst?/Save Changes dialog: Save is focused/:/saved and still open/;
  assert.match(await page.locator('#missionProblem').textContent(),state);
  await page.keyboard.press('Control');
  assert.match(await page.locator('#transcript').textContent(),state);
  if(voice)assert.match(await page.evaluate(()=>testSpeech.at(-1)),state);
  await page.keyboard.press('F1');
  assert.match(await page.locator('#transcript').textContent(),closeFirst?/focused Save button/:/Alt plus F4/);
  await page.keyboard.press('q');
  assert.equal(await page.locator('#missionProgress').getAttribute('value'),'1');
  assert.match(await page.locator('#transcript').textContent(),state);
  await page.keyboard.press('Tab');
  assert.notEqual(await page.evaluate(()=>document.activeElement.id),'missionControlStation');
  await page.locator('#missionControlStation').focus();
  if(voice && closeFirst) {
   await page.setViewportSize({width:390,height:844});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
   if(process.env.AXE_PATH) {
    await page.addScriptTag({path:process.env.AXE_PATH});
    const violations=await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})));
    assert.deepEqual(violations,[],'Word branch accessibility scan');
   }
   await page.screenshot({path:b+'/word-close-dialog-narrow.png',fullPage:true});
   await page.setViewportSize({width:1100,height:850});
  }
  await page.keyboard.press(closeFirst?'Enter':'F4');
  assert.equal(await page.locator('#missionResults').isVisible(),true);
  assert.equal(await page.locator('#missionAttemptResult').textContent(),'4');
  assert.equal(await page.evaluate(()=>document.activeElement.id),'nextMission');
  assert.deepEqual(await page.locator('#missionMasteredList li').evaluateAll(nodes=>nodes.map(n=>n.textContent.split(':')[0])),closeFirst?['ALT+F4','ENTER']:['CTRL+S','ALT+F4']);
  await page.locator('.mission-result-details > summary').focus();
  await page.keyboard.press('Enter');
  await page.locator('#retryMissionResult').click();
  await page.keyboard.press('Shift+F12');
  assert.match(await page.locator('#missionProblem').textContent(),/saved and still open/);
  await page.keyboard.press('F4');
  assert.equal(await page.locator('#missionResults').isVisible(),true);
  assert.equal(await page.locator('#missionAttemptResult').textContent(),'2');
  console.log('Word choice mission: '+(closeFirst?'close then save':'save then close')+', voice='+voice+', recovery/repeat/retry/results passed.');
 }
 for(const addressKey of ['Control+l','Alt+d','F6']) {
  await page.goto(base+'/topic-mission-session.html?reader=jaws&mission=20&voice=0&sounds=0');
  await page.keyboard.press('Space');
  for(const key of ['g','F6',addressKey,'c','F6'])await page.keyboard.press(key);
  assert.equal(await page.locator('#missionResults').isVisible(),true,addressKey);
  assert.equal(await page.locator('#missionAttemptResult').textContent(),'5');
 }
 await page.goto(base+'/topic-mission-session.html?reader=jaws&mission=3&voice=0&sounds=0');
 await page.keyboard.press('Space');await page.keyboard.press('Control+z');await page.keyboard.press('Shift+F12');
 assert.equal(await page.locator('#missionResults').isVisible(),true);
 console.log('Native Chrome address alternatives and Word Shift+F12 save passed.');
 await page.clock.install();
 await page.goto(base+'/command-practice-session.html?category=Microsoft%20Excel%20and%20spreadsheets&style=guided&length=all&spoken=0&sounds=0');
 await page.keyboard.press('Space');
 const entries=await page.evaluate(()=>CommandPracticeCourses['Microsoft Excel and spreadsheets']);
 const stop=entries.findIndex(e=>e[4].stepGoals),aliases={'Left Arrow':'ArrowLeft','Right Arrow':'ArrowRight','Up Arrow':'ArrowUp','Down Arrow':'ArrowDown','Page Up':'PageUp','Page Down':'PageDown','Space':'Space','Equals':'=','Semicolon':';','Grave':'`'};
 for(const entry of entries.slice(0,stop)) {
  for(const step of entry[4].steps) {
   const keys=step.split('+').map(k=>aliases[k]||k);
   if(entry[3]==='safe')for(const key of keys)await page.keyboard.press(key);
   else await page.keyboard.press(keys.join('+'));
  }
  await page.clock.fastForward(2500);
 }
 assert.match(await page.locator('#commandPrompt').textContent(),/After copying cells, open Paste Special/);
 for(const key of ['Control','Alt','v'])await page.keyboard.press(key);
 assert.match(await page.locator('#commandPrompt').textContent(),/In Paste Special, choose all cell contents/);
 await page.keyboard.press('a');
 assert.match(await page.locator('#commandPrompt').textContent(),/Confirm to paste all cell contents/);
 await page.keyboard.press('Enter');
 assert.match(await page.locator('#practiceScore').textContent(),new RegExp('Correct: '+(stop+1)+' · Attempts: '+(stop+1)));
 console.log('Native Excel Paste Special: protected sequence, current dialog goals, and confirmation passed.');
 await page.setViewportSize({width:390,height:844});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 await page.screenshot({path:b+'/excel-paste-special-narrow.png'});
 for(const [name,detailKey] of [['Thunderbird email','Control+Shift+O'],['ZoomText and Fusion Desktop magnification','Caps Lock+Space then Y then W'],['NVDA commands','Insert+F10']]) {
  await page.setViewportSize({width:1100,height:850});
  await page.goto(base+'/command-practice-session.html?category='+encodeURIComponent(name)+'&style=guided&length=all&spoken=1&sounds=0');
  await page.keyboard.press('Space');
  const items=await page.evaluate(name=>CommandPracticeCourses[name],name);
  for(let i=0;i<items.length;i++) {
   const entry=items[i];
   assert.equal(await page.locator('#commandExplanationDetails').evaluate(e=>e.open),false);
   assert.equal(await page.locator('#commandDetailedExplanation').textContent(),entry[2]);
   if(entry[0]===detailKey) {
    await page.locator('#commandExplanationDetails summary').click();
    assert.equal(await page.locator('#commandDetailedExplanation').isVisible(),true);
    await page.setViewportSize({width:390,height:844});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,name);
    if(process.env.AXE_PATH) {
     await page.addScriptTag({path:process.env.AXE_PATH});
     const violations=await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})));
     assert.deepEqual(violations,[],name+' expanded explanation');
    }
    await page.screenshot({path:b+'/'+(name.startsWith('Thunderbird')?'email':name.startsWith('NVDA')?'nvda':'magnification')+'-teaching-narrow.png',fullPage:true});
    await page.locator('#commandExplanationDetails summary').click();
    await page.setViewportSize({width:1100,height:850});
    await page.locator('#keyCapture').focus();
   }
   for(const step of entry[4].steps) {
    const keys=step.split('+').map(k=>k==='Caps Lock'?'CapsLock':aliases[k]||k);
    if(entry[3]==='safe')for(const key of keys)await page.keyboard.press(key);
    else await page.keyboard.press(keys.join('+'));
   }
   assert.equal(await page.locator('#practiceScore').textContent(),`Correct: ${i+1} · Attempts: ${i+1}`,name+': '+entry[0]);
   // Finish the mocked spoken confirmation; a spoken session waits for end.
   await page.evaluate(()=>testSpeechUtterances.at(-1).dispatchEvent(new Event('end')));
  }
  assert.equal(await page.locator('#commandResults').isVisible(),true,name);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'practiceMissed');
  assert.match(await page.evaluate(()=>testSpeech.at(-1)),new RegExp(`practiced ${items.length} commands correctly`));
  console.log(name+': all '+items.length+' commands, speech requests, optional explanations, narrow layout and completion passed.');
 }
 assert.deepEqual(errors,[]); console.log('No browser JavaScript errors.');
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
