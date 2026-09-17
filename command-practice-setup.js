(() => {
  "use strict";

  const catalog = window.MissionControlCatalog;
  const menu = document.getElementById("commandTopicsMenu");
  const status = document.getElementById("commandTopicsStatus");
  if (!Array.isArray(catalog) || !menu) return;

  const settingsKey = "missionControlPracticeSettings";
  const preferenceKey = "accessibleLearningPreferences";
  const voiceSupported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  let openingAnnouncement = true;

  function readSettings() {
    const defaults = { style: "quick", length: "5", level: "brief", sounds: "1", order: "0" };
    try { return { ...defaults, ...JSON.parse(localStorage.getItem(settingsKey) || "{}") }; }
    catch (error) { return defaults; }
  }

  function siteVoiceEnabled() {
    try {
      const preferences = JSON.parse(localStorage.getItem(preferenceKey) || "{}");
      return preferences.trainingSpeech === "voice";
    } catch (error) { return false; }
  }

  function stopVoice() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }

  function speak(text) {
    if (!siteVoiceEnabled() || !voiceSupported) return;
    stopVoice();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    speechSynthesis.speak(utterance);
  }

  const description = document.getElementById("missionSelectionDescription");
  const focusKey = "missionControlFocus:" + menu.id;
  const choices = [];
  catalog.forEach(manual => {
    manual.commandSets.forEach(set => {
      const link = document.createElement("a");
      link.className = "mission-center-option mission-topic-option";
      link.href = "#";
      link.dataset.category = set.category;
      const name = document.createElement("strong");
      name.textContent = set.menuLabel || set.label.split(":")[0];
      link.dataset.choice = set.id;
      link.dataset.description = set.label;
      const source = document.createElement("span");
      source.textContent = "From " + manual.label;
      source.className = "visually-hidden";
      link.append(name, source);
      menu.append(link);
      choices.push(link);
    });
  });

  function setActive(item) {
    choices.forEach(option => { option.tabIndex = option === item ? 0 : -1; });
  }

  function startTopic(item) {
    stopVoice();
    const settings = readSettings();
    const params = new URLSearchParams({
      category: item.dataset.category,
      style: settings.style,
      length: settings.length,
      level: settings.level,
      spoken: siteVoiceEnabled() ? "1" : "0",
      sounds: settings.sounds,
      random: settings.order
    });
    window.location.href = "command-practice-session.html?" + params.toString();
  }

  choices.forEach((item, index) => {
    item.tabIndex = index === 0 ? 0 : -1;
    item.addEventListener("focus", () => {
      setActive(item);
      try { sessionStorage.setItem(focusKey, item.dataset.choice); } catch (error) {}
      if (description) description.textContent = item.dataset.description;
      const announcement = item.dataset.description + ". Press Enter to start.";
      status.textContent = announcement;
      if (!openingAnnouncement) speak(announcement);
    });
    item.addEventListener("click", event => {
      event.preventDefault();
      startTopic(item);
    });
  });

  menu.addEventListener("keydown", event => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const activeIndex = Math.max(0, choices.indexOf(document.activeElement));
    let nextIndex = activeIndex;
    if (event.key === "ArrowDown") nextIndex = (activeIndex + 1) % choices.length;
    if (event.key === "ArrowUp") nextIndex = (activeIndex - 1 + choices.length) % choices.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = choices.length - 1;
    choices[nextIndex].focus();
  });

  document.addEventListener("keydown", event => {
    if (!["Escape", "Esc"].includes(event.key) || event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;
    event.preventDefault();
    stopVoice();
    window.location.href = "troubleshooting-lab.html";
  }, true);

  status.setAttribute("aria-live", siteVoiceEnabled() ? "off" : "polite");
  window.addEventListener("DOMContentLoaded", () => {
    let remembered = "";
    try { remembered = sessionStorage.getItem(focusKey) || ""; } catch (error) {}
    const selected = choices.find(item => item.dataset.choice === remembered) || choices[0];
    selected?.focus();
    openingAnnouncement = false;
    const first = selected?.dataset.description || "";
    speak("Welcome to Command Practice. Use the Down Arrow or Up Arrow to choose a practice topic from the manuals. " + first + ". Press Enter to start.");
  });
  window.addEventListener("pagehide", stopVoice);
})();
