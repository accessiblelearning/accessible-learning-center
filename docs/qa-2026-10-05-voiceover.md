# Advanced VoiceOver teaching and Fn practice — October 5, 2026

Starting main: `ca245c8b0b687e1dbbeecb15ae12f055b8805993`. Read fresh main, AGENTS.md, the private Braille publication checkpoint and remaining-work notes. This batch continues independent public curriculum work while the owner prepares to test Safari/VoiceOver and Windows.

## Completed changes

- Reviewed and rewrote teaching for all **40 advanced Mac VoiceOver entries**, including **26 entries that previously used generic expanded explanations**. Added practical examples for text review and selection, current-item help, Quick Nav, notifications, Option-key commands, visual panels, tile visuals and the screen curtain.
- Clarified **32 short task prompts**, including the text-area requirement for arrow-based reading. Basic interface navigation remains distinct from advanced word/line review with the same keys. Detailed teaching remains in optional More explanation.
- Corrected reference links to the relevant Apple instructions, including the important distinction between currently displayed notifications and older notifications, and between the on-screen braille panel and a physical display.
- Preserved the main **60-command course** and the **24-task reading/settings** and **36-task navigation/web** routes, including their existing key combinations, order, input modes, stage boundaries and complete coverage. The focused route membership now uses stable task keys and original stage context rather than descriptive wording or reference URLs.
- Reproduced and fixed a scoring defect: the expanded Mac course rejected the documented no-Fn version of a function-key command even in the builder. **11 reviewed Fn commands** now accept the builder form with or without Fn, reflecting the Mac's function-key setting. Other missing or extra modifiers still cause an incorrect attempt. Ordinary letter commands do not gain this exception.
- When separate-key practice reaches Fn, visible and spoken help now directs the learner to Build the command if Fn is not detected. Existing separate-key practice remains the default, and the builder does not execute a real system command.

## Verification

- **150 public tests pass**, up from 147: `node --test --test-isolation=none tests/*.test.mjs`.
- Three new regressions cover curriculum identity and contextual meaning, all 11 Fn variations with wrong-modifier rejection and recovery, and the Fn fallback with Control repeat, Tab escape and semicolon recognition. The three targeted checks failed before implementation and pass afterward.
- Compared all three published Mac routes with the previous main: shortcut identities, input modes, stage order and command steps are identical.
- `node tests/validate-site.mjs` passes: **408 pages, 58 manuals, 300 lessons and 30 final quizzes**, plus the existing privacy and content checks. `git diff --check` passes.
- Chromium completed the full 60-task course and both focused routes, **120 tasks total**, using separate physical key events and the visible builder. It checked both Fn variants, VO and Caps Lock builder modifiers, wrong input and recovery, Control repeat, Tab out of capture, keyboard-opened disclosures, automatic advance, stage/completion speech requests, result focus and Escape.
- The main and navigation routes used recorded site-speech requests; the reading/settings route used own-screen-reader mode with no site-speech requests. This verifies website requests and live text, not real screen-reader audio.
- Two narrow **390×844** checks covered the Fn fallback and expanded screen-curtain teaching. Scoped Axe WCAG A/AA scans reported no violations or horizontal overflow. Screenshots were inspected and no browser JavaScript errors occurred.
- `tests/browser-voiceover-course.mjs` preserves the focused browser regression. It uses existing local tooling, fictional session activity and no external service connections.

These are controller and Chromium webpage checks. Actual macOS, Safari, VoiceOver, JAWS, NVDA, screen curtain operation and physical function-key behavior were not tested. Default commands are checked against Apple's documentation; customized key assignments may differ.

## Other workstreams and remaining work

- **Command Practice:** this advanced Mac section is reviewed. Remaining application/screen-reader sections, fuller basic/intermediate examples and dedicated Fusion speech/layout teaching remain follow-up work.
- **Topic Missions:** unchanged in this batch. Existing IDs 0–23 remain stable; append new missions at 24 onward. Additional scenario variety and recovery branches remain future work.
- **Private Braille:** preview 24 and its privately persisted source are unchanged. The earlier 71-test private result is not presented as a new test run here. Continue with the owner's brief narration/entry/recall checks before broader pacing refinements.
- **Keyboarding/quality:** the three independent 50-lesson paths, scores, certificates and stored progress are unchanged and covered by the public suite. Physical reach and comfort remain the owner's short device checks.
- **Private accounts:** no account source, previews, tests, data, imports or backend were changed or published. Login remains off. The private scaffold still needs provider integration, synchronization, reporting/import work and explicit release authorization.

No additional hands-on checklist is required. During the planned Mac testing, note whether a failure occurs with VoiceOver on, off, or both, and record the exact keys and current prompt.

## Publication and boundaries

This checkpoint accompanies validated public teaching/controller changes and regressions. Use the containing GitHub commit and its validation/Pages workflows as the publication record; actual workflow completion and live asset comparison are reported in the conversation. No Worker code changed or was deployed. No private source, account previews, access codes or student records are included.

Additional spending remains $0. No provisioning, billing, invitations, messages, account activation or new automations.

## Official references checked October 5, 2026

- [Apple VoiceOver general commands](https://support.apple.com/guide/voiceover/general-commands-cpvokys01/mac) — help, modifier lock, status, utility and general controls.
- [Apple VoiceOver text commands](https://support.apple.com/guide/voiceover/text-commands-cpvokys06/mac) and [reading text](https://support.apple.com/guide/voiceover/vo2706/mac) — interacting with text, reading units and context-dependent arrows.
- [Selecting text](https://support.apple.com/guide/voiceover/mchlp2741/mac) — selection tracking and the start/navigate/stop sequence.
- [Function-key behavior](https://support.apple.com/guide/voiceover/mchlp2685/mac) — default Fn usage and the standard-function-key setting.
- [Learning and help](https://support.apple.com/guide/voiceover/mchlp2687/mac), [Quick Nav](https://support.apple.com/guide/voiceover/vo27943/mac), and [command customization](https://support.apple.com/guide/voiceover/vo14096/mac) — help tags, usage hints, tutorials and alternative input methods.
- [Notifications](https://support.apple.com/guide/voiceover/vo082d92ca69/mac) and [verbosity](https://support.apple.com/guide/voiceover/mchlp2703/mac) — available notifications and spoken detail.
- [Braille and caption panels](https://support.apple.com/guide/voiceover/unac078/mac), [tile visuals](https://support.apple.com/guide/voiceover/vo15626/mac), and [screen curtain](https://support.apple.com/guide/voiceover/vo2726/mac) — visual aids and their operation/recovery.

Teaching examples are original fictional practice situations. They do not imply that this webpage controls VoiceOver, Mac settings or a physical braille display.
