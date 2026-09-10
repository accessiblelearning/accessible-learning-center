import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manualsHtml = readFileSync(resolve(root, "manuals.html"), "utf8");
const manualFiles = [...manualsHtml.matchAll(/<a href="([^"]+-manual\.html)">/g)].map(match => match[1]);
const lessonFiles = readdirSync(root).filter(file => /-lesson-\d+\.html$/.test(file)).sort();
const quizFiles = readdirSync(root).filter(file => /-quiz\.html$/.test(file)).sort();
const helpFiles = [
  "index.html", "manuals.html", "lessons.html", "quizzes.html", "resources.html",
  "command-practice.html", "troubleshooting-lab.html"
];
const files = [...new Set([...manualFiles, ...lessonFiles, ...quizFiles, ...helpFiles])];

if (manualFiles.length !== 53 || lessonFiles.length !== 250 || quizFiles.length !== 25 || files.length !== 335) {
  throw new Error(`Unexpected search catalog size: ${manualFiles.length} manuals, ${lessonFiles.length} lessons, ${quizFiles.length} quizzes, ${files.length} total.`);
}

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
}

function plainText(value) {
  return decodeEntities(value
    .replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<head[\s\S]*?<\/head>/gi, " ").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ").trim();
}

function titleFrom(html, file) {
  const heading = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return plainText(heading?.[1] || title?.[1] || file.replace(/\.html$/, "").replace(/-/g, " "));
}

function courseFrom(html, title) {
  const course = html.match(/data-course="([^"]+)"/i)?.[1];
  if (course) return decodeEntities(course);
  return title.replace(/\s+(Manual|Lesson \d+|Final Quiz|Quiz)$/i, "").trim() || "Accessible Learning Center";
}

const entries = files.map(file => {
  const html = readFileSync(resolve(root, file), "utf8");
  const title = titleFrom(html, file);
  const body = plainText(html);
  const type = file.endsWith("-manual.html") ? "manual" : /-lesson-\d+\.html$/.test(file) ? "lesson" : file.endsWith("-quiz.html") ? "quiz" : "help";
  return {
    title,
    url: file,
    type,
    course: courseFrom(html, title),
    snippet: body.slice(0, 260),
    text: `${title} ${body.slice(0, 1800)}`.toLowerCase()
  };
});

writeFileSync(resolve(root, "search-index.json"), JSON.stringify({ count: entries.length, entries }) + "\n");
console.log(`Built search-index.json with ${entries.length} entries.`);
