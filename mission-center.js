(() => {
  "use strict";

  const menu = document.getElementById("missionLibraryMenu");
  const catalog = window.MissionControlCatalog;
  if (!menu || !Array.isArray(catalog)) return;

  const voiceSupported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  const preferenceStorageKey = "accessibleLearningPreferences";
  const setupStorageKey = "missionControlLibrarySettings";
  const queryMode = new URLSearchParams(window.location.search).get("mode");
  const settings = {
    mode: {
      index: queryMode === "commands" ? 1 : 0,
      options: [
        { value: "topics", label: "Topic Missions" },
        { value: "commands", label: "Command Practice" }
      ],
      valueElement: document.getElementById("practiceTypeValue")
    },
    manual: { index: 0, options: [], valueElement: document.getElementById("manualValue") },
    set: { index: 0, options: [], valueElement: document.getElementById("practiceSetValue") },
    reader: {
      index: 0,
      options: [
        { value: "jaws", label: "JAWS" },
        { value: "nvda", label: "NVDA" },
        { value: "narrator", label: "Narrator" }
      ],
      valueElement: document.getElementById("readerValue")
    },
    style: {
      index: 0,
      options: [
        { value: "quick", label: "Quick Command Practice" },
        { value: "guided", label: "Guided Skill Practice" }
      ],
      valueElement: document.getElementById("styleValue")
    },
    length: {
      index: 0,
      options: [
        { value: "5", label: "Five commands" },
        { value: "all", label: "Complete practice set" }
      ],
      valueElement: document.getElementById("lengthValue")
    },
    level: {
      index: 0,
      options: [
        { value: "brief", label: "General explanation" },
        { value: "detailed", label: "More detailed explanation" }
      ],
      valueElement: document.getElementById("explanationValue")
    },
    speech: {
      index: 0,
      options: [
        { value: "own", label: "Use my own screen reader" },
        ...(voiceSupported ? [{ value: "voice", label: "Use the Mission Control voice" }] : [])
      ],
      valueElement: document.getElementById("speechValue")
    },
    sounds: {
      index: 0,
      options: [
        { value: "1", label: "On" },
        { value: "0", label: "Off" }
      ],
      valueElement: document.getElementById("soundValue")
    },
    order: {
      index: 0,
      options: [
        { value: "0", label: "In lesson order" },
        { value: "1", label: "Random order" }
      ],
      valueElement: document.getElementById("orderValue")
    }
  };

  const status = document.getElementById("missionLibraryStatus");
  const start = document.getElementById("startMissionPractice");
  const startLabel = document.getElementById("startMissionPracticeLabel");
  let openingAnnouncement = true;

  function current(setting) {
    return settings[setting].options[settings[setting].index];
  }

  function mode() {
    return current("mode").value;
  }

  function setsFor(manual) {
    return mode() === "topics" ? manual.missionSets : manual.commandSets;
  }

  function availableManuals() {
    return catalog.filter(manual => setsFor(manual).length > 0);
  }

  function rebuildManuals(preferredId = "") {
    settings.manual.options = availableManuals().map(manual => ({ value: manual.id, label: manual.label, manual }));
    const preferredIndex = settings.manual.options.findIndex(option => option.value === preferredId);
    settings.manual.index = preferredIndex >= 0 ? preferredIndex : 0;
    rebuildSets();
  }

  function rebuildSets(preferredId = "") {
    const manual = current("manual").manual;
    settings.set.options = setsFor(manual).map(set => ({ value: set.id, label: set.label, set }));
    const preferredIndex = settings.set.options.findIndex(option => option.value === preferredId);
    settings.set.index = preferredIndex >= 0 ? preferredIndex : 0;
  }

  function updateModeVisibility() {
    menu.querySelectorAll("[data-mode]").forEach(item => {
      item.hidden = item.dataset.mode !== mode();
    });
    startLabel.textContent = mode() === "topics" ? "Start Topic Mission" : "Start Command Practice";
  }

  function render() {
    Object.values(settings).forEach(setting => {
      const selected = setting.options[setting.index];
      if (setting.valueElement && selected) setting.valueElement.textContent = selected.label;
    });
    updateModeVisibility();
    updateStatus();
  }

  function visibleItems() {
    return [...menu.querySelectorAll("button:not([hidden])")];
  }

  function resetRovingFocus(preferred) {
    const items = visibleItems();
    const active = items.includes(preferred) ? preferred : items[0];
    [...menu.querySelectorAll("button")].forEach(item => { item.tabIndex = item === active ? 0 : -1; });
  }

  function readPreferences() {
    try {
      const saved = JSON.parse(localStorage.getItem(preferenceStorageKey) || "{}");
      return saved && typeof saved === "object" ? saved : {};
    } catch (error) {
      return {};
    }
  }

  function voiceEnabled() {
    return current("speech").value === "voice";
  }

  function stopVoice() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }

  function speak(text) {
    if (!voiceEnabled() || !voiceSupported) return;
    stopVoice();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    speechSynthesis.speak(utterance);
  }

  function savePreferences() {
    try {
      const preferences = readPreferences();
      preferences.trainingSpeech = voiceEnabled() ? "voice" : "own";
      localStorage.setItem(preferenceStorageKey, JSON.stringify(preferences));
    } catch (error) {}
  }

  function saveSetup() {
    try {
      const saved = {};
      Object.keys(settings).forEach(key => { saved[key] = current(key).value; });
      sessionStorage.setItem(setupStorageKey, JSON.stringify(saved));
    } catch (error) {}
    savePreferences();
  }

  function restoreSetup() {
    let saved = {};
    try { saved = JSON.parse(sessionStorage.getItem(setupStorageKey) || "{}"); } catch (error) {}
    if (queryMode !== "topics" && queryMode !== "commands") {
      const modeIndex = settings.mode.options.findIndex(option => option.value === saved.mode);
      if (modeIndex >= 0) settings.mode.index = modeIndex;
    }
    rebuildManuals(saved.manual);
    rebuildSets(saved.set);
    ["reader", "style", "length", "level", "sounds", "order"].forEach(key => {
      const index = settings[key].options.findIndex(option => option.value === saved[key]);
      if (index >= 0) settings[key].index = index;
    });
    const preferences = readPreferences();
    const speechValue = preferences.trainingSpeech === "voice" && voiceSupported ? "voice" : "own";
    settings.speech.index = Math.max(0, settings.speech.options.findIndex(option => option.value === speechValue));
    render();
  }

  function selectionSummary() {
    const parts = [current("mode").label, current("manual").label, current("set").label];
    if (mode() === "topics") parts.push(current("reader").label);
    else parts.push(current("style").label, current("length").label, current("level").label, "sound " + current("sounds").label.toLowerCase(), current("order").label);
    parts.push(current("speech").label);
    return parts.join(", ");
  }

  function updateStatus() {
    status.setAttribute("aria-live", voiceEnabled() ? "off" : "polite");
    status.textContent = "Selected: " + selectionSummary() + ".";
  }

  function itemAnnouncement(item) {
    if (item === start) return startLabel.textContent + ". Press Enter to begin.";
    const setting = item.dataset.setting;
    return item.querySelector(".mission-setting-label").textContent + ". " + current(setting).label + ". Press Enter to change.";
  }

  function cycle(setting) {
    const data = settings[setting];
    if (setting === "speech" && data.options.length === 1) {
      status.setAttribute("aria-live", "polite");
      status.textContent = "Mission Control voice is unavailable in this browser. Use your own screen reader.";
      return;
    }
    const previousManual = settings.manual.options.length ? current("manual").value : "";
    data.index = (data.index + 1) % data.options.length;
    if (setting === "mode") rebuildManuals(previousManual);
    if (setting === "manual") rebuildSets();
    render();
    resetRovingFocus(document.activeElement);
    saveSetup();
    if (setting === "speech" && !voiceEnabled()) stopVoice();
    else speak(current(setting).label + " selected.");
  }

  function startPractice() {
    saveSetup();
    const selectedSet = current("set").set;
    if (mode() === "topics") {
      const params = new URLSearchParams({
        reader: current("reader").value,
        mission: selectedSet.mission,
        voice: voiceEnabled() ? "1" : "0"
      });
      window.location.href = "topic-mission-session.html?" + params.toString();
      return;
    }
    const params = new URLSearchParams({
      category: selectedSet.category,
      style: current("style").value,
      length: current("length").value,
      level: current("level").value,
      spoken: voiceEnabled() ? "1" : "0",
      sounds: current("sounds").value,
      random: current("order").value
    });
    window.location.href = "command-practice-session.html?" + params.toString();
  }

  menu.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button === start) startPractice();
    else cycle(button.dataset.setting);
  });

  menu.addEventListener("focusin", event => {
    const item = event.target.closest("button");
    if (!item || item.hidden) return;
    resetRovingFocus(item);
    if (!openingAnnouncement) speak(itemAnnouncement(item));
  });

  menu.addEventListener("keydown", event => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const items = visibleItems();
    const activeIndex = Math.max(0, items.indexOf(document.activeElement));
    let nextIndex = activeIndex;
    if (event.key === "ArrowDown") nextIndex = (activeIndex + 1) % items.length;
    if (event.key === "ArrowUp") nextIndex = (activeIndex - 1 + items.length) % items.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = items.length - 1;
    items[nextIndex].focus();
  });

  document.addEventListener("keydown", event => {
    if (!["Escape", "Esc"].includes(event.key) || event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;
    event.preventDefault();
    stopVoice();
    window.location.href = "start-here.html";
  }, true);

  if (!voiceSupported) {
    const hint = document.querySelector('[data-setting="speech"] .mission-setting-hint');
    if (hint) hint.textContent = "Site voice unavailable in this browser";
  }
  restoreSetup();
  resetRovingFocus(visibleItems()[0]);
  window.addEventListener("DOMContentLoaded", () => {
    visibleItems()[0]?.focus();
    openingAnnouncement = false;
    speak("Mission Control Settings. Choose Topic Missions or Command Practice, then choose a manual and practice lesson. Use Up or Down Arrow to move and Enter to change or start. " + itemAnnouncement(visibleItems()[0]));
  });
  window.addEventListener("pagehide", stopVoice);
})();
