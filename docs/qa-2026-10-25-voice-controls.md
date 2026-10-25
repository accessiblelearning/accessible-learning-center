# Topic announcements and optional typed-key speech — October 25, 2026

Base main: `0c103ca88b7932ad82e18d5faa86afbb1cdfdb17`. Read current source, AGENTS and the latest QA checkpoint before editing.

## Behavior

- Command Practice starts with site voice when no speech choice has been saved. An explicit My screen reader choice stays off. Its initial voice choice is remembered so display controls do not silently reset it.
- Enabling voice returns focus from the toolbar to the selected topic. Down/Up Arrow read the selected topic; Home/End also repeat the label when already at that boundary. A paused speech engine is resumed before topic announcements. Modified assistive-technology shortcuts pass through.
- Keyboarding Settings includes **Speak each key I type**, off by default and remembered on this browser. Its explanation is visually hidden, associated using `aria-describedby`, and spoken on focus. The button exposes its On/Off state.
- With site voice enabled, typed letters, capitals, numbers, spaces and punctuation are spoken in lessons, copy practice and free typing. Mistakes name the actual input before the existing correction. Typed characters queue in order through group transitions and completion. Escape, voice-off and ordinary control actions interrupt the queue. No typing speech is added to login fields or elsewhere on the site. Paste, deletions and control shortcuts are not treated as typed letters.
- The public and signed-in Keyboarding sources receive focused corresponding changes independently. This public commit contains no private course, account or admin source/data.

## Verification

- Public Node suite and site validator pass. Two new menu regressions cover first-visit voice, preservation of an explicit own-reader choice, toolbar focus and boundary announcements.
- `tests/browser-command-topic-voice.mjs` checks every topic with native Chromium arrow input, Up/Home/End, modified shortcuts, voice-off live-region updates, persistence, blocked storage and voice handoff to practice.
- `tests/browser-typed-key-voice.mjs` uses real keyboard/input events and a controllable speech queue. It covers default Off, focus help, all three hand modes, wrong input, rapid queued characters, whole-lesson completion, free typing, named spaces/capitals/numbers/punctuation/newlines, Escape/voice-off, persistence and unavailable storage.
- These are Chromium behavior and simulated speech-queue checks, not actual audible speech, Safari, JAWS, NVDA, Narrator or VoiceOver verification. The owner should listen on the device used for learning.

Existing curriculum, scoring and access boundaries are retained. Deployment must be checked on the containing commit before reporting live availability.
