(() => {
  "use strict";

  const siteVoiceSupported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  const preferenceStorageKey = "accessibleLearningPreferences";

  const settings = {
    speech: {
      index: 0,
      options: [
        { value: "0", label: "Use my own screen reader" },
        ...(siteVoiceSupported ? [{ value: "1", label: "Use site voice" }] : [])
      ],
      valueElement: document.getElementById("commandSpeechValue")
    },
    print: {
      index: 0,
      options: [
        { value: "100", label: "Small print" },
        { value: "125", label: "Medium print" },
        { value: "150", label: "Large print" }
      ],
      valueElement: document.getElementById("commandPrintValue")
    },
    category: {
      index: 0,
      options: [
        "General editing",
        "Microsoft Word and documents",
        "Web and screen-reader navigation",
        "Microsoft Excel and spreadsheets",
        "Presentations",
        "Windows and File Explorer",
        "JAWS commands",
        "NVDA commands",
        "Narrator commands",
        "Braille display keyboard practice"
      ].map(label => ({ value: label, label })),
      valueElement: document.getElementById("commandCategoryValue")
    },
    style: {
      index: 0,
      options: [
        { value: "quick", label: "Quick Command Practice" },
        { value: "guided", label: "Guided Skill Practice" }
      ],
      valueElement: document.getElementById("commandStyleValue")
    },
    length: {
      index: 0,
      options: [
        { value: "5", label: "Five connected tasks" },
        { value: "all", label: "Complete topic" }
      ],
      valueElement: document.getElementById("commandLengthValue")
    },
    level: {
      index: 0,
      options: [
        { value: "brief", label: "General explanation" },
        { value: "detailed", label: "More detailed explanation" }
      ],
      valueElement: document.getElementById("commandExplanationValue")
    },
    sounds: {
      index: 0,
      options: [
        { value: "1", label: "On" },
        { value: "0", label: "Off" }
      ],
      valueElement: document.getElementById("commandSoundValue")
    },
    order: {
      index: 0,
      options: [
        { value: "0", label: "In topic order" },
        { value: "1", label: "Random order" }
      ],
      valueElement: document.getElementById("commandOrderValue")
    }
  };

  const menu = document.getElementById("commandSettingsMenu");
  const status = document.getElementById("commandSetupStatus");
  const start = document.getElementById("startCommandSetup");
  const items = [...menu.querySelectorAll("button")];
  let openingAnnouncement = true;

  function current(setting) {
    return settings[setting].options[settings[setting].index];
  }

  function voiceEnabled() {
    return current("speech").value === "1";
  }

  function readPreferences() {
    try {
      const saved = JSON.parse(localStorage.getItem(preferenceStorageKey) || "{}");
      return saved && typeof saved === "object" ? saved : {};
    } catch (error) {
      return {};
    }
  }

  function saveTrainingPreferences() {
    try {
      const preferences = readPreferences();
      preferences.trainingSpeech = voiceEnabled() ? "voice" : "own";
      preferences.textScale = Number(current("print").value);
      localStorage.setItem(preferenceStorageKey, JSON.stringify(preferences));
    } catch (error) {}
  }

  function applyPrintSize() {
    document.documentElement.style.fontSize = current("print").value + "%";
  }

  function restoreTrainingPreferences() {
    const preferences = readPreferences();
    const speechValue = preferences.trainingSpeech === "voice" && siteVoiceSupported ? "1" : "0";
    const savedScale = Number(preferences.textScale) || 100;
    const printValue = savedScale >= 138 ? "150" : savedScale >= 113 ? "125" : "100";
    settings.speech.index = Math.max(0, settings.speech.options.findIndex(option => option.value === speechValue));
    settings.print.index = settings.print.options.findIndex(option => option.value === printValue);
    Object.keys(settings).forEach(setting => {
      settings[setting].valueElement.textContent = current(setting).label;
    });
    applyPrintSize();
  }

  function stopVoice() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }

  function speak(text) {
    if (!voiceEnabled() || !siteVoiceSupported) return;
    stopVoice();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    speechSynthesis.speak(utterance);
  }

  function itemAnnouncement(item) {
    if (item === start) return "Start Command Practice. Press Enter to begin.";
    const setting = item.dataset.setting;
    return item.querySelector(".mission-setting-label").textContent + ". " + current(setting).label + ". Press Enter to change.";
  }

  function updateStatus() {
    status.textContent = "Selected: " + current("speech").label + ", " + current("print").label + ", " + current("category").label + ", " + current("style").label + ", " + current("length").label + ", " + current("level").label + ", sound " + current("sounds").label.toLowerCase() + ", and " + current("order").label + ".";
  }

  function changeSetting(setting) {
    const data = settings[setting];
    data.index = (data.index + 1) % data.options.length;
    data.valueElement.textContent = current(setting).label;
    if (setting === "print") applyPrintSize();
    saveTrainingPreferences();
    updateStatus();

    if (setting === "speech" && !voiceEnabled()) {
      stopVoice();
      return;
    }
    speak(current(setting).label + " selected.");
  }

  items.forEach(item => {
    item.tabIndex = item === items[0] ? 0 : -1;
    item.addEventListener("focus", () => {
      items.forEach(option => { option.tabIndex = option === item ? 0 : -1; });
      if (!openingAnnouncement) speak(itemAnnouncement(item));
    });
  });

  menu.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button === start) {
      saveTrainingPreferences();
      const params = new URLSearchParams({
        category: current("category").value,
        style: current("style").value,
        length: current("length").value,
        level: current("level").value,
        spoken: current("speech").value,
        sounds: current("sounds").value,
        random: current("order").value
      });
      window.location.href = "command-practice-session.html?" + params.toString();
      return;
    }
    changeSetting(button.dataset.setting);
  });

  menu.addEventListener("keydown", event => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const activeIndex = Math.max(0, items.indexOf(document.activeElement));
    let nextIndex = activeIndex;
    if (event.key === "ArrowDown") nextIndex = (activeIndex + 1) % items.length;
    if (event.key === "ArrowUp") nextIndex = (activeIndex - 1 + items.length) % items.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = items.length - 1;
    items[nextIndex].focus();
  });

  restoreTrainingPreferences();
  updateStatus();
  if (!siteVoiceSupported) {
    const speechHint = document.querySelector('[data-setting="speech"] .mission-setting-hint');
    if (speechHint) speechHint.textContent = "Site voice unavailable in this browser";
  }
  window.addEventListener("DOMContentLoaded", () => {
    items[0].focus();
    openingAnnouncement = false;
    speak("Command Practice setup. Use Down Arrow and Up Arrow to move. Press Enter to change a setting or start. " + itemAnnouncement(items[0]));
  });
})();
