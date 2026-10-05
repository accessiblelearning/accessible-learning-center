# Keyboard restart and mission-progress retention — October 5, 2026

Base: `f1a4018631f315655bc97c8d97a221ce7f744b90` (179 public tests). This batch follows the Firefox and lesson-record fixes; it does not repeat them.

## Keyboarding: reproduced and fixed

After the last correct character, the controller waits 220 ms before showing results. If the learner pressed Escape and opened another session during that interval, the old completion callback used the new global session. It could finish the new session immediately and save a zero-character result.

The callback now belongs to the session that scheduled it and acts only if that same session remains active. Regression coverage reproduces the failure on the prior implementation and checks both-hand, left-only and right-only paths. A normal completion still saves exactly one result, scores 100% for correct input and focuses the next action. Existing 50-lesson curricula, hand prefixes, opt-in saving, thresholds and timing are unchanged.

## Topic Missions: reproduced and fixed

- A mission page read completed IDs only when opened. Completing another mission in a different tab, then finishing the older page, overwrote the newer completion. Saving now reads and merges valid existing IDs before writing the local list.
- Storage failures were silently discarded. Completion now includes a visible save warning and a site-voice request; the focused next-action button describes the warning for personal screen-reader users. Finishing, reviewing and continuing remain available. A later successful completion can retain the pending results from this visit and clears the warning.
- Malformed completion lists still recover; only integer mission IDs in the current catalog are retained. Stable IDs 0–24 and all scenario content remain unchanged.

This remains browser-local storage. The read/merge/write fix handles the reproduced older-tab snapshot case; it is not cross-device synchronization or a transactional account backend.

## Validation

- `node --test --test-isolation=none tests/*.test.mjs`: **183 passed**, four new regression tests.
- `node tests/validate-site.mjs`: **408 pages, 58 manuals, 300 lessons and 30 quizzes** validated.
- `tests/browser-keyboard-restart.mjs`: actual Chromium key events and a controlled clock reproduce rapid exit/restart across all three hand paths, then verify ordinary completion, one saved result, accuracy, focus and speech requests. No unexpected JavaScript errors.
- `tests/browser-mission-progress.mjs`: two Chromium tabs sharing a fictional local history retain newer completions; a blocked write shows and requests speech for the warning without blocking results. Site-voice on/off, personal-reader description association, retry, warning removal, completion counts and Escape return pass.
- Mission warning at 390 × 844: no horizontal overflow, no scoped Axe WCAG A/AA violations; screenshot visually inspected.
- `git diff --check` clean. External browser requests are blocked in these tests; no real learner records are read or written.

## Other workstreams and boundaries

- Command Practice: latest Firefox improvements retained; no new curriculum changes here.
- Private Braille: unchanged. No private source, encrypted package or preview access edited.
- Accounts/admin: unchanged, private and inactive; public login OFF. No service provisioning, billing, email, migration or Worker/backend deployment. Additional spending $0.
- Actual Safari, JAWS/NVDA/VoiceOver, physical one-hand comfort and Braille hardware remain unverified. Automated speech-request checks are not listening tests.

## Publication and remaining work

Prepared for the existing GitHub Pages workflow after fresh-main and changed-blob checks. Actual commit, workflow and live-byte verification are reported in the conversation. A Git commit alone is not a completed deployment.

Remaining curriculum and device work is tracked in `remaining-work.md`. These defects need no extra owner preparation. When doing the planned short device checks, ordinary lesson completion/restart and one Topic Mission are sufficient to check speech and focus; there is no need to manufacture storage failures manually.
