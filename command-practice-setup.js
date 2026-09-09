(() => {
  "use strict";

  const categories = [
    "General editing",
    "Microsoft Word and documents",
    "Web and screen-reader navigation",
    "Microsoft Excel and spreadsheets",
    "Presentations",
    "Windows and File Explorer",
    "JAWS commands",
    "NVDA commands",
    "Narrator commands",
    "Braille display keyboard practice"
  ];

  const category = document.getElementById("commandCategory");
  const form = document.getElementById("commandPracticeSetup");

  categories.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    category.append(option);
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const params = new URLSearchParams({
      category: category.value,
      style: document.getElementById("practiceStyle").value,
      length: document.getElementById("sessionLength").value,
      level: document.getElementById("explanationLevel").value,
      spoken: document.getElementById("spokenInstructions").checked ? "1" : "0",
      sounds: document.getElementById("soundFeedback").checked ? "1" : "0",
      random: document.getElementById("randomOrder").checked ? "1" : "0"
    });
    window.location.href = "command-practice-session.html?" + params.toString();
  });
})();
