import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
async function lesson({blocked=false,fail=false}={}){
 class Node{
  constructor(tag){this.tag=tag;this.children=[];this.listeners={};}
  append(...children){this.children.push(...children);}
  setAttribute(k,v){this[k]=v;}
  addEventListener(t,f){this.listeners[t]=f;}
 }
 const main=new Node('main'),state={id:'learner_one'},posts=[];
 const document={currentScript:{dataset:{lessonNumber:'1',course:'Firefox',allowedExtensions:'txt,docx,pdf,brf'}},
  getElementById(){return null;},createElement:tag=>new Node(tag),querySelector:()=>main};
 vm.runInNewContext(readFileSync(new URL('../assignment-submission.js',import.meta.url),'utf8'),{
  document,localStorage:{getItem(){if(blocked)throw Error('blocked');return state.id;}},
  fetch:async(url,options)=>{if(options){posts.push(JSON.parse(options.body));if(fail)throw Error('offline');}return {ok:true,json:async()=>options?{success:true}:[]};}
 });
 await new Promise(r=>setImmediate(r));const section=main.children[0];
 return {state,posts,button:section.children.find(n=>n.tag==='button'),status:section.children.find(n=>n.id==='lessonCompletionStatus')};
}
test('lesson completion and undo save the intended course and learner',async()=>{
 const p=await lesson();await p.button.listeners.click();assert.equal(p.posts[0].course,'Firefox');assert.equal(p.posts[0].student_id,'learner_one');assert.equal(p.posts[0].status,'completed');assert.equal(p.button.textContent,'Undo lesson completion');
 await p.button.listeners.click();assert.equal(p.posts[1].status,'in_progress');assert.equal(p.button.textContent,'Mark this lesson complete');
});
test('blocked storage and a changed identity do not send completion records',async()=>{
 const p=await lesson({blocked:true});assert.equal(p.button,undefined);assert.match(p.status.textContent,/blocking storage/);
 const q=await lesson();q.state.id='learner_two';await q.button.listeners.click();assert.equal(q.posts.length,0);assert.match(q.status.textContent,/Student ID changed/);
});
test('an offline completion request is not reported as saved and can be retried',async()=>{
 const p=await lesson({fail:true});await p.button.listeners.click();assert.match(p.status.textContent,/connection problem/);assert.equal(p.button.disabled,false);assert.equal(p.button.textContent,'Mark this lesson complete');
});
