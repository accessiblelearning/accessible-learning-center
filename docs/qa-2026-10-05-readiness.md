# Learning-site readiness continuation — October 5, 2026

Base: `aac5f5b58f07a5683c79442e7475ffec392c64ff`. Read current main, AGENTS and remaining-work notes first; no intervening remote main change was observed during preparation. This is a focused readiness pass, not a claim that every curriculum expansion or account-launch task is complete.

## Command Practice — completed in this public batch

- Replace the remaining **74 NVDA basic/intermediate explanations** with command-specific context and examples. Together with the earlier 19 advanced entries, all **93 tasks** now have distinct reviewed teaching.
- Clarify Desktop layout/Insert assumptions, Word/Outlook-only sentence movement, editing versus review cursors, current-cell versus whole-table reading, automatic versus locked focus mode, safe remote/log behavior and version-dependent magnification.
- Preserve all 93 command identities, stages, protected input and scoring. The repeated Find task is explicitly labeled recall rather than implying a different command. Short prompts remain short; expanded teaching stays under More explanation.
- Official sources checked October 5: [NVDA 2026.2 key commands](https://download.nvaccess.org/releases/stable/documentation/en/keyCommands.html) and [NVDA user guide](https://download.nvaccess.org/releases/stable/documentation/en/userGuide.html). These are shortcut references, not evidence of real NVDA usability testing.
- Unit regression preserves task identities and checks important context distinctions. Chromium completes all 93 tasks with voice enabled and disabled, with a deliberate mistake, repeat, recovery, Tab exit, spoken stages, completion focus and correct totals. Expanded teaching remains optional and collapses on the next task. Three expanded-explanation narrow-screen Axe checks pass.

Remaining: broader Word/Excel/PowerPoint/Docs teaching and progression review, the four previously identified Narrator notes, and feedback-driven refinements. Existing full-course completion tests are not a substitute for editorial review of every explanation.

## Topic Missions — verification, no new scenarios

The full public suite continues to exercise existing mission scoring, wrong-state recovery, current-step repeat, saved completion and focus flows. Stable mission IDs 0–24 remain unchanged. No shallow filler missions were added. Actual assistive-technology focus and audio remain device checks; further scenario variety is optional curriculum work, not claimed complete.

## Private Braille — tested locally, release held

The verified current private source matched deployed preview 24 before editing. A reproduced delayed-timer problem is fixed locally: late cells cannot extend timed scoring, saved duration is capped and old callbacks cannot end a new session. All **73 private tests** and encrypted Chromium checks pass, including 1/3/6-minute modes in both entry methods, hints, visible typed letters, pause/resume and access closure.

**Do not publish preview 25 yet.** Attempts to replace the matching private source archive failed during file transfer; the identified saved archive remains version 24. Local updated source/archive and encrypted payload are retained privately, but durable replacement is not confirmed. Keep the live preview at 24 until the matching private archive can be safely persisted. No access code, private source or private tests belong in this repository.

## Keyboarding and site quality — completed checks and one layout fix

- The three independent 50-lesson paths and all 150 simulated completions pass existing regressions. Whole-keyboard coverage, selected-hand cues, separated history, timing, WPM/accuracy, storage failure and restart isolation remain preserved.
- New `tests/browser-readiness.mjs` scans **all 408 public HTML pages** locally at 390×844, with external requests blocked. It checks initial-state reflow, uncaught browser errors and Axe WCAG 2 A/AA plus 2.1 AA rules.
- The first completed scan reproduced one horizontal overflow in the optional adventure prototype: its tall aspect ratio computed a box wider than the screen. An explicit width/min-width fixes it without changing the rest of the site.
- The complete rescan reports **zero horizontal overflows, zero uncaught errors and zero detected scoped Axe violations** across those 408 initial pages. This is not an audit of every dynamic state or a guarantee of accessibility compliance.
- Full public suite: **193 tests passed**. Site validator: **408 pages, 58 manuals, 300 assessed lessons, 30 quizzes**. Existing certificate and anonymous-progress tests pass. `git diff --check` passes.

## Private accounts — local/inactive only

Privately tested dated speed/accuracy imports, appended mission mapping and safer comparable-mode trend calculations. **20 local tests** plus fictional-preview browser checks pass. No private source, migrations, previews or records were put in this public batch. Saving the updated private archive also failed; its local changes are not a deployed or finished account system. Public login stays OFF. Provider integration, connected reports, sync, recovery, pagination, privacy/security work and explicit owner launch authorization remain required.

## Publication and boundaries

Public publication candidates are NVDA teaching, the scoped layout fix, public regressions and these notes. No Worker/backend deployment, production migration, service provisioning, real account/student operation or spending occurred. Private Braille release is held, as above. Check GitHub validation/Pages and live asset bytes separately before reporting these public changes as live.

## Small human test set

1. **One-hand typing:** one short lesson per hand, then a capital/symbol exercise. Check comfort, Shift guidance, focus, spoken feedback and separate saved WPM/accuracy.
2. **Braille preview 24:** warm-up; a word-recall miss three times then correct it; confirm letters/dots, repeat, pause and Escape. The unpublished deadline fix is not yet on the live preview.
3. **Topic Missions:** Word Undo then Save; repeat after advancing and try one wrong command. Check the new state and next action are clear.
4. **Safari/VoiceOver and Windows screen reader:** one short representative flow each; report missing/overlapping speech, lost focus or keys intercepted by the system.

These are Chromium automation and recorded speech-request checks only. Actual Safari, JAWS, NVDA, VoiceOver, braille hardware and physical one-handed usability were not tested here.
