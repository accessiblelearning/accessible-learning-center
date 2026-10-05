# Narrator reading and focus teaching — October 5, 2026

Base: `8011fb0d1f6d8e75326bbd226a1c3db1c8da254b` (189 public tests). This is an owner-authorized continuation after the afternoon checkpoint, while the owner begins device testing. Earlier reliability and keypad fixes are preserved, not counted as new work.

## Command Practice — 38 more explanations reviewed

Replaced 38 remaining generic Narrator notes with original examples and command-specific guidance. Added reading-unit choices, recovery after passing text, document-body focus, window-item versus text boundaries, formatting review versus formatting changes, and parent/child/sibling navigation with explicit app-support limits.

Other notes cover starting/exiting Narrator safely, the commands list, primary action, status-bar backslash, mouse-pointer versus keyboard focus, and feedback. Image/link teaching explains the online-service privacy boundary and supported on-device image descriptions without sending anything from the simulator.

- All **73 tasks**, identities, goals, shortcut mappings, order, stages and protected input are unchanged. A comparison against the base commit confirms that only the 38 Narrator expanded-note fields changed in the loaded curriculum; no other course fields changed.
- The concise main prompts and optional **More explanation** design remain. The session references a fresh teaching-asset version so a new load can obtain the update; an already-running practice session is not forcibly reloaded.
- **69 of 73 explanations** now have this individual review. Four are deliberately still open: search-mode toggle (`Control+Insert+Enter`), advanced item reading (`Insert+0`), linked-item navigation (`Insert+A`) and annotated-content navigation (`Shift+Insert+A`). Official tables confirm their mappings, but the retrieved material did not establish enough specific usage behavior to invent detailed examples. Their existing tasks remain available.
- The existing **3 basic / 65 intermediate / 5 advanced** distribution remains a separate sequencing question. This wording batch does not reorder a course while the owner is testing.

## Verification

- `node --test --test-isolation=none tests/*.test.mjs`: **189 passed**. Strengthened the existing preservation regression to identify the four remaining notes and check key teaching distinctions; no artificial increase in test count.
- `node tests/validate-site.mjs`: **408 pages, 58 manuals, 300 lessons and 30 quizzes** validated. `git diff --check` clean.
- `tests/browser-narrator-course.mjs` completes all **73 tasks twice**, with site voice on and off. Existing keypad rejection/recovery, repeat, builder, retry, scoring, stages, completion focus and Escape checks still pass. No JavaScript errors.
- Added browser assertions that the expanded note is absent from the short prompt and automatic speech, and collapses when the next task begins. Keyboard-opened explanations for image/link information, read-from-cursor, formatting and first-child navigation passed at **390 × 844**, without horizontal overflow or scoped Axe WCAG A/AA violations. Inspected the saved narrow screenshot.
- All browser requests outside the local test origin were blocked. Fictional practice only; speech requests were inspected, not listened to through a real screen reader.

## Other workstreams and remaining boundaries

- **Topic Missions:** unchanged, IDs 0–24 and existing saved-progress behavior preserved. Further scenario depth remains open.
- **Keyboarding/quality:** three independent 50-lesson paths, WPM/accuracy, certificates and earlier reliability fixes preserved. No new physical comfort claim.
- **Private Braille:** source, preview package, access and progress untouched; this is not another private test run. Existing targeted human pacing/entry checks remain useful.
- **Accounts/admin:** unchanged, private and inactive; public login OFF. No provider activation, real account/data access, messages, migrations or Worker deployment. Additional spending **$0**.
- Actual Narrator/JAWS/NVDA, Safari/VoiceOver, braille hardware and physical one-handed usability remain unverified. The owner's existing short test list is sufficient; no additional whole-course testing is requested.

Publication follows fresh-main and changed-blob checks through the existing Pages workflow. A commit alone is not deployment; workflow and live-byte outcomes are reported in the conversation.

## Official references checked October 5, 2026

- [Narrator keyboard commands](https://support.microsoft.com/en-us/accessibility/windows/narrator/appendix-b-narrator-keyboard-commands-and-touch-gestures): Standard-layout mappings, window focus, text boundaries and structural navigation.
- [Reading text](https://support.microsoft.com/en-us/accessibility/windows/narrator/chapter-4-reading-text): reading units, cursor/start distinctions and formatting groups.
- [Narrator basics](https://support.microsoft.com/en-us/accessibility/windows/narrator/chapter-2-narrator-basics): window reading, online image/link information and supported on-device descriptions.
- [Narrator navigation](https://support.microsoft.com/en-us/accessibility/windows/narrator/chapter-5-navigation): link-title service and focus context.
- [Customizing Narrator](https://support.microsoft.com/en-us/accessibility/windows/narrator/chapter-7-customizing-narrator): mouse reading and cursor synchronization settings.
- [Word screen-reader basics](https://support.microsoft.com/en-us/accessibility/word/basic-tasks-using-a-screen-reader-with-word): document-body focus before text reading.
- [Standard keyboard layout](https://support.microsoft.com/en-us/accessibility/windows/narrator/welcome-to-the-new-standard-keyboard-layout-for-narrator): selection-reading and structural-command distinctions.

The examples are original fictional teaching situations, not instructions that operate the user's screen reader from this webpage.
