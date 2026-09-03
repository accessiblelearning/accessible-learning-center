import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";

const root = process.cwd();
const htmlFiles = readdirSync(root).filter((file) => extname(file) === ".html");
const errors = [];
const courses = [
  {
    "name": "Choosing a Free Office Suite",
    "slug": "free-office",
    "ext": "txt,docx,xlsx,pptx,pdf,brf"
  },
  {
    "name": "LibreOffice Writer",
    "slug": "libreoffice-writer",
    "ext": "odt,docx,pdf,txt,brf"
  },
  {
    "name": "LibreOffice Calc",
    "slug": "libreoffice-calc",
    "ext": "ods,xlsx,csv,pdf"
  },
  {
    "name": "LibreOffice Impress",
    "slug": "libreoffice-impress",
    "ext": "odp,pptx,pdf"
  },
  {
    "name": "Google Sheets",
    "slug": "sheets",
    "ext": "xlsx,csv,pdf"
  },
  {
    "name": "Google Slides",
    "slug": "slides",
    "ext": "pptx,pdf"
  },
  {
    "name": "AI Fundamentals",
    "slug": "ai-fundamentals",
    "ext": "txt,docx,pdf,brf"
  },
  {
    "name": "ChatGPT",
    "slug": "chatgpt",
    "ext": "txt,docx,pdf,brf"
  },
  {
    "name": "Microsoft Copilot",
    "slug": "copilot",
    "ext": "txt,docx,pdf,brf"
  },
  {
    "name": "Google Gemini",
    "slug": "gemini",
    "ext": "txt,docx,pdf,brf"
  },
  {
    "name": "Windows 11",
    "slug": "windows",
    "ext": "txt,docx,pdf,brf"
  },
  {
    "name": "JAWS Screen Reader",
    "slug": "jaws",
    "ext": "txt,docx,pdf,brf"
  },
  {
    "name": "Google Chrome",
    "slug": "chrome",
    "ext": "txt,docx,pdf,brf"
  },
  {
    "name": "Google Docs",
    "slug": "docs",
    "ext": "docx,pdf,txt,brf"
  },
  {
    "name": "Microsoft Word",
    "slug": "word",
    "ext": "docx,pdf,txt,brf"
  },
  {
    "name": "Google Calendar",
    "slug": "calendar",
    "ext": "pdf,txt,docx,brf"
  },
  {
    "name": "Microsoft Excel",
    "slug": "excel",
    "ext": "xlsx,csv,pdf"
  },
  {
    "name": "Microsoft PowerPoint",
    "slug": "powerpoint",
    "ext": "pptx,pdf"
  },
  {
    "name": "Adobe Acrobat and Accessible PDFs",
    "slug": "pdf",
    "ext": "pdf,docx,txt,brf"
  },
  {
    "name": "Cybersecurity for Screen Reader Users",
    "slug": "cybersecurity",
    "ext": "txt,docx,pdf,brf"
  },
  {
    "name": "Accessible Job Search",
    "slug": "job-search",
    "ext": "docx,pdf,txt,brf"
  },
  {
    "name": "Focus 40 Blue",
    "slug": "focus",
    "ext": "txt,docx,pdf,brf"
  },
  {
    "name": "Mantis Q40",
    "slug": "mantis",
    "ext": "brf,txt,docx,pdf"
  },
  {
    "name": "NLS Braille eReader",
    "slug": "ereader",
    "ext": "brf,txt,docx,pdf"
  },
  {
    "name": "BrailleBlaster",
    "slug": "brailleblaster",
    "ext": "brf,bbz,docx,pdf,txt"
  }
];

function check(condition, message) {
  if (!condition) errors.push(message);
}

for (const file of htmlFiles) {
  const html = readFileSync(resolve(root, file), "utf8");
  check(html.includes('href="styles.css'), file + " is missing the shared stylesheet.");
  check(html.includes('src="accessibility.js'), file + " is missing accessibility controls.");
  check(!html.includes('href="#"'), file + " contains a dead # link.");
  check(/<html\s+lang="en"/i.test(html), file + ' is missing lang="en".');
  check(/<meta\s+name="viewport"/i.test(html), file + " is missing a viewport setting.");
  check((html.match(/<h1(?:\s|>)/gi) || []).length === 1, file + " must contain exactly one H1.");
  check(!/tabindex="[1-9][0-9]*"/i.test(html), file + " contains a positive tabindex.");

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  const idSet = new Set(ids);
  check(ids.length === idSet.size, file + " contains a duplicate element ID.");

  for (const image of html.matchAll(/<img\b[^>]*>/gi)) {
    check(/\salt="[^"]*"/i.test(image[0]), file + " contains an image without an alt attribute.");
  }

  for (const relation of html.matchAll(/\saria-(?:labelledby|describedby)="([^"]+)"/gi)) {
    for (const referencedId of relation[1].trim().split(/\s+/)) {
      check(idSet.has(referencedId), file + " references missing ARIA target " + referencedId + ".");
    }
  }

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const reference = match[1];
    if (/^(?:https?:|#|mailto:|data:)/.test(reference)) continue;
    const clean = reference.split("?")[0].split("#")[0];
    check(existsSync(resolve(root, dirname(file), clean)), file + " references missing file " + clean + ".");
  }
}

for (const course of courses) {
  check(existsSync(resolve(root, course.slug + "-manual.html")), course.name + " manual is missing.");
  check(existsSync(resolve(root, course.slug + "-quiz.html")), course.name + " final quiz is missing.");
  for (let lesson = 1; lesson <= 10; lesson += 1) {
    const file = course.slug + "-lesson-" + lesson + ".html";
    check(existsSync(resolve(root, file)), file + " is missing.");
    if (!existsSync(resolve(root, file))) continue;
    const html = readFileSync(resolve(root, file), "utf8");
    check(html.includes('src="assignment-submission.js'), file + " is missing assignment submission behavior.");
    check(html.includes("hidden data-upload-ui"), file + " must hide the paused upload interface.");
    check(html.includes("Open this lesson in Safari"), file + " is missing the iPhone Safari upload note.");
    if (course.slug !== "word") {
      check(html.includes('data-course="' + course.name + '"'), file + " has the wrong course identifier.");
    }
    if (["word", "excel"].includes(course.slug)) {
      check(
        course.slug === "word" || html.includes("data-allowed-extensions="),
        file + " is missing course-aware file types."
      );
    } else {
      check(html.includes('data-allowed-extensions="' + course.ext + '"'), file + " has the wrong file types.");
    }
  }
}

const worker = readFileSync(resolve(root, "submissions/worker.js"), "utf8");
for (const course of courses) {
  check(worker.includes('["' + course.name + '", new Set('), "Submission Worker is missing " + course.name + ".");
}
check(worker.includes('"bbz"'), "Submission Worker is missing BBZ validation.");
check(htmlFiles.length === 318, "Expected 318 HTML pages, found " + htmlFiles.length + ".");
const manualsHtml = readFileSync(resolve(root, "manuals.html"), "utf8");
check(manualsHtml.includes("Manuals are grouped by subject"), "Manuals page is not grouped by subject.");
const accessibilityScript = readFileSync(resolve(root, "accessibility.js"), "utf8");
const assignmentScript = readFileSync(resolve(root, "assignment-submission.js"), "utf8");
const searchIndex = JSON.parse(readFileSync(resolve(root, "search-index.json"), "utf8"));
check(existsSync(resolve(root, "resources.html")), "Help and Resource Search page is missing.");
check(existsSync(resolve(root, "resource-search.js")), "Resource search behavior is missing.");
check(existsSync(resolve(root, "command-practice.html")), "Keyboard Command Practice Lab page is missing.");
check(existsSync(resolve(root, "troubleshooting-lab.html")), "Assistive Technology Troubleshooting Lab page is missing.");
check(existsSync(resolve(root, "additional-skills-manual.html")), "Additional Screen-Reader Skills manual is missing.");
for (const file of ["job-search-manual.html", "calendar-manual.html", "docs-manual.html", "cybersecurity-manual.html", "pdf-manual.html", "focus-manual.html", "mantis-manual.html", "ereader-manual.html", "brailleblaster-manual.html"]) {
  const detailedManual = readFileSync(resolve(root, file), "utf8");
  check(detailedManual.includes("Basic") && detailedManual.includes("advanced"), file + " is missing basic and advanced how-to instruction.");
  check((detailedManual.match(/<ol>/g) || []).length >= 4, file + " needs more step-by-step procedures.");
  check(detailedManual.includes("Keyboard command"), file + " is missing keyboard-command guidance.");
  check(detailedManual.includes("If that does not happen"), file + " is missing recovery guidance.");
}
for (const file of htmlFiles.filter(file => file.endsWith("-manual.html"))) {
  check(!readFileSync(resolve(root, file), "utf8").includes("private assignment uploader"), file + " still directs learners to the paused uploader.");
}
const additionalSkills = readFileSync(resolve(root, "additional-skills-manual.html"), "utf8");
check(additionalSkills.includes("Independent Skills Manuals"), "Independent skills directory title is missing.");
check(!additionalSkills.includes("curriculum-audit") && !additionalSkills.includes("topic gaps identified"), "Independent skills manual still contains source-comparison framing.");
check(readFileSync(resolve(root, "resources.html"), "utf8").includes("The Windows Screen Reader Primer: All the Basics and More, Fifth Edition"), "Screen Reader Primer is missing from Resources.");
const independentManualFiles = ["outlook-manual.html", "google-services-manual.html", "cloud-storage-manual.html", "online-meetings-manual.html", "accessible-audio-manual.html", "ai-access-manual.html", "screen-reader-recovery-manual.html"];
for (const file of independentManualFiles) {
  check(existsSync(resolve(root, file)), file + " is missing.");
  const manual = readFileSync(resolve(root, file), "utf8");
  check(manual.includes("Keyboard command") || manual.includes("Keyboard approach"), file + " is missing keyboard-command guidance.");
  check(manual.includes("If that does not happen"), file + " is missing recovery guidance.");
  check(additionalSkills.includes(file), "Independent skills directory is missing " + file + ".");
}
check(manualsHtml.indexOf("Microsoft applications") < manualsHtml.indexOf("outlook-manual.html"), "Outlook is not grouped with Microsoft applications.");
check(manualsHtml.indexOf("Google applications") < manualsHtml.indexOf("google-services-manual.html"), "Google services are not grouped with Google applications.");
check(manualsHtml.indexOf("Cloud storage and online communication") < manualsHtml.indexOf("cloud-storage-manual.html"), "Cloud storage is not in its category.");
const troubleshootingLab = readFileSync(resolve(root, "troubleshooting-lab.js"), "utf8");
check((troubleshootingLab.match(/category: "/g) || []).length === 8, "Mission Control must include eight command-based missions.");
for (const perspective of ["JAWS", "NVDA", "Narrator"]) {
  check(troubleshootingLab.includes(perspective), "Mission Control is missing the " + perspective + " perspective.");
}
for (const topic of ["Screen-reader recovery", "Google applications", "Email and calendar", "Microsoft applications", "Cloud storage", "Online meetings", "Privacy and cybersecurity", "Files and folders"]) {
  check(troubleshootingLab.includes(topic), "Mission Control is missing the " + topic + " mission.");
}
check(troubleshootingLab.includes("missionControlCompleted"), "Mission Control local progress is missing.");
check(troubleshootingLab.includes("speechSynthesis"), "Troubleshooting Lab speech playback is missing.");
check(troubleshootingLab.includes('missionControl.addEventListener("keydown"'), "Mission Control does not accept keyboard commands.");
check(!/cockpit/i.test(troubleshootingLab + readFileSync(resolve(root, "troubleshooting-lab.html"), "utf8")), "Mission Control still uses cockpit terminology.");
check(!readFileSync(resolve(root, "troubleshooting-lab.html"), "utf8").includes("What is the safest next action?"), "Mission Control still contains multiple-choice questions.");
check(readFileSync(resolve(root, "accessibility.js"), "utf8").includes('href="troubleshooting-lab.html">Mission Control Sim</a>'), "Primary navigation is missing Mission Control Sim.");
const commandPractice = readFileSync(resolve(root, "command-practice.js"), "utf8");
check(commandPractice.includes("speechSynthesis"), "Spoken command instructions are missing.");
check(commandPractice.includes("AudioContext"), "Command sound feedback is missing.");
check(commandPractice.includes("event.preventDefault()"), "Practice key containment is missing.");
check(commandPractice.includes("insertHeld"), "JAWS Insert-key chord practice is missing.");
check(commandPractice.includes("missedCommands"), "Missed-command review is missing.");
for (const categoryName of ["Windows and File Explorer", "Microsoft Word and documents", "Microsoft Excel and spreadsheets", "JAWS commands", "NVDA commands", "Narrator commands", "Braille display keyboard practice"]) {
  check(commandPractice.includes('"' + categoryName + '"'), "Command Practice is missing " + categoryName + ".");
}
check(commandPractice.includes('return "Press " + spokenKeys(command[0]) + ". " + commandExplanation();'), "Spoken command and explanation are not clearly separated.");
check(commandPractice.includes('return "This command lets you "'), "General command explanations are missing clear wording.");
check(commandPractice.includes('return "Here is what this command does. "'), "Detailed command explanations are missing clear wording.");
check(readFileSync(resolve(root, "command-practice.html"), "utf8").includes("cannot block operating-system"), "System-shortcut safety warning is missing.");
const quizScript = readFileSync(resolve(root, "quiz.js"), "utf8");
check(quizScript.includes("data.passPercent"), "Quiz passing-score behavior is missing.");
check(quizScript.includes("print-certificate"), "Printable certificate behavior is missing.");
check(quizScript.includes("accessibleLearningQuizResults"), "Local quiz result storage is missing.");
check(!quizScript.includes("certificateStudentName") || !quizScript.includes("localStorage.setItem(key, name"), "Certificate names must not be stored.");
check(searchIndex.count === 306 && searchIndex.entries.length === 306, "Search index must contain 306 public learning, practice, quiz, and help pages.");
check(assignmentScript.includes("const UPLOADS_ENABLED = false"), "Lesson upload interface is not paused.");
check(assignmentScript.includes("submissionSection?.remove()"), "Paused upload interface is not removed.");
check(assignmentScript.includes("Mark this lesson complete"), "Lesson completion control is missing.");
check(assignmentScript.includes('isComplete ? "in_progress" : "completed"'), "Lesson completion is not saved separately from submissions.");
check(assignmentScript.includes('"Undo lesson completion"'), "Lesson completion cannot be undone.");
check(assignmentScript.includes('isComplete ? "in_progress" : "completed"'), "Undo completion does not restore in-progress status.");
check(readFileSync(resolve(root, "student-progress.html"), "utf8").includes("Continue learning"), "Next unfinished lesson control is missing.");
check(readFileSync(resolve(root, "student-progress.html"), "utf8").includes('["completed", "submitted"]'), "Completed and legacy submitted lessons are not both counted.");
check(readFileSync(resolve(root, "student-progress.html"), "utf8").includes("recentCourseIndex"), "Continue learning does not use the most recently active course.");
check(quizScript.includes('"accessibleLearningQuizResults:" + studentId'), "Quiz results are not separated by Student ID.");
check(!readFileSync(resolve(root, "index.html"), "utf8").includes("Upload your work"), "Homepage still instructs learners to upload assignments.");
check(worker.includes("const SUBMISSIONS_ENABLED = false"), "Submission Worker is not paused.");
check(worker.includes("Assignment uploads are temporarily unavailable."), "Submission Worker pause response is missing.");
const progressWorker = readFileSync(resolve(root, "worker.js"), "utf8");
check(progressWorker.includes('["in_progress", "completed", "submitted"]'), "Progress Worker does not validate supported statuses.");
check(accessibilityScript.includes("Website accessibility settings"), "Accessibility menu label is missing.");
check(accessibilityScript.includes("darkMode"), "Saved dark-mode preference is missing.");
check(accessibilityScript.includes('dataset.theme'), "Dark-mode theme state is missing.");
check(accessibilityScript.includes('details class="accessibility-menu"'), "Accessibility controls are not in a compact details menu.");
check(accessibilityScript.includes("Last accessibility and structure review:"), "Manual review dates are missing.");
check(accessibilityScript.includes('href="quizzes.html">Quizzes</a>'), "Primary navigation is missing Quizzes.");
check(existsSync(resolve(root, "quizzes.html")), "Quizzes page is missing.");
check((readFileSync(resolve(root, "quizzes.html"), "utf8").match(/-quiz\.html/g) || []).length === 25, "Quizzes page must link all 25 final quizzes.");
check(existsSync(resolve(root, "course-catalog.js")), "Course catalog filtering behavior is missing.");
check(readFileSync(resolve(root, "lessons.html"), "utf8").includes('id="courseFilter"'), "Lessons course filter is missing.");
check(readFileSync(resolve(root, "student-progress.html"), "utf8").includes('id="startedCoursesOnly"'), "Started-courses progress filter is missing.");
check(existsSync(resolve(root, "ACCESSIBILITY-TESTING.md")), "Accessibility testing checklist is missing.");
for (let lesson = 1; lesson <= 10; lesson += 1) {
  const screenReaderLesson = readFileSync(resolve(root, "jaws-lesson-" + lesson + ".html"), "utf8");
  for (const name of ["JAWS", "Narrator", "NVDA"]) {
    check(screenReaderLesson.includes(name), "Screen Readers lesson " + lesson + " is missing " + name + ".");
  }
  check(screenReaderLesson.includes('data-course="JAWS Screen Reader"'), "Screen Readers lesson " + lesson + " does not preserve legacy progress.");
}
const screenReaderManual = readFileSync(resolve(root, "jaws-manual.html"), "utf8");
check(screenReaderManual.includes("Screen Readers: JAWS, Narrator, and NVDA"), "Unified Screen Readers manual title is missing.");
for (const action of ["decrease", "increase", "reset-text", "dark", "contrast", "motion"]) {
  check(accessibilityScript.includes('data-action="' + action + '"'), "Accessibility menu is missing " + action + ".");
}
const sharedStyles = readFileSync(resolve(root, "styles.css"), "utf8");
check(sharedStyles.includes('html[data-theme="dark"] body {\n  color: #ffffff;\n  background: #000000;'), "Dark mode does not enforce a black background with white text.");
check(sharedStyles.includes('html[data-theme="dark"] .site-nav a[aria-current="page"]'), "Dark-mode current navigation is not explicitly styled.");
check(sharedStyles.includes('html[data-theme="dark"] [role="status"]:not(:empty)'), "Dark-mode status messages are not explicitly styled.");
check(sharedStyles.includes('html[data-theme="dark"] .accessibility-controls button[aria-pressed="true"]'), "Pressed accessibility controls do not retain a dark outlined style.");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Validated " + htmlFiles.length + " accessible pages, 33 manuals, 250 lessons, 25 final quizzes, command practice, local certificates, searchable help, and paused private uploads.");
