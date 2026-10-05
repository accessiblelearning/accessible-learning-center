# Optional learner account pilot

Current privacy status: account implementation and previews have been moved out of the current public project. See `docs/account-preview-privacy.md`. The material below is historical planning; new account development must remain private until explicitly released.

Prepared October 2, 2026; updated October 5 with an inactive implementation. This is not a deployed account system. Working target: a limited November pilot, with a broader December release subject to the checks below.

## October 5 implementation checkpoint

The disabled account boundary, separate schema, authorization and import foundation, local SQL tests, and fictional learner/admin previews now exist. See `accounts/README.md` and `docs/account-no-cost-options.md` for implemented behavior and launch blockers. Public login remains OFF. No provider was configured, production migration run, Worker deployed or additional service provisioned. All additional spending remains $0.

## Existing learning/progress state

- `student-id.html` registers an anonymous identifier through the Worker API. It does not authenticate a learner.
- `worker.js` accepts the supplied Student ID for progress reads/writes. Knowledge of that identifier is not proof of ownership. Do not turn those identifiers into authenticated account claims.
- Existing course progress accepts lesson numbers 1–10. It cannot be reused unchanged for the 50-lesson typing paths or private Braille curriculum.
- Keyboarding history is local under `alcKeyboardingProgressV1`, with distinct completion prefixes for both hands, left hand and right hand. Sessions include accuracy, WPM, mode, targets and timestamps; the last 100 sessions are retained. Saving is opt-in.
- Topic Mission completion is browser-local under `missionControlCompleted` (numeric mission indices). Command Practice does not currently maintain a comparable account-backed completion history.
- Quiz results use `accessibleLearningQuizResults:<studentId>`. Older unscoped quiz results may exist. A local identifier is not authenticated identity.
- Private Braille access is separate; its source/progress format needs a private integration review. No private code or access material belongs in this public plan.

## Proposed pilot boundaries

Keep public manuals and anonymous practice available. Accounts are optional for cross-device progress. Keep private previews private. Use a maintained authentication service for credentials and recovery; select/configure it before implementing the live login flow. Do not implement ad hoc password storage in the existing Worker.

The backend must derive an immutable account ID from a validated session; never use a client-supplied username or student ID as authorization. Use separate account-owned records from the legacy anonymous tables. Every progress read/write must enforce account ownership. Course, path, lesson and metric validation belongs on the server. Authentication does not make client-reported practice scores tamper-proof.

Suggested progress identity: account ID + activity type + stable curriculum ID + curriculum version + path + lesson/mission ID. Use stable mission IDs rather than array positions. Keep settings and preview entitlements separate from progress; logging in must not grant private-preview access automatically.

## Implementation order

1. Select and configure the authentication provider, site/API domains, allowed redirects and recovery delivery. Keep additional costs at $0; paid infrastructure, trials, billing and automatic overages are not authorized.
2. Implement a separate test environment for sign-up, login, logout, session expiry and recovery. Support password managers, paste, accessible field errors and a readable show-password control. Avoid timed tasks and inaccessible challenges.
3. Add account-scoped progress endpoints and an explicit data schema, with authorization tests using two synthetic accounts. Do not test cross-account reads against real learners.
4. Add one pilot progress adapter for Keyboarding, preserving all three paths and existing opt-in local saving. Handle offline work and retries without duplicate completion records or erased history.
5. Offer a preview of local records and an explicit import choice after login. Local records are learner-supplied practice history, not proof of ownership of any server record. Never claim another legacy Student ID's history automatically. Label imported history and do not convert it into newly verified certificates. Keep original local data until import is confirmed; repeated imports must not duplicate it.
6. Add Topic Missions and Command Practice progress, then assessed courses and private Braille after their separate review. Show clear per-area sync status; do not imply all areas sync when only typing does.
7. Test a small learner pilot before broad release. Document support/recovery steps, data deletion, retention and rollback. A login failure must leave public learning materials usable.

## Release checks

- Two-account isolation; invalid/expired sessions; tampered IDs; rejected cross-account writes.
- Keyboard-only and real screen-reader sign-up, login, recovery and logout.
- Two devices; refresh; offline retries; import conflicts; account switching on a shared computer; no previous learner's results shown after logout.
- Existing local progress and private-preview behavior survive rollout and rollback.
- Provider configuration and recovery delivery work on production domains.

## Still not implemented

A real provider adapter, active login/recovery, cross-device client sync, detailed-history import, production account database, retention/deletion workflows and private Braille integration remain outstanding. The code foundation is not a finished secure login system. No password accounts are live and no production migration has run.
