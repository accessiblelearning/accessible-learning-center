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
 assert.deepEqual(errors,[]);
}finally{await browser?.close();await new Promise(r=>server.close(r));}
