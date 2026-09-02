(() => {
  "use strict";

  const perspectives = {
    jaws: "JAWS",
    nvda: "NVDA",
    narrator: "Narrator",
    voiceover: "VoiceOver",
    braille: "the braille display"
  };

  const scenarios = [
    {
      title: "Speech suddenly stops",
      problem: "You are editing a document. After pressing a command, you no longer hear speech. Your work may not be saved.",
      reports: {
        jaws: "No speech. The document window still appears active.", nvda: "No speech. The document window still appears active.",
        narrator: "No speech. The document window still appears active.", voiceover: "No speech. The document remains on screen.",
        braille: "The braille line still changes when you press an Arrow key, but speech is silent."
      },
      choices: [
        ["Close the application immediately", false, "Closing could lose unsaved work. First determine whether only speech is muted."],
        ["Use the assistive technology's speech-toggle command, then test the current item", true, "Good choice. This is reversible and checks whether speech was accidentally muted without disturbing the document."],
        ["Restart the computer", false, "Restarting is too disruptive while work may be unsaved. Begin with a reversible speech check."]
      ]
    },
    {
      title: "Letters run commands instead of typing",
      problem: "You focus what seems to be a text field, but pressing H moves to a heading instead of typing the letter H.",
      reports: {
        jaws: "JAWS announces a nearby heading.", nvda: "NVDA announces a nearby heading.", narrator: "Narrator moves through page items in Scan Mode.",
        voiceover: "VoiceOver moves to another rotor item instead of entering text.", braille: "The display moves to a heading instead of inserting the typed character."
      },
      choices: [
        ["Confirm focus on the edit field and switch to the typing or interaction mode", true, "Correct. The screen reader is still interpreting letters as navigation commands. Confirm the edit field before changing mode."],
        ["Keep pressing H until it appears", false, "Repeated commands may move farther from the field. Stop, locate the edit field, and confirm the interaction mode."],
        ["Turn the screen reader off", false, "Turning it off removes useful feedback. Correct the navigation or interaction mode instead."]
      ]
    },
    {
      title: "Tab cannot reach a control",
      problem: "A page tells you to select Continue, but repeated Tab presses never reach it.",
      reports: {
        jaws: "JAWS cycles among the same few links and fields.", nvda: "NVDA cycles among the same few links and fields.", narrator: "Narrator repeats the same controls.",
        voiceover: "VoiceOver focus remains in one part of the page.", braille: "The focus indicator repeats the same controls and never reaches Continue."
      },
      choices: [
        ["Use headings, landmarks, or a controls list to inspect the page structure", true, "Correct. Structural navigation can reveal whether the control is elsewhere, hidden in a dialog, or missing from the keyboard order."],
        ["Hold Tab down for a long time", false, "Rapid cycling makes focus harder to track. Pause and inspect the page structure."],
        ["Assume the website is inaccessible and leave", false, "The page may be inaccessible, but first gather evidence by checking headings, landmarks, dialogs, and the controls list."]
      ]
    },
    {
      title: "Braille cursor is in the wrong place",
      problem: "The braille display shows text from the document, but typing inserts text somewhere unexpected.",
      reports: {
        jaws: "JAWS reads one line, but the editing caret appears to be elsewhere.", nvda: "NVDA reads one line, but the editing caret appears to be elsewhere.",
        narrator: "Narrator focus and the text caret do not seem aligned.", voiceover: "VoiceOver focus and the insertion point do not seem aligned.",
        braille: "The displayed line and the active editing cursor do not match."
      },
      choices: [
        ["Type more text to discover where it goes", false, "That can damage the document. Stop typing until the caret and displayed line are confirmed."],
        ["Confirm the active window and caret, then route the cursor only after identifying the intended cell", true, "Correct. Confirming focus before routing prevents accidental edits in the wrong location."],
        ["Disconnect the display immediately", false, "Disconnecting may not fix a focus mismatch. First identify the application focus, caret, and braille cursor." ]
      ]
    },
    {
      title: "Page problem or screen-reader problem?",
      problem: "A button is announced only as “button,” with no useful name. You need to decide what is causing the problem.",
      reports: {
        jaws: "Button.", nvda: "Button.", narrator: "Button.", voiceover: "Button.", braille: "btn"
      },
      choices: [
        ["Check nearby text and compare the control with another screen reader or browser if available", true, "Correct. Comparing contexts helps separate a webpage labeling defect from a product-specific compatibility problem."],
        ["Guess what the button does and activate it", false, "An unnamed control could perform an unexpected action. Do not activate it until its purpose is known."],
        ["Change many screen-reader settings at once", false, "Changing several settings destroys useful evidence. Make one reversible comparison at a time."]
      ]
    }
  ];

  const perspectiveSelect = document.getElementById("atPerspective");
  const title = document.getElementById("scenarioTitle");
  const problem = document.getElementById("scenarioProblem");
  const transcript = document.getElementById("transcript");
  const choices = document.getElementById("choices");
  const feedback = document.getElementById("scenarioFeedback");
  const nextButton = document.getElementById("nextScenario");
  const progress = document.getElementById("scenarioProgress");
  const count = document.getElementById("scenarioCount");
  const summary = document.getElementById("completionSummary");
  let current = 0;
  let completed = new Set();

  try {
    completed = new Set(JSON.parse(localStorage.getItem("atTroubleshootingCompleted") || "[]"));
  } catch (error) {
    completed = new Set();
  }

  function save() {
    try { localStorage.setItem("atTroubleshootingCompleted", JSON.stringify([...completed])); } catch (error) {}
  }

  function updateProgress() {
    progress.value = completed.size;
    progress.textContent = completed.size + " of 5 scenarios completed";
    summary.textContent = completed.size === scenarios.length
      ? "All five scenarios completed. You practiced safe diagnosis before disruptive action."
      : completed.size + " of 5 scenarios completed on this device.";
  }

  function render() {
    const scenario = scenarios[current];
    const perspective = perspectiveSelect.value;
    count.textContent = "Scenario " + (current + 1) + " of " + scenarios.length;
    title.textContent = scenario.title;
    problem.textContent = scenario.problem;
    transcript.textContent = perspectives[perspective] + " reports: “" + scenario.reports[perspective] + "”";
    feedback.textContent = "";
    choices.replaceChildren();
    scenario.choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = (index + 1) + ". " + choice[0];
      button.addEventListener("click", () => answer(choice, button));
      choices.append(button);
    });
    nextButton.hidden = true;
    updateProgress();
  }

  function answer(choice, button) {
    feedback.className = "scenario-feedback " + (choice[1] ? "is-correct" : "is-incorrect");
    feedback.innerHTML = "<h3>" + (choice[1] ? "Safe diagnosis" : "Try a safer action") + "</h3><p>" + choice[2] + "</p>";
    if (choice[1]) {
      completed.add(current);
      save();
      [...choices.querySelectorAll("button")].forEach(item => { item.disabled = true; });
      button.setAttribute("aria-pressed", "true");
      nextButton.textContent = current === scenarios.length - 1 ? "Review from scenario 1" : "Next scenario";
      nextButton.hidden = false;
      updateProgress();
      nextButton.focus();
    }
  }

  perspectiveSelect.addEventListener("change", render);
  nextButton.addEventListener("click", () => { current = (current + 1) % scenarios.length; render(); title.focus(); });
  document.getElementById("restartLab").addEventListener("click", () => {
    current = 0; completed.clear(); save(); render(); title.focus();
  });
  document.getElementById("speakTranscript").addEventListener("click", () => {
    if (!("speechSynthesis" in window)) { feedback.textContent = "Speech playback is not available in this browser."; return; }
    speechSynthesis.cancel();
    speechSynthesis.speak(new SpeechSynthesisUtterance(transcript.textContent));
  });

  title.tabIndex = -1;
  render();
})();
