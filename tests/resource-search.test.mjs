import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

test('search moves focus only on explicit submission, not filtering or late index loading', async () => {
 let active, resolveIndex;
 class Element {
  constructor(){this.value='';this.children=[];this.listeners={};this.textContent='';}
  addEventListener(t,f){this.listeners[t]=f;}
  fire(t){this.listeners[t]?.({preventDefault(){}});}
  append(...nodes){this.children.push(...nodes);}
  appendChild(n){this.append(n);}
  replaceChildren(...nodes){this.children=nodes;}
  querySelector(){return this.children.length ? resultLink : null;}
  focus(){active=this;}
 }
 const nodes=new Map(),get=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id);};
 const resultLink=new Element();
 const response=new Promise(resolve=>{resolveIndex=resolve;});
 vm.runInNewContext(readFileSync(new URL('../resource-search.js',import.meta.url),'utf8'),{
  document:{getElementById:get,createElement:()=>new Element(),createDocumentFragment:()=>new Element()},
  window:{location:{href:'https://example.org/resources.html?q=jaws',search:'?q=jaws'}},
  URL,URLSearchParams,history:{replaceState(){}},fetch:()=>response
 });
 const query=get('resourceQuery'),type=get('resourceType');query.focus();
 resolveIndex({ok:true,json:async()=>({entries:[{title:'JAWS guide',course:'JAWS',text:'jaws guide',type:'manual',url:'jaws-manual.html',snippet:'Learn JAWS'}]})});
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(active,query,'late loading preserves the current input');
 get('resourceSearchForm').fire('submit');assert.equal(active,resultLink);
 type.focus();type.value='manual';type.fire('change');assert.equal(active,type);
 type.value='quiz';type.fire('change');assert.equal(active,type);assert.match(get('resourceSearchStatus').textContent,/No results/);
 get('clearResourceSearch').fire('click');assert.equal(active,query);
});
