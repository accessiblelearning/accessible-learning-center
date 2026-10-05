# Course browsing and menu voice recovery — October 5, 2026

Starting main: `7cbd33f596258dec55c3df5be257dfdb37610dac`. The previous progress/settings batch passed validation and Pages workflows (37356310901 and 37356310531); its seven live runtime assets returned HTTP 200 and matched the tested files byte for byte. Read current main and retained the applicable AGENTS.md/privacy boundaries.

## Changes

- The course catalog keeps browsing and text/topic filters available while saved progress loads. The Started courses checkbox becomes available only after a valid response. Loading/unavailable explanations are associated with that checkbox and announced as status text.
- A failed or invalid progress response resets a checked Started filter instead of leaving all courses hidden behind a disabled checkbox. Valid records are retained when an array also contains invalid entries. A delayed response for an earlier Student ID cannot label the current view with the earlier learner's completion or continue links.
- Mission Control, Command Practice and Topic Missions menus use the current voice choice while storage is unwritable. Arrow-key focus changes still request speech when voice is on, stop requesting speech when it is off, and pass the active voice setting into command/mission sessions. Persistent storage is still attempted by the shared toolbar; this is a per-page fallback, not new storage or account synchronization.

## Verification

- **168 public tests pass**: `node --test --test-isolation=none tests/*.test.mjs`. Four new regression tests failed against the preceding versions, then passed after the fixes. They cover catalog loading/failure, invalid/mixed records, a changed Student ID, and all three menus with unwritable storage.
- Chromium `tests/browser-storage-recovery.mjs` passes its prior recovery checks plus catalog loading, invalid and mixed response handling, changed-ID exclusion, next-lesson links, Started filtering, course-hash navigation, and native menu voice toggles/arrow keys. External requests are blocked or replaced with fictional responses. No real progress data was read or changed.
- Site validation passes (408 pages, 58 manuals, 300 lessons, 30 quizzes), as does `git diff --check`. No JavaScript errors in the focused browser check. Automated speech-request inspection is not a real screen-reader test.

## Workstream checkpoint

- **Command Practice and Topic Missions:** menu speech fixes complete; curriculum and stable mission IDs 0–24 unchanged. Further command-specific explanation review and scenario depth remain open; future mission IDs start at 25.
- **Private Braille:** unchanged at preview 24; private tests were not rerun. Existing access and 48 lesson identifiers are preserved. No private source was copied into the public project.
- **Keyboarding and site quality:** course-browsing recovery complete; the preceding timer/stats/progress fixes remain validated by the full suite. All three independent 50-lesson paths and their saved data remain unchanged.
- **Private accounts/admin:** untouched, private and inactive. Anonymous Student IDs still are not authenticated account ownership. Public login remains off; no backend deployment or service setup.

Publication is recorded by the containing commit and its validation/Pages workflows. Live verification follows deployment. Additional spending remains $0. No messages, real credentials or student records were used. Human Safari, screen-reader, braille-hardware and one-handed comfort checks are still outstanding, but this batch does not require another broad testing assignment from the owner.
