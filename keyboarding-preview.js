(function () {
  "use strict";

  const PREVIEW_CODE = "KEYS2026";
  const STORAGE_KEY = "alcKeyboardingProgressV1";
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
    ["Keyboard orientation", "Find the Space bar and the F and J locator keys.", " fj"],
    ["F and J locator keys", "Use your index fingers to press F and J.", "fj"],
    ["Left home-row keys", "Add A, S, D, and F.", "asdf"],
    ["Right home-row keys", "Add J, K, L, and semicolon.", "jkl;"],
    ["Full home row", "Use both sides of the home row together.", "asdfjkl;"],
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

  const panels = ["unlockPanel", "setupPanel", "practicePanel", "resultsPanel"].map(id => document.getElementById(id));
  const lessonSetting = document.getElementById("lessonSetting");
  const modeSetting = document.getElementById("modeSetting");
  const handSetting = document.getElementById("handSetting");
  const targetPrompt = document.getElementById("targetPrompt");
  const typedText = document.getElementById("typedText");
  const practiceStatus = document.getElementById("practiceStatus");
  const lessonProgress = document.getElementById("lessonProgress");
  const progressText = document.getElementById("progressText");
  const previewToolbar = document.getElementById("previewToolbar");
  const websiteControlsToggle = document.getElementById("websiteControlsToggle");
  let useSiteVoice = false;
  let useSounds = true;
  let rememberProgress = false;
  let audioContext = null;
  let session = null;
  let timerId = null;

  function show(panelId) {
    const selected = document.getElementById(panelId);
    panels.forEach(panel => { panel.hidden = panel !== selected; });
    const heading = selected.querySelector("h1, h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus();
    }
  }

  function setWebsiteControlsMinimized(minimized) {
    document.body.classList.toggle("kb-controls-minimized", minimized);
    websiteControlsToggle.setAttribute("aria-expanded", String(!minimized));
    websiteControlsToggle.textContent = minimized ? "Show Website Controls" : "Minimize Website Controls";
  }

  function speak(message) {
    if (!useSiteVoice || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
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

  function repeatedFocus(focus, length) {
    let characters = Array.from(focus.replace(/ /g, ""));
    if (!characters.length) characters = ["f", "j"];
    const output = [];
    for (let i = 0; i < length; i += 1) output.push(characters[i % characters.length]);
    return output.join(" ");
  }

  function buildPrompt(lesson, mode, hand) {
    const lowerAllowed = lesson.allowed.toLowerCase() + lesson.allowed.toUpperCase();
    let words = WORD_BANK.filter(word => fits(word, lowerAllowed));
    if (hand !== "both") words = words.filter(word => Array.from(word).every(character => belongsToHand(character, hand)));
    if (!words.length) words = [lesson.focus.replace(/ /g, "") || (hand === "right" ? "j" : "f")];
    const start = (lesson.number * 3) % words.length;
    const selectedWords = Array.from({ length: 12 }, (_, index) => words[(start + index) % words.length]);
    const sentences = SENTENCE_BANK.filter(sentence => fits(sentence.toLowerCase(), lowerAllowed) && (hand === "both" || Array.from(sentence.toLowerCase()).every(character => !/[a-z]/.test(character) || belongsToHand(character, hand))));
    if (mode === "guided") return repeatedFocus(lesson.focus, lesson.number < 11 ? 12 : 18);
    if (mode === "words") return selectedWords.slice(0, 8).join(" ");
    if (mode === "sentences") return sentences[lesson.number % Math.max(sentences.length, 1)] || selectedWords.slice(0, 8).join(" ");
    if (mode === "accuracy") return selectedWords.slice(0, 10).join(" ");
    if (mode === "timed") return Array.from({ length: 5 }, () => selectedWords.join(" ")).join(" ");
    if (mode === "review") {
      const difficult = getProgress().difficult || {};
      const keys = Object.keys(difficult).filter(key => lesson.allowed.includes(key) && belongsToHand(key, hand)).sort((a, b) => difficult[b] - difficult[a]).slice(0, 8).join("");
      return repeatedFocus(keys || lesson.focus, 18);
    }
    return selectedWords.join(" ");
  }

  function getProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return {
        completed: saved && Array.isArray(saved.completed) ? saved.completed : [],
        difficult: saved && saved.difficult && typeof saved.difficult === "object" ? saved.difficult : {}
      };
    }
    catch (error) { return { completed: [], difficult: {} }; }
  }

  function saveProgress() {
    if (!rememberProgress || !session) return false;
    try {
      const progress = getProgress();
      const completion = "en:" + session.hand + ":" + session.lesson.number;
      if (!progress.completed.includes(completion)) progress.completed.push(completion);
      Object.keys(session.mistakesByKey).forEach(key => {
        progress.difficult[key] = (progress.difficult[key] || 0) + session.mistakesByKey[key];
      });
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

  function updateLessonSummary() {
    const lesson = lessonFor(Number(lessonSetting.value || 0), handSetting.value);
    document.getElementById("lessonSummary").textContent = "Lesson " + lesson.number + ": " + lesson.title + ". " + lesson.description;
    renderCurriculum();
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
    updateLessonSummary();
  }

  function currentInstruction() {
    if (!session) return "";
    const remaining = session.prompt.slice(session.position);
    if (session.mode === "guided" && remaining.length <= 80) {
      return session.lesson.description + " Type this sequence: " + speakableSequence(remaining) + ".";
    }
    const nextCharacter = session.prompt[session.position];
    return session.lesson.description + (nextCharacter === undefined ? "" : " Next character: " + speakable(nextCharacter) + ".");
  }

  function renderPractice() {
    if (!session) return;
    const total = session.prompt.length;
    document.getElementById("practiceHeading").textContent = "Lesson " + session.lesson.number + ": " + session.lesson.title;
    document.getElementById("practiceInstruction").textContent = session.lesson.description;
    targetPrompt.className = "kb-prompt";
    targetPrompt.textContent = session.prompt;
    targetPrompt.setAttribute("aria-label", "Typing area. " + currentInstruction());
    typedText.textContent = session.prompt.slice(0, session.position) || "Not started";
    lessonProgress.max = total;
    lessonProgress.value = session.position;
    lessonProgress.textContent = Math.round((session.position / total) * 100) + " percent";
    progressText.textContent = session.mode === "timed" ? session.secondsLeft + " seconds remaining" : "Character " + (session.position + 1) + " of " + total;
    practiceStatus.textContent = "Begin typing.";
    targetPrompt.focus();
  }

  function startPractice() {
    if (timerId) window.clearInterval(timerId);
    const hand = handSetting.value;
    const lesson = lessonFor(Number(lessonSetting.value), hand);
    const mode = modeSetting.value;
    const prompt = buildPrompt(lesson, mode, hand);
    session = {
      lesson, hand, mode, prompt, position: 0, correct: 0, mistakes: 0,
      mistakesByKey: {}, startedAt: Date.now(), secondsLeft: 30, finished: false, accepting: true
    };
    show("practicePanel");
    renderPractice();
    speak(currentInstruction());
    if (mode === "timed") {
      timerId = window.setInterval(() => {
        if (!session || session.finished) return;
        session.secondsLeft -= 1;
        progressText.textContent = session.secondsLeft + " seconds remaining";
        if (session.secondsLeft <= 0) finishPractice();
      }, 1000);
    }
  }

  function finishPractice() {
    if (!session || session.finished) return;
    session.finished = true;
    session.accepting = false;
    if (timerId) window.clearInterval(timerId);
    timerId = null;
    const attempts = session.correct + session.mistakes;
    const accuracy = attempts ? Math.round((session.correct / attempts) * 100) : 0;
    const minutes = Math.max((Date.now() - session.startedAt) / 60000, 1 / 60);
    const wpm = Math.round((session.correct / 5) / minutes);
    const difficult = Object.keys(session.mistakesByKey).sort((a, b) => session.mistakesByKey[b] - session.mistakesByKey[a]).slice(0, 5);
    const saved = saveProgress();
    document.getElementById("resultsSummary").textContent = "You completed Lesson " + session.lesson.number + " with " + session.correct + " correct characters in " + attempts + " attempts.";
    document.getElementById("accuracyResult").textContent = accuracy + "%";
    document.getElementById("speedResult").textContent = String(wpm);
    document.getElementById("difficultResult").textContent = difficult.length ? difficult.map(speakable).join(", ") : "None";
    document.getElementById("saveResult").textContent = saved ? "This lesson was marked complete on this browser." : "This session was not saved.";
    const nextButton = document.getElementById("nextLesson");
    nextButton.hidden = session.lesson.number >= lessonData.length;
    nextButton.textContent = session.lesson.number >= lessonData.length ? "All Lessons Complete" : "Start Lesson " + (session.lesson.number + 1);
    renderCurriculum();
    show("resultsPanel");
    speak("Practice complete. " + accuracy + " percent accuracy.");
  }

  function openMenu() {
    if (timerId) window.clearInterval(timerId);
    timerId = null;
    session = null;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
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
    setWebsiteControlsMinimized(true);
    show("setupPanel");
  });

  document.getElementById("setupForm").addEventListener("submit", event => {
    event.preventDefault();
    useSiteVoice = document.querySelector('input[name="voice"]:checked').value === "site";
    useSounds = document.getElementById("soundSetting").checked;
    rememberProgress = document.getElementById("saveSetting").checked;
    document.documentElement.style.setProperty("--kb-scale", document.getElementById("textSizeSetting").value);
    startPractice();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && (!document.getElementById("practicePanel").hidden || !document.getElementById("resultsPanel").hidden)) {
      event.preventDefault();
      openMenu();
      return;
    }
    if (document.getElementById("practicePanel").hidden || !session) return;
    if (event.key === "Control") {
      event.preventDefault();
      practiceStatus.textContent = currentInstruction();
      speak(currentInstruction());
      return;
    }
    if (!session.accepting || event.repeat || event.ctrlKey || event.altKey || event.metaKey || event.key.length !== 1) return;
    event.preventDefault();
    const expected = session.prompt[session.position];
    if (event.key === expected) {
      session.correct += 1;
      session.position += 1;
      targetPrompt.classList.remove("incorrect");
      targetPrompt.classList.add("correct");
      tone(660, 0.08);
      typedText.textContent = session.prompt.slice(0, session.position);
      lessonProgress.value = session.position;
      progressText.textContent = session.mode === "timed" ? session.secondsLeft + " seconds remaining" : "Character " + Math.min(session.position + 1, session.prompt.length) + " of " + session.prompt.length;
      if (session.position >= session.prompt.length) {
        session.accepting = false;
        window.setTimeout(finishPractice, 220);
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
  document.getElementById("practiceAgain").addEventListener("click", startPractice);
  document.getElementById("changeSettings").addEventListener("click", openMenu);
  document.getElementById("nextLesson").addEventListener("click", () => {
    lessonSetting.value = String(Math.min(Number(lessonSetting.value) + 1, lessonData.length - 1));
    updateLessonSummary();
    startPractice();
  });
  websiteControlsToggle.addEventListener("click", () => setWebsiteControlsMinimized(!document.body.classList.contains("kb-controls-minimized")));
  document.getElementById("lockPreview").addEventListener("click", () => {
    sessionStorage.removeItem("alcKeyboardingPreview");
    document.getElementById("previewCode").value = "";
    previewToolbar.hidden = true;
    setWebsiteControlsMinimized(false);
    show("unlockPanel");
  });

  populateLessons();
  if (sessionStorage.getItem("alcKeyboardingPreview") === "open") {
    previewToolbar.hidden = false;
    setWebsiteControlsMinimized(true);
    show("setupPanel");
  }
})();
