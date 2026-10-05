# Keyboarding session results — October 5, 2026

Starting main: `2146ba8aa50472dc4bf5e0f01a76480a76a69216`. Read fresh main, AGENTS.md and current remaining-work notes. This changes existing browser-local keyboarding statistics, not private accounts/admin.

## Changes

- My Stats now offers an accessible Recent practice results disclosure with the latest 10 sessions for the selected hand path, newest first. Each row pairs date/time, lesson, practice mode, WPM, accuracy and duration.
- Best copy-practice and free-typing speeds are separate. Free typing is labeled gross WPM and accuracy not assessed. Previously the best-speed statistic mixed both measures.
- Missing metric values display as unavailable rather than fabricated zero scores. Copy accuracy excludes free typing and invalid percentages.
- The display explains comparison of like lessons/modes and the existing browser-local retention of up to 100 sessions across all paths. No storage format, retention limit, opt-in, lesson, gate, score calculation or progress identifier changed. Viewing history does not rewrite storage.

## Validation

- **155 public tests pass** (`node --test --test-isolation=none tests/*.test.mjs`), including the new history regression: newest-first/10-row limit, speed distinction, paired accuracy, missing values, all hand paths, empty results and unchanged stored records.
- The keyboard fixture's old Date-only-now stub was updated to a Date subclass so the production timestamp formatter can run. Initial failures were from that fixture limitation.
- `node tests/validate-site.mjs` passes: 408 pages, 58 manuals, 300 lessons and 30 final quizzes; existing boundaries retained.
- Chromium `tests/browser-keyboard-stats.mjs` uses only fictional records. It checks speed separation, rows, Enter-operated disclosure, unchanged storage and Escape back to the center. At 390×844, no horizontal overflow or scoped Axe WCAG A/AA violations; full-page screenshot inspected. No JavaScript errors.
- `git diff --check` passes. Runtime controller query version updated.

## Remaining and boundaries

This makes existing saved attempts visible; it is not cross-device progress, an administrator report or a statistical improvement trend. Compare like practice modes/lessons; formal trend reporting and imports remain private account work. Existing 50-lesson paths, private Braille preview 24, Command Practice and 25 Topic Missions are unchanged. Actual Safari, screen-reader speech, physical one-handed use and Braille hardware still need device feedback. No additional testing assignment for the owner in this batch.

No costs, services, real learner records, account activation, Worker deployment, messages or automations. Public login stays off and account source stays private. Publication is recorded by the containing commit and its validation/Pages workflows; live verification follows deployment.
