(() => {
  "use strict";

  const menu = document.getElementById("missionSettingsMenu");
  if (!menu) return;
  const voiceSupported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  const settingsKey = "missionControlPracticeSettings";
  const preferenceKey = "accessibleLearningPreferences";
  const status = document.getElementById("missionSettingsStatus");
  const settings = {
    speech: { options: [{ value: "own", label: "Use my own screen reader" }, ...(voiceSupported ? [{ value: "voice", label: "Use the Mission Control voice" }] : [])], valueElement: document.getElementById("speechValue"), index: 0 },
    sounds: { options: [{ value: "1", label: "On" }, { value: "0", label: "Off" }], valueElement: document.getElementById("soundValue"), index: 0 },
    reader: { options: [{ value: "jaws", label: "JAWS" }, { value: "narrator", label: "Narrator" }, { value: "nvda", label: "NVDA" }], valueElement: document.getElementById("readerValue"), index: 0 },
    style: { options: [{ value: "quick", label: "Quick Command Practice" }, { value: "guided", label: "Guided Skill Practice" }], valueElement: document.getElementById("styleValue"), index: 0 },
    length: { options: [{ value: "5", label: "Five commands" }, { value: "all", label: "Complete command topic" }], valueElement: document.getElementById("lengthValue"), index: 0 },
    level: { options: [{ value: "brief", label: "General explanation" }, { value: "detailed", label: "More detailed explanation" }], valueElement: document.getElementById("levelValue"), index: 0 },
    order: { options: [{ value: "0", label: "In manual order" }, { value: "1", label: "Random order" }], valueElement: document.getElementById("orderValue"), index: 0 }
  };
  const items = [...menu.querySelectorAll("button")];
  let openingAnnouncement = true;

  function current(key) { return settings[key].options[settings[key].index]; }
  function voiceEnabled() { return current("speech").value === "voice"; }
  function stopVoice() { if ("speechSynthesis" in window) speechSynthesis.cancel(); }
  function speak(text) {
    if (!voiceEnabled() || !voiceSupported) return;
    stopVoice();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    speechSynthesis.speak(utterance);
  }

  function restore() {
    let saved = {};
    let preferences = {};
    try { saved = JSON.parse(localStorage.getItem(settingsKey) || "{}"); } catch (error) {}
    try { preferences = JSON.parse(localStorage.getItem(preferenceKey) || "{}"); } catch (error) {}
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
    Object.keys(settings).forEach(key => { if (key !== "speech") saved[key] = current(key).value; });
    try { localStorage.setItem(settingsKey, JSON.stringify(saved)); } catch (error) {}
    try {
      const preferences = JSON.parse(localStorage.getItem(preferenceKey) || "{}");
      preferences.trainingSpeech = voiceEnabled() ? "voice" : "own";
      localStorage.setItem(preferenceKey, JSON.stringify(preferences));
    } catch (error) {}
  }

  function updateStatus() {
    status.textContent = "Settings saved: " + Object.keys(settings).map(key => current(key).label).join(", ") + ".";
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
      save();
      updateStatus();
      if (key === "speech" && !voiceEnabled()) stopVoice();
      else speak(current(key).label + " selected and saved.");
    });
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
  window.addEventListener("DOMContentLoaded", () => {
    items[0]?.focus();
    openingAnnouncement = false;
    speak("Mission Control Settings. Training speech. " + current("speech").label + ". Press Enter to change, or use the Down Arrow for more settings.");
  });
  window.addEventListener("pagehide", stopVoice);
})();
