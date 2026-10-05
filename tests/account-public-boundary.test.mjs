import assert from 'node:assert/strict';
import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {test} from 'node:test';
const root=new URL('../',import.meta.url);
const privatePaths=['account-preview.html','admin-preview.html','account-preview.css','account-preview.js','account-progress-metrics.js','accounts','private-account-development'];
test('unfinished account source and previews are absent from the public site tree',()=>{
 for(const path of privatePaths)assert.equal(existsSync(new URL(path,root)),false,path+' must remain private');
 assert.ok(!readdirSync(root).some(name=>/Private-Accounts.*\.zip$/i.test(name)),'Private archive must not enter the public checkout');
 const worker=readFileSync(new URL('worker.js',root),'utf8');assert.doesNotMatch(worker,/handleAccounts|ACCOUNT_IDENTITY|ACCOUNT_DB/);
});
test('public navigation and scripts cannot reopen the withdrawn preview',()=>{
 for(const file of readdirSync(root).filter(name=>/\.(html|js)$/.test(name))) {
   const source=readFileSync(new URL(file,root),'utf8');
   assert.doesNotMatch(source,/(?:href|src)=["'][^"']*(?:account-preview|admin-preview|account-progress-metrics)/,file);
 }
});
