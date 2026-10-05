// Use only fictional progress responses. No requests reach the real progress API.
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
const deferred=()=>{let resolve;const promise=new Promise(r=>{resolve=r;});return {promise,resolve};};
const record={course:'Firefox',lesson_number:1,status:'completed'};
try{
 browser=await chromium.launch({executablePath:join(dir,'chromium'),args:[...runtime.args.filter(a=>!a.startsWith('--use-gl=')&&!a.startsWith('--use-angle=')),'--disable-gpu','--disable-software-rasterizer']});
 const errors=[];
 async function pageWithProgress(onProgress){
  const page=await browser.newPage({viewport:{width:1100,height:850}});page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{localStorage.setItem('accessibleLearningStudentId','fictional_test_one');window.testSpeech=[];speechSynthesis.speak=u=>testSpeech.push(u.text);speechSynthesis.cancel=()=>{};});
  await page.route('**/*',async r=>{
   const url=new URL(r.request().url());
   if(url.origin===base)return r.continue();
   if(url.hostname==='accessible-learning-api.aaccessabilitylearningcenter.workers.dev'&&url.pathname==='/progress'){
    const body=await onProgress(r.request());return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
   }
   return r.abort();
  });
  return page;
 }
 const read=deferred(),readStarted=deferred(),posts=[];
 const lesson=await pageWithProgress(async request=>{if(request.method()==='GET'){readStarted.resolve();return read.promise;}posts.push(request.postDataJSON());return {success:true};});
 await lesson.goto(base+'/firefox-lesson-1.html');await readStarted.promise;
 await lesson.getByRole('button',{name:'Mark this lesson complete',exact:true}).click();
 await lesson.getByRole('button',{name:'Undo lesson completion',exact:true}).click();
 await lesson.waitForFunction(()=>document.querySelector('#lessonCompletionStatus').textContent==='This lesson is not marked complete.');
 const responseRead=lesson.waitForResponse(r=>r.url().includes('/progress?'));
 read.resolve([record]);await (await responseRead).finished();
 // A local task after the response ensures the production continuation has run.
 await lesson.evaluate(()=>new Promise(r=>setTimeout(r,0)));
 assert.equal(await lesson.getByRole('button',{name:'Mark this lesson complete',exact:true}).count(),1);
 assert.deepEqual(posts.map(p=>p.status),['completed','in_progress']);
 assert.ok(posts.every(p=>p.student_id==='fictional_test_one'));
 console.log('Delayed lesson read cannot overwrite completed save/undo. Fictional API only.');

 const write=deferred(),writeStarted=deferred();
 const changed=await pageWithProgress(async request=>{if(request.method()==='GET')return [];writeStarted.resolve();return write.promise;});
 await changed.goto(base+'/firefox-lesson-1.html');await changed.getByRole('button',{name:'Mark this lesson complete',exact:true}).click();await writeStarted.promise;
 await changed.evaluate(()=>localStorage.setItem('accessibleLearningStudentId','fictional_test_two'));
 write.resolve({success:true});await changed.waitForFunction(()=>document.querySelector('#lessonCompletionStatus').textContent.includes('Student ID changed'));
 assert.equal(await changed.locator('.lesson-completion button').isDisabled(),true);
 console.log('An in-flight completion response cannot display success for a switched Student ID.');

 const ready=deferred(),readyStarted=deferred();
 const quiz=await pageWithProgress(async()=>{readyStarted.resolve();return ready.promise;});
 await quiz.goto(base+'/firefox-quiz.html');await readyStarted.promise;
 assert.equal(await quiz.locator('#courseQuiz button[type="submit"]').isDisabled(),true);
 await quiz.evaluate(()=>localStorage.setItem('accessibleLearningStudentId','fictional_test_two'));
 ready.resolve(Array.from({length:10},(_,i)=>({...record,lesson_number:i+1})));
 await quiz.waitForFunction(()=>document.querySelector('.quiz-readiness').textContent.includes('Student ID changed'));
 assert.equal(await quiz.locator('#courseQuiz button[type="submit"]').isDisabled(),true);
 assert.equal(await quiz.locator('#certificateSetup').isVisible(),false);
 console.log('A late quiz-readiness response remains locked after an ID change.');

 const malformedProgress=[true,[1],['1'],null,{},'',0,11,1.5].map(n=>({...record,lesson_number:n}));
 const validProgress=Array.from({length:9},(_,i)=>({...record,lesson_number:String(i+2)}));
 const malformed=await pageWithProgress(async()=>[...malformedProgress,...validProgress]);
 await malformed.goto(base+'/firefox-quiz.html');
 await malformed.waitForFunction(()=>document.querySelector('.quiz-readiness').textContent.includes('9 of 10'));
 assert.equal(await malformed.locator('#courseQuiz button[type="submit"]').isDisabled(),true);
 assert.equal(await malformed.locator('#certificateSetup').isVisible(),false);
 await malformed.goto(base+'/lessons.html#firefox-lessons');
 await malformed.waitForFunction(()=>document.querySelector('#firefox-lessons summary').textContent.includes('9 of 10'));
 assert.match(await malformed.locator('#firefox-lessons .course-continue a').getAttribute('href'),/firefox-lesson-1\.html$/);
 const malformedLessonResponse=malformed.waitForResponse(r=>new URL(r.url()).pathname==='/progress');
 await malformed.goto(base+'/firefox-lesson-1.html');await (await malformedLessonResponse).finished();
 await malformed.evaluate(()=>new Promise(r=>setTimeout(r,0)));
 assert.equal(await malformed.getByRole('button',{name:'Mark this lesson complete',exact:true}).count(),1);
 assert.equal(await malformed.getByRole('button',{name:'Undo lesson completion',exact:true}).count(),0);
 console.log('Malformed lesson numbers cannot count as lesson one, skip it in Continue, or unlock the final quiz; valid numeric strings remain counted.');

 const settings=await pageWithProgress(async()=>[]);
 await settings.addInitScript(()=>{localStorage.setItem('missionControlPracticeSettings','null');localStorage.setItem('accessibleLearningPreferences','true');});
 await settings.setViewportSize({width:390,height:844});await settings.goto(base+'/mission-settings.html');
 await settings.locator('[data-setting="speech"]').focus();await settings.keyboard.press('Enter');
 assert.equal(await settings.locator('#speechValue').textContent(),'Use the Mission Control voice');
 assert.equal(await settings.locator('#missionVoiceToggle').textContent(),'Voice: Mission Control');
 await settings.evaluate(()=>{window.originalSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('Storage full','QuotaExceededError');};});
 await settings.locator('[data-setting="reader"]').focus();await settings.keyboard.press('ArrowRight');
 assert.equal(await settings.locator('#readerValue').textContent(),'Narrator');
 assert.equal(await settings.locator('#missionSettingsSaveWarning').isVisible(),true);
 assert.match(await settings.evaluate(()=>testSpeech.at(-1)),/could not be saved/);
 await settings.locator('#missionVoiceToggle').click();assert.equal(await settings.locator('#speechValue').textContent(),'Use my own screen reader');
 assert.equal(await settings.locator('#missionVoiceToggle').textContent(),'Voice: My screen reader');
 assert.equal(await settings.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 if(process.env.AXE_PATH){await settings.addScriptTag({path:process.env.AXE_PATH});assert.deepEqual(await settings.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id)),[]);}
 await settings.evaluate(()=>{Storage.prototype.setItem=window.originalSet;});
 await settings.locator('[data-setting="reader"]').focus();await settings.keyboard.press('ArrowLeft');
 assert.equal(await settings.locator('#readerValue').textContent(),'JAWS');assert.equal(await settings.locator('#missionSettingsSaveWarning').isVisible(),false);
 assert.match(await settings.locator('#missionSettingsStatus').textContent(),/Settings saved/);
 await settings.keyboard.press('Escape');await settings.waitForURL('**/troubleshooting-lab.html');
 console.log('Settings: malformed-data recovery, arrow/Enter controls, visible unsaved warning, voice synchronization, persistence retry, narrow layout, Axe and Escape passed.');

 const catalogRead=deferred(),catalogStarted=deferred();
 const courses=await pageWithProgress(async()=>{catalogStarted.resolve();return catalogRead.promise;});
 await courses.goto(base+'/lessons.html');await catalogStarted.promise;
 assert.equal(await courses.locator('#startedCoursesOnly').isDisabled(),true);
 assert.equal(await courses.locator('main > section[id$="-lessons"]:visible').count(),30);
 await courses.locator('#courseFilter').fill('Firefox');
 assert.equal(await courses.locator('#firefox-lessons').isVisible(),true);
 catalogRead.resolve(null);await courses.waitForFunction(()=>document.querySelector('#courseProgressNotice').textContent.includes('temporarily unavailable'));
 assert.equal(await courses.locator('#startedCoursesOnly').isDisabled(),true);
 assert.equal(await courses.locator('#courseFilterStatus').textContent(),'1 course shown.');
 assert.equal(await courses.locator('#firefox-lessons').isVisible(),true);
 const otherRead=deferred(),otherStarted=deferred();
 const otherCourses=await pageWithProgress(async()=>{otherStarted.resolve();return otherRead.promise;});
 await otherCourses.goto(base+'/lessons.html');await otherStarted.promise;
 await otherCourses.evaluate(()=>localStorage.setItem('accessibleLearningStudentId','fictional_test_two'));
 otherRead.resolve([record]);await otherCourses.waitForFunction(()=>document.querySelector('#courseProgressNotice').textContent.includes('Student ID changed'));
 assert.equal(await otherCourses.locator('#startedCoursesOnly').isDisabled(),true);
 assert.doesNotMatch(await otherCourses.locator('#firefox-lessons summary').textContent(),/lessons complete/);
 const validCourses=await pageWithProgress(async()=>[null,[],false,record]);await validCourses.goto(base+'/lessons.html');
 await validCourses.waitForFunction(()=>!document.querySelector('#startedCoursesOnly').disabled);
 assert.match(await validCourses.locator('#firefox-lessons summary').textContent(),/1 of 10/);
 assert.equal(await validCourses.locator('#firefox-lessons .course-continue a').getAttribute('href'),'firefox-lesson-2.html');
 await validCourses.locator('#startedCoursesOnly').check();assert.equal(await validCourses.locator('#courseFilterStatus').textContent(),'1 course shown.');
 await validCourses.evaluate(()=>{location.hash='bookshare-lessons';});await validCourses.waitForFunction(()=>!document.querySelector('#startedCoursesOnly').checked);
 assert.equal(await validCourses.locator('#bookshare-lessons details').getAttribute('open'),'');
 console.log('Course catalog: loading/invalid-response browsing, late-ID guard, mixed-record recovery, next-lesson link, started filter and hash navigation passed.');

 for(const [file,menuId,param] of [['troubleshooting-lab.html','missionCenterMenu',''],['command-practice.html','commandTopicsMenu','spoken'],['topic-missions.html','topicMissionsMenu','voice']]){
  const menuPage=await pageWithProgress(async()=>[]);await menuPage.goto(base+'/'+file);
  await menuPage.evaluate(()=>{Storage.prototype.setItem=function(){throw new DOMException('Storage full','QuotaExceededError');};});
  await menuPage.locator('#missionVoiceToggle').click();
  await menuPage.locator('#'+menuId+' a').first().focus();await menuPage.evaluate(()=>{testSpeech.length=0;});
  await menuPage.keyboard.press('ArrowDown');assert.equal(await menuPage.evaluate(()=>testSpeech.length),1,file);
  assert.match(await menuPage.evaluate(()=>testSpeech.at(-1)),/Press Enter/);
  await menuPage.locator('#missionVoiceToggle').click();
  await menuPage.locator('#'+menuId+' a').first().focus();await menuPage.evaluate(()=>{testSpeech.length=0;});
  await menuPage.keyboard.press('ArrowDown');assert.equal(await menuPage.evaluate(()=>testSpeech.length),0,file+' off');
  if(param){
   await menuPage.locator('#missionVoiceToggle').click();await menuPage.locator('#'+menuId+' a').first().focus();await menuPage.keyboard.press('Enter');
   await menuPage.waitForURL(url=>url.searchParams.get(param)==='1');
  }
 }
 console.log('All three menus speak arrow-key choices with storage blocked, stop when voice is off, and carry the current voice choice into practice.');

 const progress=await pageWithProgress(async()=>[null,false,{},record,{...record,lesson_number:2,status:'in_progress'}]);
 const quizSource=JSON.stringify({Firefox:{score:150}});
 await progress.addInitScript(value=>localStorage.setItem('accessibleLearningQuizResults:fictional_test_one',value),quizSource);
 await progress.setViewportSize({width:390,height:844});await progress.goto(base+'/student-progress.html');
 await progress.waitForFunction(()=>document.querySelector('#progressMessage').textContent.includes('Progress loaded'));
 assert.equal(await progress.locator('.course-progress').count(),30);
 const firefox=progress.locator('.course-progress').filter({has:progress.locator('#firefox-progress-heading')});
 await firefox.locator('summary').click();
 assert.equal(await firefox.locator('li').nth(1).locator('span').textContent(),'In progress');
 assert.match(await firefox.locator('details > p').textContent(),/Saved quiz result unavailable/);
 assert.equal(await progress.locator('#continueLearning a').getAttribute('href'),'firefox-lesson-2.html');
 assert.equal(await progress.evaluate(()=>localStorage.getItem('accessibleLearningQuizResults:fictional_test_one')),quizSource);
 await progress.locator('#startedCoursesOnly').check();assert.equal(await progress.locator('#progressFilterStatus').textContent(),'1 course shown.');
 assert.equal(await progress.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 if(process.env.AXE_PATH){await progress.addScriptTag({path:process.env.AXE_PATH});assert.deepEqual(await progress.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id)),[]);}
 const historyRead=deferred(),historyStarted=deferred();
 const oldProgress=await pageWithProgress(async()=>{historyStarted.resolve();return historyRead.promise;});
 await oldProgress.goto(base+'/student-progress.html');await historyStarted.promise;
 await oldProgress.evaluate(()=>localStorage.setItem('accessibleLearningStudentId','fictional_test_two'));historyRead.resolve([record]);
 await oldProgress.waitForFunction(()=>document.querySelector('#progressMessage').textContent.includes('Student ID changed'));
 assert.equal(await oldProgress.locator('.course-progress').count(),0);assert.equal(await oldProgress.locator('#continueSection').isVisible(),false);
 assert.doesNotMatch(await oldProgress.locator('#studentName').textContent(),/fictional_test_one/);
 console.log('Learner progress: partial lesson status, mixed records, invalid quiz result, unchanged source history, next lesson, filters, narrow layout, Axe and late-ID guard passed.');
 assert.deepEqual(errors,[]);
}finally{await browser?.close();await new Promise(r=>server.close(r));}
