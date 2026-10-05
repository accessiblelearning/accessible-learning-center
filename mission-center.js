(() => {
  "use strict";

  const menu = document.getElementById("missionCenterMenu");
  if (!menu) return;
  const items = [...menu.querySelectorAll("a")];
  const voiceSupported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  let openingAnnouncement = true;

  function readVoicePreference() {
    try {
      const preferences = JSON.parse(localStorage.getItem("accessibleLearningPreferences") || "{}");
      return preferences.trainingSpeech === "voice";
    } catch (error) { return false; }
  }
  let useSiteVoice = voiceSupported && readVoicePreference();
  function voiceEnabled() { return useSiteVoice; }
  window.addEventListener("missionvoicechange", event => {
    useSiteVoice = Boolean(event.detail.enabled && voiceSupported);
  });

  function stopVoice() {
    try { window.speechSynthesis?.cancel(); } catch (error) { /* Keep keyboard controls usable. */ }
  }

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

  function setActive(item) {
    items.forEach(option => { option.tabIndex = option === item ? 0 : -1; });
  }

  items.forEach((item, index) => {
    item.tabIndex = index === 0 ? 0 : -1;
    item.addEventListener("focus", () => {
      setActive(item);
      try { sessionStorage.setItem("missionControlCenterChoice", item.getAttribute("href")); } catch (error) {}
      if (!openingAnnouncement) speak(item.textContent.trim() + ". Press Enter to open.");
    });
  });

  menu.addEventListener("keydown", event => {
    if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
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
    window.location.href = "start-here.html";
  }, true);

  window.addEventListener("DOMContentLoaded", () => {
    let remembered = "";
    try { remembered = sessionStorage.getItem("missionControlCenterChoice") || ""; } catch (error) {}
    const selected = items.find(item => item.getAttribute("href") === remembered) || items[0];
    selected?.focus();
    openingAnnouncement = false;
    speak("Mission Control is coming soon and is currently being tested. These activities are a development preview. " + selected.textContent.trim() + ". Press Enter to open. Use Up or Down Arrow to choose Topic Missions, Command Practice, or Settings.");
  });
  window.addEventListener("pagehide", stopVoice);
})();
