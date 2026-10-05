// Local Chromium checks for the webpage's Mac practice UI, not real VoiceOver.
import {createServer} from 'node:http';
import {readFile,writeFile,chmod} from 'node:fs/promises';
import {brotliDecompressSync} from 'node:zlib';
import {join,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const tooling=process.env.BROWSER_QA_ROOT;
if(!tooling)throw Error('Set BROWSER_QA_ROOT to existing playwright-core and @sparticuz/chromium tooling.');
const require=createRequire(join(tooling,'fixture.cjs'));
const {chromium:playwright}=require('playwright-core'),module=require('@sparticuz/chromium'),chromium=module.default||module;
const root=fileURLToPath(new URL('../',import.meta.url));
await writeFile(join(tooling,'chromium'),brotliDecompressSync(await readFile(join(tooling,'node_modules/@sparticuz/chromium/bin/chromium.br'))));
await chmod(join(tooling,'chromium'),0o755);
const mime={'.js':'text/javascript','.css':'text/css','.html':'text/html'};
const server=createServer(async(req,res)=>{
 try{const path=decodeURIComponent(req.url.split('?')[0]),body=await readFile(join(root,path));res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream'});res.end(body);}
 catch{res.writeHead(404);res.end();}
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
 const keyNames={Option:'Alt',Command:'Meta',Semicolon:';',Space:'Space','Right Arrow':'ArrowRight','Left Arrow':'ArrowLeft','Up Arrow':'ArrowUp','Down Arrow':'ArrowDown','Page Up':'PageUp','Page Down':'PageDown'};
 async function build(step){
  const panel=page.locator('#courseBuilderPanel');
  if(!(await panel.evaluate(e=>e.open))){await panel.locator('summary').focus();await page.keyboard.press('Enter');}
  const parts=step.split('+');
  for(const modifier of ['Control','Shift','Caps Lock','VO','Command','Option','Fn'])await page.locator('#courseMod'+modifier.replaceAll(' ','')).setChecked(parts.slice(0,-1).includes(modifier));
  await page.locator('#courseFinalKey').selectOption(parts.at(-1));
  await page.locator('#courseCommandBuilder button[type="submit"]').click();
 }
 async function scan(name){
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,name);
  if(process.env.AXE_PATH){
   await page.addScriptTag({path:process.env.AXE_PATH});
   const violations=await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})));
   assert.deepEqual(violations,[],name);
  }
  await page.screenshot({path:join(tooling,name+'.png'),fullPage:true});
 }
 for(const [name,voice,expectedCount] of [['Mac VoiceOver basics',1,60],['Mac VoiceOver reading and settings',0,24],['Mac VoiceOver navigation and web',1,36]]){
  await page.goto(base+'/command-practice-session.html?category='+encodeURIComponent(name)+'&style=guided&length=all&spoken='+voice+'&sounds=0');
  await page.keyboard.press('Space');
  const items=await page.evaluate(name=>CommandPracticeCourses[name],name);assert.equal(items.length,expectedCount);
  let mistakes=0,fnCommands=0;
  for(const [i,entry] of items.entries()){
   assert.equal(await page.locator('#commandDetailedExplanation').textContent(),entry[2]);
   assert.equal(await page.locator('#commandExplanationDetails').evaluate(e=>e.open),false);
   if(name==='Mac VoiceOver basics'&&entry[0]==='Shift+VO+Fn+F11'){
    await page.locator('#commandExplanationDetails summary').focus();await page.keyboard.press('Enter');
    await page.setViewportSize({width:390,height:844});await scan('voiceover-curtain-explanation-narrow');
    await page.locator('#commandExplanationDetails summary').focus();await page.keyboard.press('Enter');
    await page.setViewportSize({width:1100,height:850});await page.locator('#keyCapture').focus();
   }
   if(entry[4].fnOptional){
    fnCommands++;
    if(entry[0]==='VO+Fn+F8'){
     await page.keyboard.press('Control');await page.keyboard.press('Alt');
     assert.match(await page.locator('#commandPrompt').textContent(),/Fn.*Build the command/s);
     await page.keyboard.press('Control');
     assert.match(voice?await page.evaluate(()=>testSpeech.at(-1)):await page.locator('#practiceStatus').textContent(),/Fn.*Build the command/s);
     if(name==='Mac VoiceOver basics'){
      await page.setViewportSize({width:390,height:844});await scan('voiceover-fn-fallback-narrow');await page.setViewportSize({width:1100,height:850});
     }
     await page.keyboard.press('Tab');assert.notEqual(await page.evaluate(()=>document.activeElement.id),'keyCapture');
     await build('VO+Shift+F8');mistakes++;
     assert.equal(await page.locator('#practiceScore').textContent(),`Correct: ${i} · Attempts: ${i+mistakes}`);
    }
    let command=fnCommands%2?entry[0].replace('Fn+',''):entry[0];
    if(fnCommands%2)command=command.replace('VO+','Caps Lock+');
    await build(command);
   }else{
    await page.locator('#keyCapture').focus();
    for(const step of entry[4].steps)for(const key of step.split('+').flatMap(k=>k==='VO'?['Control','Option']:[k]))await page.keyboard.press(keyNames[key]||key);
   }
   assert.equal(await page.locator('#practiceScore').textContent(),`Correct: ${i+1} · Attempts: ${i+1+mistakes}`,name+': '+entry[0]);
   if(voice)await page.evaluate(()=>testUtterances.at(-1).dispatchEvent(new Event('end')));
   else await page.clock.fastForward(2500);
  }
  assert.equal(await page.locator('#commandResults').isVisible(),true);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'practiceMissed');
  if(voice){
   for(const stage of ['Starting with basic','Moving to intermediate','Moving to advanced'])assert.ok(await page.evaluate(stage=>testSpeech.some(t=>t.includes(stage)),stage));
   assert.match(await page.evaluate(()=>testSpeech.at(-1)),new RegExp('practiced '+items.length+' commands correctly'));
  }else assert.equal(await page.evaluate(()=>testSpeech.length),0);
  await page.keyboard.press('Escape');await page.waitForURL('**/command-practice.html');
  console.log(name+': '+items.length+' tasks, '+fnCommands+' Fn-capable tasks, separated keys, builder alternatives, recovery, repeat, focus and completion passed; site voice='+voice);
 }
 assert.deepEqual(errors,[]);console.log('No browser JavaScript errors. These are Chromium webpage checks, not Safari or real VoiceOver tests.');
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
