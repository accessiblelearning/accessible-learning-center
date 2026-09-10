(() => {
  "use strict";

  const screenReaders = {
    jaws: { name: "JAWS", title: "Insert+T", focus: "Insert+Tab", mode: "Insert+Z" },
    nvda: { name: "NVDA", title: "NVDA+T", focus: "NVDA+Tab", mode: "NVDA+Space" },
    narrator: { name: "Narrator", title: "Narrator+T", focus: "Narrator+Tab", mode: "Narrator+Space" }
  };

  const missions = [
    {
      category: "Screen-reader recovery", title: "The unexpected window",
      problem: "You were editing a report, but your keys stopped behaving as expected. You are not sure which window has focus. Find out before changing anything.",
      steps: [
        { command: "TITLE", success: "Window title: Downloads — File Explorer. You are not in the report.", why: "You identified the active window without changing it." },
        { command: "ALT+TAB", success: "Quarterly Report — Microsoft Word. Editing area.", why: "You returned to the document after confirming where focus was." },
        { command: "CTRL+S", success: "Document saved.", why: "You protected the report after safely returning to it." }
      ],
      hint: "Begin by asking the screen reader to announce the active window title."
    },
    {
      category: "Google applications", title: "Letters navigate instead of typing",
      problem: "On a web form, pressing H moves to a heading instead of typing. Locate the edit field and enter interaction mode without using the mouse.",
      steps: [
        { command: "E", success: "Email address, edit box.", why: "Browse-mode edit-field navigation located the intended field." },
        { command: "ENTER", success: "Forms mode on. Email address, edit.", why: "Enter placed the screen reader in the field’s interaction mode." },
        { command: "TAB", success: "Continue, button.", why: "You completed the focus recovery and moved to the next control." }
      ],
      hint: "Use a screen-reader navigation key to find the next edit field before changing modes."
    },
    {
      category: "Email and calendar", title: "Protect the unsent Outlook message",
      problem: "An Outlook message contains important unsent work. You need to protect the draft before leaving the message.",
      steps: [
        { command: "CTRL+S", success: "Draft saved.", why: "You saved the message before attempting to leave it." },
        { command: "ALT+F4", success: "Inbox — Outlook. Draft retained.", why: "You closed the protected message and returned to the Inbox." }
      ],
      hint: "Protect the draft before trying to leave the message."
    },
    {
      category: "Microsoft applications", title: "The risky Word edit",
      problem: "A large block of text disappeared in Microsoft Word. Do not retype it. Recover the edit and save the corrected document.",
      steps: [
        { command: "CTRL+Z", success: "Undo. Selected text restored.", why: "Undo reversed the most recent destructive edit." },
        { command: "CTRL+S", success: "Document saved.", why: "You saved immediately after verifying the recovery." }
      ],
      hint: "Use the standard command that reverses the most recent action."
    },
    {
      category: "Cloud storage", title: "Move without losing the original",
      problem: "A practice file is selected in a synchronized OneDrive folder. The original must remain where it is while you place a copy in the open destination folder.",
      steps: [
        { command: "CTRL+C", success: "Copied: Interview Notes.docx.", why: "Copy preserves the original; Cut would move it." },
        { command: "CTRL+V", success: "Pasted: Interview Notes.docx. Synchronization pending.", why: "You created one copy in the verified destination." }
      ],
      hint: "Choose the clipboard command that preserves the original file."
    },
    {
      category: "Online meetings", title: "The live microphone",
      problem: "You are in a Zoom meeting and hear private conversation nearby. Mute immediately, then open the participant list to confirm who is present.",
      steps: [
        { command: "ALT+A", success: "Audio muted.", why: "You used Zoom’s microphone command immediately." },
        { command: "ALT+U", success: "Participants panel. Twelve participants.", why: "You opened the participant list after protecting the microphone." }
      ],
      hint: "Use Zoom’s Windows command for mute before inspecting anything else."
    },
    {
      category: "Privacy and cybersecurity", title: "The suspicious pop-up",
      problem: "A pop-up says your computer is infected and tells you to press Enter to call support. Close only the suspicious window without activating its button.",
      steps: [
        { command: "ALT+F4", success: "Suspicious pop-up closed. Browser remains open.", why: "You closed the active pop-up without activating its fraudulent control." },
        { command: "CTRL+L", success: "Address bar, edit. Current site address selected.", why: "You moved to a known browser control so you can leave the suspicious page safely." }
      ],
      hint: "Do not press Enter. Use the command that closes the active window."
    },
    {
      category: "Files and folders", title: "Rename the correct file",
      problem: "Resume Final Copy.docx is selected in File Explorer. Give it the clearer name Amber Price Resume.docx without opening it.",
      steps: [
        { command: "F2", success: "Resume Final Copy, filename edit.", why: "F2 opened rename mode for the selected file." },
        { command: "CTRL+A", success: "Filename selected. The .docx extension remains protected.", why: "You selected the editable filename before replacing it." },
        { command: "ENTER", success: "Renamed: Amber Price Resume.docx.", why: "The simulator supplied the practice name and Enter confirmed it." }
      ],
      hint: "Use File Explorer’s rename command on the selected file."
    }
  ];

  const perspective = document.getElementById("atPerspective");
  const missionSelect = document.getElementById("missionSelect");
  const missionControl = document.getElementById("missionControlStation");
  const title = document.getElementById("missionTitle");
  const category = document.getElementById("missionCategory");
  const problem = document.getElementById("missionProblem");
  const transcript = document.getElementById("transcript");
  const lastCommand = document.getElementById("lastCommand");
  const log = document.getElementById("missionLog");
  const feedback = document.getElementById("scenarioFeedback");
  const nextButton = document.getElementById("nextMission");
  const progress = document.getElementById("missionProgress");
  const count = document.getElementById("missionCount");
  const summary = document.getElementById("completionSummary");
  const simulatedVoice = document.getElementById("simulatedVoice");
  const simulatedVoiceActions = document.getElementById("simulatedVoiceActions");
  const focusedMissionSession = document.body.dataset.missionSession === "true";
  let current = 0;
  let step = 0;
  let active = false;
  let completed = new Set();

  try { completed = new Set(JSON.parse(localStorage.getItem("missionControlCompleted") || "[]")); } catch (error) { completed = new Set(); }

  function save() {
    try { localStorage.setItem("missionControlCompleted", JSON.stringify([...completed])); } catch (error) {}
  }

  function speak(text) {
    if (!simulatedVoice.checked || !("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  }

  function announce(text, aloud = true) {
    transcript.textContent = screenReaders[perspective.value].name + " reports: “" + text + "”";
    if (aloud) speak(transcript.textContent);
  }

  function updateProgress() {
    progress.value = completed.size;
    progress.textContent = completed.size + " of " + missions.length + " missions completed";
    summary.textContent = completed.size === missions.length
      ? "All current missions completed. Mission Control will add more hangars and more difficult failures over time."
      : completed.size + " of " + missions.length + " missions completed on this device.";
  }

  function displayedCommand(command) {
    const sr = screenReaders[perspective.value];
    return command === "TITLE" ? sr.title : command === "FOCUS" ? sr.focus : command === "MODE" ? sr.mode : command;
  }

  function normalizedKey(event) {
    const parts = [];
    if (event.ctrlKey) parts.push("CTRL");
    if (event.altKey) parts.push("ALT");
    if (event.shiftKey) parts.push("SHIFT");
    let key = event.key.toUpperCase();
    if (key === " ") key = "SPACE";
    if (key === "ESC") key = "ESCAPE";
    if (!["CONTROL", "ALT", "SHIFT", "META"].includes(key)) parts.push(key);
    const chord = parts.join("+");
    const sr = perspective.value;
    if ((sr === "jaws" && event.key === "Insert") || (sr === "nvda" && (event.key === "Insert" || event.key === "CapsLock")) || (sr === "narrator" && (event.key === "Insert" || event.key === "CapsLock"))) return "MODIFIER";
    return chord;
  }

  let modifierHeld = false;
  let altModifierArmed = false;
  let controlModifierArmed = false;
  document.addEventListener("keydown", event => {
    if (!focusedMissionSession || event.key !== "Escape" || event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;
    event.preventDefault();
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    window.location.href = "topic-missions.html";
  }, true);
  missionControl.addEventListener("keydown", event => {
    if (!active) return;
    const expectedCommand = missions[current].steps[step].command;
    if (event.key === "F1" && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && expectedCommand !== "F1") {
      event.preventDefault();
      announce("Strategy hint: " + missions[current].hint);
      return;
    }
    if (event.key === "Alt" && !event.ctrlKey && !event.shiftKey && !event.metaKey) {
      event.preventDefault();
      altModifierArmed = true;
      modifierHeld = false;
      controlModifierArmed = false;
      lastCommand.textContent = "Alt ready; press the remaining key";
      return;
    }
    if (event.key === "Control" && !event.altKey && !event.shiftKey && !event.metaKey) {
      event.preventDefault();
      controlModifierArmed = true;
      modifierHeld = false;
      altModifierArmed = false;
      lastCommand.textContent = "Control ready; press the remaining key";
      return;
    }
    if (normalizedKey(event) === "MODIFIER") {
      modifierHeld = true;
      altModifierArmed = false;
      controlModifierArmed = false;
      event.preventDefault();
      lastCommand.textContent = screenReaders[perspective.value].name + " key ready; press the remaining key";
      return;
    }
    let command = normalizedKey(event);
    if (modifierHeld && !event.ctrlKey && !event.altKey) {
      const key = event.key.toUpperCase() === " " ? "SPACE" : event.key.toUpperCase();
      command = key === "T" ? "TITLE" : key === "TAB" ? "FOCUS" : key === "Z" || key === "SPACE" ? "MODE" : "SCREENREADER+" + key;
    } else if (altModifierArmed && !event.altKey && !event.ctrlKey && !event.metaKey) {
      const key = event.key.toUpperCase() === " " ? "SPACE" : event.key.toUpperCase();
      command = "ALT+" + key;
    } else if (controlModifierArmed && !event.ctrlKey && !event.altKey && !event.metaKey) {
      const key = event.key.toUpperCase() === " " ? "SPACE" : event.key.toUpperCase();
      command = "CTRL+" + key;
    }
    modifierHeld = false;
    altModifierArmed = false;
    controlModifierArmed = false;
    if (!command || command.endsWith("+")) return;
    event.preventDefault();
    processCommand(command);
  });
  missionControl.addEventListener("keyup", event => {
    if (!active || event.key !== "Control" || !controlModifierArmed) return;
    event.preventDefault();
    controlModifierArmed = false;
    lastCommand.textContent = "Control: repeated mission problem";
    announce("Mission problem. " + problem.textContent);
  });

  function processCommand(command) {
    const mission = missions[current];
    const expected = mission.steps[step];
    lastCommand.textContent = displayedCommand(command);
    const item = document.createElement("li");
    if (command === expected.command) {
      item.textContent = displayedCommand(command) + ": " + expected.success;
      log.append(item);
      feedback.className = "scenario-feedback is-correct";
      feedback.textContent = expected.why;
      step += 1;
      if (step === mission.steps.length) finishMission(expected.success + " " + expected.why);
      else announce(expected.success + " " + expected.why);
    } else {
      const response = wrongResponse(command, expected.command);
      item.textContent = displayedCommand(command) + ": " + response;
      log.append(item);
      feedback.className = "scenario-feedback is-incorrect";
      feedback.textContent = "That changed or inspected something, but the problem is not solved. Use the new announcement as evidence and keep working.";
      announce(response + " " + feedback.textContent);
    }
  }

  function wrongResponse(command, expected) {
    if (command === "ENTER") return "Focused control activated. The original problem remains.";
    if (command === "TAB" || command === "SHIFT+TAB") return "Focus moved to another control. The original problem remains.";
    if (command === "ALT+F4") return expected === "CTRL+S" ? "Close requested. Warning: unsaved changes." : "The active window did not close in this simulated state.";
    if (command === "CTRL+S") return "Save command received, but the current simulated control cannot be saved.";
    if (command === "TITLE") return "Window title announced. More action is still required.";
    if (command === "FOCUS") return "Current focused control announced. More action is still required.";
    return "Command received. No useful change occurred in the current state.";
  }

  function finishMission(finalStepFeedback) {
    active = false;
    completed.add(current);
    save();
    updateProgress();
    feedback.className = "scenario-feedback is-correct";
    feedback.innerHTML = "<h3>Mission complete</h3><p>You solved the problem through keyboard commands and confirmed system feedback.</p>";
    announce(finalStepFeedback + " Mission complete. " + missions[current].title);
    nextButton.hidden = false;
    nextButton.focus();
  }

  function startMission() {
    current = Number(missionSelect.value);
    step = 0;
    active = true;
    const mission = missions[current];
    category.textContent = mission.category;
    title.textContent = mission.title;
    problem.textContent = mission.problem;
    count.textContent = "Mission " + (current + 1) + " of " + missions.length;
    log.replaceChildren();
    feedback.textContent = "";
    feedback.className = "scenario-feedback";
    lastCommand.textContent = "None";
    modifierHeld = false;
    altModifierArmed = false;
    controlModifierArmed = false;
    nextButton.hidden = true;
    updateProgress();
    announce("Mission briefing. " + mission.title + ". " + mission.problem + " Move to Mission Control and begin.");
    title.focus();
  }

  missions.forEach((mission, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = mission.category + ": " + mission.title;
    missionSelect.append(option);
  });
  document.getElementById("startMission").addEventListener("click", startMission);
  document.getElementById("restartMission").addEventListener("click", startMission);
  document.getElementById("speakTranscript").addEventListener("click", () => speak(transcript.textContent));
  document.getElementById("repeatProblem").addEventListener("click", () => announce("Mission problem. " + problem.textContent));
  simulatedVoice.addEventListener("change", () => {
    simulatedVoiceActions.hidden = !simulatedVoice.checked;
    try { localStorage.setItem("missionControlSimulatedVoice", simulatedVoice.checked ? "on" : "off"); } catch (error) {}
    if (simulatedVoice.checked) {
      transcript.textContent = "Mission Control reports: “Extra simulator voice on.”";
      speak("Extra simulator voice on.");
    } else {
      if ("speechSynthesis" in window) speechSynthesis.cancel();
      transcript.textContent = "Mission Control reports: “Using your screen reader only.”";
    }
  });
  nextButton.addEventListener("click", () => {
    missionSelect.value = String((current + 1) % missions.length);
    startMission();
  });
  perspective.addEventListener("change", () => {
    if (active) announce("Screen-reader perspective changed to " + screenReaders[perspective.value].name + ".");
  });
  if (!focusedMissionSession) {
    try { simulatedVoice.checked = localStorage.getItem("missionControlSimulatedVoice") === "on"; } catch (error) { simulatedVoice.checked = false; }
  }
  simulatedVoiceActions.hidden = !simulatedVoice.checked;
  updateProgress();
})();
