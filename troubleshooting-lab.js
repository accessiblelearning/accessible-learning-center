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
      problem: "An Outlook message contains important unsent work. A dialog appeared, and you need to protect the draft before leaving the message.",
      steps: [
        { command: "ESCAPE", success: "Dialog closed. Message body, edit.", why: "You dismissed the interruption and returned to the draft." },
        { command: "CTRL+S", success: "Draft saved.", why: "You saved the message before attempting to leave it." },
        { command: "ALT+F4", success: "Inbox — Outlook. Draft retained.", why: "You closed the protected message and returned to the Inbox." }
      ],
      hint: "First dismiss the temporary dialog with a reversible command."
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
  let current = 0;
  let step = 0;
  let active = false;
  let completed = new Set();

  try { completed = new Set(JSON.parse(localStorage.getItem("missionControlCompleted") || "[]")); } catch (error) { completed = new Set(); }

  function save() {
    try { localStorage.setItem("missionControlCompleted", JSON.stringify([...completed])); } catch (error) {}
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) return;
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
  missionControl.addEventListener("keydown", event => {
    if (!active) return;
    if (["F1", "F2"].includes(event.key)) {
      event.preventDefault();
      if (event.key === "F1") announce("Strategy hint: " + missions[current].hint);
      else speak(problem.textContent);
      return;
    }
    if (normalizedKey(event) === "MODIFIER") {
      modifierHeld = true;
      event.preventDefault();
      return;
    }
    let command = normalizedKey(event);
    if (modifierHeld && !event.ctrlKey && !event.altKey) {
      const key = event.key.toUpperCase() === " " ? "SPACE" : event.key.toUpperCase();
      command = key === "T" ? "TITLE" : key === "TAB" ? "FOCUS" : key === "Z" || key === "SPACE" ? "MODE" : "SCREENREADER+" + key;
    }
    modifierHeld = false;
    if (!command || command.endsWith("+")) return;
    event.preventDefault();
    processCommand(command);
  });
  missionControl.addEventListener("keyup", event => {
    if (event.key === "Insert" || event.key === "CapsLock") modifierHeld = false;
  });

  function processCommand(command) {
    const mission = missions[current];
    const expected = mission.steps[step];
    lastCommand.textContent = displayedCommand(command);
    const item = document.createElement("li");
    if (command === expected.command) {
      item.textContent = displayedCommand(command) + ": " + expected.success;
      log.append(item);
      announce(expected.success);
      feedback.className = "scenario-feedback is-correct";
      feedback.textContent = expected.why;
      step += 1;
      if (step === mission.steps.length) finishMission();
    } else {
      const response = wrongResponse(command, expected.command);
      item.textContent = displayedCommand(command) + ": " + response;
      log.append(item);
      announce(response);
      feedback.className = "scenario-feedback is-incorrect";
      feedback.textContent = "That changed or inspected something, but the problem is not solved. Use the new announcement as evidence and keep working.";
    }
  }

  function wrongResponse(command, expected) {
    if (command === "ENTER") return "Focused control activated. The original problem remains.";
    if (command === "TAB" || command === "SHIFT+TAB") return "Focus moved to another control. The original problem remains.";
    if (command === "ESCAPE") return "No open menu or dialog responded to Escape.";
    if (command === "ALT+F4") return expected === "CTRL+S" ? "Close requested. Warning: unsaved changes." : "The active window did not close in this simulated state.";
    if (command === "CTRL+S") return "Save command received, but the current simulated control cannot be saved.";
    if (command === "TITLE") return "Window title announced. More action is still required.";
    if (command === "FOCUS") return "Current focused control announced. More action is still required.";
    return "Command received. No useful change occurred in the current state.";
  }

  function finishMission() {
    active = false;
    completed.add(current);
    save();
    updateProgress();
    feedback.className = "scenario-feedback is-correct";
    feedback.innerHTML = "<h3>Mission complete</h3><p>You solved the problem through keyboard commands and confirmed system feedback.</p>";
    announce("Mission complete. " + missions[current].title);
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
    nextButton.hidden = true;
    updateProgress();
    title.focus();
    speak("Mission briefing. " + mission.title + ". " + mission.problem + " Move to Mission Control and begin.");
    window.setTimeout(() => missionControl.focus(), 100);
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
  document.getElementById("repeatProblem").addEventListener("click", () => speak("Mission problem. " + problem.textContent));
  nextButton.addEventListener("click", () => {
    missionSelect.value = String((current + 1) % missions.length);
    startMission();
  });
  perspective.addEventListener("change", () => {
    if (active) announce("Screen-reader perspective changed to " + screenReaders[perspective.value].name + ".");
  });
  updateProgress();
})();
