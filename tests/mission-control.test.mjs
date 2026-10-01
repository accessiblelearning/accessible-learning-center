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
    ctrlKey: parts.includes("Control") || parts.includes("VO"), altKey: parts.includes("Alt") || parts.includes("Option") || parts.includes("VO"),
    shiftKey: parts.includes("Shift"), metaKey: parts.includes("Command") });
  if (parts.includes("Insert")) p.get(id).fire("keyup", { key: "Insert" });
  return event;
}

function buildMacCommand(p, command, caps = false) {
  const parts = command.split("+");
  p.get("macVOModifier").value = parts.includes("VO") ? (caps ? "caps" : "vo") : "none";
  p.get("macShift").checked = parts.includes("Shift");
  p.get("macCommand").checked = parts.includes("Command");
  p.get("macFn").checked = parts.includes("Fn");
  p.get("macFinalKey").value = parts.at(-1).toLowerCase();
  p.get("macCommandBuilder").fire("submit");
}

test("every catalog command scores and advances to results", () => {
  const catalog = vm.runInNewContext("(" + source("command-practice.js").match(/const categories = (\{[\s\S]*?\n  \});/)[1] + ")");
  for (const [category, commands] of Object.entries(catalog)) {
    const p = practice(category);
    commands.forEach(([command, , , mode], index) => {
      if (mode === "builder") buildMacCommand(p, command);
      else chord(p, command);
      assert.equal(p.get("practiceScore").textContent, `Correct: ${index + 1} · Attempts: ${index + 1}`, category + ": " + command);
      p.advance();
    });
    assert.equal(p.get("commandResults").hidden, false, category + " results");
  }
});

test("all Mac sets finish using accessible controls with either VO modifier and manual review links", () => {
  const catalog = vm.runInNewContext("(" + source("command-practice.js").match(/const categories = (\{[\s\S]*?\n  \});/)[1] + ")");
  for (const [category, commands] of Object.entries(catalog).filter(([name]) => name.startsWith("Mac VoiceOver "))) {
    const p = practice(category);
    assert.equal(p.get("macCommandPanel").hidden, false);
    assert.equal(p.document.activeElement, p.get("macVOModifier"));
    for (const [index, [command]] of commands.entries()) {
      buildMacCommand(p, command, index % 2 === 1);
      assert.equal(p.get("practiceScore").textContent, `Correct: ${index + 1} · Attempts: ${index + 1}`);
      assert.match(p.get("practiceStatus").textContent, /Correct combination. You built/);
      // Repeated submission during feedback must not score twice.
      p.get("macCommandBuilder").fire("submit");
      assert.equal(p.get("practiceScore").textContent, `Correct: ${index + 1} · Attempts: ${index + 1}`);
      p.advance();
    }
    assert.equal(p.get("macCommandPanel").hidden, true);
    assert.equal(p.get("commandResults").hidden, false);
    assert.match(p.get("commandSuggestedReview").href, /^mac-voiceover-manual.html#/);
    assert.equal(p.get("commandMasteredHeading").textContent, "Commands practiced");
  }
});

test("Mac builder rejects wrong modifiers, preserves attempts, and retries only missed commands", () => {
  const p = practice("Mac VoiceOver basics");
  buildMacCommand(p, "VO+Shift+Right Arrow");
  assert.equal(p.get("practiceScore").textContent, "Correct: 0 · Attempts: 1");
  assert.equal(p.get("commandProgress").value, 0);
  buildMacCommand(p, "Right Arrow");
  assert.equal(p.get("practiceScore").textContent, "Correct: 0 · Attempts: 2");
  for (const command of ["VO+Right Arrow", "VO+Left Arrow", "VO+Down Arrow", "VO+Up Arrow", "VO+Space",
    "VO+Shift+Down Arrow", "VO+Shift+Up Arrow", "VO+K", "VO+H", "VO+A"]) {
    buildMacCommand(p, command); p.advance();
  }
  assert.equal(p.get("commandAttemptResult").textContent, "12");
  p.get("practiceMissed").click();
  assert.equal(p.get("commandPosition").textContent, "Command 1 of 1");
  buildMacCommand(p, "VO+Right Arrow"); p.advance();
  assert.equal(p.get("commandAccuracyResult").textContent, "100%");
});

test("Mac physical commands use Option and Command correctly and do not score a plain final key", () => {
  const p = practice("Mac VoiceOver navigation and web");
  p.key("keyCapture", "d");
  assert.equal(p.get("practiceScore").textContent, "Correct: 0 · Attempts: 1");
  p.key("keyCapture", "∂", { code: "KeyD", ctrlKey: true, altKey: true }); p.advance();
  chord(p, "VO+M"); p.advance(); chord(p, "VO+Shift+M"); p.advance();
  chord(p, "VO+U"); p.advance(); chord(p, "VO+I"); p.advance();
  chord(p, "VO+Right Arrow");
  assert.equal(p.get("practiceScore").textContent, "Correct: 5 · Attempts: 7");
  chord(p, "VO+Command+Right Arrow");
  assert.equal(p.get("practiceScore").textContent, "Correct: 6 · Attempts: 8");
  assert.match(p.get("detectedKeys").textContent, /Option plus Command/);
});

test("Mac system commands are builder-only and accept documented Fn variations", () => {
  const p = practice("Mac VoiceOver reading and settings");
  for (const command of ["VO+P", "VO+L", "VO+S", "VO+W", "VO+C", "VO+V", "VO+Q", "VO+Shift+Q"]) {
    buildMacCommand(p, command); p.advance();
  }
  chord(p, "Command+F5");
  assert.equal(p.get("practiceScore").textContent, "Correct: 8 · Attempts: 8");
  assert.match(p.get("practiceStatus").textContent, /builder/);
  buildMacCommand(p, "Command+Fn+F5"); p.advance();
  buildMacCommand(p, "VO+F8"); p.advance();
  assert.equal(p.get("commandResults").hidden, false);
  assert.equal(p.get("commandCorrectResult").textContent, "10");
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
  p.load("command-courses.js"); p.load("chrome-command-course.js");
  Object.assign(categories, p.window.CommandPracticeCourses);
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

test('Mission Control menus preserve modified screen-reader navigation keys', () => {
  for (const [file,id] of [['mission-center.js','missionCenterMenu'],['command-practice-setup.js','commandTopicsMenu'],['topic-missions-setup.js','topicMissionsMenu'],['mission-settings.js','missionSettingsMenu']]) {
    const p=page(),menu=p.get(id);
    if (id==='missionCenterMenu') for(const key of ['topics','commands']) {const item=p.get(key);item.textContent=key;menu.append(item);}
    if (id==='missionSettingsMenu') for(const key of ['speech','sounds','reader']) {const item=p.get(key+'Setting');item.dataset.setting=key;menu.append(item);}
    p.load('mission-catalog.js');p.load(file);menu.children[0].focus();
    const focused=p.document.activeElement,previous=p.get('speechValue').textContent;
    for(const modifiers of [{ctrlKey:true,altKey:true},{metaKey:true},{shiftKey:true}]) for(const key of ['ArrowDown','ArrowRight','Home','End']) {
      const event=menu.fire('keydown',{key,...modifiers});
      assert.equal(event.defaultPrevented,false,file+': '+key);
      assert.equal(p.document.activeElement,focused);
      assert.equal(p.get('speechValue').textContent,previous);
    }
    menu.fire('keydown',{key:'ArrowDown'});
    assert.notEqual(p.document.activeElement,focused,file+' still allows ordinary arrows');
  }
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

test("shared skip navigation reuses the existing link and focuses main on full and minimal pages", () => {
  for (const minimal of [false, true]) {
    const p = page();
    p.document.body.dataset.minimalPage = String(minimal);
    const existing = p.get('existingSkip'), main = p.get('main');
    const originalQuery = p.document.querySelector;
    p.document.querySelector = selector => selector === 'a.skip-link' ? existing : originalQuery(selector);
    p.load('accessibility.js');
    p.document.fire('DOMContentLoaded');
    assert.equal(p.document.body.children[0], existing);
    assert.equal(main.getAttribute('tabindex'), '-1');
    existing.click();
    assert.equal(p.document.activeElement, main);
  }
});

const courseWindow={};vm.runInNewContext(source('command-courses.js'),{window:courseWindow});
vm.runInNewContext(source('chrome-command-course.js'),{window:courseWindow});
const courses=courseWindow.CommandPracticeCourses;
function coursePage(category,spoken=false){
 const p=page({commandCategory:{value:category},practiceStyle:{value:'guided'},sessionLength:{value:'5'},explanationLevel:{value:'brief'},randomOrder:{checked:true},spokenInstructions:{checked:spoken},soundFeedback:{checked:false}});
 p.load('command-courses.js');p.load('chrome-command-course.js');p.load('command-practice.js');p.get('startPractice').click();return p;
}
function buildStep(p,step){
 const modifiers=['Control','Alt','Shift','Windows','Insert','Caps Lock','VO','Command','Option','Fn'];
 const parts=step.split('+');for(const m of modifiers)p.get('courseMod'+m.replaceAll(' ','')).checked=parts.slice(0,-1).includes(m);
 p.get('courseFinalKey').value=parts.at(-1);p.get('courseCommandBuilder').fire('submit');
}
test('every expanded topic reaches all three levels and completes through the accessible builder',()=>{
 const aliases=new Set(['General editing','Mac VoiceOver navigation and web','Mac VoiceOver reading and settings']);
 for(const [category,items] of Object.entries(courses)){
  if(aliases.has(category))continue;
  const p=coursePage(category);let last='';
  items.forEach((item,i)=>{
   assert.equal(p.get('commandLevel').textContent,item[4].level[0].toUpperCase()+item[4].level.slice(1)+' commands · '+category);
   if(item[4].level!==last){const text=p.get('practiceStatus').children.map(x=>x.textContent).join(' ');assert.match(text,item[4].level==='basic'?/Starting with basic commands/:new RegExp('Moving to '+item[4].level+' level commands'));last=item[4].level;}
   for(const step of item[4].steps)buildStep(p,step);
   assert.equal(p.get('practiceScore').textContent,`Correct: ${i+1} · Attempts: ${i+1}`,category+': '+item[0]);
   p.advance();
  });
  assert.equal(p.get('commandResults').hidden,false,category);assert.equal(p.get('courseBuilderPanel').hidden,true);
 }
});
test('Google Docs covers menus, heading depths, table navigation and accurate redo semantics',()=>{
 const c=courses['Google Docs and applications'];assert.ok(c.length>150);
 for(const keys of ['Alt+F','Alt+Shift+F','Control+Alt+N then Control+Alt+H','Control+Alt+Shift+T then Control+Alt+Shift+M','Control+Alt+N then Control+Alt+6','Control+Alt+M'])assert.ok(c.some(x=>x[0]===keys),keys);
 assert.match(c.find(x=>x[0]==='Control+Shift+Z')[1],/Redo/);assert.match(c.find(x=>x[0]==='Control+Y')[1],/Repeat/);
 assert.ok(Object.values(courses).every(items=>items.every(item=>item[2].length>40&&item[4].source.startsWith('https://')&&item[4].steps.length)));
});
test('multi-step commands require each step, preserve the current step after a mistake, and count one completed command',()=>{
 const name='Google Docs and applications',items=courses[name],index=items.findIndex(x=>x[4].steps.length>1),p=coursePage(name);
 for(const item of items.slice(0,index)){for(const step of item[4].steps)buildStep(p,step);p.advance();}
 const steps=items[index][4].steps;buildStep(p,steps[0]);assert.match(p.get('courseStep').textContent,/Step 2/);
 buildStep(p,'F2');assert.match(p.get('practiceStatus').textContent,/Not quite/);assert.equal(p.get('practiceScore').textContent,`Correct: ${index} · Attempts: ${index+1}`);
 for(const step of steps.slice(1))buildStep(p,step);
 assert.equal(p.get('practiceScore').textContent,`Correct: ${index+1} · Attempts: ${index+2}`);
});
test('expanded direct commands accept chords and protected commands require separated key presses',()=>{
 const p=coursePage('Google Docs and applications');chord(p,'Control+C');assert.equal(p.get('practiceScore').textContent,'Correct: 1 · Attempts: 1');p.advance();
 const q=coursePage('Windows and File Explorer');q.key('keyCapture','e',{metaKey:true});assert.equal(q.get('practiceScore').textContent,'Correct: 0 · Attempts: 0');assert.match(q.get('practiceStatus').textContent,/one key at a time/);
 buildStep(q,'Windows+E');assert.equal(q.get('practiceScore').textContent,'Correct: 1 · Attempts: 1');
});
test('course data stays ordered, preserves all old categories, and avoids unsupported keys or legacy Narrator collisions',()=>{
 const levels=['basic','intermediate','advanced'];
 for(const [name,items] of Object.entries(courses)){
  assert.deepEqual([...new Set(items.map(x=>x[4].level))],levels,name);
  for(const item of items){assert.equal(item[0],item[4].steps.join(' then '));assert.ok(item[4].steps.every(step=>step.split('+').at(-1)));}
 }
 const f12=courses['Narrator commands'].filter(x=>x[0]==='Insert+F12');assert.equal(f12.length,1);assert.match(f12[0][1],/time and date/);
});

function tapCourseKey(p,key) {
 const aliases={Option:'Alt',Command:'Meta',Windows:'Meta',VO:'Control',Space:' ',Escape:'Escape',
  'Caps Lock':'CapsLock','Left Arrow':'ArrowLeft','Right Arrow':'ArrowRight','Up Arrow':'ArrowUp','Down Arrow':'ArrowDown',
  'Page Up':'PageUp','Page Down':'PageDown','Less Than':',','Greater Than':'.'};
 p.key('keyCapture',aliases[key]||key);
}
function courseAt(category,keys) {
 const p=coursePage(category),items=courses[category],index=items.findIndex(x=>x[0]===keys);
 assert.ok(index>=0);
 for(const item of items.slice(0,index)){for(const step of item[4].steps)buildStep(p,step);p.advance();}
 return {p,index};
}
test('slash is named explicitly in prompts, speech, feedback and the picker, and remains distinct from period',()=>{
 const {p,index}=courseAt('Google Docs and applications','Control+/'),speech=[];
 p.get('spokenInstructions').checked=true;
 p.window.speechSynthesis.speak=utterance=>speech.push(utterance.text);
 assert.equal(p.get('commandPrompt').children[0].textContent,'Press Control plus slash');
 assert.equal(p.get('courseFinalKey').children.find(option=>option.value==='/').textContent,'slash');
 p.key('keyCapture','Control');assert.match(speech.at(-1),/Press Control plus slash\./);
 p.key('keyCapture','.',{code:'Period',ctrlKey:true});
 assert.equal(p.get('practiceScore').textContent,`Correct: ${index} · Attempts: ${index+1}`);
 assert.match(speech.at(-1),/Control plus period\. Try Control plus slash\./);
 p.key('keyCapture','/',{code:'Slash',ctrlKey:true});
 assert.equal(p.get('practiceScore').textContent,`Correct: ${index+1} · Attempts: ${index+2}`);
 assert.match(speech.at(-1),/Control plus slash\./);
});
test('all protected exercises finish using separate key presses with the picker closed',()=>{
 const aliases=new Set(['General editing','Mac VoiceOver navigation and web','Mac VoiceOver reading and settings']);
 for(const [category,items] of Object.entries(courses)){
  if(aliases.has(category))continue;
  const p=coursePage(category);
  items.forEach((item,i)=>{
   if(item[3]==='safe'){
    assert.equal(p.get('courseBuilderPanel').open,false);
    assert.equal(p.document.activeElement,p.get('keyCapture'));
    for(const step of item[4].steps)for(const key of step.split('+').flatMap(k=>k==='VO'?['Control','Option']:[k]))tapCourseKey(p,key);
   }else for(const step of item[4].steps)buildStep(p,step);
   assert.equal(p.get('practiceScore').textContent,`Correct: ${i+1} · Attempts: ${i+1}`,category+': '+item[0]);
   p.advance();
  });
 }
});
test('Alt Enter waits for releases, ignores held-key repeats, and teaches the real chord',()=>{
 const {p,index}=courseAt('Google Docs and applications','Alt+Enter');
 assert.match(p.get('commandPrompt').children.map(e=>e.textContent).join(' '),/Normally, hold Alt, press Enter, then release both keys/);
 p.get('keyCapture').fire('keydown',{key:'Alt',altKey:true});
 p.get('keyCapture').fire('keydown',{key:'Alt',altKey:true,repeat:true});
 assert.equal(p.get('commandPrompt').children[0].textContent,'Press and release Alt');
 p.get('keyCapture').fire('keyup',{key:'Alt'});
 assert.equal(p.get('commandPrompt').children[0].textContent,'Press and release Enter');
 p.get('keyCapture').fire('keydown',{key:'Enter'});
 assert.equal(p.get('practiceScore').textContent,`Correct: ${index} · Attempts: ${index}`);
 p.get('keyCapture').fire('keyup',{key:'Enter'});
 assert.equal(p.get('practiceScore').textContent,`Correct: ${index+1} · Attempts: ${index+1}`);
});
test('protected input resets on overlap or focus loss and never accepts an omitted modifier',()=>{
 const {p,index}=courseAt('Google Docs and applications','Alt+Shift+F');
 tapCourseKey(p,'Alt');tapCourseKey(p,'F');
 assert.equal(p.get('practiceScore').textContent,`Correct: ${index} · Attempts: ${index+1}`);
 assert.equal(p.get('commandPrompt').children[0].textContent,'Press and release Alt');
 p.get('keyCapture').fire('keydown',{key:'Alt',altKey:true});
 p.get('keyCapture').fire('keydown',{key:'Shift',altKey:true,shiftKey:true});
 p.get('keyCapture').fire('keyup',{key:'Shift',altKey:true});p.get('keyCapture').fire('keyup',{key:'Alt'});
 assert.equal(p.get('commandPrompt').children[0].textContent,'Press and release Alt');
 tapCourseKey(p,'Alt');p.window.fire('blur');assert.equal(p.get('commandPrompt').children[0].textContent,'Press and release Alt');
 for(const key of ['Alt','Shift','F'])tapCourseKey(p,key);
 assert.equal(p.get('practiceScore').textContent,`Correct: ${index+1} · Attempts: ${index+2}`);
});
test('Control repeats unless it is requested; unrelated Tab exits capture and Escape exits practice',()=>{
 const {p,index}=courseAt('Google Docs and applications','Alt+Enter');
 tapCourseKey(p,'Control');assert.match(p.get('practiceStatus').textContent,/Normally, hold Alt/);
 assert.equal(p.get('practiceScore').textContent,`Correct: ${index} · Attempts: ${index}`);
 tapCourseKey(p,'Alt');tapCourseKey(p,'Control');
 assert.equal(p.get('commandPrompt').children[0].textContent,'Press and release Enter');
 assert.equal(p.get('practiceScore').textContent,`Correct: ${index} · Attempts: ${index}`);
 const tab=p.key('keyCapture','Tab');assert.equal(tab.defaultPrevented,false);
 tapCourseKey(p,'Escape');assert.equal(p.window.location.href,'command-practice.html');
 const q=coursePage('NVDA commands');tapCourseKey(q,'Control');assert.equal(q.get('practiceScore').textContent,'Correct: 1 · Attempts: 1');
 const {p:r,index:ri}=courseAt('Firefox browser','Control+Shift+T');
 tapCourseKey(r,'Control');tapCourseKey(r,'Control');
 assert.equal(r.get('commandPrompt').children[0].textContent,'Press and release Shift');
 assert.match(r.get('practiceStatus').textContent,/Next: press and release Shift/);
 tapCourseKey(r,'Shift');tapCourseKey(r,'T');
 assert.equal(r.get('practiceScore').textContent,`Correct: ${ri+1} · Attempts: ${ri+1}`);
});


test('speech service exceptions do not block practice, automatic advance, or stopping', () => {
  for (const failure of ['speak', 'cancel']) {
    const p = page({commandCategory:{value:'General editing'},practiceStyle:{value:'quick'},sessionLength:{value:'all'},spokenInstructions:{checked:true}});
    p.window.speechSynthesis[failure] = () => { throw Error('Speech unavailable'); };
    p.load('command-practice.js');p.get('startPractice').click();
    chord(p,'Control+C');assert.match(p.get('practiceScore').textContent,/Correct: 1/);
    p.advance();chord(p,'Control+X');assert.match(p.get('practiceScore').textContent,/Correct: 2/);
    p.get('stopPractice').click();assert.equal(p.window.location.href,'command-practice.html');
  }
});

test('menu focus and toolbar fallback survive speech failures', () => {
  for (const failure of ['speak','cancel']) {
    for (const [file,id] of [['mission-center.js','missionCenterMenu'],['command-practice-setup.js','commandTopicsMenu'],['topic-missions-setup.js','topicMissionsMenu'],['mission-settings.js','missionSettingsMenu']]) {
      const p=page(),menu=p.get(id);
      p.storage.setItem('accessibleLearningPreferences',JSON.stringify({trainingSpeech:'voice'}));
      p.window.speechSynthesis[failure]=()=>{throw Error('Speech unavailable');};
      if(id==='missionCenterMenu')for(const key of ['topics','commands']){const item=p.get(key);item.textContent=key;menu.append(item);}
      if(id==='missionSettingsMenu')for(const key of ['speech','sounds','reader']){const item=p.get(key+'Setting');item.dataset.setting=key;menu.append(item);}
      p.load('mission-catalog.js');p.load(file);p.advance();
      menu.children[0].focus();menu.fire('keydown',{key:'ArrowDown'});
      assert.equal(p.document.activeElement,menu.children[1],file);
    }
  }
  const p=practice();p.load('mission-ui.js');p.window.fire('DOMContentLoaded');p.advance();
  p.window.speechSynthesis.speak=()=>{throw Error('Speech unavailable');};
  const voice=p.get('main.mission-center-shell').children[0].children[2];voice.click();
  assert.equal(p.get('spokenInstructions').checked,false);
  assert.equal(JSON.parse(p.storage.getItem('accessibleLearningPreferences')).trainingSpeech,'own');
  assert.equal(p.get('practiceStatus').getAttribute('aria-live'),'polite');
  assert.equal(p.document.activeElement,p.get('keyCapture'));
  chord(p,'Control+C');assert.match(p.get('practiceScore').textContent,/Correct: 1/);
});

test('square bracket prompts locate the key and reject the comma/less-than key',()=>{
 const {p,index}=courseAt('Microsoft Word and documents','Control+['),speech=[];
 p.get('spokenInstructions').checked=true;p.window.speechSynthesis.speak=u=>speech.push(u.text);
 assert.equal(p.get('commandPrompt').children[0].textContent,'Press Control plus left square bracket');
 p.key('keyCapture',',',{code:'Comma',ctrlKey:true});
 assert.equal(p.get('practiceScore').textContent,`Correct: ${index} · Attempts: ${index+1}`);
 assert.match(speech.at(-1),/left square bracket/);assert.match(speech.at(-1),/right of P/);
 p.key('keyCapture','<',{code:'Comma',ctrlKey:true,shiftKey:true});
 assert.equal(p.get('practiceScore').textContent,`Correct: ${index} · Attempts: ${index+2}`);
 p.key('keyCapture','[',{code:'BracketLeft',ctrlKey:true});
 assert.equal(p.get('practiceScore').textContent,`Correct: ${index+1} · Attempts: ${index+3}`);
});

test('font-size shortcuts recognize shifted comma and period while requiring Shift',()=>{
 for(const category of ['Microsoft Word and documents','Presentations'])for(const [name,code,base,symbol] of [['Less Than','Comma',',','<'],['Greater Than','Period','.','>']])for(const key of [base,symbol]){
  const {p,index}=courseAt(category,'Control+Shift+'+name);
  p.key('keyCapture',base,{code,ctrlKey:true});
  assert.equal(p.get('practiceScore').textContent,`Correct: ${index} · Attempts: ${index+1}`);
  p.key('keyCapture',key,{code,ctrlKey:true,shiftKey:true});
  assert.equal(p.get('practiceScore').textContent,`Correct: ${index+1} · Attempts: ${index+2}`,category+' '+name+' '+key);
 }
});

test('separated-key angle-symbol practice uses the shared unshifted key after the Shift step',()=>{
 for(const [name,code,base] of [['Less Than','Comma',','],['Greater Than','Period','.']]){
  const {p,index}=courseAt('Microsoft Word and documents','Alt+Shift+'+name);
  tapCourseKey(p,'Alt');p.key('keyCapture',base,{code});
  assert.equal(p.get('practiceScore').textContent,`Correct: ${index} · Attempts: ${index+1}`);
  tapCourseKey(p,'Alt');tapCourseKey(p,'Shift');p.key('keyCapture',base,{code});
  assert.equal(p.get('practiceScore').textContent,`Correct: ${index+1} · Attempts: ${index+2}`);
 }
});
