# Private Braille help and practice controls — October 5, 2026

Starting main: `a89ad12ec237427e69474631718b5b7b8420e029`. Read current main, AGENTS.md and the newest QA/remaining-work notes before editing. Verified the current authorized private archive and editable source against the live encrypted preview before making changes.

## Completed changes

- Recall help now displays only the current Braille cell. Previously its words described the current cell while the visual reference revealed the whole target. Help still appears after three consecutive misses or an explicit request, and clears after a correct entry. Guided and Study references remain complete.
- Free-writing directions now match the chosen input method, including the difference between committing selected dots and adding a word space with Space in sequential mode. Repeat uses the same current instructions.
- Corrected a word-practice explanation to describe the default accuracy-only requirement and optional speed goal consistently with Settings.
- Fixed a reproduced single-click failure: the pause caption could appear above a practice button during pointer focus, move the button before release, and prevent activation. The caption now follows the action row. Hint, Repeat and Finish remain in place while focus/pause messages appear.
- Preserved all 48 lesson IDs, reference/practice targets, exercise order, scoring, saved progress, preview access and branding. No new lessons or arbitrary delays were introduced.

## Verification

- **71 private Braille tests pass**, up from 68. Added or strengthened coverage for current-cell-only word, number and word-space help; complete guided/Study references; correct retries; hidden future answers; both free-writing modes; and speed-goal wording. Full course completion and historical progress migration remain covered.
- **147 public tests pass**: `node --test --test-isolation=none tests/*.test.mjs`.
- `node tests/validate-site.mjs` passes: **408 pages, 58 manuals, 300 lessons and 30 final quizzes**, plus existing access-boundary checks.
- Chromium exercised the actual encrypted preview with fictional progress: wrong-code rejection, both Braille entry modes, third-miss and requested hints, entered-letter display, current-cell correction, pause/resume, repeat, single-click Hint/Repeat/Finish, completion, Escape and a locked reload. No access code persisted in browser storage and no JavaScript errors occurred.
- The pointer failure was reproduced before the fix: the button moved between pointer down and pointer up. The regression now checks both events and click reach the same Hint button at a stable position.
- Three scoped WCAG A/AA scans at desktop/narrow extra-large layouts found no violations or horizontal overflow. Screenshots were inspected. Large text remains scrollable.
- Encrypted package round-trip and matching source/deployment files were checked. `git diff --check` passes.

Speech checks inspect website requests, not actual screen-reader output. Actual JAWS, NVDA, VoiceOver, Safari, physical key rollover and learner comfort were not tested.

## Workstreams and remaining work

- **Private Braille:** this focused batch is complete in preview 24. Longer-term recall spacing, broader word/sentence difficulty and narration comfort remain follow-up work. The matching editable package and browser regression are preserved privately.
- **Command Practice / Topic Missions:** no changes in this batch. Advanced teaching and scenario depth remain in the remaining-work list; the previous mission/NVDA batch is not counted again. Existing mission IDs 0–23 remain stable; append at 24 onward.
- **Keyboarding / quality:** all three independent 50-lesson paths and progress are unchanged and covered by the public tests. Physical one-hand reach and comfort still need the owner's short planned checks.
- **Private accounts:** no account source, previews, tests or data changed or published. Public login remains off; private scaffolding is not a finished account system.

The owner's existing short hands-on checklist remains sufficient. In Braille word practice, notice whether the hint, spoken instructions and current entered letter agree after an error; there is no request to repeat the whole course.

## Publication and boundaries

Only the encrypted private bundle, matching public shell/loader and this public checkpoint are included in this publication. Plaintext private source, tests and access codes stay outside the public repository. The existing private archive identity is updated with a version guard before publication.

Use the containing commit and its validation/Pages workflow runs as the publication record. Actual workflow success and live byte comparisons are reported in the conversation once verified. No Worker code changed or was deployed. No spending, provisioning, billing, real student/account data access, messages or new automations.
