// Chromium keyboard/focus checks with local course data and simulated speech.
// No real Office application, accounts, screen reader or clipboard is used.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';
import {extname} from 'node:path';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const root=new URL('../',import.meta.url),origin='https://mission-parts.example';
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],executablePath:process.env.ALC_CHROMIUM_PATH});
const errors=[];
try {
 const page=await browser.newPage({viewport:{width:1100,height:850}});page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',async route=>{
  const url=new URL(route.request().url());if(url.origin!==origin)return route.abort();
  try {
   let body=await readFile(new URL('.'+url.pathname,root));
   // Keep the production entries/controllers, narrowing this test to all twelve
   // Excel Control+Alt+V tasks instead of traversing unrelated curriculum.
   if(url.pathname==='/command-teaching.js')body=body.toString()+`\nwindow.CommandPracticeCourses['Microsoft Excel and spreadsheets']=window.CommandPracticeCourses['Microsoft Excel and spreadsheets'].filter(e=>e[0].startsWith('Control+Alt+V'));`;
   await route.fulfill({body,contentType:{'.js':'text/javascript','.css':'text/css','.html':'text/html','.png':'image/png'}[extname(url.pathname)]||'application/octet-stream'});
  }catch{await route.fulfill({status:404,body:''});}
 });
 await page.addInitScript(()=>{
  window.heard=[];let pending;
  speechSynthesis.speak=u=>{heard.push(u.text);pending=setTimeout(()=>u.dispatchEvent(new Event('end')),10);};
  speechSynthesis.cancel=()=>clearTimeout(pending);
 });
 await page.clock.install();
 for(const voice of [0,1]){
  await page.goto(origin+'/command-practice-session.html?category=Microsoft%20Excel%20and%20spreadsheets&style=guided&length=all&spoken='+voice+'&sounds=0');
  await page.keyboard.press('Space');
  const entries=await page.evaluate(()=>CommandPracticeCourses['Microsoft Excel and spreadsheets']);assert.equal(entries.length,12);
  for(const [index,entry] of entries.entries()){
   if(entry[3]==='safe'){
    assert.match(await page.locator('#commandPrompt').textContent(),/together.*one key at a time/);
    if(index===1){
     await page.keyboard.press('Control+Alt+Shift+v');assert.match(await page.locator('#courseStep').textContent(),/Step 1 of 3/);
     await page.keyboard.down('Control');await page.keyboard.down('Alt');await page.keyboard.down('v');
     await page.keyboard.up('v');assert.match(await page.locator('#courseStep').textContent(),/Step 1 of 3/);
     await page.keyboard.up('Alt');await page.keyboard.up('Control');
    }else if(index===2){for(const k of ['Control','Alt','v'])await page.keyboard.press(k);}
    else await page.keyboard.press(index%2?'Alt+Control+v':'Control+Alt+v');
    assert.match(await page.locator('#courseStep').textContent(),/Step 2 of 3/);
    await page.keyboard.press(entry[4].steps[1].toLowerCase());assert.match(await page.locator('#courseStep').textContent(),/Step 3 of 3/);
    await page.keyboard.press('Enter');
   }else await page.keyboard.press('Control+Alt+v');
   assert.equal(await page.locator('#practiceScore').textContent(),'Correct: '+(index+1)+' · Attempts: '+(index+1));
   await page.clock.fastForward(2600);
  }
  await page.locator('#commandResults').waitFor({state:'visible'});
 }
 await page.goto(origin+'/topic-missions.html');
 await page.evaluate(()=>localStorage.setItem('accessibleLearningPreferences',JSON.stringify({trainingSpeech:'voice'})));await page.reload();
 const topics=page.locator('#topicMissionsMenu a'),labels=await topics.locator('strong').allTextContents();
 assert.equal(labels.length,27);assert.equal(new Set(labels).size,27);
 assert.ok(labels.some(label=>/PowerPoint.*Part 3 of 3.*slideshow/.test(label)));
 for(let i=0;i<labels.length;i++){
  const expected=await page.evaluate(()=>document.activeElement.dataset.description);
  assert.equal(await page.locator('#topicMissionsMenu a:focus strong').textContent(),expected);
  await page.keyboard.press('ArrowDown');
  const selected=await page.evaluate(()=>document.activeElement.dataset.description);
  assert.equal((await page.evaluate(()=>heard)).at(-1),selected+'. Press Enter to start.');
 }
 for(const [width,scale] of [[1100,100],[390,100],[320,200]]){
  await page.setViewportSize({width,height:850});await page.evaluate(scale=>document.documentElement.style.fontSize=scale+'%',scale);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'menu overflow at '+width+' / '+scale+'%');
 }
 await page.setViewportSize({width:1100,height:850});await page.evaluate(()=>document.documentElement.style.fontSize='100%');
 await page.locator('[data-choice="excel-paste-values"]').focus();
 if(process.env.ALC_MISSION_SCREENSHOT)await page.screenshot({path:process.env.ALC_MISSION_SCREENSHOT});
 await page.keyboard.press('Enter');await page.waitForURL('**/topic-mission-session.html?**');
 assert.equal(new URL(page.url()).searchParams.get('mission'),'18');
 await page.keyboard.press('Space');
 for(const key of ['Control+z','ArrowLeft','Control+c','ArrowRight','Control+Alt+v','v','Enter','Control+s'])await page.keyboard.press(key);
 assert.equal(await page.locator('#missionResults').isVisible(),true);
 assert.equal(await page.locator('#missionReviewResult').textContent(),'0');
 await page.keyboard.press('Escape');await page.waitForURL('**/topic-missions.html');
 assert.equal(await page.evaluate(()=>document.activeElement.dataset.choice),'excel-paste-values');
 assert.match(await page.locator('[data-choice="excel-paste-values"] strong').textContent(),/Part 2 of 2/);
 assert.deepEqual(errors,[]);
 console.log('PASS: 12 native Excel tasks with voice on/off; held and separated keys; no premature dialog choice; 27 unique spoken mission titles, numbered parts, narrow/large-print layout, stable links and Escape focus. Not real Office/AT testing.');
}finally{await browser.close();}
