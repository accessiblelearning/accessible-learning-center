(() => {
  "use strict";

  const menu = document.getElementById("missionSettingsMenu");
  if (!menu) return;
  const voiceSupported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  const settingsKey = "missionControlPracticeSettings";
  const preferenceKey = "accessibleLearningPreferences";
  const status = document.getElementById("missionSettingsStatus");
  const saveWarning = document.getElementById("missionSettingsSaveWarning");
  const settings = {
    speech: { options: [{ value: "own", label: "Use my own screen reader" }, ...(voiceSupported ? [{ value: "voice", label: "Use the Mission Control voice" }] : [])], valueElement: document.getElementById("speechValue"), index: 0 },
    sounds: { options: [{ value: "1", label: "On" }, { value: "0", label: "Off" }], valueElement: document.getElementById("soundValue"), index: 0 },
    reader: { options: [{ value: "jaws", label: "JAWS" }, { value: "narrator", label: "Narrator" }, { value: "nvda", label: "NVDA" }], valueElement: document.getElementById("readerValue"), index: 0 },
    style: { options: [{ value: "quick", label: "Quick Command Practice" }, { value: "guided", label: "Guided Skill Practice" }], valueElement: document.getElementById("styleValue"), index: 0 },
    length: { options: [{ value: "5", label: "Five commands" }, { value: "all", label: "Complete command topic" }], valueElement: document.getElementById("lengthValue"), index: 0 },
    level: { options: [{ value: "brief", label: "General explanation" }, { value: "detailed", label: "More detailed explanation" }], valueElement: document.getElementById("levelValue"), index: 0 },
    order: { options: [{ value: "0", label: "In manual order" }, { value: "1", label: "Random order" }], valueElement: document.getElementById("orderValue"), index: 0 }
  };
  const items = [...menu.querySelectorAll("button")].filter(item => !item.hidden);
  let openingAnnouncement = true;

  function current(key) { return settings[key].options[settings[key].index]; }
  function voiceEnabled() { return current("speech").value === "voice"; }
  function stopVoice() { try { window.speechSynthesis?.cancel(); } catch (error) { /* Keep keyboard controls usable. */ } }
  function speak(text) {
    if (!voiceEnabled() || !voiceSupported) return;
    stopVoice();
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      speechSynthesis.speak(utterance);
    } catch (error) {
      window.dispatchEvent(new CustomEvent("missionspeecherror"));
    }
  }

  function readObject(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "{}");
      if (value && typeof value === "object" && !Array.isArray(value)) return value;
    } catch (error) {}
    return {};
  }

  function restore() {
    const saved = readObject(settingsKey);
    const preferences = readObject(preferenceKey);
    saved.speech = preferences.trainingSpeech === "voice" && voiceSupported ? "voice" : "own";
    Object.keys(settings).forEach(key => {
      const index = settings[key].options.findIndex(option => option.value === saved[key]);
      settings[key].index = index >= 0 ? index : 0;
      settings[key].valueElement.textContent = current(key).label;
    });
    updateStatus();
  }

  function save() {
    const saved = {};
    let persisted = true;
    Object.keys(settings).forEach(key => { if (key !== "speech") saved[key] = current(key).value; });
    try { localStorage.setItem(settingsKey, JSON.stringify(saved)); } catch (error) { persisted = false; }
    try {
      const preferences = readObject(preferenceKey);
      preferences.trainingSpeech = voiceEnabled() ? "voice" : "own";
      localStorage.setItem(preferenceKey, JSON.stringify(preferences));
    } catch (error) { persisted = false; }
    window.dispatchEvent(new CustomEvent("missionvoicechange", { detail: { enabled: voiceEnabled() } }));
    if (saveWarning) saveWarning.hidden = persisted;
    return persisted;
  }

  function updateStatus(persisted) {
    const prefix = persisted === false ? "Settings could not be saved. These choices work for this visit only: " : persisted === true ? "Settings saved: " : "Current settings: ";
    status.textContent = prefix + items.map(item => current(item.dataset.setting).label).join(", ") + ".";
    // Keep a live fallback even when site voice is selected. This prevents a
    // silent Settings page if the browser delays or blocks speech synthesis.
    status.setAttribute("aria-live", "polite");
  }

  function setActive(item) { items.forEach(option => { option.tabIndex = option === item ? 0 : -1; }); }

  items.forEach((item, index) => {
    item.tabIndex = index === 0 ? 0 : -1;
    item.addEventListener("focus", () => {
      setActive(item);
      const key = item.dataset.setting;
      const label = item.querySelector(".mission-setting-label").textContent;
      const announcement = label + ". " + current(key).label + ". Press Enter to change.";
      status.textContent = announcement;
      if (!openingAnnouncement) speak(announcement);
    });
    item.addEventListener("click", () => {
      const key = item.dataset.setting;
      const data = settings[key];
      if (key === "speech" && data.options.length === 1) {
        status.setAttribute("aria-live", "polite");
        status.textContent = "Mission Control voice is unavailable in this browser. Use your own screen reader.";
        return;
      }
      data.index = (data.index + 1) % data.options.length;
      data.valueElement.textContent = current(key).label;
      const persisted = save();
      updateStatus(persisted);
      if (key === "speech" && !voiceEnabled()) stopVoice();
      else speak(current(key).label + (persisted ? " selected and saved." : " selected for this visit, but could not be saved. Check your browser's storage settings before leaving this page."));
    });
  });

  menu.addEventListener("keydown", event => {
    if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
    if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
      const item = document.activeElement;
      if (!items.includes(item)) return;
      event.preventDefault();
      const data = settings[item.dataset.setting];
      // The click handler advances one step; offset first for a backward step.
      if (event.key === "ArrowLeft") data.index = (data.index - 2 + data.options.length * 2) % data.options.length;
      item.click();
      return;
    }
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

  document.addEventListener("keydown", event => {
    if (!["Escape", "Esc"].includes(event.key) || event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;
    event.preventDefault();
    stopVoice();
    window.location.href = "troubleshooting-lab.html";
  }, true);

  if (!voiceSupported) {
    const hint = document.querySelector('[data-setting="speech"] .mission-setting-hint');
    if (hint) hint.textContent = "Site voice unavailable in this browser";
  }
  restore();
  window.addEventListener("missionvoicechange", event => {
    settings.speech.index = event.detail.enabled && voiceSupported ? 1 : 0;
    settings.speech.valueElement.textContent = current("speech").label;
    updateStatus();
  });
  window.addEventListener("DOMContentLoaded", () => {
    items[0]?.focus();
    openingAnnouncement = false;
    const introduction = "Mission Control Settings. Use the Down Arrow or Up Arrow to move through the settings. Press Enter or Right Arrow for the next value, or Left Arrow for the previous value. Press Escape to return to Mission Control Center.";
    status.textContent = introduction + " Training speech is set to " + current("speech").label + ".";
    speak(introduction + " Training speech is set to " + current("speech").label + ". Press Enter to change it.");
  });
  window.addEventListener("pagehide", stopVoice);
})();
