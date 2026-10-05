import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const context={};vm.runInNewContext(readFileSync(new URL('../account-progress-metrics.js',import.meta.url),'utf8'),context);
const summarize=context.ALCTypingProgressSummary;
test('typing trends order dated sessions and keep hand paths independent',()=>{
 const records=[{date:'2026-10-04',path:'both',wpm:21,accuracy:98},{date:'2026-09-27',path:'both',wpm:16,accuracy:93},{date:'2026-10-02',path:'both',wpm:22,accuracy:96},{date:'2026-10-04',path:'left',wpm:8,accuracy:90}];
 const original=JSON.stringify(records),result=summarize(records,'both');
 assert.equal(result.latest.wpm,21);assert.equal(result.bestWpm,22);assert.equal(result.bestAccuracy,98);assert.equal(result.speedChange,5);assert.equal(result.accuracyChange,5);assert.equal(result.rows.length,3);assert.equal(JSON.stringify(records),original);
 const left=summarize(records,'left');assert.equal(left.latest.wpm,8);assert.equal(left.speedChange,null);assert.equal(summarize(records,'right').latest,null);
});
test('missing and invalid scores stay unavailable instead of becoming zero',()=>{
 const result=summarize([{date:'2026-10-01',path:'both',wpm:null,accuracy:90},{date:'2026-10-04',path:'both',wpm:15,accuracy:101}], 'both');
 assert.equal(result.bestWpm,15);assert.equal(result.bestAccuracy,90);assert.equal(result.latest.accuracy,null);assert.equal(result.speedChange,null);assert.equal(result.accuracyChange,null);
});
test('speed loss and accuracy improvement are reported independently',()=>{
 const result=summarize([{date:'2026-10-01',path:'right',wpm:15.2,accuracy:93.5},{date:'2026-10-04',path:'right',wpm:14,accuracy:96.2}],'right');
 assert.equal(result.speedChange,-1.2);assert.equal(result.accuracyChange,2.7);
});
