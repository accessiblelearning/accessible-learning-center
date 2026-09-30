(() => {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const requestedCategory = params.get("category");
  const introHeadings = {
    "Google Docs and applications": "Google Docs commands",
    "Microsoft Word and documents": "Microsoft Word commands",
    "General editing": "Microsoft Word commands",
    "Microsoft Excel and spreadsheets": "Microsoft Excel commands",
    "Presentations": "PowerPoint commands",
    "Windows and File Explorer": "Windows and File Explorer commands",
    "Web and screen-reader navigation": "Web navigation commands",
    "Firefox browser": "Firefox commands",
    "Thunderbird email": "Thunderbird commands",
    "ZoomText and Fusion Desktop magnification": "ZoomText and Fusion commands",
    "Bookshare Reader on the web": "Bookshare commands",
    "Learning Ally control navigation": "Learning Ally commands",
    "Braille display keyboard practice": "Braille display commands",
    "Mac VoiceOver basics": "Mac VoiceOver commands",
    "Mac VoiceOver navigation and web": "Mac VoiceOver commands",
    "Mac VoiceOver reading and settings": "Mac VoiceOver commands"
  };

  window.addEventListener("DOMContentLoaded", () => {
    const category = document.getElementById("commandCategory");
    if (!requestedCategory || ![...category.options].some(option => option.value === requestedCategory)) {
      window.location.replace("command-practice.html");
      return;
    }

    category.value = requestedCategory;
    document.getElementById("commandReadyHeading").textContent = introHeadings[requestedCategory] || requestedCategory;
    const macPractice = requestedCategory.startsWith("Mac VoiceOver ");
    document.body.dataset.macPractice = String(macPractice);
    if (macPractice) {
      document.getElementById("commandReadyScreen").removeAttribute("role");
    }
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

    const readyScreen = document.getElementById("commandReadyScreen");
    const readyStart = document.getElementById("commandReadyStart");
    const trainingStage = document.querySelector(".mission-training-panel");
    let started = false;

    function beginPractice() {
      if (started) return;
      started = true;
      readyScreen.hidden = true;
      trainingStage.hidden = false;
      document.getElementById("startPractice").click();
    }

    function startFromKey(event) {
      if (event.target.closest("a, select, input, summary") || event.ctrlKey || event.altKey || event.metaKey) return;
      if (started || ["Escape", "Esc", "Tab", "Shift", "Control", "Alt", "Meta"].includes(event.key)) return;
      event.preventDefault();
      beginPractice();
    }

    readyScreen.addEventListener("keydown", startFromKey);
    readyStart.addEventListener("click", beginPractice);
    readyScreen.focus();
  });
})();
