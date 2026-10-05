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
  for (const [mission, valid] of [["8", true], ["12", true], ["19", true], ["20", true], ["21", true], ["22", true], ["23", true], ["24", true], ["25", false], ["", false], ["-1", false], ["1.5", false]]) {
    const p = page();
    p.window.location.search = `?reader=jaws&mission=${mission}`;
    p.load("topic-mission-session.js");
    p.load("troubleshooting-lab.js");
    p.window.fire("DOMContentLoaded");
    assert.equal(p.window.location.href === "topic-missions.html", !valid, mission);
    if (valid) {
      assert.equal(p.get("missionSelect").value, mission);
      p.get("missionReadyStart").click();
      assert.match(p.get("missionProblem").textContent, /Thunderbird|Learning Ally|PowerPoint|Chrome|Mac lesson-player|Focus 40|Meeting Notes/);
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
    for (const [index, command] of solution.entries()) {
      const oldPrompt = p.get("missionProblem").textContent;
      chord(p, command, control.id);
      if (index < solution.length - 1) {
        const prompt = p.get("missionProblem").textContent;
        assert.notEqual(prompt, oldPrompt);
        assert.ok(p.get("transcript").textContent.includes(prompt));
        assert.ok(p.get("transcript").textContent.includes(`Step ${index + 2} of ${solution.length}`));
        p.key(control.id, "Control");
        assert.ok(p.get("transcript").textContent.includes(prompt));
      }
    }
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

test('Mission Settings recovers from malformed saved objects and preserves display preferences', () => {
 for(const value of ['null','true','12','"text"','[]','{bad']){
  const p=page();p.document.body.dataset={};const menu=p.get('missionSettingsMenu');
  for(const key of ['speech','sounds','reader']){const item=p.get(key+'Setting');item.dataset.setting=key;menu.append(item);}
  p.storage.setItem('missionControlPracticeSettings',value);p.storage.setItem('accessibleLearningPreferences',value);
  p.load('mission-ui.js');p.load('mission-settings.js');p.window.fire('DOMContentLoaded');p.advance();
  p.get('speechSetting').click();assert.equal(p.get('speechValue').textContent,'Use the Mission Control voice');
  assert.equal(JSON.parse(p.storage.getItem('accessibleLearningPreferences')).trainingSpeech,'voice');
  assert.equal(p.get('main.mission-center-shell').children[0].children[2].textContent,'Voice: Mission Control');
  p.storage.setItem('accessibleLearningPreferences',JSON.stringify({trainingSpeech:'voice',textScale:160,highContrast:true}));
  p.get('speechSetting').click();const saved=JSON.parse(p.storage.getItem('accessibleLearningPreferences'));
  assert.equal(saved.textScale,160);assert.equal(saved.highContrast,true);assert.equal(saved.trainingSpeech,'own');
 }
});

test('blocked settings storage reports the failure and keeps voice and keyboard controls usable for this visit', () => {
 const p=page();p.document.body.dataset={};const menu=p.get('missionSettingsMenu'),spoken=[];
 for(const key of ['speech','sounds','reader']){const item=p.get(key+'Setting');item.dataset.setting=key;menu.append(item);}
 p.window.speechSynthesis.speak=u=>spoken.push(u.text);
 p.storage.setItem=()=>{throw Error('Storage full');};
 p.load('mission-ui.js');p.load('mission-settings.js');p.window.fire('DOMContentLoaded');p.advance();
 p.get('speechSetting').click();
 assert.match(p.get('missionSettingsStatus').textContent,/could not be saved/);
 assert.equal(p.get('missionSettingsSaveWarning').hidden,false);assert.match(spoken.at(-1),/could not be saved/);
 const voice=p.get('main.mission-center-shell').children[0].children[2];assert.equal(voice.textContent,'Voice: Mission Control');
 p.get('readerSetting').focus();menu.fire('keydown',{key:'ArrowRight'});assert.equal(p.get('readerValue').textContent,'Narrator');
 voice.click();assert.equal(p.get('speechValue').textContent,'Use my own screen reader');assert.equal(voice.textContent,'Voice: My screen reader');
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


test("Word mission announces the save step, repeats it, and gives a current hint", () => {
  const p = page({ atPerspective: { value: "jaws" }, missionSelect: { value: "3" }, simulatedVoice: { checked: true } });
  const spoken = [];
  p.window.speechSynthesis.speak = utterance => spoken.push(utterance.text);
  p.load("troubleshooting-lab.js"); p.get("startMission").click();
  const id = "missionControlStation";
  p.get(id).fire("keydown", { key: "Control", ctrlKey: true });
  chord(p, "Control+Z", id);
  p.get(id).fire("keyup", { key: "Control" });
  assert.match(spoken.at(-1), /Selected text restored.*Step 2 of 2.*save the corrected document/);
  assert.match(p.get("missionProblem").textContent, /Now save/);
  p.key(id, "Control");
  assert.match(spoken.at(-1), /^Step 2 of 2.*save/);
  chord(p, "Control+Z", id);
  assert.match(spoken.at(-1), /Step 2 of 2.*save/);
  assert.equal(p.get("missionProgress").value, 1);
  p.key(id, "F1");
  assert.match(spoken.at(-1), /Control plus S/);
  chord(p, "Control+S", id);
  assert.match(spoken.at(-1), /Document saved.*Mission complete/);
  assert.equal(p.get("missionResults").hidden, false);
  assert.equal(p.document.activeElement, p.get("nextMission"));
});

test("holding a mission key does not complete or penalize another step", () => {
  const p = page({ atPerspective: { value: "jaws" }, missionSelect: { value: "12" } });
  p.load("troubleshooting-lab.js"); p.get("startMission").click();
  const control = p.get("missionControlStation");
  control.fire("keydown", { key: "Enter" });
  control.fire("keydown", { key: "Enter", repeat: true });
  assert.equal(p.get("missionProgress").value, 1);
  assert.equal(p.get("missionResults").hidden, true);
  control.fire("keyup", { key: "Enter" });
  p.key(control.id, "Enter");
  assert.equal(p.get("missionAttemptResult").textContent, "2");
});

test("a Shift press within a protected Alt chord does not count as an incorrect answer", () => {
  const p = page({ atPerspective: { value: "jaws" }, missionSelect: { value: "11" } });
  p.load("troubleshooting-lab.js"); p.get("startMission").click();
  const control = p.get("missionControlStation");
  p.key(control.id, "Alt"); p.key(control.id, "b");
  p.key(control.id, "Alt");
  control.fire("keydown", { key: "Shift", shiftKey: true });
  p.key(control.id, "b", { shiftKey: true });
  control.fire("keyup", { key: "Shift" });
  assert.equal(p.get("missionResults").hidden, false);
  assert.equal(p.get("missionAttemptResult").textContent, "2");
  assert.equal(p.get("missionReviewResult").textContent, "0");
});


test("new topic missions finish with safe inputs and preserve old numeric progress", () => {
  const solutions = [[13,["t","d"]],[14,["F2","Enter","s"]],[15,["m","z","s"]],[16,["m","ArrowRight"," "]],[17,["ArrowRight","ArrowLeft"]]];
  for (const [index,keys] of solutions) {
    const p=page({atPerspective:{value:"jaws"},missionSelect:{value:String(index)}});
    p.storage.setItem("missionControlCompleted", "[3,12]");
    p.load("troubleshooting-lab.js");p.get("startMission").click();
    for(const key of keys) p.key("missionControlStation",key);
    assert.equal(p.get("missionResults").hidden,false,String(index));
    assert.deepEqual(JSON.parse(p.storage.getItem("missionControlCompleted")),[3,12,index]);
  }
});

test('focused legacy courses have distinct outcomes while full topics retain contextual commands',()=>{
  const p=page();p.load('command-courses.js');
  const before=p.window.CommandPracticeCourses;
  const wordCoverage=new Set(before['Microsoft Word and documents'].map(e=>e[0]));
  const macCoverage=new Set(before['Mac VoiceOver basics'].map(e=>e[0]));
  p.load('command-teaching.js');const c=p.window.CommandPracticeCourses;
  assert.deepEqual(new Set(c['Microsoft Word and documents'].map(e=>e[0])),wordCoverage);
  assert.deepEqual(new Set(c['Mac VoiceOver basics'].map(e=>e[0])),macCoverage);
  assert.ok(c['General editing'].length<c['Microsoft Word and documents'].length);
  assert.notDeepEqual(c['Mac VoiceOver reading and settings'],c['Mac VoiceOver navigation and web']);
  assert.ok(c['Mac VoiceOver basics'].filter(e=>e[0]==='VO+Right Arrow').length>=2,'Different item/text contexts retained');
  for(const [name,key] of [['Microsoft Word and documents','Control+B'],['Mac VoiceOver basics','VO+K']]) assert.equal(c[name].filter(e=>e[0]===key).length,1);
  for(const name of ['General editing','Mac VoiceOver reading and settings','Mac VoiceOver navigation and web']) assert.deepEqual([...new Set(c[name].map(e=>e[4].level))],['basic','intermediate','advanced']);
  assert.match(c['Microsoft Word and documents'].find(e=>e[0]==='Control+[')[2],/different key from comma/);
  assert.match(c['Google Docs and applications'].find(e=>e[0]==='Control+\/')[2],/forward slash/);
});

test('all focused legacy routes complete with the production teaching layer',()=>{
  for(const category of ['General editing','Mac VoiceOver reading and settings','Mac VoiceOver navigation and web']) {
    const p=page({commandCategory:{value:category},practiceStyle:{value:'guided'},sessionLength:{value:'all'},explanationLevel:{value:'detailed'},soundFeedback:{checked:false}});
    p.load('command-courses.js');p.load('command-teaching.js');p.load('command-practice.js');p.get('startPractice').click();
    for(const entry of p.window.CommandPracticeCourses[category]) {
      for(const command of entry[4].steps) {
        if(category.startsWith('Mac'))buildMacCommand(p,command);
        else chord(p,command);
      }
      p.advance();
    }
    assert.equal(p.get('practiceResults').hidden,false,category);
  }
});

test('Paste Special rehearses the dialog, option and confirmation with a current-step goal',()=>{
  const category='Microsoft Excel and spreadsheets',p=page({commandCategory:{value:category},practiceStyle:{value:'guided'},sessionLength:{value:'all'},explanationLevel:{value:'detailed'}});
  p.load('command-courses.js');p.load('command-teaching.js');
  const options=p.window.CommandPracticeCourses[category].filter(e=>e[4].stepGoals);
  assert.equal(options.length,11);
  for(const entry of options){assert.equal(entry[0],entry[4].steps.join(' then '));assert.match(entry[2],/copy the source cells and select the destination/);}
  const values=options.find(e=>e[4].steps[1]==='V');
  p.window.CommandPracticeCourses[category]=[values];p.load('command-practice.js');p.get('startPractice').click();
  assert.match(p.get('commandPrompt').children[1].textContent,/After copying cells, open Paste Special/);
  for(const key of ['Control','Alt','V'])tapCourseKey(p,key);
  assert.match(p.get('commandPrompt').children[1].textContent,/In Paste Special, choose values only/);
  tapCourseKey(p,'F');assert.match(p.get('practiceStatus').textContent,/Not quite/);
  assert.equal(p.get('practiceScore').textContent,'Correct: 0 · Attempts: 1');
  tapCourseKey(p,'V');assert.match(p.get('commandPrompt').children[1].textContent,/Confirm to paste values only/);
  assert.doesNotMatch(p.get('commandPrompt').children.map(e=>e.textContent).join(' '),/Normally|one key at a time/);
  assert.equal(p.get('commandPrompt').children[2].textContent,'Step 3 of 3.');
  tapCourseKey(p,'Enter');assert.equal(p.get('practiceScore').textContent,'Correct: 1 · Attempts: 2');p.advance();
  assert.equal(p.get('practiceResults').hidden,false);
});

test('reviewed Excel and PowerPoint teaching preserves contextual duplicates and fixes keypad substitutions',()=>{
  const p=page();p.load('command-courses.js');p.load('command-teaching.js');const c=p.window.CommandPracticeCourses;
  const excel=c['Microsoft Excel and spreadsheets'],ppt=c.Presentations;
  assert.equal(excel.filter(e=>e[0]==='Alt+M').length,1);
  assert.equal(ppt.filter(e=>e[0]==='Control+Shift+Tab').length,1);
  assert.equal(ppt.filter(e=>e[0]==='Alt+Shift+1').length,2,'Outline and Selection pane are distinct contexts');
  assert.match(excel.find(e=>e[0]==='Control+8')[2],/worksheet outline/);
  assert.doesNotMatch(excel.find(e=>e[0]==='Control+8')[2],/slide|heading/);
  assert.equal(ppt.find(e=>e[1]==='In the Selection pane, expand a focused group.')[0],'Right Arrow');
  assert.equal(ppt.find(e=>e[1]==='In the Selection pane, collapse a focused group.')[0],'Left Arrow');
});

test('deeper missions retain state on mistakes, repeat current focus, and preserve completion IDs',()=>{
  for(const [id,keys,states] of [
    [18,['z','ArrowLeft','c','ArrowRight','v','v','Enter','s'],[/C4 is selected/,/C4 is blank/,/B4, total 60/,/B4 is copied/,/C4 is selected/,/Paste Special is open/,/Values is selected/,/fixed total 60/]],
    [19,['Alt','F10','F6','ArrowDown',' ','f','s'],[/title is covered/,/Selection pane is open/,/Cover rectangle is focused/,/Title is focused/,/Title is selected/,/title is visible/]]
  ]) {
    const p=page({atPerspective:{value:'jaws'},missionSelect:{value:String(id)},simulatedVoice:{checked:true}}),heard=[];
    p.window.speechSynthesis.speak=u=>heard.push(u.text);
    p.storage.setItem('missionControlCompleted','[3,13,17]');p.load('troubleshooting-lab.js');p.get('startMission').click();
    let n=0;
    for(const key of keys){
      if(key==='Alt'){p.key('missionControlStation',key);continue;}
      // Ctrl alone repeats; a wrong answer must neither move focus in the model nor advance the step.
      p.key('missionControlStation','q');assert.equal(p.get('missionProgress').value,n);
      assert.match(p.get('transcript').textContent,/That command did not complete this step/);
      p.key('missionControlStation','Control');assert.match(p.get('transcript').textContent,states[n]);
      p.key('missionControlStation','F1');assert.match(p.get('transcript').textContent,/Strategy hint/);
      if(id===19&&n===0)p.key('missionControlStation','Alt');
      p.key('missionControlStation',key);n++;
      if(n<states.length){assert.match(p.get('missionProblem').textContent,states[n]);assert.match(heard.at(-1),states[n]);}
    }
    assert.equal(p.get('missionResults').hidden,false);
    assert.equal(p.document.activeElement,p.get('nextMission'));
    assert.deepEqual(JSON.parse(p.storage.getItem('missionControlCompleted')),[3,13,17,id]);
    assert.equal(p.get('missionAttemptResult').textContent,String(states.length*2));
  }
});

test('the reviewed Excel and PowerPoint courses complete with production sequences',()=>{
 for(const category of ['Microsoft Excel and spreadsheets','Presentations']){
  const p=page({commandCategory:{value:category},practiceStyle:{value:'guided'},sessionLength:{value:'all'},explanationLevel:{value:'detailed'}});
  p.load('command-courses.js');p.load('command-teaching.js');p.load('command-practice.js');p.get('startPractice').click();
  const items=p.window.CommandPracticeCourses[category];
  assert.deepEqual([...new Set(items.map(e=>e[4].level))],['basic','intermediate','advanced']);
  items.forEach((entry,index)=>{
   for(const step of entry[4].steps){
    if(entry[3]==='safe')for(const key of step.split('+'))tapCourseKey(p,key);
    else buildStep(p,step);
   }
   assert.equal(p.get('practiceScore').textContent,`Correct: ${index+1} · Attempts: ${index+1}`,entry[0]);p.advance();
  });
  assert.equal(p.get('practiceResults').hidden,false,category);
 }
});

test('new Chrome, VoiceOver and Focus missions explain each state, recover, and preserve saved IDs',()=>{
 const cases=[
  [20,['g','F6','l','c','F6'],[/match 3 of 3/i,/Match 2 gives/,/article has focus/,/full page address/,/source address is copied/]],
  [21,['ArrowDown','ArrowRight',' ','ArrowUp','ArrowRight',' '],[/Playback group/,/Play is focused/,/Repeat is unchecked/,/Repeat is checked/,/outer level/,/Save has focus/]],
  [22,['c','w','r','Delete','a','s'],[/cell 2/i,/JAWS identified o/,/word is cot/,/cursor is before o/,/text is ct/,/word is now cat/]]
 ];
 for(const [id,keys,states] of cases){
  const p=page({atPerspective:{value:'jaws'},missionSelect:{value:String(id)},simulatedVoice:{checked:true}}),heard=[];
  p.window.speechSynthesis.speak=u=>heard.push(u.text);
  p.storage.setItem('missionControlCompleted','[3,13,19]');p.load('troubleshooting-lab.js');p.get('startMission').click();
  keys.forEach((key,i)=>{
   p.key('missionControlStation','q');assert.equal(p.get('missionProgress').value,i);
   assert.match(p.get('transcript').textContent,/That command did not complete this step/);
   p.key('missionControlStation','Control');assert.match(p.get('transcript').textContent,states[i]);
   p.key('missionControlStation','F1');assert.match(p.get('transcript').textContent,/Strategy hint/);
   p.key('missionControlStation',key);
   if(i<keys.length-1){assert.match(p.get('missionProblem').textContent,states[i+1]);assert.match(heard.at(-1),states[i+1]);}
  });
  assert.equal(p.get('missionResults').hidden,false);assert.equal(p.document.activeElement,p.get('nextMission'));
  assert.deepEqual(JSON.parse(p.storage.getItem('missionControlCompleted')),[3,13,19,id]);
  assert.equal(p.get('missionAttemptResult').textContent,String(keys.length*2));
  if(id===21)assert.match(p.get('missionMasteredList').children[0].textContent,/VoiceOver plus Shift plus Down Arrow/);
  if(id===22)assert.match(p.get('missionMasteredList').children[0].textContent,/Focus NAV Mode plus Cursor Router/);
 }
});

test('unrelated Meta-modified keys cannot masquerade as a mission answer',()=>{
 for(const [id,key] of [[3,'z'],[20,'g'],[21,'ArrowDown'],[22,'c']]){
  const p=page({atPerspective:{value:'jaws'},missionSelect:{value:String(id)}});
  p.load('troubleshooting-lab.js');p.get('startMission').click();
  p.key('missionControlStation',key,{metaKey:true});assert.equal(p.get('missionProgress').value,0);
  p.key('missionControlStation',key);assert.equal(p.get('missionProgress').value,1);
 }
});

test('Windows teaching retains every command and all stages with concrete context',()=>{
 const p=page();p.load('command-courses.js');const before=p.window.CommandPracticeCourses['Windows and File Explorer'].map(e=>e[0]);
 p.load('command-teaching.js');const entries=p.window.CommandPracticeCourses['Windows and File Explorer'];
 assert.deepEqual(entries.map(e=>e[0]),before);assert.equal(entries.length,35);
 assert.deepEqual([...new Set(entries.map(e=>e[4].level))],['basic','intermediate','advanced']);
 for(const entry of entries){assert.doesNotMatch(entry[2],/Use this during|Check the current focus before|Use the command for/);assert.ok(entry[2].length>100);}
 const note=key=>entries.find(e=>e[0]===key)[2];
 assert.match(note('Control+X'),/has not moved/);assert.match(note('Control+W'),/only tab/);
 assert.match(note('Alt+Left Arrow'),/not necessarily go up/);assert.match(note('Control+Windows+D'),/not another user/);
});

test('email and magnification teaching keeps coverage and exposes necessary application context',()=>{
 const p=page();p.load('command-courses.js');
 const names=['Thunderbird email','ZoomText and Fusion Desktop magnification'];
 const identities=name=>p.window.CommandPracticeCourses[name].map(e=>[e[0],e[3],e[4].level,[...e[4].steps]]);
 const before=names.map(identities);p.load('command-teaching.js');
 names.forEach((name,i)=>assert.deepEqual(identities(name),before[i],name));
 const mail=p.window.CommandPracticeCourses[names[0]],zoom=p.window.CommandPracticeCourses[names[1]];
 assert.equal(mail.length,36);assert.equal(zoom.length,23);
 for(const entries of [mail,zoom])assert.equal(new Set(entries.map(e=>e[2])).size,entries.length,'Each command has its own teaching');
 const note=key=>mail.find(e=>e[0]===key);
 assert.match(note('Control+S')[1],/compose window/);assert.match(note('Control+S')[2],/as a file/);
 assert.match(note('Control+Shift+A')[2],/select a thread/);assert.match(note('Control+K')[2],/insert a link/);
 assert.match(note('Control+Shift+O')[2],/paste a quotation/);
 for(const entry of zoom.filter(e=>e[4].level==='advanced'))assert.match(entry[1],/In ZoomText Reader/);
 assert.match(zoom.find(e=>e[0]==='Caps Lock+I')[1],/inversion is active/);
 assert.match(p.window.CommandPracticeCourseNotes[names[1]],/Fusion uses JAWS/);
});

test('reviewed mail, magnification and NVDA courses finish with native or separated keys and spoken stages',()=>{
 for(const name of ['Thunderbird email','ZoomText and Fusion Desktop magnification','NVDA commands','JAWS commands']){
  const p=page({commandCategory:{value:name},practiceStyle:{value:'guided'},sessionLength:{value:'all'},spokenInstructions:{checked:true}}),heard=[];
  p.window.speechSynthesis.speak=u=>heard.push(u.text);
  p.load('command-courses.js');p.load('command-teaching.js');p.load('command-practice.js');p.get('startPractice').click();
  const entries=p.window.CommandPracticeCourses[name];
  entries.forEach((entry,i)=>{
   assert.equal(p.get('commandExplanationDetails').open,false);
   assert.equal(p.get('commandDetailedExplanation').textContent,entry[2]);
   for(const step of entry[4].steps){
    if(entry[3]==='safe')for(const key of step.split('+'))tapCourseKey(p,key);
    else chord(p,step);
   }
   assert.equal(p.get('practiceScore').textContent,`Correct: ${i+1} · Attempts: ${i+1}`,name+': '+entry[0]);p.advance();
  });
  for(const level of ['basic','intermediate','advanced'])assert.ok(heard.some(s=>s.includes(level+(level==='basic'?' commands':' level commands'))),name+': '+level);
  assert.equal(p.get('commandResults').hidden,false);
  assert.match(heard.at(-1),new RegExp(`practiced ${entries.length} commands correctly`));
  assert.equal(p.document.activeElement,p.get('practiceMissed'));
 }
});

test('mission shortcut alternatives are state-specific and results name the actual shortcut',()=>{
 for(const [key,options,label] of [['s',{ctrlKey:true},'CTRL+S'],['F12',{shiftKey:true},'SHIFT+F12'],['F12',{},'SHIFT+F12']]){
  const p=page({atPerspective:{value:'jaws'},missionSelect:{value:'3'}});
  p.load('troubleshooting-lab.js');p.get('startMission').click();
  p.key('missionControlStation','F12',{shiftKey:true});assert.equal(p.get('missionProgress').value,0,'Saving cannot replace Undo');
  p.key('missionControlStation','z',{ctrlKey:true});p.key('missionControlStation',key,options);
  assert.equal(p.get('missionResults').hidden,false);
  assert.ok(p.get('missionMasteredList').children[1].textContent.startsWith(label+':'));
 }
 for(const [key,options,label] of [['l',{ctrlKey:true},'CTRL+L'],['d',{altKey:true},'ALT+D'],['F6',{},'F6'],['d',{},'ALT+D']]){
  const p=page({atPerspective:{value:'jaws'},missionSelect:{value:'20'}});
  p.load('troubleshooting-lab.js');p.get('startMission').click();
  p.key('missionControlStation','d',{altKey:true});assert.equal(p.get('missionProgress').value,0,'Address selection cannot replace finding the earlier match');
  p.key('missionControlStation','g');p.key('missionControlStation','F6');
  p.key('missionControlStation','d',{ctrlKey:true});assert.equal(p.get('missionProgress').value,2,'Control+D is not Alt+D');
  p.key('missionControlStation',key,options);assert.equal(p.get('missionProgress').value,3);
  p.key('missionControlStation','c');p.key('missionControlStation','F6');
  assert.equal(p.get('missionResults').hidden,false);
  assert.ok(p.get('missionMasteredList').children[2].textContent.startsWith(label+':'));
 }
});

test('Word save-or-close routes recover, repeat the actual state, and preserve old mission progress',()=>{
 for(const [first,next,state,labels] of [['s','F4',/saved and still open/,['CTRL+S','ALT+F4']],['F4','Enter',/Save Changes dialog: Save is focused/,['ALT+F4','ENTER']]]){
  const p=page({atPerspective:{value:'jaws'},missionSelect:{value:'23'},simulatedVoice:{checked:true}}),heard=[];
  p.window.speechSynthesis.speak=u=>heard.push(u.text);
  p.storage.setItem('missionControlCompleted','[0,3,20,22]');p.load('troubleshooting-lab.js');p.get('startMission').click();
  p.key('missionControlStation','Enter');assert.equal(p.get('missionProgress').value,0);
  assert.match(p.get('transcript').textContent,/remain unsaved and open/);
  p.key('missionControlStation',first);assert.equal(p.get('missionProgress').value,1);
  assert.match(p.get('missionProblem').textContent,state);assert.match(heard.at(-1),state);
  p.key('missionControlStation','Control');assert.match(heard.at(-1),state);assert.match(heard.at(-1),/^Step 2 of 2/);
  p.key('missionControlStation','F1');assert.match(heard.at(-1),first==='s'?/Alt plus F4/:/focused Save button/);
  p.key('missionControlStation','q');assert.equal(p.get('missionProgress').value,1);assert.match(p.get('transcript').textContent,state);
  p.key('missionControlStation',next);
  assert.equal(p.get('missionResults').hidden,false);assert.equal(p.document.activeElement,p.get('nextMission'));
  assert.equal(p.get('missionAttemptResult').textContent,'4');assert.equal(p.get('missionReviewResult').textContent,'2');
  assert.deepEqual(JSON.parse(p.storage.getItem('missionControlCompleted')),[0,3,20,22,23]);
  labels.forEach((label,i)=>assert.ok(p.get('missionMasteredList').children[i].textContent.startsWith(label+':')));
  assert.match(heard.at(-1),/report’s editing window.*Mission complete/);
 }
});

test('slideshow recovery accepts documented alternatives and confirms numeric jumps separately',()=>{
 for(const restore of ['b','.'])for(const next of ['ArrowRight','n','Enter','PageDown','ArrowDown',' ']){
  const p=page({atPerspective:{value:'jaws'},missionSelect:{value:'24'},simulatedVoice:{checked:true}}),heard=[];
  p.window.speechSynthesis.speak=u=>heard.push(u.text);
  p.storage.setItem('missionControlCompleted','[3,19,23]');p.load('troubleshooting-lab.js');p.get('startMission').click();
  const keys=[restore,'Home',next,'5','Enter'];
  const states=[/blanked/,/Slide 3/,/Slide 1/,/slide 5/,/number 5/];
  for(let i=0;i<keys.length;i++){
   p.key('missionControlStation','q');assert.equal(p.get('missionProgress').value,i);
   assert.match(p.get('transcript').textContent,/That command did not complete this step/);
   p.key('missionControlStation','Control');assert.match(heard.at(-1),states[i]);
   p.key('missionControlStation','F1');assert.match(heard.at(-1),/Strategy hint/);
   p.key('missionControlStation',keys[i]);
   if(i<4){assert.equal(p.get('missionResults').hidden,true);assert.match(heard.at(-1),new RegExp('Step '+(i+2)+' of 5'));}
  }
  assert.equal(p.get('missionResults').hidden,false);
  assert.equal(p.get('missionAttemptResult').textContent,'10');
  assert.match(heard.at(-1),/slide 5, Questions.*Mission complete/);
  assert.deepEqual(JSON.parse(p.storage.getItem('missionControlCompleted')),[3,19,23,24]);
  assert.equal(p.document.activeElement,p.get('nextMission'));
  p.get('retryMissionResult').click();assert.equal(p.get('missionProgress').value,0);
  assert.match(p.get('missionProblem').textContent,/blanked/);
 }
 const p=page();p.load('mission-catalog.js');
 assert.deepEqual(Array.from(p.window.MissionControlCatalog.find(t=>t.id==='microsoft-powerpoint').missionSets,e=>e.mission),['15','19','24']);
});

test('Word recovery says the text is restored when Undo is repeated and still accepts saving',()=>{
 const p=page({atPerspective:{value:'jaws'},missionSelect:{value:'3'},simulatedVoice:{checked:true}}),heard=[];
 p.window.speechSynthesis.speak=u=>heard.push(u.text);p.load('troubleshooting-lab.js');p.get('startMission').click();
 p.key('missionControlStation','s',{ctrlKey:true});assert.match(heard.at(-1),/text is still missing/);
 p.key('missionControlStation','z',{ctrlKey:true});assert.equal(p.get('missionProgress').value,1);
 p.key('missionControlStation','z',{ctrlKey:true});assert.match(heard.at(-1),/already restored.*Save the corrected document/);
 p.key('missionControlStation','Control');assert.match(heard.at(-1),/Step 2 of 2.*Now save/);
 p.key('missionControlStation','s',{ctrlKey:true});assert.equal(p.get('missionResults').hidden,false);
});

test('restarting a branched mission resets its route and held keys cannot finish the next step',()=>{
 const p=page({atPerspective:{value:'jaws'},missionSelect:{value:'23'}});
 p.load('troubleshooting-lab.js');p.get('startMission').click();
 p.key('missionControlStation','Alt');p.key('missionControlStation','F4');
 p.key('missionControlStation','Enter',{repeat:true});assert.equal(p.get('missionProgress').value,1);
 p.key('missionControlStation','Enter');assert.equal(p.get('missionResults').hidden,false);
 p.get('retryMissionResult').click();
 assert.equal(p.get('missionProgress').value,0);assert.equal(p.get('missionResults').hidden,true);
 // Use the production restart control too; either entry point must clear the branch.
 p.get('restartMission').click();assert.equal(p.get('missionProgress').value,0);
 p.key('missionControlStation','F12',{shiftKey:true});
 assert.match(p.get('missionProblem').textContent,/saved and still open/);
 p.key('missionControlStation','Enter');assert.equal(p.get('missionProgress').value,1);
 p.key('missionControlStation','F4');assert.equal(p.get('missionResults').hidden,false);
 assert.equal(p.get('missionAttemptResult').textContent,'3');
 assert.match(p.get('missionMasteredList').children[0].textContent,/^SHIFT\+F12:/);
 assert.match(p.get('missionMasteredList').children[1].textContent,/^ALT\+F4:/);
});

test('an armed screen-reader modifier does not erase extra Meta or Shift keys',()=>{
 for(const modifier of ['metaKey','shiftKey']){
  const p=page({atPerspective:{value:'jaws'},missionSelect:{value:'0'}});
  p.load('troubleshooting-lab.js');p.get('startMission').click();
  p.key('missionControlStation','Insert');p.key('missionControlStation','t',{[modifier]:true});
  assert.equal(p.get('missionProgress').value,0);
  p.key('missionControlStation','Insert');p.key('missionControlStation','t');
  assert.equal(p.get('missionProgress').value,1);
 }
});

test('advanced NVDA teaching distinguishes review markers, existing selection, and saved configuration',()=>{
 const p=page();p.load('command-courses.js');
 const identity=()=>p.window.CommandPracticeCourses['NVDA commands'].map(e=>[e[0],e[3],e[4].level,[...e[4].steps]]);
 const before=identity();p.load('command-teaching.js');assert.deepEqual(identity(),before);
 const entries=p.window.CommandPracticeCourses['NVDA commands'];assert.equal(entries.length,93);
 const advanced=entries.filter(e=>e[4].level==='advanced');assert.equal(advanced.length,19);
 for(const entry of advanced)assert.doesNotMatch(entry[2],/Use this during|Use the command for|Check the current focus before/);
 assert.equal(new Set(advanced.map(e=>e[2])).size,19);
 const note=key=>entries.find(e=>e[0]===key);
 assert.match(note('Insert+Page Up')[2],/Desktop layout.*Laptop layout/);
 assert.match(note('Alt+Insert+Home')[2],/existing selection/);
 assert.match(note('Shift+Insert+F9')[1],/Return/);
 assert.match(note('Insert+F9')[2],/neither selects nor copies/);
 assert.match(note('Insert+F10')[2],/first.*selects.*second press copies/s);
 assert.match(note('Control+Insert+C')[2],/rather than the document/);
 assert.match(note('Control+Insert+R')[1],/one press/);
 assert.match(note('Control+Insert+R')[2],/three times.*factory defaults/);
});

test('advanced VoiceOver teaching keeps text and interface contexts distinct without losing course coverage',()=>{
 const p=page();p.load('command-courses.js');
 const raw=p.window.CommandPracticeCourses['Mac VoiceOver basics'];
 const duplicateKeys=new Set(['VO+K','VO+Q','Shift+VO+Q','VO+P','VO+L','VO+S','VO+W','VO+C']),seen=new Set();
 const before=raw.filter(e=>{if(!duplicateKeys.has(e[0]))return true;if(seen.has(e[0]))return false;seen.add(e[0]);return true;}).map(e=>[e[0],e[3],e[4].level,[...e[4].steps]]);
 p.load('command-teaching.js');const entries=p.window.CommandPracticeCourses['Mac VoiceOver basics'];
 assert.deepEqual(entries.map(e=>[e[0],e[3],e[4].level,[...e[4].steps]]),before);
 assert.equal(entries.length,60);const advanced=entries.filter(e=>e[4].level==='advanced');assert.equal(advanced.length,40);
 for(const entry of advanced)assert.doesNotMatch(entry[2],/Use this to review or select text at the stated level|VoiceOver on Mac\. VO means/);
 assert.equal(new Set(advanced.map(e=>e[2])).size,40);
 const note=key=>advanced.find(e=>e[0]===key);
 assert.match(note('VO+Right Arrow')[1],/text/);
 assert.match(note('VO+Right Arrow')[2],/interact.*text/i);
 assert.match(entries.find(e=>e[0]==='VO+Right Arrow'&&e[4].level==='basic')[1],/next item/);
 assert.match(note('VO+N')[2],/currently.*screen/);
 assert.match(note('VO+Enter')[2],/tracking.*on.*Return.*again/s);
 assert.match(note('VO+Command+Fn+F9')[2],/on-screen.*physical/i);
 assert.match(note('Shift+VO+Fn+F10')[2],/Escape/);
 assert.match(note('Shift+VO+Fn+F11')[2],/black.*same command/s);
 const aliases=['Mac VoiceOver reading and settings','Mac VoiceOver navigation and web'];
 assert.deepEqual(aliases.map(n=>p.window.CommandPracticeCourses[n].length),[24,36]);
 assert.equal(aliases.flatMap(n=>p.window.CommandPracticeCourses[n]).length,60);
});

test('reviewed Mac function-key builder accepts the documented Fn setting but rejects other wrong modifiers',()=>{
 const review=page();review.load('command-courses.js');review.load('command-teaching.js');
 const name='Mac VoiceOver basics',items=review.window.CommandPracticeCourses[name].filter(e=>e[0].includes('Fn+'));
 assert.ok(items.length>=10);
 for(const entry of items)for(const omitFn of [false,true]){
  const p=page({commandCategory:{value:name},practiceStyle:{value:'guided'},sessionLength:{value:'all'},spokenInstructions:{checked:true}}),heard=[];
  p.window.speechSynthesis.speak=u=>heard.push(u.text);p.load('command-courses.js');p.load('command-teaching.js');
  p.window.CommandPracticeCourses[name]=[p.window.CommandPracticeCourses[name].find(e=>e[0]===entry[0])];
  p.load('command-practice.js');p.get('startPractice').click();
  const variant=omitFn?entry[0].replace('Fn+',''):entry[0];
  const wrong=variant.includes('Shift+')?variant.replace('Shift+',''):'Shift+'+variant;
  buildStep(p,wrong);assert.equal(p.get('practiceScore').textContent,'Correct: 0 · Attempts: 1',entry[0]);
  buildStep(p,variant.replace('VO+','Caps Lock+'));assert.equal(p.get('practiceScore').textContent,'Correct: 1 · Attempts: 2',variant);
  p.advance();assert.equal(p.get('practiceResults').hidden,false);
  assert.match(heard.at(-1),/Practice complete/);
 }
 const p=page({commandCategory:{value:name},sessionLength:{value:'all'}});p.load('command-courses.js');p.load('command-teaching.js');
 p.window.CommandPracticeCourses[name]=[p.window.CommandPracticeCourses[name].find(e=>e[0]==='VO+N')];p.load('command-practice.js');p.get('startPractice').click();
 buildStep(p,'VO+Fn+N');assert.equal(p.get('practiceScore').textContent,'Correct: 0 · Attempts: 1');
 buildStep(p,'VO+N');assert.equal(p.get('practiceScore').textContent,'Correct: 1 · Attempts: 2');
});

test('Mac separated-key practice offers a builder escape at Fn and preserves repeat, Tab and punctuation',()=>{
 const name='Mac VoiceOver basics',p=page({commandCategory:{value:name},sessionLength:{value:'all'},spokenInstructions:{checked:true}}),heard=[];
 p.window.speechSynthesis.speak=u=>heard.push(u.text);p.load('command-courses.js');p.load('command-teaching.js');
 const items=p.window.CommandPracticeCourses[name];p.window.CommandPracticeCourses[name]=[items.find(e=>e[0]==='VO+Fn+F8'),items.find(e=>e[0]==='VO+Semicolon')];
 p.load('command-practice.js');p.get('startPractice').click();
 tapCourseKey(p,'Control');tapCourseKey(p,'Option');
 assert.equal(p.get('commandPrompt').children[0].textContent,'Press and release Fn');
 assert.match(p.get('practiceStatus').textContent,/Fn.*Build the command/);
 p.key('keyCapture','Control');assert.match(heard.at(-1),/Fn.*Build the command/);
 assert.equal(p.key('keyCapture','Tab').defaultPrevented,false);
 p.get('courseBuilderPanel').focus();buildStep(p,'VO+F8');assert.equal(p.get('practiceScore').textContent,'Correct: 1 · Attempts: 1');p.advance();
 tapCourseKey(p,'Control');tapCourseKey(p,'Option');p.key('keyCapture',';',{code:'Semicolon'});
 assert.equal(p.get('practiceScore').textContent,'Correct: 2 · Attempts: 2');p.advance();assert.equal(p.get('practiceResults').hidden,false);
});

test('JAWS teaching preserves coverage and explains OCR scope and layered commands',()=>{
 const p=page();p.load('command-courses.js');
 const identity=()=>p.window.CommandPracticeCourses['JAWS commands'].map(e=>[e[0],e[3],e[4].level,[...e[4].steps]]);
 const before=identity();p.load('command-teaching.js');assert.deepEqual(identity(),before);
 const entries=p.window.CommandPracticeCourses['JAWS commands'];assert.equal(entries.length,32);
 const advanced=entries.filter(e=>e[4].level==='advanced');assert.equal(advanced.length,11);
 assert.equal(new Set(advanced.map(e=>e[2])).size,11);
 const note=key=>entries.find(e=>e[0]===key);
 assert.match(note('Insert+Space then X')[2],/virtual cursor.*temporary change/);
 assert.match(note('Insert+Space then O then D')[2],/Adobe Reader.*misread/);
 assert.match(note('Insert+Space then O then W')[2],/active application window/);
 assert.match(note('Insert+Space then O then S')[2],/does not turn pictured buttons/);
 assert.match(note('Insert+3')[2],/number-row 3/);
 for(const entry of advanced.filter(e=>e[4].steps.length>1)){
  assert.equal(entry[4].stepGoals.length,entry[4].steps.length);
  assert.equal(entry[4].stepGoals.at(-1),entry[1]);
 }
});

test('JAWS OCR repeats its current layer and recovers without early credit',()=>{
 for(const finalKey of ['D','W','S']){
  const name='JAWS commands',p=page({commandCategory:{value:name},practiceStyle:{value:'guided'},sessionLength:{value:'all'},spokenInstructions:{checked:true}}),heard=[];
  p.window.speechSynthesis.speak=u=>heard.push(u.text);
  p.load('command-courses.js');p.load('command-teaching.js');
  const entry=p.window.CommandPracticeCourses[name].find(e=>e[0]===`Insert+Space then O then ${finalKey}`);
  p.window.CommandPracticeCourses[name]=[entry];p.load('command-practice.js');p.get('startPractice').click();
  p.key('keyCapture','Control');assert.match(heard.at(-1),/Enter JAWS layered commands/);
  tapCourseKey(p,'Insert');tapCourseKey(p,'Space');
  p.key('keyCapture','Control');assert.match(heard.at(-1),/Choose Convenient OCR/);
  tapCourseKey(p,'X');assert.equal(p.get('practiceScore').textContent,'Correct: 0 · Attempts: 1');
  p.key('keyCapture','Control');assert.match(heard.at(-1),/Choose Convenient OCR/);
  tapCourseKey(p,'O');p.key('keyCapture','Control');assert.ok(heard.at(-1).includes(entry[1]));
  assert.equal(p.get('practiceScore').textContent,'Correct: 0 · Attempts: 1');
  tapCourseKey(p,finalKey);assert.equal(p.get('practiceScore').textContent,'Correct: 1 · Attempts: 2');
  p.advance();assert.equal(p.get('commandResults').hidden,false);
 }
});

test('ZoomText Say sequences repeat the current layer and recover without restarting or early credit',()=>{
 const name='ZoomText and Fusion Desktop magnification';
 for(const finalKey of ['D','T','F','S','W','P','U']){
  const p=page({commandCategory:{value:name},practiceStyle:{value:'guided'},sessionLength:{value:'all'},spokenInstructions:{checked:true}}),heard=[];
  p.window.speechSynthesis.speak=u=>heard.push(u.text);
  p.load('command-courses.js');p.load('command-teaching.js');
  const entry=p.window.CommandPracticeCourses[name].find(e=>e[0]===`Caps Lock+Space then Y then ${finalKey}`);
  p.window.CommandPracticeCourses[name]=[entry];p.load('command-practice.js');p.get('startPractice').click();
  p.key('keyCapture','Control');assert.match(heard.at(-1),/enter layered commands/);
  tapCourseKey(p,'Caps Lock');tapCourseKey(p,'Space');
  p.key('keyCapture','Control');assert.match(heard.at(-1),/Say command group/);
  tapCourseKey(p,'X');assert.equal(p.get('practiceScore').textContent,'Correct: 0 · Attempts: 1');
  p.key('keyCapture','Control');assert.match(heard.at(-1),/Say command group/);
  tapCourseKey(p,'Y');p.key('keyCapture','Control');assert.ok(heard.at(-1).includes(entry[1]));
  assert.equal(p.get('practiceScore').textContent,'Correct: 0 · Attempts: 1');
  tapCourseKey(p,finalKey);assert.equal(p.get('practiceScore').textContent,'Correct: 1 · Attempts: 2');
  p.advance();assert.equal(p.get('commandResults').hidden,false);
 }
});
