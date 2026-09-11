(function () {
  "use strict";

  const PREVIEW_CODE = "KEYS2026";
  const STORAGE_KEY = "alcKeyboardingProgressV1";
  const LESSON_ONE_WORDS = new Set(["sad", "fad", "dad", "add", "lad", "fall", "salad", "ask", "hall", "flask"]);
  const LEFT_KEYS = "qwertasdfgzxcvb12345`~!@#$%";
  const RIGHT_KEYS = "yuiophjklnm67890-=[]\\;',./^&*()_+{}|:\"<>?";
  const WORD_BANK = [
    "a", "add", "all", "ask", "at", "bad", "bag", "ball", "best", "big", "book", "bring", "calm", "can", "cat", "clear", "come", "day", "desk", "dog", "each", "easy", "fast", "find", "first", "from", "good", "great", "hand", "help", "home", "hope", "join", "jump", "keep", "key", "kind", "learn", "left", "light", "look", "make", "map", "milk", "move", "new", "next", "nice", "now", "open", "page", "place", "practice", "press", "quick", "read", "ready", "right", "row", "safe", "see", "slow", "small", "space", "start", "steady", "step", "still", "take", "text", "time", "today", "type", "use", "very", "voice", "word", "work", "write", "you"
  ];
  const SENTENCE_BANK = [
    "a fast reader starts at a safe rate.",
    "join in. you jump.",
    "keep your hands ready on the home row.",
    "type each word at a calm and steady pace.",
    "accuracy comes first and speed grows with practice.",
    "use a light touch and return each finger to home row.",
    "today i will type with care and correct my difficult keys.",
    "the quick brown fox jumps over the lazy dog.",
    "i practiced for 10 minutes and reached 25 words per minute!"
  ];

  const lessonData = [
    ["Home-row foundations", "Practice the left home-row keys, then the right home-row keys, and finish with short words.", "asdfjkl;"],
    ["Left home-row accuracy", "Build control with A, S, D, and F.", "asdf"],
    ["Right home-row accuracy", "Build control with J, K, L, and semicolon.", "jkl;"],
    ["Full home-row words", "Combine both hands to type short home-row words.", "asdfjkl;"],
    ["Home-row checkpoint", "Use both sides of the home row with accuracy and rhythm.", "asdfjkl;"],
    ["G and H reaches", "Reach inward for G and H, then return home.", "gh"],
    ["Home-row patterns", "Build steady movement across the home row.", "asdfghjkl;"],
    ["Home-row words", "Type short words with home-row keys.", "asdfghjkl;"],
    ["Home-row accuracy", "Keep a calm pace and reduce mistakes.", "asdfghjkl;"],
    ["Home-row checkpoint", "Review every home-row key.", "asdfghjkl;"],
    ["E and I", "Reach to E and I on the top row.", "ei"],
    ["R and U", "Add R and U, returning to home row.", "ru"],
    ["W and O", "Add W and O with controlled reaches.", "wo"],
    ["Q and P", "Add the outside top-row keys Q and P.", "qp"],
    ["T and Y", "Add the center top-row keys T and Y.", "ty"],
    ["Full top row", "Use every top-row letter.", "qwertyuiop"],
    ["Left top-row reaches", "Strengthen left-hand top-row movement.", "qwert"],
    ["Right top-row reaches", "Strengthen right-hand top-row movement.", "yuiop"],
    ["Top and home-row words", "Combine the top and home rows in words.", "qwertyuiopasdfghjkl;"],
    ["Top-row checkpoint", "Review the top and home rows together.", "qwertyuiopasdfghjkl;"],
    ["C and comma", "Reach down to C and comma.", "c,"],
    ["V and M", "Add V and M on the bottom row.", "vm"],
    ["X and period", "Add X and period.", "x."],
    ["Z and slash", "Add Z and slash.", "z/"],
    ["B and N", "Add the center bottom-row keys B and N.", "bn"],
    ["Full bottom row", "Use every bottom-row key.", "zxcvbnm,./"],
    ["Left-hand alphabet", "Review all letters typed by the left hand.", "qwertasdfgzxcvb"],
    ["Right-hand alphabet", "Review all letters typed by the right hand.", "yuiophjklnm"],
    ["Whole-alphabet words", "Type words using all three letter rows.", "abcdefghijklmnopqrstuvwxyz"],
    ["Alphabet checkpoint", "Review all letter keys before adding Shift.", "abcdefghijklmnopqrstuvwxyz"],
    ["Left-side capitals", "Use the opposite Shift key for left-side capitals.", "ASDFG"],
    ["Right-side capitals", "Use the opposite Shift key for right-side capitals.", "HJKL"],
    ["Capitalized words", "Combine capital and lowercase letters.", "ABCDEFGHIJKLMNOPQRSTUVWXYZ"],
    ["Numbers 1 through 5", "Reach to the left side of the number row.", "12345"],
    ["Numbers 6 through 0", "Reach to the right side of the number row.", "67890"],
    ["Full number row", "Practice every number key.", "1234567890"],
    ["Comma and period", "Add commas and periods to text.", ",."],
    ["Question and exclamation", "Use Shift for question marks and exclamation points.", "?!"],
    ["Apostrophe, quote, and colon", "Practice common punctuation marks.", "'\":"],
    ["Punctuation checkpoint", "Combine capitals, numbers, and punctuation.", ",./?!'\":;"],
    ["Common words", "Build fluency with frequently used words.", "abcdefghijklmnopqrstuvwxyz"],
    ["Short sentences", "Type short complete thoughts.", "abcdefghijklmnopqrstuvwxyz,."],
    ["Longer sentences", "Maintain accuracy across longer prompts.", "abcdefghijklmnopqrstuvwxyz,."],
    ["Accuracy builder", "Slow down enough to type each character correctly.", "abcdefghijklmnopqrstuvwxyz"],
    ["Typing rhythm", "Use a steady, comfortable pace.", "abcdefghijklmnopqrstuvwxyz"],
    ["Thirty-second typing", "Practice continuous typing for thirty seconds.", "abcdefghijklmnopqrstuvwxyz"],
    ["Paragraph practice", "Keep your place through several sentences.", "abcdefghijklmnopqrstuvwxyz,."],
    ["Numbers in text", "Combine words, numbers, capitals, and punctuation.", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,.!"],
    ["Difficult-key review", "Spend time on the keys that need more practice.", "abcdefghijklmnopqrstuvwxyz"],
    ["Final keyboarding check", "Bring every beginning keyboarding skill together.", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,./?!'\":;" ]
  ];

  const panels = ["unlockPanel", "setupPanel", "practiceMenuPanel", "settingsPanel", "statsPanel", "practicePanel", "resultsPanel"].map(id => document.getElementById(id));
  const lessonSetting = document.getElementById("lessonSetting");
  const modeSetting = document.getElementById("modeSetting");
  const handSetting = document.getElementById("handSetting");
  const setupMenu = document.getElementById("setupMenu");
  const targetPrompt = document.getElementById("targetPrompt");
  const freeTypeInput = document.getElementById("freeTypeInput");
  const finishFreeType = document.getElementById("finishFreeType");
  const typedText = document.getElementById("typedText");
  const practiceStatus = document.getElementById("practiceStatus");
  const lessonProgress = document.getElementById("lessonProgress");
  const progressText = document.getElementById("progressText");
  const previewToolbar = document.getElementById("previewToolbar");
  const voiceToggle = document.getElementById("voiceToggle");
  const websiteControlsToggle = document.getElementById("websiteControlsToggle");
  let useSiteVoice = true;
  let useSounds = true;
  let rememberProgress = false;
  let audioContext = null;
  let session = null;
  let timerId = null;
  const sessionUnlockedLessons = { both: 0, left: 0, right: 0 };

  function show(panelId) {
    const selected = document.getElementById(panelId);
    panels.forEach(panel => { panel.hidden = panel !== selected; });
    document.body.classList.toggle("kb-results-active", panelId === "resultsPanel");
    const heading = selected.querySelector("h1, h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus();
    }
    const firstChoice = Array.from(selected.querySelectorAll(".kb-arrow-menu .kb-menu-option, .kb-auto-focus")).find(button => !button.hidden && !button.disabled);
    if (firstChoice) window.setTimeout(() => firstChoice.focus(), 0);
  }

  function setWebsiteControlsMinimized(minimized) {
    document.body.classList.toggle("kb-controls-minimized", minimized);
    websiteControlsToggle.setAttribute("aria-expanded", String(!minimized));
    websiteControlsToggle.textContent = minimized ? "Show Website Controls" : "Minimize Website Controls";
  }

  function speak(message, onComplete) {
    let finished = false;
    const complete = () => {
      if (finished) return;
      finished = true;
      if (onComplete) onComplete();
    };
    if (!useSiteVoice || !("speechSynthesis" in window)) {
      complete();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.9;
    utterance.onend = complete;
    utterance.onerror = complete;
    window.speechSynthesis.speak(utterance);
  }

  function setVoice(enabled, announce) {
    useSiteVoice = enabled;
    document.querySelector('input[name="voice"][value="site"]').checked = enabled;
    document.querySelector('input[name="voice"][value="screen-reader"]').checked = !enabled;
    voiceToggle.setAttribute("aria-pressed", String(enabled));
    voiceToggle.textContent = enabled ? "Voice: On" : "Voice: Off";
    const menuVoice = document.getElementById("menuVoiceValue");
    if (menuVoice) menuVoice.textContent = enabled ? "Site voice" : "My screen reader";
    if (!enabled && "speechSynthesis" in window) window.speechSynthesis.cancel();
    if (enabled && announce) speak("Site voice on.");
  }

  function tone(frequency, duration) {
    if (!useSounds) return;
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.1, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      // Visual feedback remains available if sound is blocked.
    }
  }

  function belongsToHand(character, hand) {
    if (character === " ") return true;
    const lower = character.toLowerCase();
    if (hand === "left") return LEFT_KEYS.includes(lower) || LEFT_KEYS.includes(character);
    if (hand === "right") return RIGHT_KEYS.includes(lower) || RIGHT_KEYS.includes(character);
    return true;
  }

  function lessonFor(index, hand) {
    let allowed = hand === "left" ? " f" : hand === "right" ? " j" : " fj";
    for (let i = 0; i <= index; i += 1) {
      for (const character of lessonData[i][2]) {
        if (belongsToHand(character, hand) && !allowed.includes(character)) allowed += character;
      }
    }
    let focus = Array.from(lessonData[index][2]).filter(character => belongsToHand(character, hand)).join("");
    const adapted = hand !== "both" && !focus.trim();
    if (adapted) focus = allowed.replace(/ /g, "").slice(-5) || (hand === "right" ? "j" : "f");
    const description = adapted
      ? "Continue strengthening " + hand + "-hand keys while this lesson introduces the other side of the keyboard."
      : lessonData[index][1];
    return { number: index + 1, title: lessonData[index][0], description, allowed, focus };
  }

  function fits(text, allowed) {
    return Array.from(text).every(character => character === " " || allowed.includes(character));
  }

  function repeatedFocus(focus, length, rowLength) {
    let characters = Array.from(focus.replace(/ /g, ""));
    if (!characters.length) characters = ["f", "j"];
    const output = [];
    for (let i = 0; i < length; i += 1) {
      if (i > 0 && i % rowLength === 0) output.push(" ");
      output.push(characters[i % characters.length]);
    }
    return output.join("");
  }

  function buildPrompt(lesson, mode, hand) {
    const lowerAllowed = lesson.allowed.toLowerCase() + lesson.allowed.toUpperCase();
    let words = WORD_BANK.filter(word => fits(word, lowerAllowed));
    if (hand !== "both") words = words.filter(word => Array.from(word).every(character => belongsToHand(character, hand)));
    if (!words.length) words = [lesson.focus.replace(/ /g, "") || (hand === "right" ? "j" : "f")];
    const start = (lesson.number * 3) % words.length;
    const selectedWords = Array.from({ length: 12 }, (_, index) => words[(start + index) % words.length]);
    const sentences = SENTENCE_BANK.filter(sentence => fits(sentence.toLowerCase(), lowerAllowed) && (hand === "both" || Array.from(sentence.toLowerCase()).every(character => !/[a-z]/.test(character) || belongsToHand(character, hand))));
    if (mode === "guided") {
      if (lesson.number === 1 && hand === "left") return "ffff dddd ssss aaaa sad fad dad add";
      if (lesson.number === 1 && hand === "right") return "jjjj kkkk llll ;;;;";
      if (lesson.number === 1) return "ffff dddd ssss aaaa sad fad dad add jjjj kkkk llll ;;;; lad fall salad ask hall flask";
      if (lesson.number === 2) return repeatedFocus(lesson.focus, 12, 4);
      if (lesson.number < 11) return repeatedFocus(lesson.focus, 12, 6);
      return repeatedFocus(lesson.focus, 18, 6);
    }
    if (mode === "words") return selectedWords.slice(0, 8).join(" ");
    if (mode === "sentences") return sentences[lesson.number % Math.max(sentences.length, 1)] || selectedWords.slice(0, 8).join(" ");
    if (mode.startsWith("speed-")) return Array.from({ length: 200 }, () => selectedWords.join(" ")).join(" ");
    if (mode === "free") return "";
    return selectedWords.join(" ");
  }

  function getProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return {
        completed: saved && Array.isArray(saved.completed) ? saved.completed : [],
        difficult: saved && saved.difficult && typeof saved.difficult === "object" ? saved.difficult : {},
        sessions: saved && Array.isArray(saved.sessions) ? saved.sessions : []
      };
    }
    catch (error) { return { completed: [], difficult: {}, sessions: [] }; }
  }

  function saveProgress() {
    if (!rememberProgress || !session) return false;
    try {
      const progress = getProgress();
      const completion = "en:" + session.hand + ":" + session.lesson.number;
      if (session.mode === "guided" && session.passed && !progress.completed.includes(completion)) progress.completed.push(completion);
      Object.keys(session.mistakesByKey).forEach(key => {
        progress.difficult[key] = (progress.difficult[key] || 0) + session.mistakesByKey[key];
      });
      progress.sessions.push({
        mode: session.mode,
        lesson: session.lesson.number,
        accuracy: session.finalAccuracy,
        wpm: session.finalWpm,
        targetAccuracy: session.targetAccuracy,
        targetWpm: session.targetWpm,
        seconds: session.elapsedSeconds,
        completedAt: Date.now()
      });
      progress.sessions = progress.sessions.slice(-100);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      return true;
    } catch (error) { return false; }
  }

  function speakable(text) {
    const names = {
      " ": "space", ";": "semicolon", ",": "comma", ".": "period",
      "?": "question mark", "!": "exclamation point", "/": "slash",
      "'": "apostrophe", '"': "quotation mark", ":": "colon"
    };
    return names[text] || text;
  }

  function speakableSequence(text) {
    return Array.from(text).map(speakable).join(", ");
  }

  function currentPromptGroup() {
    if (!session || !session.promptGroups) return "";
    return session.promptGroups[session.groupIndex] || "";
  }

  function currentPromptGroupStart() {
    if (!session || !session.groupOffsets) return 0;
    return session.groupOffsets[session.groupIndex] || 0;
  }

  function spokenPromptGroup(group) {
    if (session && session.lesson.number === 1 && LESSON_ONE_WORDS.has(group)) return group;
    return speakableSequence(group);
  }

  function announceCurrentPromptGroup() {
    const group = currentPromptGroup();
    if (!group || !session) return;
    session.accepting = false;
    session.announcementToken += 1;
    const token = session.announcementToken;
    const message = "Type " + spokenPromptGroup(group) + ".";
    practiceStatus.textContent = message;
    targetPrompt.setAttribute("aria-label", message);
    speak(message, () => {
      if (!session || session.finished || token !== session.announcementToken) return;
      session.accepting = true;
      session.segmentStartedAt = Date.now();
      if (!session.startedAt) session.startedAt = session.segmentStartedAt;
    });
  }

  function closePromptGroupTimer() {
    if (!session || !session.segmentStartedAt) return;
    session.typingMilliseconds += Date.now() - session.segmentStartedAt;
    session.segmentStartedAt = null;
  }

  function updateLessonSummary() {
    const lesson = lessonFor(Number(lessonSetting.value || 0), handSetting.value);
    document.getElementById("lessonSummary").textContent = "Lesson " + lesson.number + ": " + lesson.title + ". " + lesson.description;
    renderCurriculum();
    updateSetupMenu();
  }

  function selectedText(select) {
    return select.options[select.selectedIndex]?.textContent || "";
  }

  function updateSetupMenu() {
    document.getElementById("menuLessonValue").textContent = selectedText(lessonSetting);
    document.getElementById("menuHandValue").textContent = selectedText(handSetting);
    document.getElementById("menuVoiceValue").textContent = useSiteVoice ? "Site voice" : "My screen reader";
    document.getElementById("menuSoundValue").textContent = document.getElementById("soundSetting").checked ? "On" : "Off";
    document.getElementById("menuWpmValue").textContent = document.getElementById("wpmSetting").value + " WPM";
    document.getElementById("menuAccuracyValue").textContent = document.getElementById("accuracySetting").value + "%";
    document.getElementById("wpmMinus").setAttribute("aria-label", "Decrease passing speed. Current target " + document.getElementById("wpmSetting").value + " words per minute.");
    document.getElementById("wpmPlus").setAttribute("aria-label", "Increase passing speed. Current target " + document.getElementById("wpmSetting").value + " words per minute.");
    document.getElementById("accuracyMinus").setAttribute("aria-label", "Decrease passing accuracy. Current target " + document.getElementById("accuracySetting").value + " percent.");
    document.getElementById("accuracyPlus").setAttribute("aria-label", "Increase passing accuracy. Current target " + document.getElementById("accuracySetting").value + " percent.");
    document.getElementById("menuSizeValue").textContent = selectedText(document.getElementById("textSizeSetting"));
    document.getElementById("menuSaveValue").textContent = document.getElementById("saveSetting").checked ? "On" : "Off";
    document.getElementById("menuLanguageValue").textContent = selectedText(document.getElementById("languageSetting"));
  }

  function unlockedLessonIndex(hand) {
    const completed = getProgress().completed || [];
    const prefix = "en:" + hand + ":";
    let unlocked = 0;
    while (unlocked < lessonData.length - 1 && completed.includes(prefix + (unlocked + 1))) unlocked += 1;
    return Math.max(unlocked, sessionUnlockedLessons[hand] || 0);
  }

  function refreshLessonAvailability() {
    const unlocked = unlockedLessonIndex(handSetting.value);
    Array.from(lessonSetting.options).forEach((option, index) => {
      option.disabled = index > unlocked;
    });
    if (Number(lessonSetting.value) > unlocked) lessonSetting.value = String(unlocked);
  }

  function cycleSelect(select, direction) {
    const count = select.options.length;
    select.selectedIndex = (select.selectedIndex + direction + count) % count;
  }

  function stepSelect(select, direction) {
    select.selectedIndex = Math.max(0, Math.min(select.options.length - 1, select.selectedIndex + direction));
  }

  function applyTextSize() {
    const scale = Number(document.getElementById("textSizeSetting").value);
    document.documentElement.style.setProperty("--kb-scale", String(scale));
    document.body.classList.toggle("kb-large-results", scale > 1.25);
  }

  function startFromMenu() {
    useSounds = document.getElementById("soundSetting").checked;
    rememberProgress = document.getElementById("saveSetting").checked;
    applyTextSize();
    startPractice();
  }

  function activateSetting(button, direction) {
    const setting = button.dataset.setting;
    if (setting === "back") return show("setupPanel");
    if (setting === "hand") cycleSelect(handSetting, direction);
    if (setting === "wpm") stepSelect(document.getElementById("wpmSetting"), direction);
    if (setting === "accuracy") stepSelect(document.getElementById("accuracySetting"), direction);
    if (setting === "size") cycleSelect(document.getElementById("textSizeSetting"), direction);
    if (setting === "language") cycleSelect(document.getElementById("languageSetting"), direction);
    if (setting === "sound") document.getElementById("soundSetting").checked = !document.getElementById("soundSetting").checked;
    if (setting === "save") document.getElementById("saveSetting").checked = !document.getElementById("saveSetting").checked;
    if (setting === "voice") setVoice(!useSiteVoice, false);
    if (setting === "hand") refreshLessonAvailability();
    if (setting === "hand") updateLessonSummary();
    else updateSetupMenu();
    if (setting === "size") applyTextSize();
    speak(button.textContent.trim());
  }

  function updateStats() {
    const progress = getProgress();
    const sessions = progress.sessions;
    const prefix = "en:" + handSetting.value + ":";
    const completedLessons = new Set(progress.completed.filter(item => item.startsWith(prefix)).map(item => item.slice(prefix.length)));
    document.getElementById("statsLessons").textContent = completedLessons.size + " of 50";
    document.getElementById("statsSessions").textContent = String(sessions.length);
    document.getElementById("statsAccuracy").textContent = sessions.length ? Math.max(...sessions.map(item => Number(item.accuracy) || 0)) + "%" : "No sessions";
    document.getElementById("statsSpeed").textContent = sessions.length ? Math.max(...sessions.map(item => Number(item.wpm) || 0)) + " WPM" : "No sessions";
    const minutes = Math.round(sessions.reduce((total, item) => total + (Number(item.seconds) || 0), 0) / 60);
    document.getElementById("statsTime").textContent = minutes + (minutes === 1 ? " minute" : " minutes");
    const difficult = Object.keys(progress.difficult).sort((a, b) => progress.difficult[b] - progress.difficult[a]).slice(0, 5);
    document.getElementById("statsDifficult").textContent = difficult.length ? difficult.map(speakable).join(", ") : "None";
    document.getElementById("statsNote").textContent = sessions.length
      ? "These stats are saved only on this browser."
      : "Turn on Save progress in Settings to build your stats on this browser.";
  }

  function renderCurriculum() {
    const list = document.getElementById("curriculumList");
    const hand = handSetting.value;
    const completed = getProgress().completed || [];
    list.replaceChildren();
    lessonData.forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = "Lesson " + (index + 1) + ": " + item[0] + " — " + item[1];
      if (completed.includes("en:" + hand + ":" + (index + 1))) {
        const mark = document.createElement("span");
        mark.className = "kb-complete";
        mark.textContent = " Completed";
        li.append(" ", mark);
      }
      list.appendChild(li);
    });
  }

  function populateLessons() {
    lessonData.forEach((lesson, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = "Lesson " + (index + 1) + ": " + lesson[0];
      lessonSetting.appendChild(option);
    });
    const progress = getProgress();
    const prefix = "en:" + handSetting.value + ":";
    const nextLesson = lessonData.findIndex((item, index) => !progress.completed.includes(prefix + (index + 1)));
    lessonSetting.value = String(nextLesson < 0 ? lessonData.length - 1 : nextLesson);
    refreshLessonAvailability();
    updateLessonSummary();
  }

  function currentInstruction() {
    if (!session) return "";
    if (session.mode === "free") return "Type anything you would like. Select Finish Free Typing when you are done.";
    if (session.durationSeconds) {
      const minutes = session.durationSeconds / 60;
      return "Speed test for " + minutes + (minutes === 1 ? " minute" : " minutes") + ". Begin typing. Next character: " + speakable(session.prompt[session.position]) + ".";
    }
    const mastery = session.mode === "guided" ? " To move on, reach " + session.targetAccuracy + " percent accuracy and " + session.targetWpm + " words per minute." : "";
    if (session.promptGroups) {
      const group = currentPromptGroup() || session.promptGroups[0];
      const position = session.started ? " Current group: " : " First group: ";
      return session.lesson.description + mastery + position + spokenPromptGroup(group) + ".";
    }
    const remaining = session.prompt.slice(session.position);
    if (session.mode === "guided" && remaining.length <= 80) {
      return session.lesson.description + mastery + " Type this sequence: " + speakableSequence(remaining) + ".";
    }
    const nextCharacter = session.prompt[session.position];
    return session.lesson.description + mastery + (nextCharacter === undefined ? "" : " Next character: " + speakable(nextCharacter) + ".");
  }

  function nextKeyInstruction() {
    if (!session) return "";
    if (session.mode === "free") return "Free typing has no required next key.";
    const nextCharacter = session.prompt[session.position];
    return nextCharacter === undefined ? "Sequence complete." : "Next key: " + speakable(nextCharacter) + ".";
  }

  function renderTrackedPrompt() {
    if (!session || session.mode === "free") return;
    const start = session.promptGroups ? currentPromptGroupStart() : session.durationSeconds ? Math.max(0, session.position - 20) : 0;
    const end = session.promptGroups ? start + currentPromptGroup().length : session.durationSeconds ? Math.min(session.prompt.length, start + 700) : session.prompt.length;
    const line = document.createElement("span");
    line.className = "kb-prompt-line";
    for (let index = start; index < end; index += 1) {
      const character = session.prompt[index];
      const marker = document.createElement("span");
      marker.className = "kb-char";
      if (character === " ") marker.classList.add("kb-char-space");
      if (index < session.position) marker.classList.add("kb-char-complete");
      if (index === session.position) marker.classList.add("kb-char-current");
      marker.textContent = character === " " ? "\u00a0" : character;
      line.appendChild(marker);
    }
    targetPrompt.replaceChildren(line);
  }

  function renderPractice() {
    if (!session) return;
    const total = session.prompt.length;
    const modeNames = {
      guided: "Lesson " + session.lesson.number + ": " + session.lesson.title,
      words: "Practice Words",
      sentences: "Practice Sentences",
      "speed-60": "One-Minute Speed Test",
      "speed-180": "Three-Minute Speed Test",
      "speed-360": "Six-Minute Speed Test",
      free: "Free Typing"
    };
    document.getElementById("practiceHeading").textContent = modeNames[session.mode];
    document.getElementById("practiceInstruction").textContent = session.mode === "guided"
      ? session.lesson.description + " Pass with " + session.targetAccuracy + "% accuracy and " + session.targetWpm + " WPM to move on."
      : currentInstruction();
    if (!session.started) {
      targetPrompt.hidden = false;
      freeTypeInput.hidden = true;
      finishFreeType.hidden = true;
      lessonProgress.hidden = true;
      typedText.hidden = true;
      targetPrompt.className = "kb-prompt kb-ready-prompt";
      targetPrompt.textContent = "Press any key to start";
      targetPrompt.setAttribute("aria-label", currentInstruction() + " Press any key to start. The timer has not started.");
      progressText.textContent = session.durationSeconds
        ? "Ready: " + (session.durationSeconds / 60) + (session.durationSeconds === 60 ? " minute" : " minutes")
        : "Ready to begin";
      practiceStatus.textContent = "The timer has not started.";
      targetPrompt.focus();
      return;
    }
    const isFree = session.mode === "free";
    targetPrompt.hidden = isFree;
    freeTypeInput.hidden = !isFree;
    finishFreeType.hidden = !isFree;
    lessonProgress.hidden = isFree;
    typedText.hidden = isFree;
    const displayedPromptLength = session.promptGroups ? currentPromptGroup().length : session.prompt.length;
    targetPrompt.className = "kb-prompt" + (displayedPromptLength > 40 ? " kb-prompt--long" : "");
    renderTrackedPrompt();
    targetPrompt.setAttribute("aria-label", "Typing area. " + currentInstruction());
    typedText.textContent = session.promptGroups
      ? "Part " + (session.groupIndex + 1) + " of " + session.promptGroups.length
      : session.prompt.slice(0, session.position) || "Not started";
    lessonProgress.max = session.durationSeconds || total || 1;
    lessonProgress.value = session.position;
    lessonProgress.textContent = total ? Math.round((session.position / total) * 100) + " percent" : "0 percent";
    progressText.textContent = session.durationSeconds ? session.secondsLeft + " seconds remaining" : isFree ? "Type at your own pace." : session.promptGroups
      ? "Part " + (session.groupIndex + 1) + " of " + session.promptGroups.length
      : "Character " + (session.position + 1) + " of " + total;
    practiceStatus.textContent = "Begin typing.";
    if (isFree) {
      freeTypeInput.value = "";
      freeTypeInput.focus();
    } else targetPrompt.focus();
  }

  function startPractice() {
    if (timerId) window.clearInterval(timerId);
    const hand = handSetting.value;
    const lesson = lessonFor(Number(lessonSetting.value), hand);
    const mode = modeSetting.value;
    const builtPrompt = buildPrompt(lesson, mode, hand);
    const promptGroups = mode === "guided" ? builtPrompt.split(/\s+/).filter(Boolean) : null;
    const prompt = promptGroups ? promptGroups.join("") : builtPrompt;
    const groupOffsets = promptGroups ? promptGroups.map((group, index) => promptGroups.slice(0, index).reduce((total, item) => total + item.length, 0)) : null;
    const durationSeconds = mode.startsWith("speed-") ? Number(mode.split("-")[1]) : 0;
    const targetAccuracy = Number(document.getElementById("accuracySetting").value);
    const targetWpm = Number(document.getElementById("wpmSetting").value);
    session = {
      lesson, hand, mode, prompt, position: 0, correct: 0, mistakes: 0,
      mistakesByKey: {}, startedAt: null, durationSeconds,
      secondsLeft: durationSeconds, targetAccuracy, targetWpm,
      promptGroups, groupOffsets, groupIndex: 0, announcementToken: 0,
      typingMilliseconds: 0, segmentStartedAt: null,
      started: false, finished: false, accepting: false
    };
    show("practicePanel");
    renderPractice();
    speak(currentInstruction() + " Press any key to start. The timer has not started.");
  }

  function beginPractice() {
    if (!session || session.started || session.finished) return;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    session.started = true;
    renderPractice();
    if (session.promptGroups) {
      announceCurrentPromptGroup();
      return;
    }
    session.accepting = true;
    session.startedAt = Date.now();
    if (session.durationSeconds) {
      timerId = window.setInterval(() => {
        if (!session || session.finished) return;
        session.secondsLeft -= 1;
        progressText.textContent = session.secondsLeft + " seconds remaining";
        lessonProgress.value = session.durationSeconds - session.secondsLeft;
        if (session.secondsLeft <= 0) finishPractice();
      }, 1000);
    }
  }

  function finishPractice() {
    if (!session || session.finished) return;
    if (session.promptGroups) closePromptGroupTimer();
    session.finished = true;
    session.accepting = false;
    if (timerId) window.clearInterval(timerId);
    timerId = null;
    if (session.mode === "free") session.correct = freeTypeInput.value.length;
    const attempts = session.correct + session.mistakes;
    const accuracy = attempts ? Math.round((session.correct / attempts) * 100) : 0;
    const elapsedMilliseconds = session.promptGroups
      ? Math.max(session.typingMilliseconds, 1000)
      : Math.max(Date.now() - session.startedAt, 1000);
    const minutes = Math.max(elapsedMilliseconds / 60000, 1 / 60);
    const wpm = Math.round((session.correct / 5) / minutes);
    session.finalAccuracy = accuracy;
    session.finalWpm = wpm;
    session.passed = session.mode !== "guided" || (accuracy >= session.targetAccuracy && wpm >= session.targetWpm);
    if (session.mode === "guided" && session.passed) {
      sessionUnlockedLessons[session.hand] = Math.max(sessionUnlockedLessons[session.hand], Math.min(session.lesson.number, lessonData.length - 1));
    }
    session.elapsedSeconds = Math.max(1, Math.round(elapsedMilliseconds / 1000));
    const difficult = Object.keys(session.mistakesByKey).sort((a, b) => session.mistakesByKey[b] - session.mistakesByKey[a]).slice(0, 5);
    const saved = saveProgress();
    const activity = document.getElementById("practiceHeading").textContent;
    document.getElementById("resultsSummary").textContent = "You finished this attempt of " + activity + " with " + session.correct + " correct characters in " + attempts + " attempts.";
    document.getElementById("errorsResult").textContent = String(session.mistakes);
    document.getElementById("accuracyResult").textContent = accuracy + "%";
    document.getElementById("speedResult").textContent = String(wpm);
    document.getElementById("difficultResult").textContent = difficult.length ? difficult.map(speakable).join(", ") : "None";
    document.getElementById("saveResult").textContent = saved
      ? (session.mode === "guided" && session.passed ? "This completed lesson and its results were saved on this browser." : "These results were saved on this browser.")
      : "This session was not saved.";
    const nextLesson = lessonData[session.lesson.number];
    const lessonFinished = session.mode === "guided";
    const resultAction = document.getElementById("resultAction");
    const resultActionLabel = document.getElementById("resultActionLabel");
    if (lessonFinished && !session.passed) {
      resultAction.dataset.action = "retry";
      resultActionLabel.textContent = "Try Lesson Again";
      resultAction.setAttribute("aria-label", "Almost there. You need " + session.targetAccuracy + " percent accuracy and " + session.targetWpm + " words per minute to move on. Press Enter to try Lesson " + session.lesson.number + " again.");
    } else if (lessonFinished && nextLesson) {
      resultAction.dataset.action = "next";
      resultActionLabel.textContent = "Next Lesson";
      resultAction.setAttribute("aria-label", "Good job. Lesson " + session.lesson.number + " done. Press Enter for Lesson " + (session.lesson.number + 1) + ": " + nextLesson[0] + ".");
    } else if (lessonFinished) {
      resultAction.dataset.action = "done";
      resultActionLabel.textContent = "Done";
      resultAction.setAttribute("aria-label", "Good job. All lessons complete. Press Enter for Done.");
    } else {
      resultAction.dataset.action = "done";
      resultActionLabel.textContent = "Done";
      resultAction.setAttribute("aria-label", "Practice complete. Press Enter for Done.");
    }
    document.getElementById("resultsHeading").innerHTML = lessonFinished && !session.passed
      ? '<span class="kb-sparkle" aria-hidden="true">✦</span> Keep going! <span class="kb-sparkle" aria-hidden="true">✦</span>'
      : lessonFinished
        ? '<span class="kb-sparkle" aria-hidden="true">✦</span> Good job! <span class="kb-sparkle" aria-hidden="true">✦</span>'
      : '<span class="kb-sparkle" aria-hidden="true">✦</span> Practice complete! <span class="kb-sparkle" aria-hidden="true">✦</span>';
    document.getElementById("completionMessage").textContent = lessonFinished && !session.passed
      ? "Reach " + session.targetAccuracy + "% accuracy and " + session.targetWpm + " WPM to move on."
      : lessonFinished ? "Lesson " + session.lesson.number + " passed." : "Nice work!";
    refreshLessonAvailability();
    renderCurriculum();
    show("resultsPanel");
  }

  function openMenu() {
    if (timerId) window.clearInterval(timerId);
    timerId = null;
    session = null;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    updateLessonSummary();
    show("setupPanel");
  }

  document.getElementById("unlockForm").addEventListener("submit", event => {
    event.preventDefault();
    const entry = document.getElementById("previewCode").value.trim().toUpperCase();
    if (entry !== PREVIEW_CODE) {
      document.getElementById("unlockMessage").textContent = "That testing code is not correct.";
      return;
    }
    sessionStorage.setItem("alcKeyboardingPreview", "open");
    previewToolbar.hidden = false;
    setVoice(true, false);
    setWebsiteControlsMinimized(true);
    show("setupPanel");
  });

  document.getElementById("setupForm").addEventListener("submit", event => {
    event.preventDefault();
    startFromMenu();
  });

  document.querySelectorAll(".kb-arrow-menu").forEach(menu => {
    const buttons = Array.from(menu.querySelectorAll(".kb-menu-option"));
    menu.addEventListener("keydown", event => {
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      const availableButtons = buttons.filter(button => !button.hidden && !button.disabled);
      const adjustmentRow = document.activeElement.closest ? document.activeElement.closest(".kb-stepper-row") : null;
      if (adjustmentRow && adjustmentRow.querySelector(".kb-menu-option")) adjustmentRow.querySelector(".kb-menu-option").focus();
      const currentIndex = Math.max(0, availableButtons.indexOf(document.activeElement));
      let nextIndex = currentIndex;
      if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % availableButtons.length;
      else if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + availableButtons.length) % availableButtons.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = availableButtons.length - 1;
      event.preventDefault();
      availableButtons[nextIndex].focus();
    });
    buttons.forEach(button => button.addEventListener("focus", () => speak(button.getAttribute("aria-label") || button.textContent.trim())));
  });

  setupMenu.querySelectorAll("[data-main-action]").forEach(button => button.addEventListener("click", () => {
    const action = button.dataset.mainAction;
    if (action === "lesson") {
      modeSetting.value = "guided";
      startFromMenu();
    }
    if (action === "practice") show("practiceMenuPanel");
    if (action === "stats") {
      updateStats();
      show("statsPanel");
      speak(document.getElementById("statsPanel").innerText);
    }
    if (action === "settings") show("settingsPanel");
  }));

  document.querySelectorAll("[data-practice-mode]").forEach(button => button.addEventListener("click", () => {
    if (button.dataset.practiceMode === "back") return show("setupPanel");
    modeSetting.value = button.dataset.practiceMode;
    startFromMenu();
  }));

  document.querySelectorAll("[data-setting]").forEach(button => button.addEventListener("click", event => {
    activateSetting(button, event.shiftKey ? -1 : 1);
  }));

  document.querySelectorAll("[data-adjust]").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      const settingButton = document.querySelector('[data-setting="' + button.dataset.adjust + '"]');
      activateSetting(settingButton, Number(button.dataset.direction));
    });
    button.addEventListener("focus", () => speak(button.getAttribute("aria-label")));
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && document.getElementById("unlockPanel").hidden && document.getElementById("setupPanel").hidden) {
      event.preventDefault();
      openMenu();
      return;
    }
    if (document.getElementById("practicePanel").hidden || !session) return;
    if (!session.started) {
      if (event.key === "Control") {
        event.preventDefault();
        const message = currentInstruction() + " Press any key to start. The timer has not started.";
        practiceStatus.textContent = message;
        speak(message);
        return;
      }
      if (event.repeat || event.key === "Shift" || event.key === "Alt" || event.key === "Meta") return;
      event.preventDefault();
      beginPractice();
      return;
    }
    if (event.key === "Control") {
      event.preventDefault();
      if (session.promptGroups && !session.accepting) {
        announceCurrentPromptGroup();
        return;
      }
      const message = nextKeyInstruction();
      practiceStatus.textContent = message;
      speak(message);
      return;
    }
    if (session.mode === "free") return;
    if (!session.accepting || event.repeat || event.ctrlKey || event.altKey || event.metaKey || event.key.length !== 1) {
      if (!session.accepting && event.key.length === 1) event.preventDefault();
      return;
    }
    event.preventDefault();
    const expected = session.prompt[session.position];
    if (event.key === expected) {
      session.correct += 1;
      session.position += 1;
      const completedGroup = session.promptGroups && session.position >= currentPromptGroupStart() + currentPromptGroup().length;
      if (completedGroup) {
        closePromptGroupTimer();
        if (session.position < session.prompt.length) session.groupIndex += 1;
      }
      targetPrompt.classList.remove("incorrect");
      targetPrompt.classList.add("correct");
      tone(660, 0.08);
      typedText.textContent = session.promptGroups
        ? "Part " + Math.min(session.groupIndex + 1, session.promptGroups.length) + " of " + session.promptGroups.length
        : session.prompt.slice(Math.max(0, session.position - 120), session.position);
      renderTrackedPrompt();
      if (!session.durationSeconds) lessonProgress.value = session.position;
      progressText.textContent = session.durationSeconds ? session.secondsLeft + " seconds remaining" : session.promptGroups
        ? "Part " + Math.min(session.groupIndex + 1, session.promptGroups.length) + " of " + session.promptGroups.length
        : "Character " + Math.min(session.position + 1, session.prompt.length) + " of " + session.prompt.length;
      if (session.position >= session.prompt.length) {
        session.accepting = false;
        window.setTimeout(finishPractice, 220);
      } else if (completedGroup) {
        session.accepting = false;
        window.setTimeout(() => targetPrompt.classList.remove("correct"), 120);
        announceCurrentPromptGroup();
      } else {
        if (practiceStatus.textContent !== "Keep typing.") practiceStatus.textContent = "Keep typing.";
        window.setTimeout(() => targetPrompt.classList.remove("correct"), 120);
      }
    } else {
      session.mistakes += 1;
      session.mistakesByKey[expected] = (session.mistakesByKey[expected] || 0) + 1;
      targetPrompt.classList.remove("correct");
      targetPrompt.classList.add("incorrect");
      practiceStatus.textContent = "Try again. Next character: " + speakable(expected) + ".";
      tone(190, 0.16);
      speak("Try again. " + speakable(expected));
      window.setTimeout(() => targetPrompt.classList.remove("incorrect"), 220);
    }
  });

  lessonSetting.addEventListener("change", updateLessonSummary);
  handSetting.addEventListener("change", updateLessonSummary);
  document.getElementById("resultAction").addEventListener("click", event => {
    if (event.currentTarget.dataset.action === "retry") {
      startPractice();
      return;
    }
    if (event.currentTarget.dataset.action !== "next") {
      openMenu();
      return;
    }
    lessonSetting.value = String(Math.min(Number(lessonSetting.value) + 1, lessonData.length - 1));
    modeSetting.value = "guided";
    updateLessonSummary();
    startPractice();
  });
  document.getElementById("resultAction").addEventListener("focus", event => {
    speak(event.currentTarget.getAttribute("aria-label") || event.currentTarget.textContent.trim());
  });
  websiteControlsToggle.addEventListener("click", () => setWebsiteControlsMinimized(!document.body.classList.contains("kb-controls-minimized")));
  voiceToggle.addEventListener("click", () => setVoice(!useSiteVoice, true));
  document.querySelectorAll('input[name="voice"]').forEach(input => input.addEventListener("change", () => setVoice(input.value === "site", false)));
  document.getElementById("statsBack").addEventListener("click", () => show("setupPanel"));
  finishFreeType.addEventListener("click", finishPractice);
  freeTypeInput.addEventListener("input", () => {
    if (!session || session.mode !== "free") return;
    progressText.textContent = freeTypeInput.value.length + (freeTypeInput.value.length === 1 ? " character typed" : " characters typed");
  });
  populateLessons();
  setVoice(true, false);
  if (sessionStorage.getItem("alcKeyboardingPreview") === "open") {
    previewToolbar.hidden = false;
    setWebsiteControlsMinimized(true);
    show("setupPanel");
  }
})();
