import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8');
async function catalog(records=[],hash='',blocked=false,faults={}){
 class Element{
  constructor(tag='div'){Object.assign(this,{tag,children:[],dataset:{},listeners:{},value:'',checked:false,textContent:''});}
  append(...nodes){for(const n of nodes){if(typeof n==='string')continue;n.parent?.remove(n);n.parent=this;this.children.push(n);}}
  remove(n){this.children=this.children.filter(c=>c!==n);}
  prepend(n){n.parent?.remove(n);n.parent=this;this.children.unshift(n);}
  insertBefore(n,ref){n.parent?.remove(n);n.parent=this;this.children.splice(this.children.indexOf(ref),0,n);}
  querySelector(s){return s===':scope > h2'?this.children.find(n=>n.tag==='h2'):this.querySelectorAll(s)[0];}
  querySelectorAll(s){const all=this.children.flatMap(n=>[n,...n.querySelectorAll('*')]);return all.filter(n=>s==='*'||(s==='.course-lesson-list a'?n.tag==='a'&&n.parent.className==='course-lesson-list':n.tag===s));}
  getAttribute(k){return this[k];}setAttribute(k,v){this[k]=v;}
  addEventListener(t,f){this.listeners[t]=f;}fire(t){this.listeners[t]?.({});}closest(){return this.parent;}scrollIntoView(){}
 }
 const nodes=new Map();const get=id=>nodes.get(id);const make=(id,tag)=>{const n=new Element(tag);n.id=id;nodes.set(id,n);return n;};
 for(const id of ['courseFilter','courseTopicFilter','startedCoursesOnly','courseFilterStatus','expandCourses','collapseCourses']){const n=make(id);new Element('p').append(n);}
 get('courseTopicFilter').value='all';
 const sections=[];
 for(const [slug,name] of [['thunderbird','Thunderbird Email'],['firefox','Firefox'],['zoomtext-fusion','ZoomText and Fusion'],['bookshare','Bookshare'],['learning-ally','Learning Ally']]){
  const markup=read('lessons.html').match(new RegExp('<section id="'+slug+'-lessons">([\\s\\S]*?)</section>'))[1];
  assert.match(markup,/<ol class="course-lesson-list">/);
  const s=make(slug+'-lessons','section'),h=new Element('h2'),ol=new Element('ol');h.textContent=name+' lessons';s.textContent=name+' lessons';ol.className='course-lesson-list';s.append(h,ol);
  for(let i=1;i<=10;i++){const a=new Element('a');a.href=`${slug}-lesson-${i}.html`;a.textContent='Lesson '+i;ol.append(a);}sections.push(s);
 }
 const window=new Element();const location={hash},state={id:'test_student'};
 vm.runInNewContext(read('course-catalog.js'),{document:{getElementById:get,querySelectorAll:()=>sections,createElement:t=>new Element(t)},window,location,
  localStorage:{getItem(){if(blocked)throw Error('Blocked');return state.id;}},fetch:async()=>{if(faults.pending)await faults.pending;if(faults.fail)throw Error('Offline');return {ok:true,json:async()=>records};}});
 await new Promise(r=>setImmediate(r));return {get,sections,window,location,state};
}
test('new course progress counts unique lessons and links to the next unfinished lesson',async()=>{
 const p=await catalog([1,1,2,99].map(n=>({course:'Firefox',lesson_number:n,status:'completed'})));
 const s=p.get('firefox-lessons');assert.match(s.querySelector('summary').textContent,/2 of 10/);assert.equal(s.querySelector('p').querySelector('a').href,'firefox-lesson-3.html');
});
test('invalid lesson numbers cannot count as completion or falsely mark a course started',async()=>{
 const bad=[true,false,[1],['1'],null,{},'',0,11,1.5].map(n=>({course:'Firefox',lesson_number:n,status:'completed'}));
 const p=await catalog(bad);assert.match(p.get('firefox-lessons').querySelector('summary').textContent,/0 of 10/);
 p.get('startedCoursesOnly').checked=true;p.get('startedCoursesOnly').fire('change');assert.equal(p.get('firefox-lessons').hidden,true);
 const q=await catalog([...bad,{course:'Firefox',lesson_number:'2',status:'completed'}]);
 assert.match(q.get('firefox-lessons').querySelector('summary').textContent,/1 of 10/);
 assert.equal(q.get('firefox-lessons').querySelector('p').querySelector('a').href,'firefox-lesson-1.html');
});
test('in-progress records remain visible in Started courses after undoing completion',async()=>{
 const p=await catalog([{course:'Bookshare',lesson_number:1,status:'in_progress'}]);p.get('startedCoursesOnly').checked=true;p.get('startedCoursesOnly').fire('change');
 assert.equal(p.get('bookshare-lessons').hidden,false);assert.equal(p.get('firefox-lessons').hidden,true);assert.match(p.get('bookshare-lessons').querySelector('summary').textContent,/0 of 10/);
});
test('course shortcuts open on initial load and hash changes, even after filtering',async()=>{
 const p=await catalog([],'#firefox-lessons');assert.equal(p.get('firefox-lessons').querySelector('details').open,true);
 p.get('courseFilter').value='unmatched';p.get('courseFilter').fire('input');p.location.hash='#bookshare-lessons';p.window.fire('hashchange');
 assert.equal(p.get('courseFilter').value,'');assert.equal(p.get('bookshare-lessons').hidden,false);assert.equal(p.get('bookshare-lessons').querySelector('details').open,true);
 p.location.hash='#%ZZ';assert.doesNotThrow(()=>p.window.fire('hashchange'));
});
test('blocked storage and malformed link fragments do not disable course browsing',async()=>{
 const p=await catalog([],'#[',true);assert.equal(p.get('startedCoursesOnly').disabled,true);p.get('courseFilter').value='firefox';p.get('courseFilter').fire('input');assert.equal(p.get('firefox-lessons').hidden,false);
});
test('course browsing stays available while progress loads and after a failed response',async()=>{
 let done;const pending=new Promise(r=>{done=r;});const p=await catalog([],'',false,{pending,fail:true});
 assert.equal(p.get('startedCoursesOnly').disabled,true);assert.ok(p.sections.every(s=>!s.hidden));
 p.get('courseFilter').value='firefox';p.get('courseFilter').fire('input');assert.equal(p.get('firefox-lessons').hidden,false);
 // Includes a restored browser checkbox state, even though it is not interactive yet.
 p.get('startedCoursesOnly').checked=true;p.get('startedCoursesOnly').fire('change');
 done();await new Promise(r=>setImmediate(r));
 assert.equal(p.get('startedCoursesOnly').checked,false);assert.equal(p.get('startedCoursesOnly').disabled,true);
 assert.equal(p.get('firefox-lessons').hidden,false);assert.equal(p.get('courseFilterStatus').textContent,'1 course shown.');
});
test('invalid progress responses disable only the saved-progress filter, not course browsing',async()=>{
 for(const records of [null,{},'invalid']){
  const p=await catalog(records);assert.equal(p.get('startedCoursesOnly').disabled,true);
  assert.ok(p.sections.every(s=>!s.hidden));
 }
 const q=await catalog([null,{},false,{course:'Firefox',lesson_number:1,status:'completed'}]);
 assert.equal(q.get('startedCoursesOnly').disabled,false);assert.match(q.get('firefox-lessons').querySelector('summary').textContent,/1 of 10/);
});
test('a late catalog response cannot label a changed Student ID\'s courses as complete',async()=>{
 let done;const pending=new Promise(r=>{done=r;});const p=await catalog([{course:'Firefox',lesson_number:1,status:'completed'}],'',false,{pending});
 p.state.id='different_student';done();await new Promise(r=>setImmediate(r));
 assert.equal(p.get('startedCoursesOnly').disabled,true);
 assert.equal(p.get('firefox-lessons').dataset.started,'false');assert.doesNotMatch(p.get('firefox-lessons').querySelector('summary').textContent,/lessons complete/);
 assert.ok(p.sections.every(s=>!s.hidden));
});
