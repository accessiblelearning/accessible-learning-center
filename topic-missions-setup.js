(() => {
  "use strict";

  const menu = document.getElementById("missionSettingsMenu");
  const status = document.getElementById("missionSetupStatus");
  const start = document.getElementById("startMissionSetup");
  const items = [...menu.querySelectorAll("button")];
  const selected = { speech: "own", reader: "jaws", mission: "0" };

  function selectedButton(group) {
    return menu.querySelector('[data-group="' + group + '"][aria-checked="true"]');
  }

  function selectedText(group) {
    return selectedButton(group).textContent.trim();
  }

  function voiceEnabled() {
    return selected.speech === "voice";
  }

  function stopVoice() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }

  function speak(text) {
    if (!voiceEnabled() || !("speechSynthesis" in window)) return;
    stopVoice();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    speechSynthesis.speak(utterance);
  }

  function updateStatus() {
    status.textContent = "Selected: " + selectedText("speech") + ", " + selectedText("reader") + ", and " + selectedText("mission") + ".";
  }

  function choose(button) {
    const group = button.dataset.group;
    menu.querySelectorAll('[data-group="' + group + '"]').forEach(option => {
      option.setAttribute("aria-checked", String(option === button));
    });
    selected[group] = button.dataset.value;
    updateStatus();

    if (group === "speech" && selected.speech === "own") {
      stopVoice();
      return;
    }
    speak(button.textContent.trim() + " selected.");
  }

  items.forEach(item => {
    item.tabIndex = item === items[0] ? 0 : -1;
    item.addEventListener("focus", () => {
      items.forEach(option => { option.tabIndex = option === item ? 0 : -1; });
      const selection = item.getAttribute("role") === "radio"
        ? (item.getAttribute("aria-checked") === "true" ? ", selected" : ", not selected")
        : "";
      speak(item.textContent.trim() + selection + ".");
    });
  });

  menu.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button === start) {
      const params = new URLSearchParams({
        reader: selected.reader,
        mission: selected.mission,
        voice: voiceEnabled() ? "1" : "0"
      });
      window.location.href = "topic-mission-session.html?" + params.toString();
      return;
    }
    choose(button);
  });

  menu.addEventListener("keydown", event => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = Math.max(0, items.indexOf(document.activeElement));
    let next = current;
    if (event.key === "ArrowDown") next = (current + 1) % items.length;
    if (event.key === "ArrowUp") next = (current - 1 + items.length) % items.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = items.length - 1;
    items[next].focus();
  });

  window.addEventListener("DOMContentLoaded", () => items[0].focus());
})();
