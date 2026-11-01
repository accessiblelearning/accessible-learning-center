# Accessible Learning Center — preliminary launch safety audit
Date: 2026-11-01
Scope: read-only review of public repository and private repository documentation. No production requests, migrations, deployments, or live account tests performed.

## Production isolation — BLOCKER
- Public site's `accessibility.js` sends analytics only when hostname matches its three production allowlisted hosts; this is a positive safeguard for previews.
- Public site's `accessibility.js` also links its "Login here" navigation to the live pilot Worker, even when opened on a preview host. A preview is therefore **not isolated** merely because it has a different URL.
- Public `wrangler.toml` binds `DB` to the named production progress database. Do not run `wrangler deploy` or remote D1 commands from a test checkout. A separate local/mock D1 binding and explicit no-production network policy are prerequisites.
- Replit's earlier read-only inspection also identified live progress API references. A comprehensive network audit is still required before browser previews or tests.

## Private learning center — review findings
- Private repository README identifies `pilot-server` as the authenticated Keyboarding and Braille application, separate from the public website.
- `TESTING.md` documents Chromium, Firefox, WebKit, unit, accessibility, dark-mode, voice, curriculum, progress, and multi-device test suites. These are documented test capabilities, **not tests executed in this audit**.
- Private progress README documents account-scoped optional sync and explicit legacy ownership/import. Confirm current implementation matches the documentation.
- The private progress README states automatic post-trial deletion is not enabled. The agreed 90-day retention policy needs implementation/verification before a paid rollout.
- Manual testing with VoiceOver, JAWS, and NVDA remains required.

## Priority test matrix
1. Safety: preview cannot call production analytics, progress, invitations, account, or submission endpoints; no real credentials or D1 IDs in test config.
2. Braille: both themes; all instructions announced; dot warmup, alphabet groups, recall, words, 3-miss hints, Escape, focus return, progress restore.
3. Keyboarding: both/left/right 50-lesson paths, letter-echo toggle, guidance, accuracy/WPM, 1/3/6-minute tests, save off/on, sign-out/account switch.
4. Accounts: unauthorized routes, trial expiry, 90-day read-only window, deletion warning, paid subscriber exclusion, report export permissions.
5. Browsers: run documented `npm test` and `npm run test:matrix` in a private isolated checkout with Node 24.22.1/Python 3.12; retain private diagnostics only.

## Status and approval gates
- Verified: code-level analytics host allowlist, production-linked login navigation, public D1 binding, private test-suite documentation, private progress design documentation.
- Not verified: browser execution, dark-mode visual parity, speech output, lesson scoring, current account retention behavior, live Clerk or Cloudflare deployment configuration.
- No fixes to application behavior have been made by this audit.
- Do not merge, deploy, publish, or enable production data cleanup without owner approval.
