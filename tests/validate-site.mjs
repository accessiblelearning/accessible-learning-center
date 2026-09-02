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

if (errors.length) {
  console.error("Site validation failed:");
  for (const error of errors) console.error("- " + error);
  process.exit(1);
}

console.log(
  "Validated " + htmlFiles.length + " pages, local links, accessibility controls, and lesson uploads."
);
