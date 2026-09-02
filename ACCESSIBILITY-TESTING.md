# Accessibility testing checklist

Use this checklist after navigation, forms, lessons, quizzes, progress, or Practice Lab changes. Test at 100% and 200% zoom and with dark mode, high contrast, and reduced motion.

## Keyboard-only checks

- Tab and Shift+Tab follow a predictable order and never trap focus.
- Enter and Space operate buttons, links, summaries, checkboxes, and quiz choices.
- Visible focus is always present and is not hidden by scrolling or overlays.
- Course filters, expand/collapse controls, lesson completion, and Practice Lab controls work without a mouse.
- Status and error messages are announced and focus moves only when necessary.

## Windows screen readers

Repeat core tasks with current JAWS, NVDA, and Narrator releases:

- Navigate by headings, landmarks, links, buttons, fields, lists, and tables.
- Confirm every control announces its name, role, state, and instructions.
- Filter the Lessons page and expand one course.
- Mark a lesson complete, undo completion, and confirm both status messages.
- Filter the Progress page and use Show only courses I started.
- Complete and review a quiz, then create and print a certificate.
- Run the Practice Lab and verify correct, incorrect, repeated, and missed-command feedback.

## iPhone VoiceOver and Safari

- Swipe through the page in a logical order and use the rotor for headings, links, form controls, and landmarks.
- Confirm course summaries announce expanded or collapsed state.
- Change accessibility settings and verify readable light and dark themes.
- Filter courses, mark and undo completion, and reload to confirm the saved state.
- Confirm controls remain usable at the largest supported text size without horizontal page scrolling.

## Braille display checks

- Confirm control names, states, status changes, and validation messages appear in braille.
- Verify panning and cursor routing do not skip content or move focus unexpectedly.
- Check that contracted or computer braille does not make command names ambiguous.
- Device-specific chords that a webpage cannot capture must remain learn-only.

Record the browser, operating system, screen reader, version, result, and any regression for each test session.
