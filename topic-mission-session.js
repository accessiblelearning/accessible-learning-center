(() => {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const reader = params.get("reader");
  const missionParam = params.get("mission");
  const mission = Number(missionParam);
  const validReader = ["jaws", "nvda", "narrator"].includes(reader);
  const validMission = missionParam !== null && Number.isInteger(mission) && mission >= 0 && mission < 8;

  if (!validReader || !validMission) {
    window.location.replace("topic-missions.html");
    return;
  }

  let savedSpeech = "own";
  try {
    const preferences = JSON.parse(localStorage.getItem("accessibleLearningPreferences") || "{}");
    savedSpeech = preferences.trainingSpeech === "voice" ? "voice" : "own";
  } catch (error) {}
  const voiceRequested = params.has("voice") ? params.get("voice") === "1" : savedSpeech === "voice";
  const useMissionVoice = voiceRequested && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  document.getElementById("atPerspective").value = reader;
  document.getElementById("simulatedVoice").checked = useMissionVoice;
  document.getElementById("transcript").setAttribute("aria-live", useMissionVoice ? "off" : "polite");

  window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("missionSelect").value = String(mission);
    document.getElementById("startMission").click();
  });
})();
