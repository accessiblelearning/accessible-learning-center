import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../student-progress.html',import.meta.url),'utf8');
const source=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const tick=()=>new Promise(r=>setImmediate(r));
async function progress({records=[],quizzes={},pending,blocked=false}={}){
 class Element{
  constructor(tag='div'){Object.assign(this,{tag,children:[],dataset:{},listeners:{},value:'',checked:false,hidden:false,textContent:''});}
  append(...nodes){this.children.push(...nodes);}appendChild(n){this.append(n);}replaceChildren(...nodes){this.children=nodes;}
  setAttribute(k,v){this[k]=v;}addEventListener(t,f){this.listeners[t]=f;}fire(t){this.listeners[t]?.({});}
  querySelector(s){return this.querySelectorAll(s)[0];}
  querySelectorAll(s){const all=this.children.flatMap(n=>[n,...n.querySelectorAll('*')]);return all.filter(n=>s==='*'||(s==='.course-progress'?n.className==='course-progress':n.tag===s));}
 }
 const nodes=new Map([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>[m[1],new Element()]));
 const get=id=>nodes.get(id);get('progressTopicFilter').value='all';get('continueSection').hidden=true;
 const storage=new Map([['accessibleLearningStudentId','fictional_one'],['accessibleLearningQuizResults:fictional_one',JSON.stringify(quizzes)]]);
 const requests=[];
 vm.runInNewContext(source,{document:{getElementById:get,createElement:t=>new Element(t),createTextNode:t=>Object.assign(new Element(),{textContent:t})},
  window:{location:{}},localStorage:{getItem(k){if(blocked)throw Error('Blocked');return storage.get(k)||null;}},
  fetch:async url=>{requests.push(url);if(pending)await pending;return {ok:true,json:async()=>records};}
 });
 await tick();
 return {get,storage,requests,course(name){return get('courseProgressSections').children.find(s=>s.querySelector('h2').textContent===name);}};
}
test('the progress page labels in-progress lessons accurately and continues the same course',async()=>{
 const p=await progress({records:[{course:'Firefox',lesson_number:1,status:'completed'},{course:'Firefox',lesson_number:2,status:'in_progress'}]});
 const section=p.course('Firefox');assert.match(section.querySelector('p').textContent,/1 of 10/);
 assert.equal(section.querySelectorAll('li')[1].querySelector('span').textContent,'In progress');
 assert.equal(p.get('continueLearning').children[0].href,'firefox-lesson-2.html');
 p.get('startedCoursesOnly').checked=true;p.get('startedCoursesOnly').fire('change');
 assert.equal(section.hidden,false);assert.equal(p.get('progressFilterStatus').textContent,'1 course shown.');
});
test('malformed progress rows do not hide valid courses or create partial results',async()=>{
 const p=await progress({records:[null,false,{},[],{course:'Firefox',lesson_number:1,status:'completed'}]});
 assert.match(p.get('progressMessage').textContent,/Progress loaded/);
 assert.equal(p.get('courseProgressSections').children.length,30);assert.match(p.course('Firefox').querySelector('p').textContent,/1 of 10/);
});
test('a delayed progress response cannot display records after the Student ID changes',async()=>{
 let done;const pending=new Promise(r=>{done=r;});const p=await progress({records:[{course:'Firefox',lesson_number:1,status:'completed'}],pending});
 p.storage.set('accessibleLearningStudentId','fictional_two');done();await tick();
 assert.match(p.get('progressMessage').textContent,/Student ID changed/);
 assert.equal(p.get('courseProgressSections').children.length,0);assert.equal(p.get('continueSection').hidden,true);
 assert.doesNotMatch(p.get('studentName').textContent,/fictional_one/);
});
test('progress ignores invalid quiz scores and preserves legacy and current passing thresholds',async()=>{
 for(const [result,expected] of [
  [{score:150},'Saved quiz result unavailable'],[{score:true},'Saved quiz result unavailable'],[{score:95,passPercent:0},'Saved quiz result unavailable'],
  [{score:80},'Final quiz passed: 80 percent'],[{score:84,passPercent:85},'Final quiz not passed yet'],[{score:85,passPercent:85},'Final quiz passed: 85 percent']
 ]){
  const p=await progress({quizzes:{Firefox:result}}),before=p.storage.get('accessibleLearningQuizResults:fictional_one');
  const details=p.course('Firefox').querySelector('details'),quizText=details.querySelector('p').children[0].textContent;
  assert.ok(quizText.startsWith(expected),JSON.stringify(result)+' => '+quizText);
  assert.equal(p.storage.get('accessibleLearningQuizResults:fictional_one'),before);
 }
});
test('blocked storage never requests a progress record',async()=>{
 const p=await progress({blocked:true});assert.equal(p.requests.length,0);assert.match(p.get('progressMessage').textContent,/blocking storage/);
});
