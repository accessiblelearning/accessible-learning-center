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
        ["Press the application's save command, then reopen the document", false, "Saving sounds protective, but without speech you cannot confirm the active window, filename, or dialog. First restore or verify feedback without changing the document."],
        ["Use the assistive technology's speech-toggle command, then request the current item", true, "Best first step. It is reversible and tests both accidental speech muting and whether the assistive technology is still responding."],
        ["Switch to another application and test whether speech works there", false, "This is a reasonable diagnostic step, but it changes focus while unsaved work is open. A speech-toggle and current-item check is safer and more direct first."]
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
        ["Press the screen reader's mode-toggle command, then return to the field", false, "The mode may be the problem, but toggling it before confirming focus can place the page in the wrong mode. Locate and confirm the edit field first."],
        ["Confirm focus on the edit field, then enter its typing or interaction mode", true, "Best answer. The order matters: confirm the intended field first, then change the interaction mode."],
        ["Use Tab once and type a short test character", false, "Tab might reach the field, but it might also move to a different control. Confirm what has focus before typing any test character."]
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
        ["Open the screen reader's controls list and search for Continue", false, "A controls list is useful, but it may omit a control trapped inside a modal dialog or one missing correct semantics. Inspect headings, landmarks, and dialogs as well."],
        ["Use headings and landmarks to inspect the page, check for an open dialog, and then review the controls list", true, "Best answer. This gathers several kinds of structural evidence before deciding whether the control is absent from the keyboard order."],
        ["Refresh the page and begin the form again", false, "Refreshing can repair a temporary page state, but it may erase entered information. Inspect the current structure before taking that risk."]
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
        ["Press a cursor-routing button at the intended word, then check the active window", false, "Routing may solve the mismatch, but doing it before confirming the active window can move the caret in the wrong application. Reverse the order."],
        ["Confirm the active window and editing caret, identify the intended braille cell, and then route the cursor", true, "Best answer. Each check narrows the problem before an action changes the document position."],
        ["Pan away and back to refresh the displayed line before routing", false, "Panning can refresh context, but it does not prove where the editing caret or application focus is. Confirm those first."]
      ]
    },
    {
      title: "Page problem or screen-reader problem?",
      problem: "A button is announced only as “button,” with no useful name. You need to decide what is causing the problem.",
      reports: {
        jaws: "Button.", nvda: "Button.", narrator: "Button.", voiceover: "Button.", braille: "btn"
      },
      choices: [
        ["Inspect nearby text and the button's available properties, then make one comparison in another browser or screen reader", true, "Best answer. Context plus one controlled comparison helps distinguish missing webpage labeling from a product-specific compatibility problem."],
        ["Open the page source or developer tools and inspect the button's code", false, "Code inspection could identify the defect, but it is not the most accessible or broadly available first test. Gather nearby context and make one controlled comparison first."],
        ["Use the screen reader's graphics or OCR feature to identify the visual label", false, "OCR may reveal visible text, but it cannot determine whether the button has a proper accessible name. It is supporting evidence, not the best first diagnosis."]
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
