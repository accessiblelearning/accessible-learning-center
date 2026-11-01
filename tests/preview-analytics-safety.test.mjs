// Static safety regression for the public site's analytics script.
// Run: node --test tests/preview-analytics-safety.test.mjs
// This test never makes network requests or loads student data.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(resolve(root, "accessibility.js"), "utf8");

test("analytics is guarded by an explicit production-host allowlist", () => {
  assert.match(source, /const analyticsHosts\s*=\s*new Set\s*\(\s*\[/);
  assert.match(source, /!analyticsHosts\.has\(location\.hostname\)/);
  assert.match(source, /recordAnonymousPageView\(\)/);
});
test("privacy exclusions remain in the analytics guard", () => {
  assert.match(source, /currentPage\s*===\s*"site-traffic\.html"/);
  assert.match(source, /navigator\.doNotTrack\s*===\s*"1"/);
});
test("Replit and localhost are not explicitly allowlisted for analytics", () => {
  const match = source.match(/const analyticsHosts\s*=\s*new Set\s*\(\s*\[([\s\S]*?)\]\s*\)/);
  assert.ok(match, "Cannot locate production analytics host list");
  assert.doesNotMatch(match[1], /replit|localhost|127\.0\.0\.1/i);
});
