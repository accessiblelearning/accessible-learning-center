import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync,existsSync} from 'node:fs';
const require=createRequire(import.meta.url),{openBundle}=require('../braille-unlock.js');
const b64=x=>Buffer.from(x).toString('base64');
async function fixture(){
 const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),iterations=600000;
 const material=await crypto.subtle.importKey('raw',new TextEncoder().encode('fixture-code'),'PBKDF2',false,['deriveKey']);
 const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt']);
 const payload={version:1,markup:'<main>Private fixture</main>',scripts:['void 0;'],bootstrapCode:'fixture'};
 const ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(JSON.stringify(payload)));
 return {payload,bundle:{version:1,iterations,salt:b64(salt),iv:b64(iv),ciphertext:b64(ciphertext)}};
}
test('private preview decrypts only with the correct code and rejects tampering',async()=>{
 const {payload,bundle}=await fixture();assert.deepEqual(await openBundle(bundle,'fixture-code'),payload);
 await assert.rejects(openBundle(bundle,'wrong-code'));
 const bytes=Buffer.from(bundle.ciphertext,'base64');bytes[0]^=1;
 await assert.rejects(openBundle({...bundle,ciphertext:b64(bytes)},'fixture-code'));
});
test('published Braille preview excludes plaintext lessons, source scripts, and public discovery links',()=>{
 const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
 assert.match(read('braille-preview.html'),/noindex, nofollow, noarchive/);
 for(const file of ['index.html','manuals.html','lessons.html','resources.html','search-index.json','accessibility.js'])assert.doesNotMatch(read(file),/braille-preview\.html/);
 for(const file of ['braille-preview.js','braille-engine.js','braille-curriculum.js'])assert.equal(existsSync(new URL('../'+file,import.meta.url)),false);
 const bundle=JSON.parse(read('braille-preview.bundle.json'));assert.equal(bundle.version,1);assert.equal(bundle.iterations,600000);
 assert.ok(Buffer.from(bundle.ciphertext,'base64').length>10000);assert.doesNotMatch(read('braille-preview.bundle.json'),/Braille Cell|⠁|BRAILLE2026/);
});
