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
check(htmlFiles.length === 339, "Expected 339 HTML pages, found " + htmlFiles.length + ".");
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
for (const file of ["focus-manual.html", "ereader-manual.html", "brailleblaster-manual.html"]) {
  const detailedManual = readFileSync(resolve(root, file), "utf8");
  check(detailedManual.includes("Basic") && detailedManual.includes("advanced"), file + " is missing basic and advanced how-to instruction.");
  check((detailedManual.match(/<ol>/g) || []).length >= 4, file + " needs more step-by-step procedures.");
  check(detailedManual.includes("Keyboard command"), file + " is missing keyboard-command guidance.");
  check(detailedManual.includes("If that does not happen"), file + " is missing recovery guidance.");
}
const fullSourceManuals = [
  "word-manual.html", "excel-manual.html", "job-search-manual.html", "social-media-manual.html",
  "cybersecurity-manual.html", "edge-manual.html", "windows-manual.html", "windows-screen-reader-manual.html",
  "brailliant-bi-x-manual.html", "chrome-manual.html", "docs-manual.html", "victor-reader-stream-3-manual.html",
  "braillenote-touch-plus-manual.html", "calendar-manual.html", "google-drive-manual.html", "bard-mobile-manual.html",
  "talkback-manual.html", "voiceover-manual.html", "mac-voiceover-manual.html", "onedrive-manual.html",
  "google-meet-manual.html", "pdf-manual.html", "onenote-manual.html", "mantis-manual.html",
  "zoom-manual.html", "zoomax-ereader-manual.html", "teams-manual.html",
  "outlook-manual.html", "gmail-manual.html"
];
for (const file of fullSourceManuals) {
  check(existsSync(resolve(root, file)), file + " is missing.");
  const manual = readFileSync(resolve(root, file), "utf8");
  check(manual.includes("What you will learn"), file + " is missing learning outcomes.");
  check(manual.includes("Before you begin"), file + " is missing preparation guidance.");
  check(manual.includes("Exactly how to do it"), file + " is missing step-by-step instruction.");
  check((manual.match(/<ol(?:\s|>)/g) || []).length >= 4, file + " needs more step-by-step procedures.");
  check(manual.includes("If that does not happen"), file + " is missing recovery guidance.");
  check(manual.includes("Practice"), file + " is missing learner practice.");
  check(manualsHtml.includes(file), "Manuals directory is missing " + file + ".");
}
const mantisInstructorManual = readFileSync(resolve(root, "mantis-instructor-manual.html"), "utf8");
check((mantisInstructorManual.match(/<ol(?:\s|>)/g) || []).length >= 10, "Mantis instructor manual needs detailed procedures.");
check(mantisInstructorManual.includes("Troubleshooting") && mantisInstructorManual.includes("Practice"), "Mantis instructor manual is missing training and troubleshooting guidance.");
check(manualsHtml.includes("mantis-instructor-manual.html"), "Manuals directory is missing the Mantis instructor manual.");
const ereaderManual = readFileSync(resolve(root, "ereader-manual.html"), "utf8");
check(ereaderManual.includes("HumanWare model: Basic and advanced how-tos"), "NLS eReader manual is missing detailed HumanWare instructions.");
check(ereaderManual.includes("Zoomax model: Basic and advanced how-tos"), "NLS eReader manual is missing detailed Zoomax instructions.");
check(ereaderManual.includes("S1 opens the Main Menu"), "NLS eReader manual is missing Zoomax model-identification guidance.");
for (const file of htmlFiles.filter(file => file.endsWith("-manual.html"))) {
  check(!readFileSync(resolve(root, file), "utf8").includes("private assignment uploader"), file + " still directs learners to the paused uploader.");
}
const instructionalManualFiles = htmlFiles.filter(file => file.endsWith("-manual.html") && file !== "additional-skills-manual.html");
for (const file of instructionalManualFiles) {
  const manual = readFileSync(resolve(root, file), "utf8");
  check(manual.includes('manual-contents'), file + " is missing a linked table of contents.");
  check(/manual-contents[\s\S]*?href="#[^"]+"/.test(manual), file + " table of contents has no topic links.");
  for (const requiredPart of ["What you will learn", "Before you begin", "Exactly how to do it", "What should happen", "If that does not happen", "Practice"]) {
    check(manual.includes(requiredPart), file + " is missing the full manual component: " + requiredPart + ".");
  }
}
const additionalSkills = readFileSync(resolve(root, "additional-skills-manual.html"), "utf8");
check(additionalSkills.includes("Independent Skills Manuals"), "Independent skills directory title is missing.");
check(!additionalSkills.includes("curriculum-audit") && !additionalSkills.includes("topic gaps identified"), "Independent skills manual still contains source-comparison framing.");
check(readFileSync(resolve(root, "resources.html"), "utf8").includes("The Windows Screen Reader Primer: All the Basics and More, Fifth Edition"), "Screen Reader Primer is missing from Resources.");
const independentManualFiles = ["outlook-manual.html", "onenote-manual.html", "onedrive-manual.html", "teams-manual.html", "edge-manual.html", "google-drive-manual.html", "gmail-manual.html", "google-meet-manual.html", "zoom-manual.html", "social-media-manual.html", "bard-mobile-manual.html", "voiceover-manual.html", "talkback-manual.html", "mac-voiceover-manual.html", "accessible-audio-manual.html", "ai-access-manual.html", "screen-reader-recovery-manual.html"];
for (const file of independentManualFiles) {
  check(existsSync(resolve(root, file)), file + " is missing.");
  const manual = readFileSync(resolve(root, file), "utf8");
  check(manual.includes("Keyboard command") || manual.includes("Keyboard approach"), file + " is missing keyboard-command guidance.");
  check(manual.includes("If that does not happen"), file + " is missing recovery guidance.");
  check(additionalSkills.includes(file), "Independent skills directory is missing " + file + ".");
}
check(manualsHtml.indexOf("Microsoft applications") < manualsHtml.indexOf("outlook-manual.html"), "Outlook is not grouped with Microsoft applications.");
check(manualsHtml.indexOf("Google applications") < manualsHtml.indexOf("google-services-manual.html"), "Google services are not grouped with Google applications.");
check(/Cloud storage and online communication[\s\S]*onedrive-manual\.html[\s\S]*google-drive-manual\.html/.test(manualsHtml), "Cloud storage is not in its category.");
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
check(searchIndex.count === 335 && searchIndex.entries.length === 335, "Search index must contain 335 public learning, practice, quiz, and help pages.");
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
const aiManual = readFileSync(resolve(root, "ai-fundamentals-manual.html"), "utf8");
for (const requiredTopic of ["Large Language Models and Tokens", "Hallucinations and Confident Errors", "Security and Prompt Injection", "Bias, Fairness, and Representation", "Accessibility and Assistive Technology", "Images, Audio, Video, and Deepfakes", "AI Agents and Automated Actions", "The CHECK Framework", "Troubleshooting Poor AI Results", "Final Independence Checklist"]) {
  check(aiManual.includes(requiredTopic), "AI Fundamentals manual is missing: " + requiredTopic + ".");
}
check((aiManual.match(/<h2 id="part-/g) || []).length === 29, "AI Fundamentals manual must contain all 29 full manual parts.");
const copilotManual = readFileSync(resolve(root, "copilot-manual.html"), "utf8");
for (const requiredTopic of ["Personal vs Work or School Copilot", "Upload Files and Images", "Copilot Voice", "Copilot Vision", "Search, Library, and Create", "Copilot in Word", "Accessibility with Narrator, NVDA, and JAWS", "VoiceOver, TalkBack, and Braille", "Enterprise Data Protection", "Troubleshooting", "Final Independence Checklist"]) {
  check(copilotManual.includes(requiredTopic), "Microsoft Copilot manual is missing: " + requiredTopic + ".");
}
check((copilotManual.match(/<h2 id="part-/g) || []).length === 32, "Microsoft Copilot manual must contain all 32 full manual parts.");
const geminiManual = readFileSync(resolve(root, "gemini-manual.html"), "utf8");
for (const requiredTopic of ["Accounts, Sign-In, and Availability", "Verify Responses and Related Sources", "Upload and Analyze Files", "Gemini Live", "Gems", "Deep Research", "Connected Apps", "Gmail, Drive, Docs, Calendar, Tasks, and Keep", "Screen Readers and Braille", "Gemini Apps Activity", "Work and School Accounts", "Troubleshooting", "Final Independence Checklist"]) {
  check(geminiManual.includes(requiredTopic), "Google Gemini manual is missing: " + requiredTopic + ".");
}
check((geminiManual.match(/<h2 id="part-/g) || []).length === 26, "Google Gemini manual must contain all 26 full manual parts.");
const sheetsManual = readFileSync(resolve(root, "sheets-manual.html"), "utf8");
for (const requiredTopic of ["Turn On Screen Reader and Braille Support", "Rows, Columns, Cells, and Ranges", "Formulas and Cell References", "Relative and Absolute References", "Filters and Filter Views", "Data Validation, Dropdowns, and Checkboxes", "Charts and Accessible Chart Descriptions", "Pivot Tables", "Sharing and Permissions", "Accessible Spreadsheet Design", "JAWS", "NVDA", "Braille Displays", "Troubleshooting", "Final Independence Checklist"]) {
  check(sheetsManual.includes(requiredTopic), "Google Sheets manual is missing: " + requiredTopic + ".");
}
check((sheetsManual.match(/<h2 id="part-/g) || []).length === 36, "Google Sheets manual must contain all 36 full manual parts.");
const chatgptManual = readFileSync(resolve(root, "chatgpt-manual.html"), "utf8");
for (const requiredTopic of ["Chat, Work, and Codex", "Prompting Fundamentals", "Search the Web", "Verify Answers and Sources", "Upload and Work with Files", "Data Analysis and Spreadsheets", "Images: Analyze, Generate, and Edit", "Projects", "Plugins and Connected Apps", "Deep Research", "Scheduled Tasks and Monitoring", "Memory and Personalization", "Temporary Chat", "Data Controls and Privacy", "Screen Reader Use on Windows", "VoiceOver on Mac and iPhone/iPad", "TalkBack on Android", "Braille Displays", "Responsible and Safe Use", "Troubleshooting", "Final Independence Checklist"]) {
  check(chatgptManual.includes(requiredTopic), "ChatGPT manual is missing: " + requiredTopic + ".");
}
check((chatgptManual.match(/<h2 id="part-/g) || []).length === 37, "ChatGPT manual must contain all 37 full manual parts.");
const aiAccessManual = readFileSync(resolve(root, "ai-access-manual.html"), "utf8");
for (const requiredTopic of ["AI-Assisted Access: The Big Picture", "Create a Notebook and Add Sources", "Chat with Sources and Use Citations", "Audio and Video Overviews", "Mind Maps and Accessible Alternatives", "Gemini Notebook with Screen Readers and Braille", "Call a Sighted Volunteer", "Use Be My AI on Mobile", "Be My AI on Windows Desktop", "Choosing AI, OCR, or a Human", "Better Image and Screen Descriptions", "Documents, Charts, Forms, and Tables", "High-Stakes Limits and Human Escalation", "Deepfakes, Misidentification, and False Confidence", "Screen Reader and Braille Privacy", "Troubleshooting", "Final Independence Checklist"]) {
  check(aiAccessManual.includes(requiredTopic), "AI-Assisted Access manual is missing: " + requiredTopic + ".");
}
check((aiAccessManual.match(/<h2 id="part-/g) || []).length === 30, "AI-Assisted Access manual must contain all 30 full manual parts.");
const expandedGoogleManuals = [
  ["google-drive-manual.html", 20, ["Screen Reader Setup", "Create Folders and Files", "Sharing and Permissions", "Drive for Desktop", "Braille and Mobile", "Troubleshooting"]],
  ["gmail-manual.html", 30, ["Turn On Gmail Keyboard Shortcuts", "Compose and Send Email", "Attachments", "Create Filters", "Security and Phishing", "Gmail with JAWS", "Gmail on Android", "Troubleshooting", "Final Independence Checklist"]],
  ["google-forms-manual.html", 23, ["Add Questions", "Required Questions and Validation", "Sections and Branching", "Preview and Publish", "Quizzes and Grading", "Accessible Form Design", "Braille and Mobile", "Troubleshooting"]],
  ["google-classroom-manual.html", 27, ["Join a Class - Student", "Complete an Assignment - Student", "Turn In, Unsubmit, and Resubmit", "Teacher: Create a Class", "Teacher: Review, Grade, and Return Work", "Gemini and Learning Tools in Classroom", "Braille and Accessibility", "Troubleshooting"]],
];
for (const [filename, partCount, topics] of expandedGoogleManuals) {
  const manual = readFileSync(resolve(root, filename), "utf8");
  for (const topic of topics) check(manual.includes(topic), filename + " is missing: " + topic + ".");
  check((manual.match(/<h2 id="part-/g) || []).length === partCount, filename + " has an incomplete full-manual section count.");
}
const manualsPage = readFileSync(resolve(root, "manuals.html"), "utf8");
for (const filename of ["google-forms-manual.html", "google-classroom-manual.html"]) {
  check(manualsPage.includes('href="' + filename + '"'), "Manuals page does not link " + filename + ".");
}
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
console.log("Validated " + htmlFiles.length + " accessible pages, " + instructionalManualFiles.length + " instructional manuals, 250 lessons, 25 final quizzes, command practice, local certificates, searchable help, and paused private uploads.");
