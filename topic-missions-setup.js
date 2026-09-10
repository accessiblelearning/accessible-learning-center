(() => {
  "use strict";

  const missionVoiceSupported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  const speechOptions = [
    { value: "own", label: "Use my own screen reader" },
    ...(missionVoiceSupported ? [{ value: "voice", label: "Use the Mission Control voice" }] : [])
  ];
  const readerOptions = [
    { value: "jaws", label: "JAWS" },
    { value: "nvda", label: "NVDA" },
    { value: "narrator", label: "Narrator" }
  ];
  const missionOptions = [
    { value: "0", label: "Screen-reader recovery: The unexpected window" },
    { value: "1", label: "Google applications: Letters navigate instead of typing" },
    { value: "2", label: "Email and calendar: Protect the unsent Outlook message" },
    { value: "3", label: "Microsoft applications: The risky Word edit" },
    { value: "4", label: "Cloud storage: Move without losing the original" },
    { value: "5", label: "Online meetings: The live microphone" },
    { value: "6", label: "Privacy and cybersecurity: The suspicious pop-up" },
    { value: "7", label: "Files and folders: Rename the correct file" }
  ];

  const settings = {
    speech: { options: speechOptions, index: 0, valueElement: document.getElementById("speechSettingValue") },
    reader: { options: readerOptions, index: 0, valueElement: document.getElementById("readerSettingValue") },
    mission: { options: missionOptions, index: 0, valueElement: document.getElementById("missionSettingValue") }
  };
  const menu = document.getElementById("missionSettingsMenu");
  const status = document.getElementById("missionSetupStatus");
  const start = document.getElementById("startMissionSetup");
  const items = [...menu.querySelectorAll("button")];
  const storageKey = "missionControlSettings";
  const preferenceStorageKey = "accessibleLearningPreferences";
  let openingAnnouncement = true;

  if (!missionVoiceSupported) {
    const speechItem = items.find(item => item.dataset.setting === "speech");
    const speechHint = speechItem?.querySelector(".mission-setting-hint");
    if (speechHint) speechHint.textContent = "Mission Control voice unavailable in this browser";
  }

  function current(setting) {
    return settings[setting].options[settings[setting].index];
  }

  function voiceEnabled() {
    return current("speech").value === "voice";
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
      localStorage.setItem(preferenceStorageKey, JSON.stringify(preferences));
    } catch (error) {}
  }

  function stopVoice() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }

  function speak(text) {
    if (!voiceEnabled() || !missionVoiceSupported) return;
    stopVoice();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    speechSynthesis.speak(utterance);
  }

  function itemAnnouncement(item) {
    if (item === start) return "Start selected mission. Press Enter to begin.";
    const setting = item.dataset.setting;
    if (setting === "speech" && !missionVoiceSupported) return "Speech. Use my own screen reader. Mission Control voice is unavailable in this browser.";
    return item.querySelector(".mission-setting-label").textContent + ". " + current(setting).label + ". Press Enter to change.";
  }

  function updateStatus() {
    status.textContent = "Selected: " + current("speech").label + ", " + current("reader").label + ", and " + current("mission").label + ".";
  }

  function saveSettings() {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({
        speech: current("speech").value,
        reader: current("reader").value,
        mission: current("mission").value
      }));
    } catch (error) {}
  }

  function restoreSettings() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) || "{}");
      Object.keys(settings).forEach(setting => {
        const savedIndex = settings[setting].options.findIndex(option => option.value === saved[setting]);
        if (savedIndex >= 0) settings[setting].index = savedIndex;
        settings[setting].valueElement.textContent = current(setting).label;
      });
    } catch (error) {}
    const preferences = readPreferences();
    const preferredSpeech = preferences.trainingSpeech === "voice" && missionVoiceSupported ? "voice" : "own";
    const speechIndex = settings.speech.options.findIndex(option => option.value === preferredSpeech);
    if (speechIndex >= 0) settings.speech.index = speechIndex;
    Object.keys(settings).forEach(setting => {
      settings[setting].valueElement.textContent = current(setting).label;
    });
    status.setAttribute("aria-live", voiceEnabled() ? "off" : "polite");
    updateStatus();
  }

  function changeSetting(setting) {
    const data = settings[setting];
    if (setting === "speech" && data.options.length === 1) {
      status.setAttribute("aria-live", "polite");
      status.textContent = "Mission Control voice is unavailable in this browser. Use your own screen reader.";
      return;
    }
    data.index = (data.index + 1) % data.options.length;
    data.valueElement.textContent = current(setting).label;
    status.setAttribute("aria-live", voiceEnabled() ? "off" : "polite");
    updateStatus();
    saveSettings();
    saveTrainingPreferences();

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
      saveSettings();
      saveTrainingPreferences();
      const params = new URLSearchParams({
        reader: current("reader").value,
        mission: current("mission").value,
        voice: voiceEnabled() ? "1" : "0"
      });
      window.location.href = "topic-mission-session.html?" + params.toString();
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

  document.addEventListener("keydown", event => {
    if (!["Escape", "Esc"].includes(event.key) || event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;
    event.preventDefault();
    stopVoice();
    window.location.replace("troubleshooting-lab.html");
  }, true);

  restoreSettings();
  window.addEventListener("pagehide", stopVoice);
  window.addEventListener("DOMContentLoaded", () => {
    items[0].focus();
    openingAnnouncement = false;
    speak("Mission Control setup. Use Down Arrow and Up Arrow to move. Press Enter to change a setting or start. Press Escape to return to the Command Center. " + itemAnnouncement(items[0]));
  });
})();
