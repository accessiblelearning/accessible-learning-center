import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";

const root = process.cwd();
const htmlFiles = readdirSync(root).filter((file) => extname(file) === ".html");
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

for (const file of htmlFiles) {
  const html = readFileSync(resolve(root, file), "utf8");

  check(
    html.includes('href="styles.css"'),
    file + " is missing the shared stylesheet."
  );
  check(
    html.includes('src="accessibility.js"'),
    file + " is missing accessibility controls."
  );
  check(!html.includes('href="#"'), file + " contains a dead # link.");
  check(/<html\s+lang="en"/i.test(html), file + " is missing lang=\"en\".");
  check(/<meta\s+name="viewport"/i.test(html), file + " is missing a viewport setting.");
  check((html.match(/<h1(?:\s|>)/gi) || []).length === 1, file + " must contain exactly one H1.");
  check(
    !html.includes("\\n  <script"),
    file + " contains a literal escaped newline in the head."
  );

  const localReferences = [
    ...html.matchAll(/(?:href|src)="([^"]+)"/g)
  ].map((match) => match[1]);

  for (const reference of localReferences) {
    if (
      reference.startsWith("http") ||
      reference.startsWith("#") ||
      reference.startsWith("mailto:") ||
      reference.startsWith("data:")
    ) {
      continue;
    }

    const cleanReference = reference.split("?")[0].split("#")[0];
    check(
      existsSync(resolve(root, dirname(file), cleanReference)),
      file + " references missing file " + cleanReference + "."
    );
  }

  if (/^word-lesson-\d+\.html$/.test(file)) {
    check(
      html.includes('src="assignment-submission.js"'),
      file + " is missing assignment submission behavior."
    );
    check(
      html.includes("Open this lesson in Safari"),
      file + " is missing the iPhone Safari upload note."
    );
  }
}

check(htmlFiles.length === 17, "Expected 17 HTML pages.");
check(
  existsSync(resolve(root, "assets/accessible-tech-hero.webp")),
  "Homepage technology artwork is missing."
);

const accessibilityScript = readFileSync(resolve(root, "accessibility.js"), "utf8");
check(
  accessibilityScript.includes("Increase text size") &&
    accessibilityScript.includes("Decrease text size") &&
    accessibilityScript.includes("Reset text size") &&
    accessibilityScript.includes("High contrast") &&
    accessibilityScript.includes("Reduce motion"),
  "Accessibility controls are incomplete."
);
check(
  accessibilityScript.includes("browser, screen reader, and device settings"),
  "Accessibility controls must explain that they complement native settings."
);

const submissionScript = readFileSync(resolve(root, "assignment-submission.js"), "utf8");
const submissionWorker = readFileSync(resolve(root, "submissions/worker.js"), "utf8");
check(
  submissionScript.includes('uploadData.append("submission_token"'),
  "The browser submission retry token is missing."
);
check(
  submissionWorker.includes("safePart(submissionToken)"),
  "The R2 Worker is missing idempotent retry handling."
);

if (errors.length) {
  console.error("Site validation failed:");
  for (const error of errors) console.error("- " + error);
  process.exit(1);
}

console.log(
  "Validated " + htmlFiles.length + " pages, local links, accessibility controls, and lesson uploads."
);
