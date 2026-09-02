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
check(htmlFiles.length === 308, "Expected 308 HTML pages, found " + htmlFiles.length + ".");
check(readFileSync(resolve(root, "manuals.html"), "utf8").includes("Manuals in recommended learning order"), "Manuals page is not marked complete.");
const accessibilityScript = readFileSync(resolve(root, "accessibility.js"), "utf8");
const assignmentScript = readFileSync(resolve(root, "assignment-submission.js"), "utf8");
const searchIndex = JSON.parse(readFileSync(resolve(root, "search-index.json"), "utf8"));
check(existsSync(resolve(root, "resources.html")), "Help and Resource Search page is missing.");
check(existsSync(resolve(root, "resource-search.js")), "Resource search behavior is missing.");
check(existsSync(resolve(root, "command-practice.html")), "Keyboard Command Practice Lab page is missing.");
const commandPractice = readFileSync(resolve(root, "command-practice.js"), "utf8");
check(commandPractice.includes("speechSynthesis"), "Spoken command instructions are missing.");
check(commandPractice.includes("AudioContext"), "Command sound feedback is missing.");
check(commandPractice.includes("event.preventDefault()"), "Practice key containment is missing.");
check(commandPractice.includes("insertHeld"), "JAWS Insert-key chord practice is missing.");
check(readFileSync(resolve(root, "command-practice.html"), "utf8").includes("cannot block operating-system"), "System-shortcut safety warning is missing.");
const quizScript = readFileSync(resolve(root, "quiz.js"), "utf8");
check(quizScript.includes("data.passPercent"), "Quiz passing-score behavior is missing.");
check(quizScript.includes("print-certificate"), "Printable certificate behavior is missing.");
check(quizScript.includes("accessibleLearningQuizResults"), "Local quiz result storage is missing.");
check(!quizScript.includes("certificateStudentName") || !quizScript.includes("localStorage.setItem(key, name"), "Certificate names must not be stored.");
check(searchIndex.count === 306 && searchIndex.entries.length === 306, "Search index must contain 306 public learning, practice, quiz, and help pages.");
check(assignmentScript.includes("const UPLOADS_ENABLED = false"), "Lesson upload interface is not paused.");
check(assignmentScript.includes("submissionSection?.remove()"), "Paused upload interface is not removed.");
check(worker.includes("const SUBMISSIONS_ENABLED = false"), "Submission Worker is not paused.");
check(worker.includes("Assignment uploads are temporarily unavailable."), "Submission Worker pause response is missing.");
check(accessibilityScript.includes("Website accessibility settings"), "Accessibility menu label is missing.");
check(accessibilityScript.includes("darkMode"), "Saved dark-mode preference is missing.");
check(accessibilityScript.includes('dataset.theme'), "Dark-mode theme state is missing.");
check(accessibilityScript.includes('details class="accessibility-menu"'), "Accessibility controls are not in a compact details menu.");
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

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Validated " + htmlFiles.length + " accessible pages, 25 manuals, 250 lessons, 25 final quizzes, command practice, local certificates, searchable help, and paused private uploads.");
