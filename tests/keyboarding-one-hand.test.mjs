import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';

const source = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const html = source('keyboarding-preview.html');
const storageKey = 'alcKeyboardingProgressV1';

// Event/DOM fixture for the real controller. Browser checks cover rendering,
// focus, and native keyboard interaction separately.
function page({ saved = {}, blocked = false, typingDelay = 700 } = {}) {
  const nodes = new Map(), timers = [], data = new Map(Object.entries(saved));
  let document, clock = 1000;
  class Element {
    constructor(tag = 'div') {
      Object.assign(this, { tag, children: [], listeners: {}, attributes: {}, dataset: {},
        checked: false, disabled: false, hidden: false, textContent: '', _value: '', style: { setProperty() {} } });
      const classes = new Set();
      this.classList = { add: (...v) => v.forEach(x => classes.add(x)), remove: (...v) => v.forEach(x => classes.delete(x)),
        contains: x => classes.has(x), toggle: (x, on) => (on ?? !classes.has(x)) ? classes.add(x) : classes.delete(x) };
    }
    get value() { return this.tag === 'select' ? this.options[this.selectedIndex]?.value || '' : this._value; }
    set value(v) { this._value = String(v); }
    get options() { return this.children; }
    get selectedIndex() { const i = this.options.findIndex(x => x.value === this._value); return i < 0 ? (this.options.length ? 0 : -1) : i; }
    set selectedIndex(i) { this._value = this.options[i]?.value || ''; }
    get innerText() { return this.textContent; }
    addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
    fire(type, props = {}) {
      const event = { target: this, currentTarget: this, key: '', ctrlKey: false, altKey: false, metaKey: false,
        shiftKey: false, repeat: false, preventDefault() {}, stopPropagation() {}, getModifierState: () => false, ...props };
      for (const fn of this.listeners[type] || []) fn(event);
    }
    click() { if (!this.disabled) this.fire('click'); }
    focus() { document.activeElement = this; this.fire('focus'); }
    append(...children) { this.children.push(...children); }
    appendChild(child) { this.append(child); }
    replaceChildren(...children) { this.children = children; this._value = ''; }
    setAttribute(k, v) { this.attributes[k] = String(v); }
    getAttribute(k) { return this.attributes[k] ?? null; }
    removeAttribute(k) { delete this.attributes[k]; }
    querySelectorAll(selector) {
      if (this.id === 'setupMenu') return mainButtons;
      if (this.id === 'settingsMenu') return settings;
      const all = this.children.flatMap(child => typeof child === 'object' ? [child, ...child.querySelectorAll(selector)] : []);
      return all.filter(child => selector === '.kb-key' ? child.dataset.key !== undefined : child.classList.contains(selector.slice(1)));
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  }
  const get = id => { if (!nodes.has(id)) nodes.set(id, new Element()); return nodes.get(id); };
  for (const match of html.matchAll(/<([a-z]+)\b([^>]*\bid="([^"]+)"[^>]*)>/g)) {
    const node = get(match[3]); node.id = match[3]; node.tag = match[1]; node.hidden = /\bhidden\b/.test(match[2]); node.checked = /\bchecked\b/.test(match[2]);
  }
  for (const match of html.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)) {
    const select = get(match[1]);
    for (const option of match[2].matchAll(/<option value="([^"]*)"([^>]*)>([^<]*)<\/option>/g)) {
      const node = new Element('option'); node.value = option[1]; node.textContent = option[3]; select.append(node);
      if (/selected/.test(option[2])) select.value = node.value;
    }
  }
  const settings = [...html.matchAll(/data-setting="([^"]+)"/g)].map(match => { const e = new Element('button'); e.dataset.setting = match[1]; return e; });
  const mainButtons = [...html.matchAll(/data-main-action="([^"]+)"/g)].map(match => { const e = new Element('button'); e.dataset.mainAction = match[1]; return e; });
  const manualLinks = ['left', 'right'].map(hand => { const e = new Element('a'); e.dataset.manualHand = hand; return e; });
  document = new Element();
  Object.assign(document, { getElementById: get, createElement: tag => new Element(tag),
    body: new Element(), documentElement: new Element(), querySelector: get,
    querySelectorAll: selector => ({ '.kb-arrow-menu': [get('setupMenu'), get('settingsMenu')],
      '[data-setting]': settings, '[data-manual-hand]': manualLinks })[selector] || [] });
  const storage = { getItem(k) { if (blocked) throw Error('blocked'); return data.get(k) ?? null; },
    setItem(k, v) { if (blocked) throw Error('blocked'); data.set(k, v); } };
  const window = { setTimeout(fn) { timers.push(fn); }, clearInterval() {}, setInterval() {}, requestAnimationFrame(fn) { fn(); } };
  const context = vm.createContext({ document, window, localStorage: storage, sessionStorage: { getItem: () => null }, Date: { now: () => clock } });
  vm.runInContext(source('keyboarding-one-hand.js'), context);
  // Expose pure curriculum/prompt helpers only within this test context.
  vm.runInContext(source('keyboarding-preview.js').replace(/\}\)\(\);\s*$/, 'globalThis.testApi = {lessonFor, buildPrompt}; })();'), context);
  function advance() { while (timers.length) timers.shift()(); }
  function key(character) { clock += typingDelay; document.fire('keydown', { key: character }); document.fire('keyup', { key: character }); advance(); }
  const api = {
    get, data, helpers: context.testApi, oneHand: context.ALCOneHandCurriculum,
    changeHand(hand) { get('handSetting').value = hand; get('handSetting').fire('change'); },
    setting(name) { settings.find(e => e.dataset.setting === name).click(); },
    menu(name) { mainButtons.find(e => e.dataset.mainAction === name).click(); advance(); },
    start(index) { if (index !== undefined) get('lessonSetting').value = index; get('setupForm').fire('submit'); advance(); },
    key,
    completeLesson(hand, index) {
      const lesson = context.testApi.lessonFor(index, hand); api.start(index);
      for (const character of lesson.practiceGroups.join('')) key(character);
      assert.equal(get('resultsPanel').hidden, false);
      assert.equal(get('completionMessage').textContent, `Lesson ${index + 1} passed.`);
    }
  };
  return api;
}

test('both one-hand curricula teach the complete alphabet and never introduce untaught practice characters', () => {
  const p = page();
  for (const hand of ['left', 'right']) {
    for (let index = 0; index < 20; index++) {
      const lesson = p.helpers.lessonFor(index, hand);
      assert.match(lesson.handPosition, new RegExp(hand + ' hand only'));
      for (const mode of ['guided', 'words', 'sentences', 'speed-60', 'speed-180', 'speed-360']) {
        const result = p.helpers.buildPrompt(lesson, mode, hand);
        const prompt = Array.isArray(result) ? result.join(' ') : result;
        assert.ok(prompt.length > 0);
        for (const ch of prompt) assert.ok(lesson.allowed.includes(ch), `${hand} lesson ${index + 1}: ${JSON.stringify(ch)} in ${mode}`);
        assert.doesNotMatch(prompt, /both hands|each finger to home row/i);
      }
    }
    const alphabet = p.helpers.lessonFor(11, hand).allowed;
    assert.ok([... 'abcdefghijklmnopqrstuvwxyz'].every(ch => alphabet.includes(ch)));
  }
});

test('one-hand finger cues cover both sides, capitals, symbols, and Space with the selected hand', () => {
  const p = page();
  for (const hand of ['left', 'right']) {
    for (const ch of 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789;:$@? "+=') {
      assert.equal(p.oneHand.keyFinger(ch, hand).handId, hand);
    }
  }
  assert.equal(p.oneHand.keyFinger('f', 'left').finger, 'Little finger');
  assert.equal(p.oneHand.keyFinger('f', 'right').finger, 'Index finger');
  assert.equal(p.oneHand.keyFinger('j', 'left').finger, 'Index finger');
  assert.equal(p.oneHand.keyFinger('j', 'right').finger, 'Little finger');
  assert.equal(p.oneHand.keyFinger('$', 'left').key, '4');
});

test('the Settings button and native hand selector replace lessons, pace, instructions, and overview', () => {
  const p = page();
  assert.equal(p.get('lessonSetting').options.length, 50);
  assert.match(p.get('lessonSetting').options[0].textContent, /Left Home Row ASDF/);
  p.setting('hand');
  assert.equal(p.get('handSetting').value, 'left');
  assert.equal(p.get('lessonSetting').options.length, 20);
  assert.equal(p.get('wpmSetting').value, '0');
  assert.match(p.get('curriculumSummary').textContent, /Left hand only.*20/);
  p.start(0);
  assert.match(p.get('targetPrompt').getAttribute('aria-label'), /left little finger for F/);
  p.key('Escape');
  p.changeHand('right'); p.start(0);
  assert.match(p.get('targetPrompt').getAttribute('aria-label'), /right index finger for F/);
  p.key('Escape'); p.changeHand('both');
  assert.equal(p.get('lessonSetting').options.length, 50);
  assert.equal(p.get('wpmSetting').value, '10');
});

test('all 20 lessons pass, unlock in order, and end at Done for each one-hand path', () => {
  for (const hand of ['left', 'right']) {
    const p = page(); p.changeHand(hand); p.get('saveSetting').checked = true;
    for (let index = 0; index < 20; index++) {
      assert.equal(p.get('lessonSetting').options[index].disabled, false);
      if (index < 19) assert.equal(p.get('lessonSetting').options[index + 1].disabled, true);
      p.completeLesson(hand, index);
      assert.equal(p.get('resultAction').dataset.action, index < 19 ? 'next' : 'done');
      p.get('resultAction').click();
    }
    const progress = JSON.parse(p.data.get(storageKey));
    assert.equal(progress.completed.length, 20);
    assert.ok(progress.completed.every(item => item.startsWith(`en:${hand}:one-hand-v1:`)));
    p.menu('stats');
    assert.equal(p.get('statsLessons').textContent, '20 of 20');
    assert.equal(p.get('statsSessions').textContent, '20');
    const restored = page({saved: Object.fromEntries(p.data)});
    assert.equal(restored.get('handSetting').value, hand);
    assert.equal(restored.get('lessonSetting').value, '19');
    restored.changeHand(hand === 'left' ? 'right' : 'left');
    assert.equal(restored.get('lessonSetting').value, '0');
    restored.menu('stats');
    assert.equal(restored.get('statsLessons').textContent, '0 of 20');
    assert.equal(restored.get('statsSessions').textContent, '0');
  }
});

test('legacy side-filtered progress cannot unlock new lessons and two-hand progress is retained', () => {
  const p = page({saved: {[storageKey]: JSON.stringify({completed: ['en:left:1','en:right:1','en:both:1'], sessions: [{wpm: 7}], difficult: {}})}});
  assert.equal(p.get('lessonSetting').value, '1');
  p.menu('stats');
  assert.match(p.get('earlierStats').textContent, /1 saved sessions; best speed 7 WPM/);
  p.changeHand('left'); assert.equal(p.get('lessonSetting').value, '0');
  p.changeHand('right'); assert.equal(p.get('lessonSetting').value, '0');
  p.changeHand('both'); assert.equal(p.get('lessonSetting').value, '1');
  p.completeLesson('both', 1);
  assert.equal(p.get('resultAction').dataset.action, 'next');
});

test('Shift hints use Sticky Keys, modifiers are not errors, and slow accurate typing passes', () => {
  const p = page({typingDelay: 6000}); p.changeHand('left'); p.start(12);
  p.key('Enter');
  assert.match(p.get('handCue').textContent, /press and release either Shift, then press s/);
  assert.doesNotMatch(p.get('handCue').textContent, /right hand|Hold/);
  p.key('Shift'); p.key('x');
  assert.match(p.get('practiceStatus').textContent, /Sticky Keys/);
  p.key('Control');
  assert.match(p.get('practiceStatus').textContent, /left hand/);
  p.key('Escape');
  p.completeLesson('left', 0);
  assert.ok(Number(p.get('speedResult').textContent) < 5);
});

test('a failed lesson stays locked and blocked storage still permits the complete learning flow', () => {
  const p = page({blocked: true}); p.changeHand('right'); p.start(0); p.key('Enter');
  for (let i = 0; i < 40; i++) p.key('x');
  for (const ch of p.helpers.lessonFor(0, 'right').practiceGroups.join('')) p.key(ch);
  assert.equal(p.get('resultAction').dataset.action, 'retry');
  assert.equal(p.get('lessonSetting').options[1].disabled, true);
  p.completeLesson('right', 0);
  p.key('Escape'); p.changeHand('left'); p.changeHand('right');
  assert.equal(p.get('lessonSetting').value, '1');
});
