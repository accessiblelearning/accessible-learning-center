(() => {
  "use strict";

  const catalog = window.MissionControlCatalog;
  const menu = document.getElementById("topicMissionsMenu");
  const status = document.getElementById("topicMissionsStatus");
  if (!Array.isArray(catalog) || !menu) return;

  const settingsKey = "missionControlPracticeSettings";
  const preferenceKey = "accessibleLearningPreferences";

  function readSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(settingsKey) || "{}");
      return { reader: "jaws", ...saved };
    } catch (error) { return { reader: "jaws" }; }
  }

  function siteVoiceEnabled() {
    try {
      const preferences = JSON.parse(localStorage.getItem(preferenceKey) || "{}");
      return preferences.trainingSpeech === "voice";
    } catch (error) { return false; }
  }

  const choices = [];
  catalog.forEach(manual => {
    manual.missionSets.forEach(set => {
      const link = document.createElement("a");
      link.className = "mission-center-option mission-topic-option";
      link.href = "#";
      link.dataset.mission = set.mission;
      if (set.reader) link.dataset.reader = set.reader;
      const name = document.createElement("strong");
      name.textContent = set.label;
      const source = document.createElement("span");
      source.textContent = "From " + manual.label;
      link.append(name, source);
      menu.append(link);
      choices.push(link);
    });
  });

  function setActive(item) {
    choices.forEach(option => { option.tabIndex = option === item ? 0 : -1; });
  }

  function startMission(item) {
    const settings = readSettings();
    const params = new URLSearchParams({
      reader: item.dataset.reader || settings.reader,
      mission: item.dataset.mission,
      voice: siteVoiceEnabled() ? "1" : "0"
    });
    window.location.href = "topic-mission-session.html?" + params.toString();
  }

  choices.forEach((item, index) => {
    item.tabIndex = index === 0 ? 0 : -1;
    item.addEventListener("focus", () => {
      setActive(item);
      status.textContent = item.querySelector("strong").textContent + ". Press Enter to start.";
    });
    item.addEventListener("click", event => {
      event.preventDefault();
      startMission(item);
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
    window.location.href = "troubleshooting-lab.html";
  }, true);

  window.addEventListener("DOMContentLoaded", () => choices[0]?.focus());
})();
