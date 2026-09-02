# Accessible Learning Center

An accessible GitHub Pages learning website for blind and low-vision students.

## Current features

- Anonymous Student IDs stored in the learner's browser
- Microsoft Word manual and ten guided lessons
- D1-backed lesson progress tracking
- Private assignment uploads to Cloudflare R2
- DOCX, PDF, TXT, and BRF submissions up to 10 MB
- Site-wide text-size, high-contrast, and reduced-motion controls
- Responsive blue technology theme
- Screen-reader status messages and keyboard-visible focus

## Architecture

- GitHub Pages serves the static website.
- `accessible-learning-api` stores Student IDs and progress in D1.
- `accessible-learning-submissions` stores private assignment files in R2.
- Cloudflare Workers Builds deploy both Workers from GitHub.

## Safety and privacy

Students should use anonymous IDs rather than names or other personal information. Assignment files are stored in the private `accessible-learning-submissions` bucket and are not publicly browsable.

No paid service is required by the current implementation.
