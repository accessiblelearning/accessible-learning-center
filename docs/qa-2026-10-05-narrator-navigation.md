# Narrator navigation teaching — October 5, 2026

Base: `0e6361f05bc173266f7b40ca688cd51ad0764735` (186 public tests). The numeric-keypad fixes and preceding 21 teaching notes are preserved. At the start of this batch, GitHub validation had succeeded and Pages publication was queued during GitHub's runner-start incident. Committed changes are not assumed live.

## Command Practice

Replaced ten more generic expanded notes, covering the course's next/previous-item commands, main landmark, webpage summary, three navigation lists and three Find commands. Main prompts, optional More explanation, all 73 task identities, stages, order and protected input remain unchanged.

The examples teach decisions that the old repeated paragraph omitted:

- Item movement depends on Narrator's selected view.
- A webpage summary describes its structure, rather than summarizing article content.
- Choosing a link in Narrator's list moves to its page location; following it is another action.
- Landmark and heading navigation depend on structure provided by the page.
- Narrator Find moves focus to the result; next/previous match commands allow review and recovery without starting the search over.

These are original teaching examples, not a simulation of running Narrator or a claim that real screen-reader behavior was tested. In total, 31 of the 73 Narrator explanations now have this focused review; 42 remain, especially text reading and structural navigation. Existing stage distribution remains 3 basic / 65 intermediate / 5 advanced and warrants a later sequencing review.

## Official references checked October 5, 2026

- [Microsoft: Narrator navigation](https://support.microsoft.com/en-us/accessibility/windows/narrator/chapter-5-navigation), views, navigation lists, webpage summaries and Find focus.
- [Microsoft: Narrator keyboard commands](https://support.microsoft.com/en-us/accessibility/windows/narrator/appendix-b-narrator-keyboard-commands-and-touch-gestures), Standard layout mappings. No changed shortcut mapping was needed in this batch.

## Validation and publication

- `node --test --test-isolation=none tests/*.test.mjs`: **186 passed**. The existing preservation check now accounts for 31 reviewed notes; no test that simply repeats new wording was added.
- `node tests/validate-site.mjs`: **408 pages, 58 manuals, 300 lessons and 30 quizzes** validated. `git diff --check` clean.
- The existing Narrator Chromium check completed all **73 tasks** with site voice on/off, including keypad rejection/recovery, repeat, builder, scoring and missed-task retry. No JavaScript errors.
- Focused additional browser inspection opened and closed the link-list and Find explanations by keyboard at **390 × 844**, confirmed the short main prompt excludes the expanded note, and found no horizontal overflow or scoped Axe WCAG A/AA violations. The link-list screenshot was visually inspected. Tests blocked external requests and used no real learner records.
- These are browser simulations and speech-request checks, not a real Narrator listening test.

Publication follows fresh-main and changed-blob verification through the existing Pages workflow. Actual workflow and live-byte results are reported in the conversation; no alternate service or backend deployment is authorized.

## Other workstreams

- Topic Missions: no new changes; stable IDs 0–24 and prior progress recovery preserved.
- Keyboarding/quality: three independent 50-lesson paths, progress and recent reliability fixes preserved.
- Private Braille: unchanged; no private source, access or encrypted package edited.
- Accounts/admin: unchanged, private and inactive; public login OFF. Additional spending $0; no new service, account, email, migration or Worker deployment.
- Actual screen-reader audio, Safari, braille hardware and one-handed physical comfort remain targeted human/device checks. No additional whole-site testing assignment is needed for these wording changes.
