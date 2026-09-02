import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";

const root = process.cwd();
const htmlFiles = readdirSync(root).filter((file) => extname(file) === ".html");
const errors = [];
const courses = [
  {
    "name": "Microsoft Word",
    "slug": "word",
    "ext": "docx,pdf,txt,brf"
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
    "name": "JAWS Screen Reader",
    "slug": "jaws",
    "ext": "txt,docx,pdf,brf"
  },
  {
    "name": "Windows 11",
    "slug": "windows",
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
    "name": "Google Calendar",
    "slug": "calendar",
    "ext": "pdf,txt,docx,brf"
  },
  {
    "name": "Adobe Acrobat and Accessible PDFs",
    "slug": "pdf",
    "ext": "pdf,docx,txt,brf"
  },
  {
    "name": "BrailleBlaster",
    "slug": "brailleblaster",
    "ext": "brf,bbz,docx,pdf,txt"
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
    "name": "Cybersecurity for Screen Reader Users",
    "slug": "cybersecurity",
    "ext": "txt,docx,pdf,brf"
  },
  {
    "name": "Accessible Job Search",
    "slug": "job-search",
    "ext": "docx,pdf,txt,brf"
  }
];

function check(condition, message) {
  if (!condition) errors.push(message);
}

for (const file of htmlFiles) {
  const html = readFileSync(resolve(root, file), "utf8");
  check(html.includes('href="styles.css"'), file + " is missing the shared stylesheet.");
  check(html.includes('src="accessibility.js"'), file + " is missing accessibility controls.");
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
  for (let lesson = 1; lesson <= 10; lesson += 1) {
    const file = course.slug + "-lesson-" + lesson + ".html";
    check(existsSync(resolve(root, file)), file + " is missing.");
    if (!existsSync(resolve(root, file))) continue;
    const html = readFileSync(resolve(root, file), "utf8");
    check(html.includes('src="assignment-submission.js"'), file + " is missing assignment submission behavior.");
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
check(htmlFiles.length === 160, "Expected 160 HTML pages, found " + htmlFiles.length + ".");
check(readFileSync(resolve(root, "manuals.html"), "utf8").includes("All manuals are available"), "Manuals page is not marked complete.");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Validated " + htmlFiles.length + " accessible pages, 14 manuals, 140 lessons, and course-aware private uploads.");
