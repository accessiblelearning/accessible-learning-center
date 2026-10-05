# Firefox curriculum and protected-input review — October 5, 2026

Base: `07ba0d54f6fb03374dbde2f740c8b88c9289b48c`. This is a new afternoon batch after the 173-test learner-progress checkpoint.

## Completed changes

- Reviewed all 39 Firefox commands: 11 basic, 14 intermediate, 14 advanced. Replaced terse expanded descriptions with command-specific context, examples and focus requirements. Main tasks remain short; teaching remains in optional More explanation.
- Corrected the Inspector task to describe its element picker and Responsive Design Mode as a toggle. Explained the Web Console's focus/close distinction, page versus toolbox focus, tab selection versus reordering, history versus bookmarks, and real-device limits of responsive preview.
- Aligned 17 previously inconsistent browser shortcuts with existing one-key-at-a-time rehearsal. All 37 non-Tab tasks now use protected entry; Tab and Shift+Tab remain ordinary navigation exercises. Instructions still explain how the real shortcut is held.
- Reproduced a scoring defect on the base code: pressing/releasing Control then O was credited for Control+Shift+O without Shift. The same protected shortcut scheme affected the Add-ons command. Regression coverage now requires Shift for both and verifies recovery without false credit.
- Preserved every command key/sequence, order, stage, topic identity and overall count. No accidental duplicate was removed in this course; next/previous and open/toggle actions have distinct outcomes.

## Verification

- `node --test --test-isolation=none tests/*.test.mjs`: 176 passed, including three new Firefox regressions. The omitted-Shift regression fails against the base teaching code with `Correct: 1` instead of `Correct: 0`.
- `node tests/validate-site.mjs`: 408 pages, 58 manuals, 300 lessons and 30 quizzes validated.
- `tests/browser-firefox-course.mjs`: all 39 tasks completed twice in Chromium, site voice on/off, with correct scoring, omitted-Shift recovery, current-key repeat, focus-loss reset, Tab exit, all three stage announcements, automatic advance, completion focus and Escape return. No unexpected tabs/navigation or JavaScript errors.
- Expanded explanation checked at 390 × 844: no horizontal overflow and no scoped Axe WCAG A/AA violations. Screenshot visually inspected. Speech checks inspect requests and completion events; they do not test actual audio or a screen reader.
- `git diff --check` clean.

## Official sources checked October 5

- [Mozilla Firefox shortcuts](https://support.mozilla.org/en-US/kb/keyboard-shortcuts-perform-firefox-tasks-quickly)
- [Firefox developer-tool shortcuts](https://firefox-source-docs.mozilla.org/devtools-user/keyboard_shortcuts/index.html)
- [Network Monitor](https://firefox-source-docs.mozilla.org/devtools-user/network_monitor/index.html)
- [Responsive Design Mode](https://firefox-source-docs.mozilla.org/devtools-user/responsive_design_mode/index.html)
- [Private browsing](https://support.mozilla.org/en-US/kb/private-browsing-use-firefox-without-history)

## Other workstreams and remaining work

- Topic Missions: unchanged, IDs 0–24 preserved. Deeper scenarios and real screen-reader focus checks remain.
- Keyboarding: unchanged, all three separate 50-lesson paths and existing WPM/accuracy reporting retained. Physical one-hand comfort remains unverified.
- Private Braille: unchanged, preview 24 remains the latest recorded package; no plaintext or access details touched. Narration, rollover and pacing still need actual device feedback.
- Accounts/admin: unchanged, private and inactive. No provider, service, billing, migration or Worker deployment. Additional spending $0; public login OFF.
- Remaining command work: review other unreviewed course sections and curriculum gaps, rather than repeating this Firefox review. Test actual Firefox/Safari and assistive technology before claiming those combinations verified.

## Publication

Prepared for the existing Pages workflow after fresh-main and changed-blob checks. Record the actual commit/workflow/live verification in the conversation; this checkpoint does not itself assert deployment succeeded. No backend deployment is part of this batch.

## Short human check when convenient

In Firefox command practice, try a bookmark-library task using each requested key, deliberately omit Shift once, then retry correctly. Check that speech and the visible prompt agree. A short real Safari/VoiceOver check remains useful; another whole-course manual run is unnecessary.
