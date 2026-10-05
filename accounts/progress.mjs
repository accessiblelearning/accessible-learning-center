// No browser storage is read or erased. The caller must obtain explicit import consent.
import { missionIds, commandIds, assessedCourses } from './registry.mjs';
export const paths = ['both', 'left', 'right'];
const allowed = new Set(['area','curriculumId','activityId','path','accuracy','wpm','completed']);
export function validateProgress(input) {
  if (!input || Array.isArray(input) || typeof input !== 'object' || Object.keys(input).some(k => !allowed.has(k))) throw new Error('Invalid progress fields.');
  const {area,curriculumId,activityId,path} = input;
  const lesson = /^lesson-([1-9]\d*)$/.exec(activityId || '');
  let valid = false;
  if (area === 'typing') valid = curriculumId === 'typing-v1' && paths.includes(path) && lesson && Number(lesson[1]) <= 50;
  if (area === 'topic-mission') valid = curriculumId === 'missions-v1' && path === 'none' && missionIds.includes(activityId);
  if (area === 'command-practice') valid = path === 'none' && commandIds[curriculumId]?.includes(activityId);
  if (area === 'assessed-course') valid = path === 'none' && assessedCourses.includes(curriculumId) && (activityId === 'quiz' || lesson && Number(lesson[1]) <= 10);
  // Braille is reserved in the schema, but deliberately has no public ingestion adapter.
  if (!valid || typeof input.completed !== 'boolean') throw new Error('Unknown curriculum, path or activity.');
  const out = {area,curriculumId,activityId,path,completed:input.completed};
  for (const [key,max] of [['accuracy',100],['wpm',500]]) {
    if (input[key] != null) {
      if (typeof input[key] !== 'number' || !Number.isFinite(input[key]) || input[key] < 0 || input[key] > max || key === 'wpm' && area !== 'typing') throw new Error('Invalid metric.');
      out[key] = input[key];
    }
  }
  return out;
}
export async function progressKey(record) {
  const bytes = new TextEncoder().encode(JSON.stringify(validateProgress(record)));
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)), b=>b.toString(16).padStart(2,'0')).join('');
}
export function prepareLocalImport(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') throw new Error('Expected a local snapshot.');
  const records=[], skipped=[];
  const keyboard = snapshot.alcKeyboardingProgressV1 || {};
  // Do not infer ownership or path from a legacy Student ID or an unscoped score.
  for (const value of keyboard.completed || []) {
    const match = /^en:(both|left:one-hand-v1|right:one-hand-v1):(\d+)$/.exec(value);
    if (!match) { skipped.push('Unrecognized keyboard completion'); continue; }
    const path = match[1].split(':')[0];
    try { records.push(validateProgress({area:'typing',curriculumId:'typing-v1',activityId:'lesson-'+Number(match[2]),path,completed:true})); }
    catch { skipped.push('Out-of-range keyboard completion'); }
  }
  for (const index of snapshot.missionControlCompleted || []) {
    if (!Number.isInteger(index) || !missionIds[index]) { skipped.push('Unknown mission'); continue; }
    records.push({area:'topic-mission',curriculumId:'missions-v1',activityId:missionIds[index],path:'none',completed:true});
  }
  // Detailed sessions and quizzes remain in their source snapshot pending a reviewed adapter.
  if (keyboard.sessions?.length) skipped.push('Detailed typing sessions retained locally; not imported by this adapter');
  if (Object.keys(snapshot).some(k=>k.startsWith('accessibleLearningQuizResults'))) skipped.push('Legacy quiz records require separate review; not claimed as account-owned');
  return {records:[...new Map(records.map(r=>[JSON.stringify(r),r])).values()],skipped,sourcePreserved:true,verification:'imported'};
}
