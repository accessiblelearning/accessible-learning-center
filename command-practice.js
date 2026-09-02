(() => {
  "use strict";

  const categories = {
    "General editing": [
      ["Control+C", "Copy selected content.", "Copies selected text or an item to the clipboard without removing the original."],
      ["Control+X", "Cut selected content.", "Removes the selected content and places it on the clipboard so it can be moved."],
      ["Control+V", "Paste clipboard content.", "Inserts the current clipboard content at the active cursor or selected location."],
      ["Control+Z", "Undo the last action.", "Reverses the most recent supported edit. Some programs allow repeated undo."],
      ["Control+Y", "Redo an undone action.", "Restores an action that was reversed with Undo when the program supports Redo."],
      ["Control+A", "Select all.", "Selects all content in the active document, list, field, or supported region."],
      ["Control+F", "Find text.", "Opens the current program or webpage Find feature so you can search for specific text."],
      ["Control+B", "Toggle bold formatting.", "Turns bold formatting on or off for selected text or text typed next in supported editors."],
      ["Control+I", "Toggle italic formatting.", "Turns italic formatting on or off in supported editors."],
      ["Control+U", "Toggle underline formatting.", "Turns underline formatting on or off in supported editors."]
    ],
    "Microsoft Word and documents": [
      ["Control+K", "Insert or edit a link.", "Opens the hyperlink dialog in many document and presentation programs."],
      ["Control+H", "Open Replace.", "Opens Find and Replace in many document editors so repeated text can be changed carefully."],
      ["Control+Enter", "Insert a page break.", "Starts the next content on a new page in many word processors."],
      ["Control+Left Arrow", "Move back one word.", "Moves the text cursor to the beginning of the previous word without selecting."],
      ["Control+Right Arrow", "Move forward one word.", "Moves the text cursor to the beginning of the next word without selecting."],
      ["Control+Shift+Left Arrow", "Select the previous word.", "Extends the selection backward by one word."],
      ["Control+Shift+Right Arrow", "Select the next word.", "Extends the selection forward by one word."],
      ["Shift+Down Arrow", "Extend selection down one line.", "Selects from the current cursor position into the next visual line."]
    ],
    "Web and screen-reader navigation": [
      ["H", "Move to the next heading.", "In JAWS or NVDA webpage browse mode, H moves to the next heading."],
      ["Shift+H", "Move to the previous heading.", "In JAWS or NVDA browse mode, Shift+H moves backward by heading."],
      ["B", "Move to the next button.", "In common screen-reader browse modes, B moves to the next button."],
      ["E", "Move to the next edit field.", "In common screen-reader browse modes, E moves to the next edit field."],
      ["T", "Move to the next table.", "In common screen-reader browse modes, T moves to the next table."],
      ["L", "Move to the next list.", "In common screen-reader browse modes, L moves to the next list."],
      ["Insert+T", "Read the window title.", "JAWS Insert+T and NVDA Insert+T announce the current window or application title."],
      ["Insert+Tab", "Read focused-control information.", "JAWS Insert+Tab or NVDA Insert+Tab announces information about the focused control."],
      ["Insert+F6", "Open the JAWS Headings List.", "JAWS Insert+F6 lists headings on the current webpage for fast navigation."],
      ["Insert+F7", "Open the JAWS Links List.", "JAWS Insert+F7 lists links on the current webpage."]
    ],
    "Microsoft Excel and spreadsheets": [
      ["Control+Space", "Select the current column.", "In Excel and many spreadsheets, Control+Space selects the active cell's entire column."],
      ["Shift+Space", "Select the current row.", "In Excel and many spreadsheets, Shift+Space selects the active cell's entire row."],
      ["Control+Page Down", "Move to the next worksheet.", "Moves to the next sheet tab in Excel and many spreadsheet programs."],
      ["Control+Page Up", "Move to the previous worksheet.", "Moves to the previous sheet tab in Excel and many spreadsheet programs."],
      ["Alt+Equals", "Insert AutoSum.", "In Excel, Alt+Equals inserts a SUM formula for a likely adjacent range."],
      ["Control+Semicolon", "Enter the current date.", "In Excel and many spreadsheets, Control+Semicolon inserts today's date."],
      ["Control+Grave", "Show or hide formulas.", "In Excel, Control plus the grave accent key toggles formula display."]
    ],
    "Presentations": [
      ["Control+M", "Insert a new slide.", "Creates a new slide in PowerPoint and many presentation editors."],
      ["Control+D", "Duplicate the selected slide or object.", "Creates a copy of the selected slide or object in many presentation programs."],
      ["Control+Shift+Greater Than", "Increase font size.", "In many editors, Control+Shift+Greater Than increases selected text size."],
      ["Control+Shift+Less Than", "Decrease font size.", "In many editors, Control+Shift+Less Than decreases selected text size."],
      ["Alt+Shift+Left Arrow", "Promote a list item.", "In supported presentation and document outlines, moves a list item to a higher level."]
    ],
    "Windows and File Explorer": [
      ["F2", "Rename the selected item.", "In Windows File Explorer, F2 places the selected file or folder name in edit mode."],
      ["Control+C", "Copy the selected item.", "Copies the selected file, folder, or text without removing the original."],
      ["Control+X", "Cut the selected item.", "Places the selected item on the clipboard so it can be moved."],
      ["Control+V", "Paste the clipboard item.", "Places the copied or cut item into the active folder or field."],
      ["Control+Z", "Undo the last supported action.", "Reverses the most recent supported file or editing action."],
      ["Alt+Left Arrow", "Return to the previous location.", "In File Explorer, moves back to the previously viewed folder or location."],
      ["Alt+Right Arrow", "Move forward to the next location.", "In File Explorer, moves forward after using the Back command."],
      ["Alt+Up Arrow", "Open the parent folder.", "In File Explorer, moves up one level in the folder structure."]
    ],
    "JAWS commands": [
      ["Insert+T", "Read the window title.", "JAWS Insert+T announces the title of the active window."],
      ["Insert+Tab", "Read the focused control.", "JAWS Insert+Tab announces the current control and related information."],
      ["Insert+F6", "Open the Headings List.", "JAWS Insert+F6 lists headings on the current webpage."],
      ["Insert+F7", "Open the Links List.", "JAWS Insert+F7 lists links on the current webpage."],
      ["Insert+1", "Toggle Keyboard Help.", "JAWS Insert+1 turns Keyboard Help on or off."],
      ["H", "Move to the next heading.", "With the JAWS Virtual Cursor active, H moves to the next heading."],
      ["Shift+H", "Move to the previous heading.", "With the JAWS Virtual Cursor active, Shift+H moves to the previous heading."]
    ],
    "NVDA commands": [
      ["Insert+T", "Read the window title.", "With Insert configured as the NVDA key, Insert+T announces the active window title."],
      ["Insert+Tab", "Read the focused control.", "With Insert configured as the NVDA key, Insert+Tab announces the focused control."],
      ["Insert+F7", "Open the Elements List.", "NVDA+F7 opens the Elements List in supported documents and webpages."],
      ["Insert+F", "Read formatting information.", "NVDA+F announces formatting information for the current text."],
      ["Insert+1", "Toggle Input Help.", "NVDA+1 turns Input Help on or off."],
      ["H", "Move to the next heading.", "In NVDA Browse Mode, H moves to the next heading."],
      ["Shift+H", "Move to the previous heading.", "In NVDA Browse Mode, Shift+H moves to the previous heading."]
    ],
    "Narrator commands": [
      ["Insert+T", "Read the window title.", "When Insert is the Narrator key, Narrator+T reads the active window title."],
      ["Insert+Tab", "Read the current item.", "When Insert is the Narrator key, Narrator+Tab reads the current item."],
      ["Insert+1", "Toggle input learning.", "Narrator key+1 turns input learning on or off."],
      ["Insert+Space", "Toggle Scan Mode.", "Narrator key+Space turns Scan Mode on or off."],
      ["H", "Move to the next heading.", "In Narrator Scan Mode, H moves to the next heading."],
      ["Shift+H", "Move to the previous heading.", "In Narrator Scan Mode, Shift+H moves to the previous heading."],
      ["B", "Move to the next button.", "In Narrator Scan Mode, B moves to the next button."]
    ],
    "Braille display keyboard practice": [
      ["Left Arrow", "Move back one character.", "A braille display or keyboard can emulate Left Arrow to move the cursor backward."],
      ["Right Arrow", "Move forward one character.", "A braille display or keyboard can emulate Right Arrow to move the cursor forward."],
      ["Control+Home", "Move to the beginning.", "In many documents, Control+Home moves to the beginning of the content."],
      ["Control+End", "Move to the end.", "In many documents, Control+End moves to the end of the content."],
      ["Tab", "Move to the next control.", "Tab moves keyboard focus to the next available control."],
      ["Shift+Tab", "Move to the previous control.", "Shift+Tab moves keyboard focus to the previous available control."],
      ["Enter", "Activate the current item.", "Enter activates many focused links, buttons, menu items, and commands."]
    ]
  };

  const learnOnly = [
    ["Alt+Tab", "Switches among open applications. Windows handles this command before a webpage can safely contain it."],
    ["Windows+E", "Opens File Explorer. The Windows key is controlled by the operating system."],
    ["Windows+D", "Shows or restores the desktop. The operating system controls this shortcut."],
    ["Control+Alt+Delete", "Opens the Windows security screen and cannot be intercepted by a webpage."],
    ["Control+W", "Closes the active browser tab or document in many programs."],
    ["Control+T", "Opens a new browser tab."],
    ["Control+Shift+T", "Reopens the most recently closed browser tab."],
    ["Control+L", "Moves focus to the browser address bar."],
    ["F5", "Reloads a webpage or starts a slide show, depending on the active program."],
    ["Alt+F4", "Closes the active application window."]
    ,["Windows+L", "Locks the computer. The operating system controls this command, so it is learn-only here."]
    ,["Control+P", "Opens the print dialog in many programs and browsers, so it is learn-only here."]
    ,["Pan Left", "Moves a braille display backward. The exact chord varies by display model and cannot be detected reliably by a webpage."]
    ,["Pan Right", "Moves a braille display forward. The exact chord varies by display model and cannot be detected reliably by a webpage."]
    ,["Cursor Routing Button", "Moves focus or the text cursor to the character above that routing button. Behavior varies by display and screen reader."]
  ];

  const category = document.getElementById("commandCategory");
  const level = document.getElementById("explanationLevel");
  const spoken = document.getElementById("spokenInstructions");
  const sounds = document.getElementById("soundFeedback");
  const random = document.getElementById("randomOrder");
  const start = document.getElementById("startPractice");
  const repeat = document.getElementById("repeatCommand");
  const next = document.getElementById("nextCommand");
  const practiceMissed = document.getElementById("practiceMissed");
  const stop = document.getElementById("stopPractice");
  const prompt = document.getElementById("commandPrompt");
  const capture = document.getElementById("keyCapture");
  const detected = document.getElementById("detectedKeys");
  const status = document.getElementById("practiceStatus");
  const score = document.getElementById("practiceScore");
  const learnOnlyList = document.getElementById("learnOnlyCommands");

  let active = false;
  let command = null;
  let order = [];
  let position = 0;
  let correctCount = 0;
  let attempts = 0;
  let audioContext = null;
  let insertHeld = false;
  let missedCommands = new Map();

  Object.keys(categories).forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    category.appendChild(option);
  });

  function speak(text) {
    if (!spoken.checked || !("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    speechSynthesis.speak(utterance);
  }

  function tone(correct) {
    if (!sounds.checked) return;
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const notes = correct ? [523.25, 659.25, 783.99] : [180];
    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const startAt = audioContext.currentTime + index * 0.11;
      oscillator.frequency.value = frequency;
      oscillator.type = correct ? "sine" : "square";
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(correct ? 0.12 : 0.07, startAt + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + (correct ? 0.16 : 0.22));
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + (correct ? 0.18 : 0.24));
    });
  }

  function spokenKeys(value) {
    return value.replaceAll("+", " plus ").replace("Ctrl", "Control").replace("Arrow", " Arrow").replace("Grave", "grave accent");
  }

  function lowerFirst(value) {
    return value.charAt(0).toLowerCase() + value.slice(1);
  }

  function briefExplanation(value) {
    return "This command lets you " + lowerFirst(value.replace(/\.$/, "")) + ".";
  }

  function commandExplanation() {
    if (!command) return "";
    if (level.value === "detailed") {
      return "Here is what this command does. " + command[2];
    }
    return briefExplanation(command[1]);
  }

  function describe() {
    if (!command) return "";
    return "Press " + spokenKeys(command[0]) + ". " + commandExplanation();
  }

  function showCommand() {
    command = order[position];
    const heading = document.createElement("h3");
    heading.textContent = "Press " + spokenKeys(command[0]);
    const explanation = document.createElement("p");
    explanation.textContent = commandExplanation();
    prompt.replaceChildren(heading, explanation);
    status.textContent = "Waiting for " + spokenKeys(command[0]) + ".";
    detected.textContent = "None yet";
    next.disabled = true;
    speak(describe());
    capture.focus();
  }

  function normalizeExpected(value) {
    return value.split("+").map(part => part.trim().toLowerCase()).join("+");
  }

  function keyName(event) {
    const names = {
      " ": "space", "ArrowLeft": "left arrow", "ArrowRight": "right arrow",
      "ArrowUp": "up arrow", "ArrowDown": "down arrow", "Control": "control",
      "Shift": "shift", "Alt": "alt", "Meta": "windows", "Insert": "insert",
      "Enter": "enter", "PageDown": "page down", "PageUp": "page up",
      ";": "semicolon", "`": "grave", "=": "equals", ">": "greater than", "<": "less than"
    };
    return names[event.key] || (event.key.length === 1 ? event.key.toLowerCase() : event.key.toLowerCase());
  }

  function signature(event) {
    const parts = [];
    if (event.ctrlKey && event.key !== "Control") parts.push("control");
    if (event.altKey && event.key !== "Alt") parts.push("alt");
    if (event.shiftKey && event.key !== "Shift") parts.push("shift");
    if (event.metaKey && event.key !== "Meta") parts.push("windows");
    if (insertHeld && event.key !== "Insert") parts.push("insert");
    parts.push(keyName(event));
    return parts.join("+");
  }

  function displaySignature(value) {
    return value.split("+").map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(" plus ");
  }

  function updateScore() {
    score.textContent = "Correct commands: " + correctCount + ". Attempts: " + attempts + ".";
  }

  start.addEventListener("click", () => {
    active = true;
    correctCount = 0;
    attempts = 0;
    position = 0;
    order = [...categories[category.value]];
    missedCommands.clear();
    practiceMissed.disabled = true;
    if (random.checked) order.sort(() => Math.random() - 0.5);
    start.disabled = true;
    stop.disabled = false;
    repeat.disabled = false;
    updateScore();
    showCommand();
  });

  repeat.addEventListener("click", () => {
    speak(describe());
    capture.focus();
  });

  next.addEventListener("click", () => {
    if (!active) return;
    position += 1;
    if (position >= order.length) {
      active = false;
      start.disabled = false;
      stop.disabled = true;
      repeat.disabled = true;
      next.disabled = true;
      const missedCount = missedCommands.size;
      prompt.innerHTML = "<h3>Practice complete</h3><p>You practiced " + correctCount + " commands correctly in " + attempts + " attempts.</p>";
      status.textContent = missedCount
        ? missedCount + " command" + (missedCount === 1 ? " is" : "s are") + " ready to practice again."
        : "Practice complete. No missed commands remain.";
      practiceMissed.disabled = missedCount === 0;
      speak("Practice complete. You practiced " + correctCount + " commands correctly in " + attempts + " attempts. " + status.textContent);
      (missedCount ? practiceMissed : start).focus();
      return;
    }
    showCommand();
  });

  practiceMissed.addEventListener("click", () => {
    if (!missedCommands.size) return;
    order = [...missedCommands.values()];
    missedCommands = new Map();
    active = true;
    position = 0;
    correctCount = 0;
    attempts = 0;
    start.disabled = true;
    stop.disabled = false;
    repeat.disabled = false;
    practiceMissed.disabled = true;
    updateScore();
    showCommand();
  });

  stop.addEventListener("click", () => {
    active = false;
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    start.disabled = false;
    stop.disabled = true;
    repeat.disabled = true;
    next.disabled = true;
    status.textContent = "Practice stopped.";
    prompt.innerHTML = "<p>Select Start command practice when you are ready to begin again.</p>";
    start.focus();
  });

  level.addEventListener("change", () => {
    if (active) showCommand();
  });

  capture.addEventListener("keydown", event => {
    if (!active) return;
    event.preventDefault();
    event.stopPropagation();

    if (event.key === "Escape" && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey) {
      stop.click();
      return;
    }
    if (event.key === "Insert") {
      insertHeld = true;
      detected.textContent = "Insert";
      return;
    }
    if (["Control", "Alt", "Shift", "Meta"].includes(event.key)) {
      detected.textContent = displaySignature(keyName(event));
      return;
    }

    const pressed = signature(event);
    attempts += 1;
    detected.textContent = displaySignature(pressed);
    const expected = normalizeExpected(command[0])
      .replace("ctrl", "control")
      .replace("arrow", "arrow")
      .replace("grave", "grave")
      .replace("greater than", "greater than")
      .replace("less than", "less than");

    if (pressed === expected) {
      correctCount += 1;
      tone(true);
      status.textContent = "Correct. You pressed " + displaySignature(pressed) + ".";
      speak("Correct. You pressed " + displaySignature(pressed) + ". " + briefExplanation(command[1]));
      next.disabled = false;
      next.focus();
    } else {
      missedCommands.set(command[0], command);
      tone(false);
      status.textContent = "Not quite. You pressed " + displaySignature(pressed) + ". Try " + spokenKeys(command[0]) + ".";
      speak("Not quite. You pressed " + displaySignature(pressed) + ". Try " + spokenKeys(command[0]) + ".");
      capture.focus();
    }
    updateScore();
  }, true);

  capture.addEventListener("keyup", event => {
    if (event.key === "Insert") {
      event.preventDefault();
      insertHeld = false;
    }
  }, true);

  learnOnly.forEach(item => {
    const article = document.createElement("article");
    const heading = document.createElement("h3");
    const explanation = document.createElement("p");
    const button = document.createElement("button");
    const learnOnlyExplanation = "This command " + lowerFirst(item[1]);
    heading.textContent = spokenKeys(item[0]);
    explanation.textContent = learnOnlyExplanation;
    button.type = "button";
    button.textContent = "Hear explanation";
    button.addEventListener("click", () => speak("The command is " + spokenKeys(item[0]) + ". " + learnOnlyExplanation));
    article.append(heading, explanation, button);
    learnOnlyList.appendChild(article);
  });
})();
