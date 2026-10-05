# Lesson-record validation — October 5, 2026

Base: `214e5681baf18624b90a74772b3a44262a33532b`, after the Firefox review. This batch adds three regressions to the 176-test baseline.

## Reproduced and fixed

The lesson-completion widget, course catalog and final-quiz readiness check converted a received lesson number with `Number(...)` before checking its type. A malformed record containing `true` or `[1]` therefore counted as lesson 1. With valid lessons 2–10, the final quiz unlocked despite the missing valid lesson-1 record. The course list could skip lesson 1 and mark a course as started based only on invalid records.

All three affected consumers now require a number or numeric string. The catalog also applies integer/range checks before both completion counting and Started courses filtering. The lesson widget and quiz retain their existing number equality/range checks. Valid legacy numeric strings, submitted/completed status, duplicate suppression and in-progress records remain supported. No source records are rewritten or deleted.

Three tests reproduced the incorrect counts/unlock before the fix and pass afterward. Cases include booleans, arrays, null/object/empty values, out-of-range/fractional numbers, valid numeric strings and duplicate records. This is data-integrity validation of the existing anonymous Student ID flow; Student IDs still do not establish secure account ownership.

## Verification

- Full public test suite: **179 passed**.
- Site validator: **408 pages, 58 manuals, 300 lessons, 30 quizzes** passed.
- Fictional-data Chromium checks: invalid lesson numbers cannot unlock the quiz, change the next unfinished lesson, or falsely mark lesson 1 complete. Valid string lessons 2–10 still count as nine completions.
- Existing storage-recovery browser checks also passed for late responses, changed IDs, settings, menus, saved-score display and scoped narrow-layout/Axe checks. No real progress API requests or student records were used.
- `git diff --check` clean.

## Scope and publication

Only public progress consumers/tests/notes changed. Public curriculum, all three 50-lesson typing paths, missions 0–24, quiz pass thresholds, certificates and anonymous practice are preserved. Private Braille and private/inactive accounts are unchanged. No paid services, identity activation, migration or backend/Worker deployment; $0 additional spending and public login OFF.

Validated changes are intended for the existing Pages workflow after fresh-main/blob checks. The conversation records actual workflow and live-byte results; a commit alone is not deployment. Real Safari/JAWS/NVDA/VoiceOver, physical one-handed use and Braille hardware remain unverified.

## Remaining work

Continue the curriculum and focused device checks listed in `remaining-work.md`. There is no need for the owner to manufacture malformed records or retest every course. A normal complete-lesson → course list → final-quiz check is sufficient when doing a short human test.
