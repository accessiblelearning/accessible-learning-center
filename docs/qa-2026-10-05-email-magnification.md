# Email and magnification teaching — October 5, 2026

Starting main: `d8e5dd431ba0302b8c70e84595d03fb2f2163ea8`. Read fresh main, AGENTS.md, the latest overnight checkpoint and remaining-work notes before editing. This is a focused public curriculum batch while the owner prepares for short hands-on tests.

## Completed changes

- Rewrote the optional expanded teaching for all **36 Thunderbird email commands** and **23 ZoomText/Fusion-course commands**. Each of the 59 entries now has its own practical explanation rather than a shared generic paragraph. Short prompts and optional More explanation remain separate.
- Thunderbird prompts distinguish the Mail window, message list and compose window where necessary. Examples cover drafts versus saved message files, thread selection versus attachments, global search versus inserting a link, conversation view versus pasted quotations, replies, mail filing, queued mail and contacts.
- Magnification teaching distinguishes the text cursor, keyboard focus and mouse pointer. The prompts describe enhancement toggles accurately, identify Desktop layout, and explain the prerequisites for Smart Invert.
- All 14 advanced speech/Say prompts identify **ZoomText Reader** explicitly. Fusion uses JAWS speech and has layout-specific bindings; the course no longer relies on the optional explanation to identify the Reader context. This is not a new Fusion speech course.
- All seven layered Say exercises now have a distinct goal for entering layered commands, choosing the Say group and requesting the final item. Repeat follows the current step. A wrong key does not erase an already completed layer or award early credit.
- Kept the same 36 and 23 commands, shortcut sequences, input modes, order and basic/intermediate/advanced stages. There were no duplicate keys within either reviewed course to remove. No command coverage was removed.

## Verification

- **142 public tests pass:** `node --test --test-isolation=none tests/*.test.mjs`.
- Three added regressions cover curriculum identity/context, both complete reviewed courses with spoken stage requests, and all seven Say sequences with wrong-key recovery/current-step repeat/scoring.
- Site validator passes: **408 HTML pages, 58 manuals, 300 lessons and 30 final quizzes**, including the existing private/public boundary checks.
- Chromium completes all **59 reviewed commands** using their native or separated-key input. Optional explanations start closed, open correctly, and the results receive focus and request a completion announcement.
- Two expanded-explanation layouts pass narrow-screen checks at **390×844**, with no horizontal overflow and no detected WCAG A/AA violations in the scoped Axe scans. Screenshots were visually inspected.
- The existing browser regression harness also passes Word Undo→Save, missions 13–22 and protected Excel Paste Special practice. No browser JavaScript errors were observed.
- The browser speech stub now exposes its utterances so this check can deliver the `end` event and verify advance after spoken confirmation. Its initial failure was a test timing assumption (using the voice-off delay in a voice-on session), not evidence of a production stall.
- `git diff --check` passes.

These are website/controller and Chromium checks. Actual Thunderbird, ZoomText, Fusion, JAWS, NVDA, VoiceOver, Safari, braille hardware and physical one-handed operation were not tested. Shortcut facts were checked against official documentation; this does not certify every application or customized keyboard layout.

## Workstream boundaries and remaining work

- **Command Practice:** this pair of courses is reviewed. Other advanced screen-reader/settings and unreviewed application sections remain. A complete dedicated Fusion speech course and its layout choices need separate review.
- **Topic Missions:** no new missions in this batch. Existing IDs 0–22 and progress remain stable. Branching decisions and alternative valid solutions remain future work.
- **Private Braille:** no changes to preview 23, its encrypted payload, source archive or 48 lesson IDs. Longer-term recall spacing and word/sentence difficulty review remain.
- **Keyboarding/quality:** all three 50-lesson paths and existing progress are unchanged and remain covered by the full suite. The owner's planned physical comfort and device checks remain useful; no additional whole-site manual test is requested.
- **Private accounts:** no source, previews or data were changed or published. Login remains off. Stable curriculum mapping, session history and future synchronization work remain private/inactive; this batch does not build or activate an account service.

No spending, service provisioning, account activation, real student-data access, messages or Worker deployment.

## Official references checked October 5, 2026

- [Thunderbird keyboard shortcuts](https://support.mozilla.org/en-US/kb/keyboard-shortcuts-thunderbird) — Windows commands and focus-dependent meanings.
- [Thunderbird Quick Filter](https://support.mozilla.org/en-US/kb/quick-filter-toolbar), [global search](https://support.mozilla.org/en-US/kb/global-search) and [archives](https://support.mozilla.org/en-US/kb/archived-messages) — search scope and message organization.
- [ZoomText hotkeys](https://www.freedomscientific.com/training/zoomtext/zoomtext-hotkeys/) — magnification, Reader and layered Say sequences.
- [ZoomText User Guide](https://support.freedomscientific.com/content/documents/manuals/ZoomText/ZoomText_User_Guide_English_US.pdf) — enhancements, Smart Invert prerequisites, smoothing and speech/echo features.
- [ZoomText getting started](https://support.freedomscientific.com/Services/TrainingAndCertification/ZoomTextGettingStarted) — voice rate and echo modes.
- [Fusion hotkeys](https://www.freedomscientific.com/training/fusion/hotkeys/) — JAWS speech and Desktop/Laptop distinctions.

## Publication

Use the existing Pages workflow after a fresh-main check and verification of every changed Git blob. Record actual commit, workflow and live-asset results in the conversation. Pages publication does not deploy the Worker. No account or private Braille source belongs in this batch.
