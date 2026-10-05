# Progress and settings recovery — October 5, 2026

Starting main: `b866d0abb22761aa765f060b43f126fa4b502133`. Read fresh main, AGENTS.md, remaining-work.md and the latest timing checkpoint. This is a public learning-flow reliability batch; no account or private Braille source changes.

## Reproduced issues and fixes

- **Lesson completion:** a delayed initial progress response could overwrite a newer save/undo or re-enable the button during an in-flight save. Initial reads now yield to newer changes; duplicate activation during saving is ignored. A response arriving after the anonymous Student ID changes no longer displays the earlier learner's completion. Storage failures and connection errors remain recoverable without claiming a failed save succeeded.
- **Final quizzes:** a late readiness response could enable a quiz after the Student ID changed. The ID is rechecked before applying the response; the quiz stays locked and asks for a reload. Existing submit/certificate checks remain in place. These checks improve the legacy anonymous-ID interface; they do not make Student IDs authenticated accounts or proof of ownership.
- **Mission Control Settings:** valid JSON with an invalid shape (null, a primitive or an array) could stop initialization. Invalid saved objects now fall back safely, while valid display preferences are retained. Failed writes produce a visible notice and an accessible announcement instead of claiming success. Choices still work on this page; a later successful save clears the notice. The shared voice toolbar follows the current in-memory choice when storage is unavailable.
- **Keyboarding Stats:** malformed session/completion entries no longer crash the page or inflate completed-lesson counts. Invalid metrics are shown as unavailable; negative durations, boolean scores and invalid mistake counts are excluded from totals. Valid legacy records and hand-path separation are preserved. Viewing stats does not rewrite stored source records.

## Verification

- **164 public tests pass:** `node --test --test-isolation=none tests/*.test.mjs`. Eight new regressions cover the failures above, including an initial read arriving during a save. The first seven added regression cases failed against the previous controller versions before fixes were applied.
- `node tests/validate-site.mjs` passes: 408 pages, 58 manuals, 300 lessons, 30 quizzes. `git diff --check` passes.
- Chromium `tests/browser-storage-recovery.mjs`: fictional intercepted responses only; delayed lesson read/save/undo, ID change during saving, late quiz readiness, malformed settings, keyboard navigation, blocked-storage voice synchronization, visible save warning, successful retry, Escape, narrow-screen layout and scoped Axe checks pass. No real progress API calls or student data were used.
- Chromium `tests/browser-keyboard-stats.mjs`: malformed history mixed with valid fictional records, paired WPM/accuracy, lesson and duration totals, retained source data, disclosure keyboard access, narrow-screen/Axe checks, and existing six-mode timer checks pass. No JavaScript errors in either browser check.

## Per-workstream status and remaining work

- **Command Practice:** no curriculum changes in this batch. Shared toolbar/settings reliability improved. Remaining command-specific teaching and shortcut review are still open.
- **Topic Missions:** shared toolbar/settings reliability improved; no scenarios or IDs changed. IDs 0–24 remain stable; append at 25 onward. Further scenario variety and recovery review remain open.
- **Private Braille:** unchanged at preview 24; the previous 71-test private result is historical, not a new private test run. Longer-term recall spacing and device feedback remain open.
- **Keyboarding/site quality:** the completion, quiz, settings and stats fixes above are finished and validated. All three independent 50-lesson paths, saved-data format/retention, certificates, anonymous practice and branding remain intact. Continue targeted checks of other saved-preference readers and async progress displays where defects can be reproduced.
- **Private accounts/admin:** untouched and inactive. Account source remains outside the public repository; public login stays off. Future authenticated ownership, import, synchronization and reporting are separate work.

Publication is recorded by the containing commit and validation/Pages workflows; live verification follows deployment. Existing lesson/quiz script URLs use the host's ten-minute cache lifetime; reload/revalidate before checking freshly published behavior. Keyboarding and Settings controller query versions were updated. No Worker/backend deployment, costs, provisioning, real records or external messages. The owner separately authorized bounded afternoon follow-up work; this batch does not claim every possible defect is resolved.

Actual Safari, JAWS/NVDA/VoiceOver, braille hardware and physical one-handed use remain unverified. No new full-site testing assignment is needed from the owner for these storage/response fixes.
