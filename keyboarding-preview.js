(function () {
  "use strict";

  const previewCode = "KEYS2026";
  const sequence = ["f", "j", "f", "f", "j", "j", "f", "j", "j", "f", "j", "f"];
  const unlockPanel = document.getElementById("unlockPanel");
  const setupPanel = document.getElementById("setupPanel");
  const practicePanel = document.getElementById("practicePanel");
  const resultsPanel = document.getElementById("resultsPanel");
  const targetKey = document.getElementById("targetKey");
  const practiceStatus = document.getElementById("practiceStatus");
  const lessonProgress = document.getElementById("lessonProgress");
  const progressText = document.getElementById("progressText");
  let position = 0;
  let mistakes = 0;
  let acceptingKey = false;
  let useSiteVoice = false;
  let useSounds = true;
  let audioContext = null;

  function show(panel) {
    [unlockPanel, setupPanel, practicePanel, resultsPanel].forEach(function (item) {
      item.hidden = item !== panel;
    });
    const heading = panel.querySelector("h1");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus();
    }
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
      gain.gain.setValueAtTime(0.12, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      // Spoken and visual feedback remain available if audio is blocked.
    }
  }

  function currentPrompt() {
    return "Press " + sequence[position].toUpperCase() + ".";
  }

  function renderPrompt(announce) {
    const key = sequence[position].toUpperCase();
    targetKey.className = "kb-key";
    targetKey.textContent = key;
    targetKey.setAttribute("aria-label", "Press " + key);
    lessonProgress.value = position;
    lessonProgress.textContent = position + " of " + sequence.length;
    progressText.textContent = "Key " + (position + 1) + " of " + sequence.length;
    practiceStatus.textContent = currentPrompt();
    acceptingKey = true;
    if (announce) speak(currentPrompt());
  }

  function startPractice() {
    position = 0;
    mistakes = 0;
    show(practicePanel);
    renderPrompt(true);
  }

  function finishPractice() {
    acceptingKey = false;
    lessonProgress.value = sequence.length;
    const attempts = sequence.length + mistakes;
    const accuracy = Math.round((sequence.length / attempts) * 100);
    document.getElementById("resultsSummary").textContent =
      "You completed 12 keys with " + accuracy + "% accuracy and " + mistakes +
      (mistakes === 1 ? " incorrect key." : " incorrect keys.");
    show(resultsPanel);
    speak("Practice complete. " + accuracy + " percent accuracy.");
  }

  document.getElementById("unlockForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const entry = document.getElementById("previewCode").value.trim().toUpperCase();
    if (entry !== previewCode) {
      document.getElementById("unlockMessage").textContent = "That testing code is not correct.";
      return;
    }
    sessionStorage.setItem("alcKeyboardingPreview", "open");
    show(setupPanel);
  });

  document.getElementById("setupForm").addEventListener("submit", function (event) {
    event.preventDefault();
    useSiteVoice = document.querySelector('input[name="voice"]:checked').value === "site";
    useSounds = document.getElementById("soundSetting").checked;
    startPractice();
  });

  document.addEventListener("keydown", function (event) {
    if (practicePanel.hidden) return;

    if (event.key === "Escape") {
      event.preventDefault();
      acceptingKey = false;
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      show(setupPanel);
      return;
    }

    if (event.key === "Control") {
      event.preventDefault();
      practiceStatus.textContent = currentPrompt();
      speak(currentPrompt());
      return;
    }

    if (!acceptingKey || event.ctrlKey || event.altKey || event.metaKey || event.key.length !== 1) return;
    event.preventDefault();
    acceptingKey = false;

    if (event.key.toLowerCase() === sequence[position]) {
      targetKey.classList.add("correct");
      practiceStatus.textContent = "Correct.";
      tone(660, 0.12);
      speak("Correct.");
      position += 1;
      window.setTimeout(function () {
        if (position >= sequence.length) finishPractice();
        else renderPrompt(true);
      }, 450);
    } else {
      mistakes += 1;
      targetKey.classList.add("incorrect");
      practiceStatus.textContent = "Try again. " + currentPrompt();
      tone(190, 0.18);
      speak("Try again. " + currentPrompt());
      window.setTimeout(function () {
        targetKey.className = "kb-key";
        acceptingKey = true;
      }, 450);
    }
  });

  document.getElementById("practiceAgain").addEventListener("click", startPractice);
  document.getElementById("changeSettings").addEventListener("click", function () { show(setupPanel); });
  document.getElementById("lockPreview").addEventListener("click", function () {
    sessionStorage.removeItem("alcKeyboardingPreview");
    document.getElementById("previewCode").value = "";
    show(unlockPanel);
  });

  if (sessionStorage.getItem("alcKeyboardingPreview") === "open") show(setupPanel);
})();
