# Google Docs objects and document review — October 5, 2026

Base: `bcba4869d8538f6f9e0c7c5becc8e3b6593eccee` (189 public tests). This is a further owner-authorized continuation, not a repeat of the earlier Narrator or reliability batches.

## Changes

- Added **32 original, command-specific explanations** for images/drawings, comments, footnotes, suggestions and comment/anchor reading. Examples distinguish resizing from zoom/cropping, comment content from its anchor, entering a comment from finding commented text, and reviewing a suggestion from accepting it.
- Added concise focus requirements to those tasks through `stepGoals`, keeping original task identities and goals stable. Single-letter comment commands now explicitly require a selected comment, not a document or reply text field. Footnote teaching accounts for pageless documents.
- Added current-step purposes to **11 two-part commands**. Reproduced and fixed the controller's omission of that purpose from automatic next-step speech. Where a course supplies a step goal, the next-step announcement now includes it; longer explanations remain optional and are not automatically spoken.
- Switched Docs **Shift+Escape** to the existing separated-key/protected input. Previously it requested the held chord even though Chrome assigns it to Task Manager. The exercise still requires Shift, accepts the optional builder and leaves ordinary Escape navigation available outside the requested key. No real browser Task Manager takeover is claimed as a test result.
- Retained both documented uses of **Control+Alt+Shift+A**, now explicitly described as a recall of the same discussion/history command, not two shortcuts to memorize. Kept context-dependent **Alt+Right Arrow** tasks distinct; rotation teaching does not overwrite the person/group-information entry. Its more specific context remains a later review.

All **199 Google Docs tasks**, shortcut identities, goals, order and levels (**33 basic / 50 intermediate / 116 advanced**) are preserved. A loaded-data comparison against the base commit confirms that only the 32 intended Docs entries changed; other course data is unchanged. Shared next-step speech improves only tasks that already supply a step goal. No extra commands, arbitrary delays or forced session reloads were added.

## Validation

- Added three regressions covering identity/context preservation, protected drawing exit with missing-modifier rejection, and all 11 layered commands with current-step speech/repeat, wrong input, recovery and correct scoring. The new assertions failed against the previous implementation before the fixes.
- `node --test --test-isolation=none tests/*.test.mjs`: **192 tests passed**.
- `node tests/validate-site.mjs`: **408 pages, 58 manuals, 300 lessons and 30 quizzes** validated. `git diff --check` clean.
- `tests/browser-docs-review.mjs`: all **199 tasks completed with site voice on and off**. Checked all 11 new layered cues, protected image rotations and drawing exit, recovery from missing modifiers, attempt totals, missed-task retry, stage announcements, results focus and Escape navigation. No JavaScript errors; external requests blocked.
- Existing `tests/browser-jaws-course.mjs`: all **32 simulated tasks** still complete with site voice on and off, including layered-command recovery and repeat. This guards the shared speech-controller change outside Docs; it is not a real JAWS test.
- Keyboard-opened optional teaching for alt text, comment reply and comment-anchor reading passed **390 × 844** layout and scoped Axe WCAG A/AA checks. Expanded notes stay out of the main prompt and automatic speech, and close when a new task begins. The reply screenshot was visually inspected.
- These are local Chromium simulation and speech-request checks, not actual Google Docs, Chrome application commands, JAWS/NVDA/Narrator, Safari/VoiceOver or hardware usability testing.

## Other workstreams and remaining work

- **Command Practice:** other generic Docs sections and advanced application teaching remain. The four unresolved Narrator explanations and course sequencing are still open; do not count them as finished. Continue distinguishing meaningful focus-dependent actions from accidental duplicates.
- **Topic Missions:** unchanged, with IDs 0–24 preserved. Further scenario depth remains independent work.
- **Keyboarding:** all three independent 50-lesson paths, recent WPM/accuracy reporting, local opt-in progress and certificates are unchanged; existing automated coverage passes. Physical reach and comfort still need human feedback.
- **Private Braille:** source, encrypted bundle, access and 48 lesson IDs were not changed or repackaged. No new private test run is claimed.
- **Private accounts/admin:** unchanged and inactive, public login OFF; no real data, credentials, service provisioning, messages, migrations or Worker/backend deployment. Additional spending **$0**.

The owner's current short human-test list remains sufficient. If testing Docs review specifically, the useful distinction is whether the selected-comment and two-part directions are understandable; a whole-course repetition is not necessary.

## Publication

Fresh main and changed blobs are verified before updating main. Publication uses the existing validation and Pages workflows; a successful commit is not a live deployment. At the start of this batch, the previous Narrator update was still queued. Its validation/Pages runs subsequently succeeded, and its live teaching and session HTML matched `bcba4869`. This batch's final workflow/live-byte outcome is reported in the conversation.

## Official references checked October 5, 2026

- [Google Docs keyboard shortcuts](https://support.google.com/docs/answer/179738?hl=en&co=GENIE.Platform%3DDesktop): Windows image, review, comment and screen-reader mappings; selected-comment context; discussion/history overlap.
- [Collaborate and comment with a screen reader](https://support.google.com/docs/answer/6239410?hl=en): content versus discussion focus, comment anchors, replies, history, and the distinction between resolving a comment and accepting a suggestion.
- [Suggest edits](https://support.google.com/docs/answer/6033474?hl=en): proposals and review versus acceptance/rejection.
- [Edit drawings with a screen reader](https://support.google.com/docs/answer/6058689?hl=en): object selection and alt-text editing.
- [Footnotes](https://support.google.com/docs/answer/86629?hl=en): reference placement and pageless behavior.
- [Chrome keyboard shortcuts](https://support.google.com/chrome/answer/157179?hl=en): Shift+Escape Task Manager conflict and browser navigation keys.

Examples are original fictional teaching situations. The simulator does not edit a document, send comments, resolve discussions or approve suggestions in a real application.
