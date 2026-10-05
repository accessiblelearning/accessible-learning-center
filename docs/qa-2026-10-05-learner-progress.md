# Learner progress display — October 5, 2026

Starting main: `fdf4edfea2112f9220862cf4d5e642106151ed80`. The preceding menu/catalog batch passed validation and Pages workflows (37357393310 and 37357392009); eight live runtime assets matched the tested files with HTTP 200 responses. Current main and the applicable privacy/remaining-work instructions were retained.

## Reproduced issues and fixes

- A lesson with status `in_progress` was shown as Not started. The learner progress page now labels it In progress and retains the correct next unfinished lesson.
- A malformed row in an otherwise valid response could stop rendering all course sections and misleadingly report a connection problem. Only recognized lesson-status records with usable course/lesson fields enter rendering; valid rows are preserved.
- A response arriving after a Student ID change could populate the prior learner's history. The page rechecks the ID before rendering and on connection errors, clears the old label/continue view, and asks for a reload when it cannot confirm the original ID.
- Out-of-range or nonnumeric local quiz scores could be displayed as passing, including a reproduced 150-percent result. Invalid records are now labeled Saved quiz result unavailable. Valid legacy 80-percent and explicitly saved current passing thresholds remain supported. Existing stored records are not rewritten, and this does not grant or revoke any certificate.

## Verification

- **173 public tests pass**: `node --test --test-isolation=none tests/*.test.mjs`. Five new progress-page tests cover the four reproduced failures plus storage blocking without any progress request. Four failed against the preceding page version before fixes.
- Chromium `tests/browser-storage-recovery.mjs` passes: mixed fictional records render all 30 courses; in-progress status, next-lesson link, unavailable quiz result, unchanged local source, Started filter, delayed-ID exclusion, narrow-screen layout and scoped Axe checks. The earlier completion, quiz, catalog and menu recovery checks also pass. No JavaScript errors and no real student data/API access.
- `node tests/validate-site.mjs` passes: 408 pages, 58 manuals, 300 lessons and 30 quizzes. `git diff --check` passes.

## Current workstream checkpoint

- **Command Practice / Topic Missions:** the preceding shared menu and settings fixes remain validated. No curriculum or scenario changes in this batch; stable IDs 0–24 preserved. Additional command-specific teaching and scenario depth remain open; append future missions at 25 onward.
- **Private Braille:** preview 24 and its 48 lesson IDs/access are unchanged. No private edits or fresh private test run in this batch.
- **Keyboarding / quality:** the public learner progress fixes above are complete. All three independent 50-lesson keyboard paths and their timer/statistics fixes remain intact. This page shows assessed-course lesson progress; it is not the future account-admin WPM/accuracy dashboard.
- **Private accounts/admin:** no changes or activation. Legacy Student IDs remain anonymous identifiers, not authenticated ownership. Public login off, private source outside this repo, $0 spending, no services or backend deployment.

The three afternoon reliability batches added 17 tests beyond the earlier 156-test baseline. This is scoped automated evidence, not a claim that every defect is removed. The scheduled continuation should read this checkpoint and remaining-work.md before choosing another independent issue. Do not repeat the completed timer, stats, storage, menu or progress fixes. Actual Safari, JAWS/NVDA/VoiceOver, braille hardware and physical one-handed usability remain human/device checks.

Publication is recorded by the containing commit and validation/Pages workflows; live verification follows deployment. No new broad testing assignment for the owner is needed for these progress-display changes.
