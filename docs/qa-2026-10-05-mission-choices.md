# Mission choices and advanced NVDA teaching — October 5, 2026

Starting main: `5c1a224f88c38d81fc64032b2d3d85de715dd232`. Read fresh main, AGENTS.md, the email/magnification checkpoint and remaining-work notes before editing. This batch continues public curriculum work while the owner prepares for short device checks.

## Completed changes

- Added **one Word mission, ID 23**, “Save your notes when leaving Word.” It models an existing local document with AutoSave off and a report window behind it. Learners can save then close, or close then activate Save in the simulated dialog. Both routes protect the notes and return focus to the report.
- Added per-attempt mission branches and state-specific shortcut alternatives. Repeat, hints, error feedback, completion and the mastered-command list follow the route actually used. Retry clears the route. The new mission has two milestones on either route; this is a bounded simulation, not a complete Word dialog emulator.
- The original Word Undo→Save mission now accepts Shift+F12 as well as Control+S for saving. The Chrome source-address mission accepts Control+L, Alt+D or F6 from its stated article-content context. These alternatives do not become equivalent commands in other states. Protected plain-final-key input remains available.
- Fixed a modifier-scoring defect: after arming a screen-reader modifier, an extra Meta or Shift key could previously be ignored when interpreting the next key. Those different commands no longer receive credit.
- Replaced generic teaching in all **19 advanced NVDA entries** with original context and examples. Clarified existing-selection boundaries versus new review markers, first-press selection versus second-press copying, return to the marked start, Desktop layout, settings categories, saving configuration and one-press recovery versus the three-press factory reset.
- Preserved the complete **93-command NVDA course**, its shortcut identities, ordering, input modes and basic/intermediate/advanced progression. Main prompts remain short; longer teaching stays in optional More explanation.
- Preserved mission IDs **0–22** and existing completion history; the new mission is appended at **23**. The Word topic menu exposes it without replacing the earlier recovery mission.

## Verification

- **147 public tests pass:** `node --test --test-isolation=none tests/*.test.mjs` (previous batch: 142).
- Five new regressions cover state-specific alternatives, both branches with current-state speech/repeat/hints/recovery/progress, route reset and held-key handling, modifier scoring, and NVDA curriculum identity/meaning. Existing complete-course scoring tests now also exercise all 93 NVDA commands through the production teaching layer.
- Site validator passes: **408 HTML pages, 58 manuals, 300 lessons and 30 final quizzes**. Mission validation now checks branch steps and duplicate or missing alternative commands, in addition to the existing access-boundary checks.
- Chromium completes both Word routes with site voice on and off, handles wrong input without changing the state, repeats the current prompt, gives the appropriate hint, permits Tab out of capture, focuses completion, and retries successfully using the other route. Native Chrome address shortcuts and Word Shift+F12 also pass.
- Chromium completes all **93 NVDA commands** with separated keys, correct scoring, optional explanations, requested stage/completion speech and results focus. The existing Thunderbird, magnification, earlier missions and Excel Paste Special browser checks still pass.
- New narrow-screen checks at **390×844** cover the Word save dialog state and expanded NVDA selection explanation. No horizontal overflow or scoped Axe WCAG A/AA violations were detected. Both screenshots were visually inspected. No browser JavaScript errors were observed.
- The initial browser retry check tried to click a button inside closed Review mission details. The harness now opens that disclosure with Enter before retrying. This was a test-navigation error, not a production mission failure.
- `git diff --check` passes. Runtime asset query versions are updated for the changed mission controller, catalog and teaching layer.

These are website/controller and Chromium checks, including inspected speech requests. Actual Word, Chrome desktop UI, NVDA, JAWS, VoiceOver, Safari, braille hardware and physical one-handed use were not tested. Official documentation verifies shortcut facts; customized layouts and real assistive-technology interactions still need device feedback.

## Workstreams and remaining work

- **Command Practice:** this advanced NVDA section is reviewed. Other NVDA stages, remaining screen-reader/application explanations and dedicated Fusion speech/layout teaching still need review. The existing whole-course coverage is retained.
- **Topic Missions:** the first explicit choice of routes is implemented and tested. More varied and longer scenarios, including cancellation/recovery paths, remain future work. Future missions must append after 23; account mappings must eventually include this ID too.
- **Private Braille:** no edits or publication in this batch. Preview 23, its private source/archive, encrypted payload and 48 IDs remain unchanged. Longer-term recall spacing and word/sentence difficulty remain follow-up work; the earlier 68-test private result was not rerun here.
- **Keyboarding/quality:** all three separate 50-lesson paths and their saved progress are unchanged and covered by the public suite. Physical reach and comfort still need the owner's planned short checks. No additional full-site test assignment is requested.
- **Private accounts:** no account source, previews or data changed or published. Public login remains off. Private session-history, import, synchronization and stable curriculum mapping work remain unfinished. This batch does not activate or finish an account system.

## Publication

This checkpoint accompanies the validated public changes. Use the containing GitHub commit and its validation/Pages workflow runs as the publication record. Pages publication and live asset checks are reported in the conversation after they complete. No Worker code changed and no Worker deployment is part of this batch.

No spending, provisioning, billing, real account/student-data access, messages or new automations.

## Official references checked October 5, 2026

- [Microsoft Word keyboard shortcuts](https://support.microsoft.com/en-us/accessibility/word/keyboard-shortcuts-in-word) — Control+S and Shift+F12 save.
- [Saving and recovering Office files](https://support.microsoft.com/en-us/office/collab-files/save-back-up-and-recover-a-file-in-microsoft-office) — saving, AutoSave context and closing an unsaved file.
- [Chrome keyboard shortcuts](https://support.google.com/chrome/answer/157179?hl=en) — address bar and web-content focus commands. F6 is interpreted only in the mission's stated focus context.
- [NVDA commands reference](https://download.nvaccess.org/releases/stable/documentation/en/keyCommands.html) and [NVDA User Guide](https://download.nvaccess.org/releases/stable/documentation/en/userGuide.html) — current pages identify NVDA 2026.2; Desktop review commands, selection markers, settings categories and configuration recovery.

The named files, window arrangement and already-focused Save button in mission 23 are explicit fictional scenario assumptions. They do not promise a universal default focus in every real Word dialog.
