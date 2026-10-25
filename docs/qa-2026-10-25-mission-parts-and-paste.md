# Mission titles and Control+Alt+V — October 25, 2026

Base main: `c8045aeab79419e79c6712df8e670472df554a77`. Current main, AGENTS and the latest voice-controls QA note were reviewed before editing.

## Changes

- The eleven Excel Paste Special sequences previously required each key separately and rejected the held Control+Alt+V combination. They now accept both methods. A held combination is credited only after all keys are released, so its V cannot also choose the next dialog option. Extra modifiers, repeats and lost focus cannot skip steps. Other protected commands keep their existing input rules. The prompt describes both supported methods, and the command builder remains available.
- The Excel topic mission recognizes physical V when a Mac Option combination reports a symbol in `event.key`. Its existing plain-V simulation alternative remains available. This does not change or control a real Office application or screen reader.
- The Topic Missions menu used only the text before the colon, making different exercises look identical. It now displays each full title and speaks the same title on focus.
- Related exercises are numbered in their existing introductory-to-applied order: Braille Displays 1–2 (reading, then review/correction), Chrome 1–2 (recover/keep a resource, then find/copy its address), VoiceOver 1–2 (menus, then groups), Excel 1–2 (repair a formula, then retain its value), Word 1–2 (recover/save an edit, then save/close choices), and PowerPoint 1–3 (slides, objects, then presenting). They remain independently openable.
- Content review found distinct scenarios, not duplicate copies of the same lesson. All 27 menu choices, existing mission IDs, reader-specific alternatives and saved-progress mappings are retained. JAWS, Narrator and NVDA versions are labeled as alternatives rather than numbered parts.
- Runtime asset query versions are updated on affected pages.

## Verification

- All **200 public Node tests** pass, including five new regressions for all eleven held Paste Special sequences, release gating/extra modifiers/focus loss, standalone Control+Alt+V tasks, the Mac-symbol topic input, and unique numbered labels with stable mission IDs.
- Site validator passes for **408 pages, 58 manuals, 300 lessons and 30 final quizzes**. `git diff --check` passes.
- `tests/browser-mission-parts.mjs` passes using native Chromium keyboard events. It exercises the standalone Excel command and all eleven dialog sequences with site voice on/off, both modifier orders and the separate-key alternative. It checks all 27 displayed/spoken menu labels, the unchanged Excel mission link, full mission completion and Escape restoring menu focus.
- Menu layout checks pass at 1100px, 390px, and 320px with 200% text. The menu screenshot was visually reviewed. No browser script errors were observed.
- Initial browser-test failures were selectors for nonexistent IDs in the test harness; the harness now uses the production results ID and menu `data-choice`. They did not require production behavior changes.

Speech is simulated in browser checks. Audible speech, Safari, real assistive technology and real Office shortcuts still need device testing. No private source, account data, real invitations, paid services or database changes are part of this public update. Verify Pages publication on the containing commit before describing it as live.
