# Accessible Learning Center

An accessible GitHub Pages learning website for blind and low-vision students.

## Current features

- Anonymous Student IDs stored in the learner's browser
- Word, Excel, PowerPoint, JAWS, Windows 11, and Google Chrome manuals with ten guided lessons per course
- D1-backed lesson progress tracking
- Private assignment uploads to Cloudflare R2
- Course-specific DOCX, XLSX, PPTX, CSV, PDF, TXT, and BRF submissions up to 10 MB
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
- Microsoft PowerPoint: PPTX, PDF
- JAWS Screen Reader: TXT, DOCX, PDF, BRF
- Windows 11: TXT, DOCX, PDF, BRF
- Google Chrome: TXT, DOCX, PDF, BRF

Existing Microsoft Word progress records and upload behavior remain compatible.

## Microsoft PowerPoint course

The PowerPoint course targets Microsoft 365 desktop on Windows with keyboard-first and JAWS-friendly instructions. Its ten employment-oriented lessons cover slide layouts and titles, concise text, alternative text, reading order, accessible tables and charts, meaningful links, contrast and fonts, speaker notes, keyboard presenting, and a final accessible workplace presentation.

The course manual links only to official Microsoft accessibility guidance and Freedom Scientific JAWS documentation. PowerPoint progress appears separately without changing existing Word or Excel records.


## JAWS Screen Reader course

The JAWS course targets current JAWS on Windows with desktop-layout commands, laptop-layout reminders, keyboard-first practice, and employment-oriented assignments. Its ten lessons cover speech and Keyboard Help, text reading, Windows navigation, dialogs and focus, the Virtual Cursor, Forms Mode, tables, built-in help and troubleshooting, responsible JAWS AI use, and a final workplace navigation project.

Lesson 9 and the manual cover FSCompanion and Picture Smart AI using official Freedom Scientific guidance. They require students to protect confidential information, verify AI results, and use Keyboard Help, Commands Search, official documentation, or an instructor when AI is unavailable. No AI service, credential, or paid feature is added to this website.

JAWS progress appears separately without changing existing Word, Excel, or PowerPoint records.


## Windows 11 course

The Windows 11 course provides keyboard-first, screen-reader-friendly instruction for desktop and Start navigation, taskbar and window management, File Explorer, folders and files, selection and search, built-in accessibility settings, Quick Settings and notifications, security and updates, safe troubleshooting, and a final workplace file-management project.

Lessons use reversible practice tasks, warn against changing shared-computer settings or deleting unrelated files, and accept TXT, DOCX, PDF, or BRF reports. Windows 11 progress appears separately without changing existing Word, Excel, PowerPoint, or JAWS records.


## Google Chrome course

The Chrome course provides keyboard-first, JAWS-friendly instruction for browser controls, tabs, web navigation, research, bookmarks, history, downloads, uploads, forms, permissions, zoom, accessibility, privacy, Safe Browsing, and a final workplace research project. It uses public or fictional information, warns against bypassing browser security, and keeps existing course records unchanged.
