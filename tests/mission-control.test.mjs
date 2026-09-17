import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { test } from "node:test";

const source = file => readFileSync(new URL("../" + file, import.meta.url), "utf8");

// Small event/DOM fixture for the production controllers. Layout and native
// keyboard focus order are checked separately in the browser.
function page(initial = {}, audio) {
  const nodes = new Map(), timers = new Map(), data = new Map();
  let document, timerId = 0;
  class Element {
    constructor(id = "") {
      Object.assign(this, { id, value: "", checked: false, disabled: false, hidden: false,
        textContent: "", children: [], listeners: {}, attributes: {}, dataset: {}, style: {} });
      const classes = new Set();
      this.classList = { add: (...v) => v.forEach(x => classes.add(x)), remove: (...v) => v.forEach(x => classes.delete(x)),
        contains: value => classes.has(value), toggle: (value, on) => on ? classes.add(value) : classes.delete(value) };
    }
    addEventListener(type, listener) { (this.listeners[type] ||= []).push(listener); }
    fire(type, details = {}) {
      const event = { target: this, key: "", ctrlKey: false, altKey: false, shiftKey: false,
        metaKey: false, repeat: false, defaultPrevented: false,
        preventDefault() { this.defaultPrevented = true; }, stopPropagation() {}, ...details };
      for (const listener of this.listeners[type] || []) listener(event);
      return event;
    }
    focus() { document.activeElement?.fire("blur"); document.activeElement = this; this.fire("focus"); }
    click() { if (!this.disabled) this.fire("click"); }
    closest(selector) { if (selector === "[hidden]") return this.hidden ? this : null; return this.closestMatch === false ? null : this; }
    querySelector(selector) { return get(this.id + " " + selector); }
    querySelectorAll() { return this.children; }
    append(...children) { this.children.push(...children); }
    appendChild(child) { this.append(child); return child; }
    prepend(...children) { this.children.unshift(...children); }
    replaceChildren(...children) { this.children = children; }
    setAttribute(name, value) { this.attributes[name] = value; }
    getAttribute(name) { return this.attributes[name] ?? null; }
    removeAttribute(name) { delete this.attributes[name]; }
  }
  const get = id => { if (!nodes.has(id)) nodes.set(id, new Element(id)); return nodes.get(id); };
  document = new Element();
  Object.assign(document, { getElementById: get, querySelector: get, createElement: () => new Element(),
    documentElement: new Element(), body: new Element(), activeElement: null });
  document.body.dataset = { practiceSession: "true", missionSession: "true" };
  Object.entries(initial).forEach(([id, props]) => Object.assign(get(id), props));
  const window = new Element();
  const location = { search: "?sounds=1", pathname: "/mission-settings.html", hostname: "localhost", href: "", replace(url) { this.href = url; } };
  const speech = { cancel() {}, speak() {} };
  class Utterance { constructor(text) { this.text = text; } addEventListener() {} }
  Object.assign(window, { location, AudioContext: audio, speechSynthesis: speech, SpeechSynthesisUtterance: Utterance,
    setTimeout(fn) { timers.set(++timerId, fn); return timerId; }, clearTimeout(id) { timers.delete(id); },
    dispatchEvent(event) { this.fire(event.type, event); } });
  const storage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
  const context = vm.createContext({ window, document, location, navigator: {}, URLSearchParams,
    localStorage: storage, sessionStorage: storage, speechSynthesis: speech, SpeechSynthesisUtterance: Utterance,
    CustomEvent: class { constructor(type, options) { Object.assign(this, { type }, options); } } });
  return { get, document, window, storage,
    load(file) { vm.runInContext(source(file), context, { filename: file }); },
    key(id, key, options = {}) { const event = get(id).fire("keydown", { key, ...options }); get(id).fire("keyup", { key, ...options }); return event; },
    advance() { const pending = [...timers.values()]; timers.clear(); pending.forEach(fn => fn()); } };
}

function practice(category = "General editing", audio) {
  const p = page({ commandCategory: { value: category }, practiceStyle: { value: "quick" },
    sessionLength: { value: "all" }, explanationLevel: { value: "brief" }, soundFeedback: { checked: false } }, audio);
  p.load("command-practice.js");
  p.get("startPractice").click();
  return p;
}

function chord(p, command, id = "keyCapture") {
  const aliases = { "Left Arrow": "ArrowLeft", "Right Arrow": "ArrowRight", "Up Arrow": "ArrowUp",
    "Down Arrow": "ArrowDown", "Page Down": "PageDown", "Page Up": "PageUp", Space: " ",
    Equals: "=", Semicolon: ";", Grave: "`", "Greater Than": ">", "Less Than": "<" };
  const parts = command.split("+");
  if (parts.includes("Insert")) p.get(id).fire("keydown", { key: "Insert" });
  if (parts.includes("Caps Lock")) p.key(id, "CapsLock");
  const event = p.key(id, aliases[parts.at(-1)] || parts.at(-1), {
    ctrlKey: parts.includes("Control"), altKey: parts.includes("Alt"), shiftKey: parts.includes("Shift") });
  if (parts.includes("Insert")) p.get(id).fire("keyup", { key: "Insert" });
  return event;
}

test("every catalog command scores and advances to results", () => {
  const catalog = vm.runInNewContext("(" + source("command-practice.js").match(/const categories = (\{[\s\S]*?\n  \});/)[1] + ")");
  for (const [category, commands] of Object.entries(catalog)) {
    const p = practice(category);
    commands.forEach(([command], index) => {
      chord(p, command);
      assert.equal(p.get("practiceScore").textContent, `Correct: ${index + 1} · Attempts: ${index + 1}`, category + ": " + command);
      p.advance();
    });
    assert.equal(p.get("commandResults").hidden, false, category + " results");
  }
});

test("Insert release, missing release, focus loss, and retry do not leave a modifier stuck", () => {
  const p = practice("JAWS commands");
  p.key("keyCapture", "Insert");
  p.key("keyCapture", "t");
  p.advance();
  p.get("keyCapture").fire("keydown", { key: "Insert" });
  for (const key of ["Tab", "F6", "F7", "1", "h"]) { p.key("keyCapture", key); p.advance(); }
  assert.equal(p.get("practiceScore").textContent, "Correct: 6 · Attempts: 6");
  p.key("keyCapture", "h", { shiftKey: true }); p.advance();
  p.get("practiceMissed").click();
  p.key("keyCapture", "t");
  assert.equal(p.get("practiceScore").textContent, "Correct: 1 · Attempts: 1");
  const plain = practice("Web and screen-reader navigation");
  plain.get("keyCapture").fire("keydown", { key: "Insert" });
  plain.window.fire("blur");
  plain.key("keyCapture", "h");
  assert.equal(plain.get("practiceScore").textContent, "Correct: 1 · Attempts: 1");
});

test("new topic routes wait for the mission catalog and reject invalid mission numbers", () => {
  for (const [mission, valid] of [["8", true], ["12", true], ["13", false], ["", false], ["-1", false], ["1.5", false]]) {
    const p = page();
    p.window.location.search = `?reader=jaws&mission=${mission}`;
    p.load("topic-mission-session.js");
    p.load("troubleshooting-lab.js");
    p.window.fire("DOMContentLoaded");
    assert.equal(p.window.location.href === "topic-missions.html", !valid, mission);
    if (valid) {
      assert.equal(p.get("missionSelect").value, mission);
      p.get("missionReadyStart").click();
      assert.match(p.get("missionProblem").textContent, /Thunderbird|Learning Ally/);
    }
  }
});

test("protected magnifier input clears on focus loss and Bookshare retains Shift", () => {
  const p = practice("ZoomText and Fusion Desktop magnification");
  p.key("keyCapture", "CapsLock"); p.window.fire("blur");
  p.key("keyCapture", "ArrowUp");
  assert.equal(p.get("practiceScore").textContent, "Correct: 0 · Attempts: 1");
  p.key("keyCapture", "CapsLock"); p.key("keyCapture", "ArrowUp");
  assert.equal(p.get("practiceScore").textContent, "Correct: 1 · Attempts: 2");
  const m = page({ atPerspective: { value: "jaws" }, missionSelect: { value: "11" } });
  m.load("troubleshooting-lab.js"); m.get("startMission").click();
  m.key("missionControlStation", "Alt"); m.key("missionControlStation", "b");
  m.key("missionControlStation", "Alt"); m.key("missionControlStation", "b", { shiftKey: true });
  assert.equal(m.get("missionResults").hidden, false);
  assert.equal(m.get("missionAttemptResult").textContent, "2");
  assert.equal(m.get("missionSuggestedReview").href, "bookshare-manual.html");
});

test("new browser commands complete through protected input without opening browser UI", () => {
  const p = practice("Firefox browser");
  for (const key of ["l", "t", "t", "d", "o", "j"]) {
    assert.equal(p.key("keyCapture", "Control").defaultPrevented, true);
    assert.equal(p.key("keyCapture", key).defaultPrevented, true);
    p.advance();
  }
  assert.equal(p.get("practiceScore").textContent, "Correct: 6 · Attempts: 6");
  const m = page({ atPerspective: { value: "jaws" }, missionSelect: { value: "9" } });
  m.load("troubleshooting-lab.js"); m.get("startMission").click();
  for (const key of ["t", "d"]) {
    m.key("missionControlStation", "Control");
    assert.match(m.get("transcript").textContent, /Protected practice/);
    m.key("missionControlStation", key);
  }
  assert.equal(m.get("missionResults").hidden, false);
});

test("every manual menu entry resolves to an existing command set and mission", () => {
  const p = page(); p.load("mission-catalog.js"); p.load("troubleshooting-lab.js");
  const categories = vm.runInNewContext("(" + source("command-practice.js").match(/const categories = (\{[\s\S]*?\n  \});/)[1] + ")");
  const ids = new Set();
  for (const manual of p.window.MissionControlCatalog) {
    for (const set of [...manual.commandSets, ...manual.missionSets]) {
      assert.equal(ids.has(set.id), false, set.id); ids.add(set.id);
    }
    manual.commandSets.forEach(set => assert.ok(categories[set.category], set.category));
    manual.missionSets.forEach(set => assert.ok(Number(set.mission) < p.window.MissionControlMissionCount));
  }
  for (const id of ["thunderbird", "firefox", "zoomtext-fusion", "bookshare", "learning-ally"]) {
    const manual = p.window.MissionControlCatalog.find(item => item.id === id);
    assert.ok(manual?.commandSets.length && manual?.missionSets.length, id);
  }
});

test("unrelated Tab leaves command capture without adding an attempt", () => {
  const p = practice();
  assert.equal(p.key("keyCapture", "Tab").defaultPrevented, false);
  assert.equal(p.key("keyCapture", "Tab", { shiftKey: true }).defaultPrevented, false);
  assert.equal(p.get("practiceScore").textContent, "Correct: 0 · Attempts: 0");
});

test("protected commands retain their two-step input", () => {
  const p = practice("Microsoft Excel and spreadsheets");
  chord(p, "Control+Space"); p.advance(); chord(p, "Shift+Space"); p.advance();
  p.key("keyCapture", "Control"); p.key("keyCapture", "PageDown"); p.advance();
  assert.equal(p.get("practiceScore").textContent, "Correct: 3 · Attempts: 3");
});

test("each new task still reaches a personal screen reader's live region", () => {
  const p = practice();
  assert.match(p.get("practiceStatus").children[0].textContent, /Press Control plus C/);
  chord(p, "Control+C"); p.advance();
  assert.match(p.get("practiceStatus").children[0].textContent, /Press Control plus X/);
});

test("missing or failing audio cannot block scoring or automatic advancement", async () => {
  for (const audio of [undefined, class { constructor() { throw Error("Audio unavailable"); } },
    class { createOscillator() { throw Error("Output unavailable"); } },
    class { state = "suspended"; resume() { return Promise.reject(Error("Playback blocked")); } createOscillator() { throw Error("No output"); } }]) {
    const p = practice("General editing", audio);
    p.get("soundFeedback").checked = true;
    chord(p, "Control+C"); p.advance(); chord(p, "Control+X");
    assert.equal(p.get("practiceScore").textContent, "Correct: 2 · Attempts: 2");
  }
  await Promise.resolve();
});

test("missions show hints, retain focus, allow Tab, and complete despite sound failure", () => {
  const solutions = [["Insert+T", "Alt+Tab", "Control+S"], ["E", "Enter"], ["Control+S", "Alt+F4"],
    ["Control+Z", "Control+S"], ["Control+C", "Control+V"], ["Alt+A", "Alt+U"], ["Alt+F4"], ["F2", "Enter"],
    ["Control+S", "Control+Shift+A"], ["Control+Shift+T", "Control+D"],
    ["Caps Lock+Up Arrow", "Caps Lock+Enter"], ["Alt+B", "Alt+Shift+B"], ["Enter", "Enter"]];
  for (const reader of ["jaws", "nvda", "narrator"]) for (const [index, solution] of solutions.entries()) {
    const p = page({ atPerspective: { value: reader }, missionSelect: { value: String(index) } },
      class { constructor() { throw Error("No audio"); } });
    p.load("troubleshooting-lab.js"); p.get("startMission").click();
    const control = p.get("missionControlStation");
    assert.equal(p.key(control.id, "Tab").defaultPrevented, false);
    p.key(control.id, "F1");
    assert.match(p.get("transcript").textContent, /Strategy hint/);
    p.document.activeElement = p.document.body;
    p.get("missionProblem").closestMatch = false;
    p.get(".focused-mission").fire("click", { target: p.get("missionProblem") });
    assert.equal(p.document.activeElement, control);
    for (const command of solution) chord(p, command, control.id);
    assert.equal(p.get("missionResults").hidden, false, `${reader} mission ${index}`);
    assert.equal(p.get("missionAttemptResult").textContent, String(solution.length));
    p.get("retryMissionResult").click();
    assert.equal(p.get("missionResults").hidden, true);
  }
});

test("display controls preserve the voice selected by Mission Settings", () => {
  const p = page();
  const menu = p.get("missionSettingsMenu");
  for (const key of ["speech", "sounds", "reader", "style", "length", "level", "order"]) {
    const item = p.get(key + "Setting"); item.dataset.setting = key;
    item.querySelector(".mission-setting-label").textContent = key;
    menu.append(item);
  }
  p.load("accessibility.js"); p.load("mission-settings.js");
  p.document.fire("DOMContentLoaded");
  p.get("speechSetting").click();
  const panel = p.document.body.children[1];
  for (const action of ["increase", "dark", "contrast", "motion", "reset-text"]) {
    const button = p.get(action); button.dataset.action = action;
    panel.fire("click", { target: button });
    assert.equal(JSON.parse(p.storage.getItem("accessibleLearningPreferences")).trainingSpeech, "voice");
  }
  p.get("speechSetting").click();
  panel.fire("click", { target: p.get("increase") });
  assert.equal(JSON.parse(p.storage.getItem("accessibleLearningPreferences")).trainingSpeech, "own");
});

test("shared toolbar toggles website controls and practice speech without resetting a task", () => {
  const p = practice();
  p.load("mission-ui.js");
  p.window.fire("DOMContentLoaded"); p.advance();
  const [, controls, voice] = p.get("main.mission-center-shell").children[0].children;
  assert.equal(controls.getAttribute("aria-expanded"), "false");
  controls.click();
  assert.equal(controls.getAttribute("aria-expanded"), "true");
  assert.equal(p.document.body.classList.contains("mission-website-controls-hidden"), false);
  voice.click();
  assert.equal(p.get("spokenInstructions").checked, true);
  assert.equal(p.document.activeElement, p.get("keyCapture"));
  assert.equal(p.get("practiceStatus").getAttribute("aria-live"), "off");
  voice.click();
  assert.equal(p.get("spokenInstructions").checked, false);
  assert.equal(p.get("practiceStatus").getAttribute("aria-live"), "polite");
  chord(p, "Control+C");
  assert.equal(p.get("practiceScore").textContent, "Correct: 1 · Attempts: 1");
});

test("toolbar and Settings voice stay synchronized; Left and Right change values", () => {
  const p = page(); p.document.body.dataset = {};
  const menu = p.get("missionSettingsMenu");
  for (const key of ["speech", "sounds", "reader", "style", "length", "level", "order"]) {
    const item = p.get(key + "Setting"); item.dataset.setting = key;
    item.querySelector(".mission-setting-label").textContent = key; menu.append(item);
  }
  p.load("mission-ui.js"); p.load("mission-settings.js");
  p.window.fire("DOMContentLoaded"); p.advance();
  const voice = p.get("main.mission-center-shell").children[0].children[2];
  voice.click();
  assert.equal(p.get("speechValue").textContent, "Use the Mission Control voice");
  p.get("speechSetting").click();
  assert.equal(voice.textContent, "Voice: My screen reader");
  p.get("readerSetting").focus();
  menu.fire("keydown", { key: "ArrowLeft" });
  assert.equal(p.get("readerValue").textContent, "NVDA");
  menu.fire("keydown", { key: "ArrowRight" });
  assert.equal(p.get("readerValue").textContent, "JAWS");
});

test("progress tracks the current command set and the current mission's steps", () => {
  const p = practice();
  assert.equal(p.get("commandPosition").textContent, "Command 1 of 10");
  chord(p, "Control+C"); p.advance();
  assert.equal(p.get("commandProgress").value, 1);
  assert.equal(p.get("commandPosition").textContent, "Command 2 of 10");
  const m = page({ atPerspective: { value: "jaws" }, missionSelect: { value: "0" } });
  m.load("troubleshooting-lab.js"); m.get("startMission").click();
  assert.equal(m.get("missionProgress").max, 3);
  chord(m, "Insert+T", "missionControlStation");
  assert.equal(m.get("missionProgress").value, 1);
  assert.equal(m.get("missionCount").textContent, "Step 2 of 3");
});
