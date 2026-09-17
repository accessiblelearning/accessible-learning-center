import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const read = file => readFileSync(new URL('../'+file, import.meta.url),'utf8');
// Exercise production scoring/readiness/certificate code without writing real student records.
async function fixture(slug, completed=10) {
  const markup=read(slug+'-quiz.html');
  const data=JSON.parse(markup.match(/<script id="quizData" type="application\/json">([\s\S]*?)<\/script>/)[1]);
  class Node {
    constructor(tag='div') { Object.assign(this,{tag,children:[],listeners:{},dataset:{},hidden:false,value:'',checked:false}); this.classList={add(){},remove(){}}; }
    append(...nodes) { for(const n of nodes){ n.parent?.remove(n); n.parent=this;this.children.push(n); } }
    appendChild(n){this.append(n);}
    remove(n){this.children=this.children.filter(x=>x!==n);}
    insertBefore(n,ref){n.parent?.remove(n);n.parent=this;this.children.splice(this.children.indexOf(ref),0,n);}
    before(n){this.parent.insertBefore(n,this);}
    after(n){n.parent?.remove(n);n.parent=this.parent;this.parent.children.splice(this.parent.children.indexOf(this)+1,0,n);}
    replaceChildren(...nodes){this.children=[];this.append(...nodes);}
    setAttribute(){}
    addEventListener(t,fn){(this.listeners[t]??=[]).push(fn);}
    fire(t){for(const fn of this.listeners[t]||[])fn({preventDefault(){}});}
    focus(){}
    closest(tag){return this.tag===tag?this:this.parent?.closest(tag);}
    reset(){for(const n of this.querySelectorAll('input'))n.checked=false;}
    querySelectorAll(s){
      if(s==='.quiz-question input')return this.querySelectorAll('.quiz-question').flatMap(n=>n.querySelectorAll('input'));
      const all=this.children.flatMap(n=>[n,...n.querySelectorAll('*')]);
      return all.filter(n=>s==='*'||(s==='.quiz-question'?n.className==='quiz-question':
        s.startsWith('input')?n.tag==='input'&&(!s.includes(':checked')||n.checked)&&(!s.includes('name=')||n.name===s.match(/name="([^"]+)"/)[1]):
        s.startsWith('button')?n.tag==='button'&&(!s.includes('submit')||n.type==='submit'):n.tag===s));
    }
    querySelector(s){return this.querySelectorAll(s)[0]||null;}
  }
  const ids=new Map();const get=id=>{if(!ids.has(id))ids.set(id,new Node());return ids.get(id);};
  const main=new Node();const form=get('courseQuiz');main.append(form);
  const grade=new Node('button');grade.type='submit';form.append(grade);
  for(let i=0;i<data.questions.length;i++){
    const f=new Node('fieldset');f.className='quiz-question';const l=new Node('legend');l.textContent=(i+1)+'. '+data.questions[i].question;f.append(l);
    for(let j=0;j<3;j++){const label=new Node('label'),input=new Node('input');input.type='radio';input.name='question-'+i;input.value=String(j);label.append(input);f.append(label);}
    form.insertBefore(f,grade);
  }
  get('quizData').textContent=JSON.stringify(data);get('certificateSetup').hidden=true;get('certificateSection').hidden=true;
  const storage=new Map([['accessibleLearningStudentId','course_test']]);
  const doc={getElementById:get,createElement:tag=>new Node(tag),createTextNode:text=>Object.assign(new Node(),{textContent:text}),body:new Node()};
  const window={print(){window.printed=true;},addEventListener(){}};
  const context={document:doc,window,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
    fetch:async()=>({ok:true,json:async()=>Array.from({length:completed},(_,i)=>({course:data.course,lesson_number:i+1,status:'completed'}))}),console};
  vm.runInNewContext(read('quiz.js'),context);await new Promise(r=>setImmediate(r));
  const answer=count=>data.questions.forEach((q,i)=>{for(const n of form.querySelectorAll(`input[name="question-${i}"]`))n.checked=Number(n.value)===(i<count?q.answer:(q.answer+1)%3);});
  return {get,form,grade,data,storage,window,answer};
}
for(const slug of ['thunderbird','firefox','zoomtext-fusion','bookshare','learning-ally']){
  test(slug+': ten lessons required; incomplete or failing answers do not issue a certificate',async()=>{
    const locked=await fixture(slug,9);assert.equal(locked.grade.disabled,true);locked.get('certificateName').value='Test Learner';locked.get('certificateForm').fire('submit');assert.equal(locked.get('certificateSection').hidden,true);
    const p=await fixture(slug);assert.equal(p.grade.disabled,false);p.form.fire('submit');assert.match(p.get('quizStatus').textContent,/Answer every question/);
    p.answer(7);p.form.fire('submit');assert.equal(p.get('certificateSetup').hidden,true);p.get('certificateName').value='Test Learner';p.get('certificateForm').fire('submit');assert.equal(p.get('certificateSection').hidden,true);
  });
  test(slug+': 8 of 10 saves the correct course and produces the named printable certificate',async()=>{
    const p=await fixture(slug);p.answer(8);p.form.fire('submit');assert.equal(p.get('certificateSetup').hidden,false);
    assert.equal(JSON.parse(p.storage.get('accessibleLearningQuizResults:course_test'))[p.data.course].score,80);
    p.get('certificateName').value='  Test   Learner  ';p.get('certificateForm').fire('submit');assert.equal(p.get('certificateSection').hidden,false);
    assert.equal(p.get('certificateStudentName').textContent,'Test Learner');assert.equal(p.get('certificateCourse').textContent,p.data.displayName);assert.equal(p.get('certificateScore').textContent,'80 percent');
    p.get('printCertificate').fire('click');assert.equal(p.window.printed,true);assert.ok(![...p.storage.values()].some(v=>v.includes('Test Learner')));
  });
}
