// Fictional local records only; no account or real learner data.
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
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
 const key='alcKeyboardingProgressV1',saved=JSON.stringify({completed:[null,{},'en:both:1','en:both:51'],sessions:[
  null,[],true,'damaged',
  {path:'en:both:',mode:'guided',lesson:1,wpm:12,accuracy:92,seconds:65,completedAt:1700000000000},
  {path:'en:both:',mode:'free',lesson:1,wpm:40,accuracy:null,seconds:60,completedAt:1700000001000},
  {path:'en:left:one-hand-v1:',mode:'words',lesson:2,wpm:8,accuracy:96,seconds:80,completedAt:1700000002000},
  {path:'en:both:',mode:'words',lesson:true,wpm:true,accuracy:false,seconds:-100}
 ]});
 await page.addInitScript(({key,saved})=>{localStorage.setItem(key,saved);speechSynthesis.speak=()=>{};speechSynthesis.cancel=()=>{};},{key,saved});
 await page.goto(base+'/keyboarding-preview.html');
 // Read the existing public preview gate's accepted code from its fixture;
 // this test does not change access or store any private Braille credential.
 const fixture=await readFile(join(root,'tests/keyboarding-one-hand.test.mjs'),'utf8');
 const code=fixture.match(/get\('previewCode'\)\.value = '([^']+)'; p\.get\('unlockForm'\)\.fire\('submit'\);\n    assert.equal\(p.get\('unlockPanel'\).hidden, true/)[1];
 await page.locator('#previewCode').fill(code);await page.locator('#unlockForm button').click();
 await page.locator('[data-main-action="stats"]').click();
 assert.equal(await page.locator('#statsSpeed').textContent(),'12 WPM');
 assert.equal(await page.locator('#statsFreeSpeed').textContent(),'40 gross WPM');
 assert.equal(await page.locator('#statsLessons').textContent(),'1 of 50');
 assert.equal(await page.locator('#statsTime').textContent(),'2 minutes');
 const summary=page.locator('summary').filter({hasText:'Recent practice results'});await summary.focus();await page.keyboard.press('Enter');
 assert.equal(await page.locator('#sessionHistory li').count(),3);
 assert.match(await page.locator('#sessionHistory li').first().textContent(),/gross WPM.*Accuracy not assessed/);
 assert.match(await page.locator('#sessionHistory li').last().textContent(),/Lesson unavailable.*Speed unavailable.*Accuracy unavailable.*Duration unavailable/);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 if(process.env.AXE_PATH){await page.addScriptTag({path:process.env.AXE_PATH});assert.deepEqual(await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>v.id)),[]);}
 await page.screenshot({path:join(dir,'keyboard-history-narrow.png'),fullPage:true});
 assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),saved);
 await page.keyboard.press('Escape');assert.equal(await page.locator('#setupPanel').isVisible(),true);
 await page.clock.install();
 for(const mode of ['speed-60','speed-180','speed-360','free-speed-60','free-speed-180','free-speed-360']){
  const free=mode.startsWith('free-'),seconds=Number(mode.split('-').at(-1));
  await page.locator('[data-main-action="practice"]').click();
  await page.locator('[data-practice-menu="'+(free?'freeTestMenuPanel':'copyTestMenuPanel')+'"]').click();
  await page.locator('[data-practice-mode="'+mode+'"]').click();
  await page.keyboard.press('f');
  if(free)await page.locator('#freeTypeInput').fill('hello');
  // fastForward fires each due interval at most once, as after a long stall.
  await page.clock.fastForward(10000);
  assert.match(await page.locator('#progressText').textContent(),new RegExp('^'+(seconds-10)+' seconds'));
  await page.clock.fastForward((seconds+5)*1000);
  assert.equal(await page.locator('#resultsPanel').isVisible(),true,mode);
  if(free)assert.equal(await page.locator('#accuracyResult').textContent(),'5');
  await page.keyboard.press('Escape');
 }
 console.log('All six timed modes finish after delayed interval callbacks at their elapsed-time deadlines.');
 assert.deepEqual(errors,[]);console.log('Fictional keyboard history: speed separation, paired results, native disclosure, narrow layout, Axe, unchanged storage and Escape passed. Not a real screen-reader or Safari test.');
}finally{await browser?.close();await new Promise(r=>server.close(r));}
