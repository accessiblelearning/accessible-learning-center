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


## Reliability and accessibility

- Each upload uses a client-generated retry token. If a mobile connection drops before confirmation, retrying the same submission reuses the same R2 object instead of creating a duplicate stored copy.
- Older cached pages remain compatible because the Worker creates a fallback token when none is provided.
- Assignment files remain private in R2.
- Shared page controls complement, rather than replace, browser and assistive-technology settings.


## Microsoft Excel course

The Excel course targets Microsoft 365 desktop on Windows with keyboard-first and JAWS-friendly instructions. Each lesson supplies its course name, lesson number, and accepted file extensions to the shared submission script. The private submission Worker enforces course-specific file types:

- Microsoft Word: DOCX, PDF, TXT, BRF
- Microsoft Excel: XLSX, CSV, PDF

Existing Microsoft Word progress records and upload behavior remain compatible.
