# Curriculum and accessibility verification — October 2026

This is a **pre-human-test checklist**, not a claim that these checks have passed. Keep changes on this branch until reviewed; do not change the approved logo or header.

## P0: one-handed typing
- [ ] Left-hand-only: 50 progressive lessons teaching **all** keys with only the left hand, not just the left half.
- [ ] Right-hand-only: 50 progressive lessons teaching **all** keys with only the right hand, not just the right half.
- [ ] Each mode handles Shift, punctuation, numbers, corrections, accuracy and WPM.
- [ ] Lesson content never uses a key before introducing it.
- [ ] Restarting and switching modes does not corrupt student progress.

## P0: keyboard and assistive technology
- [ ] Every interactive element has a visible focus indicator, accessible name and keyboard action.
- [ ] Tab, Shift+Tab, Enter, Space and Escape behave predictably.
- [ ] Lesson speech does not talk over JAWS/NVDA/VoiceOver; built-in voice can be disabled.
- [ ] Correct/incorrect feedback is available as text, not sound or color alone.
- [ ] High contrast, dark mode, text zoom and reduced motion work on every learning page.
- [ ] No global shortcut hijacks screen-reader or browser keys.

## P1: curriculum and learning integrity
- [ ] Mission Control command descriptions are accurate, including Chrome.
- [ ] Braille Center: narration, Louis Braille content, Grade 1/2 sequencing and assessments.
- [ ] Quizzes adequately sample each course's learning objectives and explain wrong answers.
- [ ] Certificates are only available after verified passing results.
- [ ] Manuals are complete, keyboard-first and identify version-dependent commands.

## P1: account and privacy
- [ ] Invitation links, first login, returning login and sign-out.
- [ ] Student A cannot see student B's progress.
- [ ] Progress persists as intended across sessions and devices.
- [ ] Confirm intentionally paused uploads remain disabled until explicitly re-enabled.

## Regression and release gate
- [ ] Automated tests pass after each change.
- [ ] Two invited friends complete hands-on tests this weekend; capture device, browser, screen reader, blocking issue and reproduction steps.
- [ ] Resolve blocking issues before wider invitation rollout.

## Documentation finding
The current README describes 25 courses with five-question final quizzes. The stated goal is more comprehensive, harder quizzes; confirm actual implementation before marking that requirement complete. The README also documents paused uploads, which should not be silently re-enabled.
