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

 await page.addInitScript(()=>{window.testSpeech=[];speechSynthesis.speak=u=>window.testSpeech.push(u.text);speechSynthesis.cancel=()=>{};});

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

 for (const [id,keys] of [[13,['Control','t','Control','d']],[14,['F2','Enter','Control+s']],[15,['Control+m','Control+z','Control+s']],[16,['m','ArrowRight','Space']],[17,['ArrowRight','ArrowLeft']]]) {
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
 assert.deepEqual(errors,[]); console.log('No browser JavaScript errors.');
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
