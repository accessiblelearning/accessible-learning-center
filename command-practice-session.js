(() => {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const requestedCategory = params.get("category");

  window.addEventListener("DOMContentLoaded", () => {
    const category = document.getElementById("commandCategory");
    if (!requestedCategory || ![...category.options].some(option => option.value === requestedCategory)) {
      window.location.replace("command-practice.html");
      return;
    }

    category.value = requestedCategory;
    document.getElementById("practiceStyle").value = params.get("style") === "guided" ? "guided" : "quick";
    document.getElementById("sessionLength").value = params.get("length") === "all" ? "all" : "5";
    document.getElementById("explanationLevel").value = params.get("level") === "detailed" ? "detailed" : "brief";
    let savedSpeech = "own";
    try {
      const preferences = JSON.parse(localStorage.getItem("accessibleLearningPreferences") || "{}");
      savedSpeech = preferences.trainingSpeech === "voice" ? "voice" : "own";
    } catch (error) {}
    document.getElementById("spokenInstructions").checked = params.has("spoken")
      ? params.get("spoken") !== "0"
      : savedSpeech === "voice";
    document.getElementById("soundFeedback").checked = params.get("sounds") !== "0";
    document.getElementById("randomOrder").checked = params.get("random") === "1";
    document.getElementById("startPractice").click();
  });
})();
