# Curriculum refinement checkpoint — October 5, 2026

Starting main: `4ad0fe0d4a61eda92570b5c197977b8f1096a49d`. Read AGENTS.md, the previous QA checkpoint and remaining-work list before editing. The current private Braille source exactly matched the deployed encrypted scripts, markup and CSS. Account development remains withdrawn/private; login is off. No new service, Worker deployment, database migration or spending is part of this batch.

## Command Practice: completed in this batch

- Improved **47 Excel/PowerPoint expanded teaching entries** with specific context and examples (30 Excel, 17 PowerPoint). Main prompts remain short and More explanation stays optional.
- Changed **11 Excel Paste Special options** from unexplained letters into complete, protected sequences: open the dialog from the destination cell, choose the option, then confirm. The short goal changes at each step. The explanation specifies copied source cells, destination selection and English Excel for Windows labels.
- Corrected Excel outline guidance to describe worksheet grouping controls. Explained different meanings of Control+A and Control+End inside the formula editor versus worksheet selection.
- Corrected PowerPoint Selection-pane group exercises that had substituted main-row plus/minus for numeric-keypad commands. They now teach documented Right/Left Arrow alternatives and identify the pane.
- Removed two reviewed duplicate actions: the repeated Excel Formulas-tab entry and PowerPoint Outline/Thumbnail toggle. Retained distinct contexts such as Alt+Shift+1 in Outline view versus the Selection pane. Excel now has 171 entries; PowerPoint has 179. Both retain basic, intermediate and advanced stages.
- Removed repeated “normally/one key at a time” wording when a protected sequence reaches an ordinary single-key step; the key, purpose and step count remain visible.

Remaining: review the rest of the advanced explanations and application-specific contexts, especially Windows/File Explorer, email, browser, magnification and screen-reader courses. Existing copied shortcut facts are not all automatically certified by this targeted review. A future private account progress registry must reconcile corrected command sequences with historical identifiers before importing records; no live account command history exists or was migrated here.

## Topic Missions: completed in this batch

Appended stable numeric IDs without moving IDs 0–17:

- **18, Excel — Keep a fixed total instead of a formula.** Eight steps: undo the wrong paste, return to B4, copy, move to C4, open Paste Special, choose Values, confirm, save. The scenario distinguishes worksheet selection, copied source, dialog focus, chosen option and final cell content.
- **19, PowerPoint — Uncover a title with the Selection pane.** Six steps: open the pane, move focus to its list, find Title, select it, bring it forward, save. The modeled focus order is explicitly fixed; real F6 navigation can require more presses.

Every new step includes current-state feedback, an F1 hint and a specific recovery message. Wrong commands leave the modeled state unchanged; Control repeats the current step. Protected final-key input avoids running conflicting browser/assistive-technology commands. Existing completion IDs persist, and results record the extra attempts and commands to review.

Remaining: further scenario depth for Chrome, Mac VoiceOver and supported display/device configurations, plus broader branching choices beyond the present guided command sequences. Simulated focus changes are not actual Excel, PowerPoint, VoiceOver or braille-display operation.

## Private Braille: completed in this batch

- Preview 22 names the current literal letter in word hints, for example “E in deed,” followed by its dots and keys. Hints still appear after three consecutive misses or an explicit request. Both chord and sequential input work, and the next cell returns to recall with future answers hidden.
- A word-space hint asks for Space; number indicators/contractions keep their separate cell meanings.
- Brief one-time transitions introduce recall and its second round. Individual letter/word prompts remain concise.
- Preserved all 48 lessons, stable IDs, current progress migration, introduced-symbol restrictions, three A–J word lessons, number/punctuation progression, typed-letter display, cell sizing and the existing access code.
- Updated the existing private source archive to version 22. Only the encrypted bundle and matching loader/shell go into this repository. No editable private source, test harness or access code is committed.

Remaining: teaching judgment about longer-term recall spacing, word/sentence difficulty and actual narration pace. The updated transitions do not impose a new timed delay. Physical six-key rollover and assistive-technology audio still need device feedback.

## Keyboarding: completed in this batch

- Added explicit Windows 11 and Mac paths to the one-handed capital-letter setup instructions. The lesson explains that Sticky Keys is a device setting, which the website cannot enable.
- When the correct base key is pressed without the required Shift, left- and right-hand paths now recognize that the learner found the key and explain the Shift/Sticky Keys issue, instead of suggesting the wrong finger location.
- Preserved all three independent 50-lesson paths, selected-hand cues, accuracy/speed settings, numbering and existing progress. Existing tests complete all 150 path lessons and check introduced characters in each practice mode.

Remaining: actual comfort of reaches/finger choices on the learner’s keyboard. No automated test can establish physical one-handed usability.

## Verification

- **136 public tests pass:** `node --test --test-isolation=none tests/*.test.mjs`.
- Site validator passes: **408 HTML pages, 58 manuals, 300 instructional lessons and 30 quizzes**, plus assets/links, certificates and private/public boundaries.
- Replaced the validator’s obsolete quote-style-dependent eight-mission count with validation of the real mission data and required step fields. There are now **20 missions**.
- **67 private Braille tests pass**, including full 48-lesson completion, saved progress, both input modes, per-cell hints and phase transitions.
- Chromium native keyboard checks pass for the existing Word Undo→Save recovery, missions 13–19, hints/repeat/error recovery/completion, protected shortcuts, and the real Excel Paste Special sequence with changing step goals.
- Private Chromium opens the actual encrypted package and checks third-miss C and word hints, correct recovery, visible typed letters, pause/resume and Escape. Four checked WCAG A/AA scans at large/narrow sizes found no violations or horizontal overflow. Screenshots were visually inspected.
- `git diff --check` passes. Account boundary checks pass; current account preview/source URLs remain withdrawn.

Speech tests record requested utterances. **Actual JAWS, NVDA, VoiceOver, Safari, physical one-handed use and braille hardware remain unverified.** Request short targeted checks, not another whole-site test.

## Official references checked October 5, 2026

- [Excel for Windows shortcuts](https://support.microsoft.com/en-us/accessibility/excel/keyboard-shortcuts-in-excel): Paste Special options, ribbon access, formula-editing context and outline controls.
- [PowerPoint for Windows shortcuts](https://support.microsoft.com/en-us/accessibility/powerpoint/use-keyboard-shortcuts-to-create-powerpoint-presentations): object/group controls, Selection pane, task panes and ribbon access.
- [Microsoft Selection pane guidance](https://support.microsoft.com/en-us/powerpoint/use-the-selection-pane-to-manage-objects-in-documents): focus, selection and stacking commands.
- [Windows keyboard accessibility](https://support.microsoft.com/en-us/accessibility/windows/make-your-mouse-keyboard-and-other-input-devices-easier-to-use): Sticky Keys and settings location.
- [Mac accessibility Keyboard settings](https://support.apple.com/en-gb/guide/mac-help/mchlae61a6de/26/mac/26): Sticky Keys and settings location.

## Release procedure

Publish through existing GitHub Pages only after fresh-main and changed-blob checks, with no force push. Inspect the repository validation and Pages workflows, then compare live changed assets with the validated local files. This procedure does not deploy the Worker or enable login. The private account development archive remains separate and unchanged.
