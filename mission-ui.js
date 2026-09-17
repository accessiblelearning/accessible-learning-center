(() => {
  "use strict";

  const main = document.querySelector("main.mission-center-shell");
  if (!main) return;
  const supported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  const preferenceKey = "accessibleLearningPreferences";
  const toolbar = document.createElement("div");
  toolbar.className = "mission-toolbar";
  toolbar.setAttribute("role", "group");
  toolbar.setAttribute("aria-label", "Mission Control controls");
  const back = document.createElement("a");
  back.href = document.body.dataset.missionBack || "troubleshooting-lab.html";
  back.textContent = document.body.dataset.missionBackLabel || "Back to Mission Control Center";
  const controls = document.createElement("button");
  controls.type = "button";
  const voice = document.createElement("button");
  voice.type = "button";
  voice.id = "missionVoiceToggle";
  const status = document.createElement("p");
  status.className = "visually-hidden";
  status.setAttribute("role", "status");
  toolbar.append(back, controls, voice);
  main.prepend(toolbar, status);

  function readPreferences() {
    try { return JSON.parse(localStorage.getItem(preferenceKey) || "{}") || {}; }
    catch (error) { return {}; }
  }

  function enabled() {
    if (document.body.dataset.practiceSession === "true") return document.getElementById("spokenInstructions").checked;
    if (document.body.dataset.missionSession === "true") return document.getElementById("simulatedVoice").checked;
    return readPreferences().trainingSpeech === "voice";
  }

  function refreshVoice() {
    const on = supported && enabled();
    voice.textContent = on ? "Voice: Mission Control" : "Voice: My screen reader";
    voice.setAttribute("aria-pressed", String(on));
    voice.disabled = !supported;
    if (!supported) voice.textContent = "Mission Control voice unavailable";
    for (const id of ["practiceStatus", "transcript", "topicMissionsStatus", "commandTopicsStatus"]) {
      const live = document.getElementById(id);
      if (live) live.setAttribute("aria-live", on ? "off" : "polite");
    }
    status.setAttribute("aria-live", on ? "off" : "polite");
  }

  function showControls(show) {
    document.body.classList.toggle("mission-website-controls-hidden", !show);
    controls.textContent = show ? "Hide Website Controls" : "Show Website Controls";
    controls.setAttribute("aria-expanded", String(show));
  }
  showControls(false);
  controls.addEventListener("click", () => showControls(controls.getAttribute("aria-expanded") !== "true"));

  voice.addEventListener("click", () => {
    const on = !enabled();
    const preferences = readPreferences();
    preferences.trainingSpeech = on ? "voice" : "own";
    try { localStorage.setItem(preferenceKey, JSON.stringify(preferences)); } catch (error) {}
    window.dispatchEvent(new CustomEvent("missionvoicechange", { detail: { enabled: on } }));
    status.textContent = on ? "Mission Control voice on. Control repeats instructions during practice." : "Use your own screen reader. Mission Control voice off.";
    if (supported) {
      speechSynthesis.cancel();
      if (on) speechSynthesis.speak(new SpeechSynthesisUtterance(status.textContent));
    }
  });

  window.addEventListener("missionvoicechange", event => {
    for (const id of ["spokenInstructions", "simulatedVoice"]) {
      const input = document.getElementById(id);
      if (input) input.checked = event.detail.enabled && supported;
    }
    refreshVoice();
  });
  window.addEventListener("DOMContentLoaded", () => window.setTimeout(refreshVoice, 0));
  window.addEventListener("pagehide", () => {
    if (supported) speechSynthesis.cancel();
  });
})();
