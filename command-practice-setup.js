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

  function readVoicePreference() {
    const defaultVoice = document.body.dataset.defaultTrainingSpeech === "voice";
    try {
      const preferences = JSON.parse(localStorage.getItem(preferenceKey) || "{}");
      if (["voice", "own"].includes(preferences?.trainingSpeech)) return preferences.trainingSpeech === "voice";
      // Remember the initial choice so display controls and a return visit do
      // not silently switch the topic narrator back off.
      if (defaultVoice) localStorage.setItem(preferenceKey, JSON.stringify({ ...preferences, trainingSpeech: "voice" }));
    } catch (error) { /* The menu remains usable without storage. */ }
    return defaultVoice;
  }
  let useSiteVoice = voiceSupported && readVoicePreference();
  function siteVoiceEnabled() { return useSiteVoice; }
  window.addEventListener("missionvoicechange", event => {
    useSiteVoice = Boolean(event.detail.enabled && voiceSupported);
    // The toolbar is outside the arrow-key menu. Return to the selected topic
    // after enabling voice so Down Arrow works immediately and reads its label.
    if (useSiteVoice) window.setTimeout(() => {
      if (document.activeElement?.id === "missionVoiceToggle") {
        (choices.find(item => item.tabIndex === 0) || choices[0])?.focus();
      }
    }, 0);
  });

  function stopVoice() {
    try { window.speechSynthesis?.cancel(); } catch (error) { /* Keep keyboard controls usable. */ }
  }

  function speak(text) {
    if (!siteVoiceEnabled() || !voiceSupported) return;
    stopVoice();
    try {
      window.speechSynthesis.resume?.();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      speechSynthesis.speak(utterance);
    } catch (error) {
      window.dispatchEvent(new CustomEvent("missionspeecherror"));
    }
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
      link.id = set.id;
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
      style: "guided",
      length: "all",
      level: "detailed",
      spoken: siteVoiceEnabled() ? "1" : "0",
      sounds: settings.sounds,
      random: "0"
    });
    window.location.href = "command-practice-session.html?" + params.toString();
  }

  function announceChoice(item) {
    setActive(item);
    try { sessionStorage.setItem(focusKey, item.dataset.choice); } catch (error) {}
    if (description) description.textContent = item.dataset.description;
    const announcement = item.dataset.description + ". Press Enter to start.";
    status.textContent = announcement;
    if (!openingAnnouncement) speak(announcement);
  }

  choices.forEach((item, index) => {
    item.tabIndex = index === 0 ? 0 : -1;
    item.addEventListener("focus", () => announceChoice(item));
    item.addEventListener("click", event => {
      event.preventDefault();
      startTopic(item);
    });
  });

  menu.addEventListener("keydown", event => {
    if (event.defaultPrevented || event.isComposing || event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const activeIndex = Math.max(0, choices.indexOf(document.activeElement));
    let nextIndex = activeIndex;
    if (event.key === "ArrowDown") nextIndex = (activeIndex + 1) % choices.length;
    if (event.key === "ArrowUp") nextIndex = (activeIndex - 1 + choices.length) % choices.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = choices.length - 1;
    const next = choices[nextIndex];
    if (next === document.activeElement) announceChoice(next);
    else next.focus();
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
    const requested = new URLSearchParams(window.location.search).get("topic");
    const selected = choices.find(item => item.dataset.choice === requested) || choices.find(item => item.dataset.choice === remembered) || choices[0];
    selected?.focus();
    openingAnnouncement = false;
    const first = selected?.dataset.description || "";
    speak("Welcome to Command Practice. Use the Down Arrow or Up Arrow to choose a practice topic from the manuals. " + first + ". Press Enter to start.");
  });
  window.addEventListener("pagehide", stopVoice);
})();
