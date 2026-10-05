# Word alignment duplicates and keypad distinctions — October 5, 2026

Base: `8f307168f5793188cee8d237e9c7828d26e75269` (186 public tests). The Narrator keypad and 31 teaching-note improvements remain in place. At this point the latest Pages workflow was still queued; successful commits are not assumed live.

## Reproduced curriculum issue

Both the full Word course and its focused General Editing route repeated the same three alignment actions: Control+E, Control+L and Control+R. The second occurrence changed the word "text" to "paragraph" in the goal, but used the same keys, context and explanation. These were duplicated reference-table entries, not an intentional recall activity with a new objective.

Extended the existing explicit reviewed-duplicate list to those three keys. The first task and its identity are retained. No broad key-only deduplication is applied to other commands or applications.

- Full Word: **217 to 214 tasks**, with the exact same set of distinct shortcuts.
- Focused General Editing: **20 to 17 tasks**, one per distinct shortcut; its selecting, moving, formatting and reusing-text coverage is preserved.
- Basic/intermediate/advanced progression remains present in both routes. The focused route uses its existing stage-balancing logic.
- Commands with different focus requirements remain separate, including Excel's worksheet/formula-bar Control+End and VoiceOver's interface/text navigation.
- No existing saved records are rewritten. Future private account import mapping should map the redundant alignment descriptions to their retained first-task identity instead of using numeric positions. Command Practice currently has session results, not the future authenticated cross-device record system.

## Reproduced physical-key issue

The em-dash and en-dash exercises accepted the main keyboard's minus key, despite the official commands requiring numeric keypad minus. A regression reproduced false credit for the wrong builder key before the fix.

- Both dash tasks now say **numeric keypad minus** in directions, repeat, feedback, builder choices and results. They use separated-key rehearsal to avoid running a browser shortcut. Native keypad codes and keypad-location fallback are recognized; main-keyboard minus is rejected.
- The optional-hyphen task remains a distinct exercise and rejects numeric keypad minus. Its modifier combination is preserved from the current official reference; this batch does not substitute a remembered mapping from another Word version.
- Added three command-specific notes explaining the dash/hyphen distinction and examples. A learner without a keypad can complete the dash tasks through the existing builder.
- Original task identities and stored `steps` are preserved; `practiceSteps` names the precise keypad input. Future account adapters should display this metadata while retaining stable identities. The current public practice results already use it.
- Ordinary zoom-out input and the preceding Narrator keypad handling retain their behavior. No global rule treats every minus key as a different command.

## Official reference

[Microsoft: Keyboard shortcuts in Word](https://support.microsoft.com/en-us/accessibility/word/keyboard-shortcuts-in-word), checked October 5, 2026. The Windows frequent-shortcut and paragraph-formatting tables describe the same three alignment actions. Original command-specific explanations already distinguish paragraph alignment from character formatting and remain unchanged.

## Verification

The alignment regression failed against the preceding code because Control+E appeared twice. It verifies one retained alignment task in both routes, unchanged distinct-key coverage, three stages, 17 focused tasks and preservation of selected commands with different contexts. The dash regression also failed on the preceding implementation by awarding credit for the main minus key. Additional checks cover physical keypad input, location fallback, builder rejection/recovery, the optional-hyphen distinction, stable identities and unchanged ordinary zoom input.

- `node --test --test-isolation=none tests/*.test.mjs`: **189 passed**, three new regressions.
- `node tests/validate-site.mjs`: **408 pages, 58 manuals, 300 lessons and 30 quizzes** validated. `git diff --check` clean.
- `tests/browser-editing-course.mjs`: Chromium completes all **214 Word** tasks and **17 General Editing** tasks with site voice on and off. It checks one appearance per alignment, native separated-key keypad-minus input, builder support without a keypad, wrong-key rejection, current-key repeat, retained browser location, scoring, stage announcements, missed-task retry, completion focus and Escape return. No JavaScript errors. All nonlocal requests were blocked.
- Narrator keypad regressions also pass after adding Word-specific recognition. No actual Word, screen-reader audio, Safari or hardware usability test is claimed.

## Other workstreams and remaining work

- Topic Missions: unchanged; stable IDs 0–24 retained.
- Keyboarding: unchanged; all three separate 50-lesson paths and prior scoring/progress fixes retained.
- Private Braille: unchanged; no private source, encrypted payload or access edited.
- Accounts/admin: unchanged, private and inactive; login OFF. Additional spending $0, no new services or Worker deployment.
- Other repeated actions still need contextual review; a repeated key or explanation alone does not prove an accidental duplicate. Remaining Word/Docs/Excel/PowerPoint explanations and Narrator text/structure instruction remain curriculum work. Existing device checks remain necessary; no real screen reader or physical keyboard comfort is claimed tested.

Publication uses fresh main, verified blobs and the existing Pages workflow. Workflow success and live bytes must be verified separately from committing these changes.
