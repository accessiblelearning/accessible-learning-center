# Narrator keypad clarity and teaching — October 5, 2026

Base: `556e8c53a9d0ce68553a22ef0f84be339ea04ab5` (183 public tests). Prior keyboard restart and mission-save fixes are preserved, not counted as new work here.

## Command Practice — completed in this batch

- Reproduced incorrect credit for number-row 5 in Narrator's numeric-keypad reading tasks. Microsoft's Standard layout documents numeric keypad 5 for these two shortcuts; number-row 5 was not an equivalent practice entry.
- Prompts, repeat, feedback, key picker and completion/review lists now say **numeric keypad 5**. Physical input recognizes its keypad code, including the `Clear` key value reported with Num Lock off, or its keypad location when the code is absent. Number-row 5 no longer receives credit for these tasks.
- Learners without a numeric keypad can use the existing accessible builder. Optional explanations also name Microsoft's documented laptop alternatives: Narrator+Tab for the current item and Narrator+K for the current word. Those alternatives are teaching context, not additional silently substituted exercises.
- Replaced **21** generic notes with original teaching for help/orientation, speech review, typing/capitalization feedback, modifier lock, pass-through, screen curtain and all **5 advanced tasks**. Examples distinguish verbosity from speed/volume, on-screen braille output from hardware controls, and Outlook column headers from webpage headings.
- Preserved all **73** task identities, ordering, goals, stages and protected separate-key practice. The two existing keys (`Insert+5` and `Control+Insert+5`) remain their stable identities; `practiceSteps` metadata supplies the precise physical-key names without renaming the records. Future private account adapters should retain the original identity and use this metadata when displaying practice directions.

## Official references checked October 5, 2026

- [Microsoft: Narrator keyboard commands](https://support.microsoft.com/en-us/accessibility/windows/narrator/appendix-b-narrator-keyboard-commands-and-touch-gestures), Standard layout and numeric keypad sections.
- [Microsoft: Narrator basics](https://support.microsoft.com/en-us/accessibility/windows/narrator/chapter-2-narrator-basics), Input Learning, orientation, recent speech and screen curtain.
- [Microsoft: Reading text](https://support.microsoft.com/en-us/accessibility/windows/narrator/chapter-4-reading-text), current item/word alternatives, verbosity and capitalization.
- [Microsoft: Customizing Narrator](https://support.microsoft.com/en-us/accessibility/windows/narrator/chapter-7-customizing-narrator), typing feedback and Narrator modifier settings.
- [Microsoft: Narrator with braille](https://support.microsoft.com/en-us/accessibility/windows/narrator/chapter-8-using-narrator-with-braille), on-screen viewer requirements and separate device context.

## Verification

- `node --test --test-isolation=none tests/*.test.mjs`: **186 passed**, three added regressions. The wrong-number-row test failed on the prior code by awarding credit, then passed with the correction.
- `node tests/validate-site.mjs`: **408 pages, 58 manuals, 300 lessons and 30 quizzes** validated.
- `tests/browser-narrator-course.mjs`: Chromium completes all 73 tasks with site voice on/off; checks wrong physical key and wrong builder selection, current-key repeat, Tab exit, native keypad events, builder success, accurate attempts, missed-task retry, stage announcements, completion focus and Escape return.
- Numeric-keypad explanation at 390 × 844: no horizontal overflow or scoped Axe WCAG A/AA violations; screenshot inspected. No unexpected JavaScript errors.
- Browser checks block all nonlocal requests and inspect speech requests, not audible screen-reader output. No real student records or actual Narrator configuration were accessed.
- `git diff --check` clean. Publication requires fresh-main/changed-blob checks and the existing Pages workflow; actual workflow/live verification is reported in the conversation.

## Other workstreams and remaining work

- **Topic Missions:** no new scenario changes. IDs 0–24 and the prior save-feedback/retention fixes are preserved.
- **Private Braille:** unchanged; no private source, package, access or progress edited. Preview 24's existing work is retained.
- **Keyboarding and quality:** all three 50-lesson paths, independent history and the earlier restart fix are preserved. This batch does not claim new keyboarding curriculum changes. Quiz/certificate completion guards were inspected; no additional change was justified there.
- **Private accounts/admin:** unchanged, private and inactive; public login OFF. No provider, database, email or Worker deployment. Additional spending **$0**.
- Narrator still has **52 explanations** outside this batch's review, especially text navigation, structure and search. Its existing 3/65/5 stage distribution also deserves a separate sequencing review; no tasks were reordered in this correction. Other remaining curriculum work is in `remaining-work.md`.
- Real Narrator/JAWS/NVDA, Mac VoiceOver/Safari, braille hardware and physical one-handed comfort remain unverified. The owner's existing short device-test list is sufficient; reproducing storage or timer failures manually is unnecessary.
