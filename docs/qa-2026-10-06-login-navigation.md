# Invitation-only login navigation — October 6, 2026

Base: `0af83606ba2eb2e4fbb962ebad6d6c90e7998171`. Read current main, AGENTS, remaining-work and readiness notes before editing. The owner explicitly requested a **Login here** link at the far right of the website menu, pointing to her existing invite-only testing login.

## Public changes

- Add one ordinary link to the existing tester pilot at `https://accessible-learning-pilot.aaccessabilitylearningcenter.workers.dev/`. The link is last in the shared primary navigation and aligned right on wide screens; it occupies the right column on small screens.
- Keep the visible label short. Its accessible description and pointer tooltip say **Invitation only. Testing is in progress.** The matching visible sign-in notice is included in the separate private Worker update, not this Pages publication.
- Preserve current-page labels, skip link, focus styling, website settings, anonymous lessons, all three typing paths, stable mission IDs, progress and private Braille access. Visiting a public page does not load Clerk or contact the tester Worker.
- No authentication implementation, private account preview/source, provider keys, student data or access codes are included. Adding this link does not enable public registration or put existing lessons behind a paywall.

## Verification

- **193 public Node tests pass**; site validator passes for **408 pages, 58 manuals, 300 lessons and 30 quizzes**. `git diff --check` passes.
- Focused local Chromium check verifies the link destination/description, Tab order and visible focus, right-edge placement at widths 1440/1280/1024/768/390/320, targets at least 44px high, and no horizontal overflow including 320px with 200% text.
- Scoped Axe checks detect no navigation violations in light, dark and high-contrast modes after styling settles. An initial theme-switch check captured intermediate transition colors; checking settled styles resolves that test timing issue without a site CSS workaround.
- No uncaught browser errors or pilot/auth requests from the guest homepage. No credentials or real student records were used. This is not an actual Safari/VoiceOver/JAWS/NVDA test.

## Deployment boundary and next check

This public commit only changes navigation and its documentation. Verify GitHub validation/Pages success and the live shared assets separately before calling it live. The existing Worker remains a separate owner-operated deployment: Pages does not install the private accessibility/invitation changes. After that update, test one actual invitation through registration and the learning menu, then a keyboard-only sign-out/sign-in. No invitation was sent by the assistant and no spending occurred.
