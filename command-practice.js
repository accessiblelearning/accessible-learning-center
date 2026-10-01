(() => {
  "use strict";

  const categories = {
    "Mac VoiceOver basics": [
      ["VO+Right Arrow", "Move to the next item.", "Hold Control and Option, press Right Arrow once, then release. Listen to the next item before activating anything."],
      ["VO+Left Arrow", "Move to the previous item.", "Control+Option+Left Arrow moves the VoiceOver cursor back one item."],
      ["VO+Down Arrow", "Move the VoiceOver cursor down.", "Within an appropriate list, menu, or table, move down and listen to the new item."],
      ["VO+Up Arrow", "Move the VoiceOver cursor up.", "Within an appropriate list, menu, or table, move up and listen to the new item."],
      ["VO+Space", "Activate the current control.", "Confirm the name of the button or link, then use Control+Option+Space for its default action."],
      ["VO+Shift+Down Arrow", "Start interacting with a group.", "Hold Control, Option, and Shift, then press Down Arrow to explore the contents of the current group."],
      ["VO+Shift+Up Arrow", "Stop interacting with a group.", "Move out one level so you can reach controls outside the current group."],
      ["VO+K", "Start Keyboard Help.", "On a Mac, Keyboard Help describes keys without performing their usual actions. Escape leaves Keyboard Help."],
      ["VO+H", "Open the VoiceOver Help menu.", "Explore available help with the arrow keys. Escape closes the menu without choosing an item."],
      ["VO+A", "Read from the current webpage position.", "With the VoiceOver cursor in webpage content, read from the current position toward the end. Control pauses or resumes speech."]
    ],
    "Mac VoiceOver navigation and web": [
      ["VO+D", "Move to the Dock.", "After reaching the Dock, use VoiceOver navigation to find an app and activate it with VO+Space."],
      ["VO+M", "Move to the menu bar.", "Use VO+Left or Right Arrow to find a menu, then VO+Space to open it. Escape closes a menu."],
      ["VO+Shift+M", "Open the current item's shortcut menu.", "This is the contextual menu for the current item. It is different from moving to the menu bar with VO+M."],
      ["VO+U", "Open the rotor menus.", "Choose a list such as Headings with Left or Right Arrow, choose an item with Up or Down Arrow, then press Return to jump to it."],
      ["VO+I", "Open the Item Chooser.", "Type part of an item's name, use Up or Down Arrow to select a match, and press Return to move to it."],
      ["VO+Command+Right Arrow", "Choose the next rotor navigation mode.", "Keep the VoiceOver modifier and Command held while pressing Right Arrow. Available modes depend on the current content."],
      ["VO+Command+Left Arrow", "Choose the previous rotor navigation mode.", "Move backward through rotor modes such as headings, links, or characters, depending on the current app or page."],
      ["VO+Command+Down Arrow", "Move to the next item using the chosen rotor mode.", "First choose a rotor mode. With Headings selected, this moves to the next heading."],
      ["VO+Command+Up Arrow", "Move to the previous item using the chosen rotor mode.", "First choose a rotor mode. With Headings selected, this moves to the previous heading."],
      ["VO+Shift+U", "Read a link's address.", "Move to a link first. VoiceOver reads its destination so you can inspect it before opening it."]
    ],
    "Mac VoiceOver reading and settings": [
      ["VO+P", "Read the current paragraph.", "In document text, ask VoiceOver to read the paragraph at the current position."],
      ["VO+L", "Read the current line.", "With the VoiceOver cursor in text, read the current line."],
      ["VO+S", "Read the current sentence.", "With the VoiceOver cursor in text, read the current sentence."],
      ["VO+W", "Read the current word.", "In text, read the word at the current position. Repeating this command can spell it."],
      ["VO+C", "Read the current character in text.", "Use this while reviewing text. In a table, VO+C instead describes the column header; context matters."],
      ["VO+V", "Open the Verbosity rotor.", "Choose a setting with Left or Right Arrow, change its level with Up or Down Arrow, and close the rotor with Escape."],
      ["VO+Q", "Toggle single-key Quick Nav.", "On your Mac, listen for whether it is on or off. Turn it off if letter keys navigate instead of typing into an editable field."],
      ["VO+Shift+Q", "Toggle arrow-key Quick Nav.", "On your Mac, listen for the new state. Arrow-key Quick Nav changes how the arrow keys navigate."],
      ["Command+F5", "Turn VoiceOver on or off.", "Use the command builder here. The real shortcut changes your Mac's screen reader, so do not press it just to answer this exercise. Some keyboards also need Fn.", "builder"],
      ["VO+Fn+F8", "Open VoiceOver Utility.", "Use the command builder here. Apple's default shortcut includes Fn; if function keys are configured as standard keys, VO+F8 may work on your Mac.", "builder"]
    ],
    "Thunderbird email": [
        [
            "Control+N",
            "Start a new Thunderbird message.",
            "In Thunderbird mail on Windows, this opens a composition window."
        ],
        [
            "Control+S",
            "Save the current draft.",
            "Use this in the composition window; in the message list it can save a message as a file."
        ],
        [
            "Control+Shift+A",
            "Attach a file to this draft.",
            "In composition, this opens the attachment file picker."
        ],
        [
            "Control+R",
            "Reply to the selected message sender.",
            "Review the recipient before writing."
        ],
        [
            "Control+Shift+R",
            "Reply to everyone on the selected message.",
            "Review all recipients before sending a group reply."
        ],
        [
            "Control+L",
            "Forward the selected message.",
            "Add the intended recipient and review the forwarded contents."
        ],
        [
            "Control+Shift+K",
            "Open Quick Filter.",
            "Search the current folder rather than the whole mailbox."
        ],
        [
            "F6",
            "Move to the next major mail area.",
            "Identify whether focus reaches folders, messages, or another mail pane."
        ]
    ],
    "Firefox browser": [
        [
            "Control+L",
            "Focus the Firefox address bar.",
            "Enter an address or search words here."
        ],
        [
            "Control+T",
            "Open a new Firefox tab.",
            "Keep the original page available in its own tab."
        ],
        [
            "Control+Shift+T",
            "Reopen the last closed tab.",
            "Recover an accidentally closed page."
        ],
        [
            "Control+D",
            "Bookmark the current page.",
            "Review its saved name and folder."
        ],
        [
            "Control+Shift+O",
            "Open the bookmark Library.",
            "Locate a previously saved link."
        ],
        [
            "Control+J",
            "Open Downloads.",
            "Inspect the intended file and its completion status."
        ],
        [
            "Control+F",
            "Find text in this page.",
            "This searches the active page rather than the entire web."
        ],
        [
            "F9",
            "Toggle Reader View on a supported article.",
            "Reader View is not offered for every page."
        ]
    ],
    "ZoomText and Fusion Desktop magnification": [
        [
            "Caps Lock+Up Arrow",
            "Increase magnification.",
            "Applies to ZoomText and Fusion Desktop layout. Fusion Laptop adds Alt."
        ],
        [
            "Caps Lock+Down Arrow",
            "Decrease magnification.",
            "A lower level shows more surrounding context. Fusion Laptop adds Alt."
        ],
        [
            "Caps Lock+Enter",
            "Compare with the unmagnified view.",
            "Toggle between the current level and 1x. Fusion Laptop adds Alt."
        ],
        [
            "Caps Lock+C",
            "Toggle color enhancement.",
            "Compare the result on familiar text. Fusion Laptop adds Alt."
        ]
    ],
    "Bookshare Reader on the web": [
        [
            "Alt+C",
            "Open the table of contents.",
            "Bookshare Reader must be active in the browser on Windows or Linux."
        ],
        [
            "Alt+B",
            "Add a bookmark.",
            "Mark the current book location."
        ],
        [
            "Alt+Shift+B",
            "Open the bookmarks list.",
            "Choose a saved passage to revisit."
        ],
        [
            "Alt+N",
            "Add a study note.",
            "Enter your comment and activate Save."
        ],
        [
            "Alt+R",
            "Start reading aloud.",
            "Use the reader playback controls if a screen reader intercepts this command."
        ],
        [
            "Alt+Shift+R",
            "Stop reading aloud.",
            "Pause narration before exploring spoken control labels."
        ],
        [
            "Alt+P",
            "Go to a page.",
            "Confirm the edition and printed-page information."
        ],
        [
            "Alt+T",
            "Open reader settings.",
            "Choose audio or display preferences."
        ],
        [
            "Alt+W",
            "Request your current location.",
            "Identify where you are in the book."
        ]
    ],
    "Learning Ally control navigation": [
        [
            "Tab",
            "Move to the next keyboard-accessible control.",
            "Desktop control navigation, not a Learning Ally app-wide shortcut. Listen to the label."
        ],
        [
            "Shift+Tab",
            "Return to the previous control.",
            "Use this when you passed the intended button."
        ],
        [
            "Enter",
            "Activate the selected reading control.",
            "In this exercise the Play button is focused. The result depends on the selected control."
        ],
        [
            "Space",
            "Activate the focused button.",
            "This exercise uses a standard focused Pause button; Space is not a universal player shortcut."
        ],
        [
            "Down Arrow",
            "Select the next item in the open chapter list.",
            "This exercise uses an interactive list, not screen-reader browse-mode text."
        ],
        [
            "Up Arrow",
            "Select the previous item in the open chapter list.",
            "Confirm the chapter label before activating it."
        ]
    ],
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
    "Google Docs and applications": [
      ["Control+C", "Copy selected content.", "Copies selected text or an item in Google Docs without removing the original."],
      ["Control+X", "Cut selected content.", "Removes selected content and places it on the clipboard so it can be moved."],
      ["Control+V", "Paste clipboard content.", "Inserts the current clipboard content at the active cursor location."],
      ["Control+Z", "Undo the last action.", "Reverses the most recent supported edit in Google Docs and many Google applications."],
      ["Control+Y", "Redo an undone action.", "Restores an action that was reversed with Undo when the Google application supports Redo."],
      ["Control+B", "Toggle bold formatting.", "Turns bold formatting on or off for selected text or text typed next in Google Docs."],
      ["Control+I", "Toggle italic formatting.", "Turns italic formatting on or off in Google Docs."],
      ["Control+U", "Toggle underline formatting.", "Turns underline formatting on or off in Google Docs."],
      ["Control+K", "Insert or edit a link.", "Opens the link controls for selected text in Google Docs and other supported Google editors."],
      ["Control+F", "Find text.", "Opens Find so you can locate text in the current document or webpage."]
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

  // Expanded courses preserve the original category URLs.
  if (window.CommandPracticeCourses) Object.assign(categories, window.CommandPracticeCourses);

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
  const practiceStyle = document.getElementById("practiceStyle");
  const sessionLength = document.getElementById("sessionLength");
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
  const completionActions = document.getElementById("sessionCompletionActions");
  const practiceExit = document.getElementById("practiceExit");
  const commandResults = document.getElementById("commandResults");
  const commandResultsSummary = document.getElementById("commandResultsSummary");
  const commandMasteredList = document.getElementById("commandMasteredList");
  const commandReviewList = document.getElementById("commandReviewList");
  const commandSuggestedReview = document.getElementById("commandSuggestedReview");
  const commandCorrectResult = document.getElementById("commandCorrectResult");
  const commandAttemptResult = document.getElementById("commandAttemptResult");
  const commandAccuracyResult = document.getElementById("commandAccuracyResult");
  const practiceResultActionLabel = document.getElementById("practiceResultActionLabel");
  const practiceShortcuts = document.querySelector(".practice-session-shortcuts");
  const practiceTopbar = document.querySelector(".training-stage__topbar");
  const focusedSession = document.body.dataset.practiceSession === "true";
  const macPanel = document.getElementById("macCommandPanel");
  const macBuilder = document.getElementById("macCommandBuilder");
  const macVO = document.getElementById("macVOModifier");
  const macKey = document.getElementById("macFinalKey");
  const macCheck = document.getElementById("macCheckCommand");
  const macCategories = new Set(["Mac VoiceOver basics", "Mac VoiceOver navigation and web", "Mac VoiceOver reading and settings"]);
  const isMacPractice = () => macCategories.has(category.value);
  let usingMacBuilder = true;

  let active = false;
  let command = null;
  let sequencePosition = 0, announcedLevel = "", levelAnnouncement = "";
  const courseLevels = ["basic", "intermediate", "advanced"];
  const courseBuilder = document.getElementById("courseCommandBuilder");
  const coursePanel = document.getElementById("courseBuilderPanel");
  const courseKey = document.getElementById("courseFinalKey");
  const courseModifiers = ["Control", "Alt", "Shift", "Windows", "Insert", "Caps Lock", "VO", "Command", "Option", "Fn"];
  const hasCourse = () => Boolean(command?.[4]);
  const commandSteps = () => command?.[4]?.steps || [command?.[0] || ""];
  const expectedStep = () => commandSteps()[sequencePosition];
  const usesReleasedKeys = () => hasCourse() && command[3] === "safe";
  let releasedKeyPosition = 0;
  let releasePendingKey = "";
  let releaseBlocked = false;
  const heldPracticeKeys = new Set();
  let order = [];
  let position = 0;
  let correctCount = 0;
  let attempts = 0;
  let audioContext = null;
  let insertHeld = false;
  let controlTapPending = false;
  let protectedModifierArmed = "";
  let missedCommands = new Map();
  let awaitingAdvance = false;
  let autoAdvanceTimer = 0;

  const AUTO_ADVANCE_DELAY = 2400;

  const protectedSequences = {
    "control+n": { modifier: "control", finalKey: "n" },
    "control+t": { modifier: "control", finalKey: "t" },
    "control+l": { modifier: "control", finalKey: "l" },
    "control+r": { modifier: "control", finalKey: "r" },
    "control+d": { modifier: "control", finalKey: "d" },
    "control+j": { modifier: "control", finalKey: "j" },
    "control+shift+t": { modifier: "control", finalKey: "t" },
    "control+shift+o": { modifier: "control", finalKey: "o" },
    "control+shift+a": { modifier: "control", finalKey: "a" },
    "control+shift+k": { modifier: "control", finalKey: "k" },
    "caps lock+up arrow": { modifier: "caps lock", finalKey: "up arrow" },
    "caps lock+down arrow": { modifier: "caps lock", finalKey: "down arrow" },
    "caps lock+enter": { modifier: "caps lock", finalKey: "enter" },
    "caps lock+c": { modifier: "caps lock", finalKey: "c" },

    "control+page down": { modifier: "control", finalKey: "page down" },
    "control+page up": { modifier: "control", finalKey: "page up" },
    "alt+left arrow": { modifier: "alt", finalKey: "left arrow" },
    "alt+right arrow": { modifier: "alt", finalKey: "right arrow" },
    "alt+up arrow": { modifier: "alt", finalKey: "up arrow" }
  };

  const practiceContexts = {
    "Thunderbird email": "This is simulated Thunderbird email practice. No real application or account is being controlled.",
    "Firefox browser": "This is simulated Firefox browser practice. No real application or account is being controlled.",
    "ZoomText and Fusion Desktop magnification": "This is simulated ZoomText and Fusion Desktop magnification practice. No real application or account is being controlled.",
    "Bookshare Reader on the web": "This is simulated Bookshare Reader on the web practice. No real application or account is being controlled.",
    "Learning Ally control navigation": "This is simulated Learning Ally control navigation practice. No real application or account is being controlled.",

    "General editing": "You are editing information in a workplace document.",
    "Microsoft Word and documents": "You are working in a document with the text cursor active.",
    "Google Docs and applications": "You are editing a document in a Google application with the text cursor active.",
    "Web and screen-reader navigation": "You are reading a webpage with browse or scan mode active.",
    "Microsoft Excel and spreadsheets": "You are working in a spreadsheet with one cell active.",
    "Presentations": "You are editing a presentation with a slide or object selected.",
    "Windows and File Explorer": "You are in File Explorer with an item or folder selected.",
    "JAWS commands": "JAWS is running and you need information or navigation help.",
    "NVDA commands": "NVDA is running and you need information or navigation help.",
    "Narrator commands": "Narrator is running and you need information or navigation help.",
    "Braille display keyboard practice": "You are navigating with a braille display or its keyboard."
  };

  const reviewLinks = {
    "Mac VoiceOver basics": ["mac-voiceover-manual.html#part-3---voiceover-modifier-and-keyboard-help", "Review Mac VoiceOver basics"],
    "Mac VoiceOver navigation and web": ["mac-voiceover-manual.html#part-10---voiceover-rotor-and-item-chooser", "Review the Mac VoiceOver rotor and navigation guide"],
    "Mac VoiceOver reading and settings": ["mac-voiceover-manual.html#part-13---read-and-edit-text", "Review reading and settings in the Mac VoiceOver manual"],
    "Thunderbird email": ["thunderbird-manual.html", "Review the Thunderbird email manual"],
    "Firefox browser": ["firefox-manual.html", "Review the Firefox browser manual"],
    "ZoomText and Fusion Desktop magnification": ["zoomtext-fusion-manual.html", "Review the ZoomText and Fusion Desktop magnification manual"],
    "Bookshare Reader on the web": ["bookshare-manual.html", "Review the Bookshare Reader on the web manual"],
    "Learning Ally control navigation": ["learning-ally-manual.html", "Review the Learning Ally control navigation manual"],

    "General editing": ["word-lesson-2.html", "Review Microsoft Word Lesson 2"],
    "Microsoft Word and documents": ["word-lesson-2.html", "Review Microsoft Word Lesson 2"],
    "Google Docs and applications": ["google-services-manual.html", "Review the Google Services Manual"],
    "Web and screen-reader navigation": ["jaws-lesson-5.html", "Review Screen Readers Lesson 5"],
    "Microsoft Excel and spreadsheets": ["excel-lesson-2.html", "Review Microsoft Excel Lesson 2"],
    "Presentations": ["powerpoint-lesson-2.html", "Review Microsoft PowerPoint Lesson 2"],
    "Windows and File Explorer": ["windows-lesson-4.html", "Review Windows Lesson 4"],
    "JAWS commands": ["jaws-lesson-2.html", "Review Screen Readers Lesson 2"],
    "NVDA commands": ["jaws-lesson-2.html", "Review Screen Readers Lesson 2"],
    "Narrator commands": ["jaws-lesson-2.html", "Review Screen Readers Lesson 2"],
    "Braille display keyboard practice": ["focus-lesson-2.html", "Review Focus 40 Blue Lesson 2"]
  };

  Object.keys(categories).forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    category.appendChild(option);
  });

  function clearAutoAdvance() {
    window.clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = 0;
  }

  function speak(text, afterSpeech) {
    if (!spoken.checked || !("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      if (afterSpeech) autoAdvanceTimer = window.setTimeout(afterSpeech, AUTO_ADVANCE_DELAY);
      return;
    }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    if (afterSpeech) {
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        clearAutoAdvance();
        afterSpeech();
      };
      utterance.addEventListener("end", finish, { once: true });
      utterance.addEventListener("error", finish, { once: true });
      autoAdvanceTimer = window.setTimeout(finish, Math.max(4000, text.length * 75));
    }
    speechSynthesis.speak(utterance);
  }

  function tone(correct) {
    if (!sounds.checked) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      audioContext ||= new AudioContextClass();
      if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
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
    } catch (error) {
      // Optional feedback must never interrupt scoring or advancement.
      audioContext = null;
    }
  }

  function resetModifiers() {
    insertHeld = false;
    controlTapPending = false;
    protectedModifierArmed = "";
    releasedKeyPosition = 0;
    releasePendingKey = "";
    releaseBlocked = false;
    heldPracticeKeys.clear();
    if (active && !awaitingAdvance && usesReleasedKeys()) renderCoursePrompt();
  }

  capture.addEventListener("blur", resetModifiers);
  window.addEventListener("blur", resetModifiers);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) resetModifiers();
  });
  capture.addEventListener("click", () => {
    if (active) capture.focus({ preventScroll: true });
  });

  function spokenKeys(value) {
    return value.replace(/^VO\+/, "Control+Option+").replaceAll("+", " plus ").replace("Ctrl", "Control").replace("Grave", "grave accent");
  }

  function lowerFirst(value) {
    return value.charAt(0).toLowerCase() + value.slice(1);
  }

  function briefExplanation(value) {
    return "This command lets you " + lowerFirst(value.replace(/\.$/, "")) + ".";
  }

  function commandExplanation() {
    if (!command) return "";
    if (hasCourse()) {
      const shortGoals = {
        "Copy.": "This command copies highlighted text.",
        "Cut.": "Removes selected text and puts it on the clipboard.",
        "Paste.": "Inserts the text or item you copied or cut.",
        "Paste without formatting.": "Paste text without its original formatting.",
        "Undo.": "Reverse the last action.",
        "Redo.": "Restore the action you just undid.",
        "Bold.": "Turn bold text on or off.",
        "Strikethrough.": "Draw a line through the selected text.",
        "Superscript.": "Format text above the normal text line.",
        "Subscript.": "Format text below the normal text line.",
        "Small caps.": "Format text as small capital letters.",
        "Numbered list.": "Create a numbered list.",
        "Bulleted list.": "Create a bulleted list.",
        "Checklist.": "Create a checklist.",
        "Alt text.": "Add or edit an image's text description.",
        "Word count.": "Show the document's word count.",
        "Zoom 100%.": "Set document zoom to 100 percent.",
        "Move paragraph up/down up.": "Move the paragraph up.",
        "Move paragraph up/down down.": "Move the paragraph down."
      };
      const goal = shortGoals[command[1]] || command[1];
      return /^[A-Z][a-z]+ menu\.$/.test(goal) ? "Open the " + lowerFirst(goal) : goal;
    }
    if (level.value === "detailed") {
      return "Here is what this command does. " + command[2];
    }
    return briefExplanation(command[1]);
  }

  function practiceStepKeys() {
    return expectedStep().split("+").flatMap(key => key === "VO" ? ["Control", "Option"] : [key]);
  }

  function currentPracticeKey() {
    return practiceStepKeys()[releasedKeyPosition];
  }

  function practiceKeyName(key) {
    return ({Option: "alt", Command: "windows", Windows: "windows", Ctrl: "control"})[key] || key.toLowerCase();
  }

  function normalStepInstruction() {
    const keys = practiceStepKeys();
    if (keys.length === 1) return "Normally, press and release " + keys[0] + ".";
    return "Normally, hold " + keys.slice(0, -1).join(" and ") + ", press " + keys.at(-1) +
      ", then release " + (keys.length === 2 ? "both keys." : "all keys.");
  }

  function releasedKeyInstruction() {
    return "Here, press and release one key at a time: " + practiceStepKeys().join(", then ") + ".";
  }

  function courseInstruction() {
    const steps = commandSteps();
    if (usesReleasedKeys()) {
      return releasedKeyInstruction() + " " + normalStepInstruction() +
        (steps.length > 1 ? " Step " + (sequencePosition + 1) + " of " + steps.length + "." : "") +
        (releasedKeyPosition ? " Next: press and release " + currentPracticeKey() + "." : "");
    }
    const keys = steps.map(spokenKeys).join(". Then ");
    return "Press " + keys + "." + (steps.length > 1 ? " Release the keys between steps." : "") +
      (sequencePosition ? " Now enter step " + (sequencePosition + 1) + ": " + spokenKeys(expectedStep()) + "." : "");
  }

  function renderCoursePrompt() {
    const heading = document.createElement("h3");
    heading.textContent = usesReleasedKeys() ? "Press and release " + currentPracticeKey()
      : commandSteps().length > 1 ? command[1] : "Press " + spokenKeys(command[0]);
    const explanation = document.createElement("p");
    explanation.textContent = commandExplanation() + (usesReleasedKeys() ? " " + normalStepInstruction()
      : commandSteps().length > 1 ? " " + courseInstruction() : "");
    prompt.replaceChildren(heading, explanation);
    if (usesReleasedKeys()) {
      const instruction = document.createElement("p");
      instruction.textContent = (commandSteps().length > 1 ? "Step " + (sequencePosition + 1) + " of " + commandSteps().length + ". " : "") + releasedKeyInstruction();
      prompt.append(instruction);
    }
  }

  function describe() {
    if (!command) return "";
    if (hasCourse()) {
      return courseInstruction() + " " + commandExplanation();
    }
    if (isMacPractice()) {
      const input = command[3] === "builder"
        ? "Use the command builder for this system shortcut. "
        : "Use the command builder, or press the combination in the keyboard practice area if your screen reader passes it through. ";
      return command[1] + " The command is " + command[0] + ", " + spokenKeys(command[0]) + ". " + input + commandExplanation();
    }
    const context = practiceContexts[category.value] || "You are working in a supported application.";
    const goal = command[1].replace(/\.$/, "");
    const protectedSequence = protectedSequences[normalizeExpected(command[0])];
    if (protectedSequence) {
      const modifier = displaySignature(protectedSequence.modifier);
      const finalKey = displaySignature(protectedSequence.finalKey);
      const safeSteps = "Protected practice. Press and release " + modifier + ". Then press " + finalKey + " by itself. The simulator will count that as " + spokenKeys(command[0]) + " without letting the browser take over.";
      if (practiceStyle.value === "guided") {
        return "Guided task. " + context + " Your goal is to " + lowerFirst(goal) + ". " + safeSteps + " " + commandExplanation();
      }
      return safeSteps + " " + commandExplanation();
    }
    if (practiceStyle.value === "guided") {
      return "Guided task. " + context + " Your goal is to " + lowerFirst(goal) +
        ". Use " + spokenKeys(command[0]) + ". " + commandExplanation();
    }
    return "Press " + spokenKeys(command[0]) + ". " + commandExplanation();
  }

  function showCommand() {
    clearAutoAdvance();
    awaitingAdvance = false;
    command = order[position];
    sequencePosition = 0;
    const currentLevel = command[4]?.level || "";
    levelAnnouncement = currentLevel && currentLevel !== announcedLevel ? (currentLevel === "basic" ? "Starting with basic commands." : "Moving to " + currentLevel + " level commands.") : "";
    announcedLevel = currentLevel;
    const badge = document.getElementById("commandLevel");
    if (badge) { badge.hidden = !currentLevel; badge.textContent = currentLevel ? currentLevel[0].toUpperCase()+currentLevel.slice(1)+" commands · "+category.value : ""; }
    if (coursePanel) {
      coursePanel.hidden = !hasCourse();
      coursePanel.open = false;
      const allowedModifiers = isMacPractice() ? ["Control", "Shift", "VO", "Command", "Option", "Fn", "Caps Lock"] : ["Control", "Alt", "Shift", "Windows", "Insert", "Caps Lock"];
      for(const modifier of courseModifiers) document.getElementById("courseMod"+modifier.replaceAll(" ", "")).closest("label").hidden = !allowedModifiers.includes(modifier);
      document.getElementById("courseBuilderCue").textContent = command[1]+" Step 1: "+spokenKeys(expectedStep())+".";
      for (const modifier of courseModifiers) document.getElementById("courseMod"+modifier.replaceAll(" ", "")).checked = false;
      courseKey.value = "";
      document.getElementById("courseStep").textContent = "Step 1 of " + commandSteps().length;
    }
    const reference = document.getElementById("commandOfficialReference");
    if (reference && hasCourse()) { reference.href = command[4].source; reference.textContent = "Official command reference"; }
    const explanationDetails = document.getElementById("commandExplanationDetails");
    if (explanationDetails) {
      explanationDetails.hidden = !hasCourse();
      explanationDetails.open = false;
      document.getElementById("commandDetailedExplanation").textContent = hasCourse() ? command[2] : "";
    }
    resetModifiers();
    if (macPanel) {
      macPanel.hidden = !isMacPractice() || hasCourse();
      if (isMacPractice() && !hasCourse()) {
        macVO.value = "none";
        macKey.value = "";
        for (const id of ["macShift", "macCommand", "macFn"]) document.getElementById(id).checked = false;
        macCheck.disabled = false;
        if (command[3] === "builder") usingMacBuilder = true;
      }
    }
    if (hasCourse()) {
      renderCoursePrompt();
    } else {
      const heading = document.createElement("h3");
      const protectedSequence = protectedSequences[normalizeExpected(command[0])];
      heading.textContent = isMacPractice() && usingMacBuilder
        ? "Build " + spokenKeys(command[0])
        : protectedSequence ? "Protected practice: " + spokenKeys(command[0])
        : practiceStyle.value === "guided" ? "Guided task " + (position + 1) + " of " + order.length
        : "Press " + spokenKeys(command[0]);
      const explanation = document.createElement("p");
      explanation.textContent = !protectedSequence && practiceStyle.value !== "guided" ? commandExplanation() : describe();
      prompt.replaceChildren(heading, explanation);
    }
    const waiting = document.createElement("span");
    waiting.textContent = "Waiting for your command.";
    if (spoken.checked) {
      status.replaceChildren(waiting);
    } else {
      // Announce each new task to a personal screen reader without repeating
      // the whole prompt visually below the command surface.
      const announcement = document.createElement("span");
      announcement.className = "visually-hidden";
      announcement.textContent = levelAnnouncement + " " + describe() + " ";
      status.replaceChildren(announcement, waiting);
    }
    detected.textContent = "None yet";
    capture.classList.remove("is-correct", "is-incorrect");
    next.disabled = true;
    speak((levelAnnouncement ? levelAnnouncement + " " : "") + describe());
    updateScore();
    focusPracticeInput();
  }

  function normalizeExpected(value) {
    const aliases = { vo: "control+alt", option: "alt", command: "windows", ctrl: "control", ";":"semicolon", "=":"equals", "`":"grave", ">":"greater than", "<":"less than" };
    if (hasCourse() && isMacPractice()) aliases["caps lock"] = "control+alt";
    const parts = value.split("+").flatMap(part => (aliases[part.trim().toLowerCase()] || part.trim().toLowerCase()).split("+"));
    const key = parts.pop();
    const rank = ["control", "alt", "shift", "windows", "insert", "caps lock", "fn"];
    return [...new Set(parts)].sort((a,b)=>rank.indexOf(a)-rank.indexOf(b)).concat(key).join("+");
  }

  function keyName(event) {
    if (hasCourse() && event.code) {
      if (/^Key[A-Z]$/.test(event.code)) return event.code.slice(3).toLowerCase();
      if (/^Digit[0-9]$/.test(event.code)) return event.code.slice(5);
      const physical = {Period:".",Comma:",",Slash:"/",Backslash:"\\",BracketLeft:"[",BracketRight:"]",Minus:"-",Equal:"equals",Quote:"'",Semicolon:"semicolon",Backquote:"grave"};
      if (physical[event.code]) return physical[event.code];
    }
    // Option can change event.key to an accented character on a Mac. The
    // physical letter still identifies a VoiceOver chord in these exercises.
    if (isMacPractice() && /^Key[A-Z]$/.test(event.code || "")) return event.code.slice(3).toLowerCase();
    const names = {
      " ": "space", "ArrowLeft": "left arrow", "ArrowRight": "right arrow",
      "ArrowUp": "up arrow", "ArrowDown": "down arrow", "Control": "control",
      "Shift": "shift", "Alt": "alt", "Meta": "windows", "Insert": "insert", "CapsLock": "caps lock",
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
    return value.split("+").map(part => {
      if (isMacPractice() && part === "alt") return "Option";
      if (isMacPractice() && part === "windows") return "Command";
      return part.charAt(0).toUpperCase() + part.slice(1);
    }).join(" plus ");
  }

  function focusPracticeInput() {
    if (isMacPractice() && !hasCourse() && usingMacBuilder && macVO) macVO.focus();
    else capture.focus();
  }

  if (courseKey && window.CommandPracticeCourses) {
    const keys = new Set();
    Object.values(window.CommandPracticeCourses).flat().forEach(item=>item[4].steps.forEach(step=>keys.add(step.split("+").at(-1))));
    [...keys].sort().forEach(key=>{ const option=document.createElement("option"); option.value=key; option.textContent=key; courseKey.appendChild(option); });
  }
  courseBuilder?.addEventListener("submit", event => {
    event.preventDefault();
    if (!active || awaitingAdvance || !hasCourse()) return;
    if (!courseKey.value) { status.textContent="Choose a final key first."; speak(status.textContent); courseKey.focus(); return; }
    const parts=courseModifiers.filter(modifier=>document.getElementById("courseMod"+modifier.replaceAll(" ", "")).checked);
    parts.push(courseKey.value);
    recordAttempt(normalizeExpected(parts.join("+")), true);
  });
  document.getElementById("courseRepeat")?.addEventListener("click", ()=>{status.textContent=describe();speak(describe());});

  macBuilder?.addEventListener("submit", event => {
    event.preventDefault();
    if (!active || awaitingAdvance || !isMacPractice()) return;
    usingMacBuilder = true;
    if (!macKey.value) {
      status.textContent = "Choose the final key before checking the command.";
      speak(status.textContent);
      macKey.focus();
      return;
    }
    const parts = [];
    if (macVO.value === "vo" || macVO.value === "caps") parts.push("control", "alt");
    if (document.getElementById("macShift").checked) parts.push("shift");
    if (document.getElementById("macCommand").checked) parts.push("windows");
    if (document.getElementById("macFn").checked) parts.push("fn");
    parts.push(macKey.value);
    recordAttempt(parts.join("+"), true);
  });

  document.getElementById("macRepeatCommand")?.addEventListener("click", () => {
    if (!active) return;
    status.textContent = describe();
    speak(describe());
  });

  document.getElementById("macPressKeys")?.addEventListener("click", () => {
    if (!active || awaitingAdvance) return;
    if (command[3] === "builder") {
      status.textContent = "Use the command builder for this system shortcut. Keep your screen reader running.";
      speak(status.textContent);
      macVO.focus();
      return;
    }
    usingMacBuilder = false;
    status.textContent = "Keyboard practice. VO means hold Control and Option together. If VoiceOver handles the shortcut, return to the command builder with Tab.";
    speak(status.textContent);
    capture.focus();
  });

  function updateScore() {
    score.textContent = focusedSession
      ? "Correct: " + correctCount + " · Attempts: " + attempts
      : "Correct commands: " + correctCount + ". Attempts: " + attempts + ".";
    const progress = document.getElementById("commandProgress");
    const positionText = document.getElementById("commandPosition");
    if (progress) { progress.max = order.length || 1; progress.value = correctCount; }
    if (positionText) positionText.textContent = "Command " + Math.min(position + 1, order.length) + " of " + order.length;
  }

  function showPracticeResults(show) {
    if (coursePanel && show) coursePanel.hidden = true;
    const explanationDetails = document.getElementById("commandExplanationDetails");
    if (explanationDetails && show) explanationDetails.hidden = true;
    if (!commandResults) return;
    commandResults.hidden = !show;
    if (practiceTopbar) practiceTopbar.hidden = show;
    prompt.hidden = show;
    capture.hidden = show;
    status.hidden = show;
    if (macPanel) macPanel.hidden = show || !isMacPractice() || hasCourse();
    if (practiceShortcuts) practiceShortcuts.hidden = show;
    for (const id of ["commandProgress", "commandPosition"]) {
      const element = document.getElementById(id);
      if (element) element.hidden = show;
    }
  }

  function fillCommandResults() {
    const uniqueCommands = [...new Map(order.map(item => [item[0]+"|"+item[1], item])).values()];
    commandResultsSummary.textContent = "You completed " + correctCount + " commands correctly in " + attempts + " attempts.";
    if (commandCorrectResult) commandCorrectResult.textContent = String(correctCount);
    if (commandAttemptResult) commandAttemptResult.textContent = String(attempts);
    if (commandAccuracyResult) commandAccuracyResult.textContent = (attempts ? Math.round((correctCount / attempts) * 100) : 0) + "%";
    if (practiceResultActionLabel) practiceResultActionLabel.textContent = missedCommands.size ? "Practice Missed Commands" : "Practice This Set Again";
    commandMasteredList.replaceChildren();
    uniqueCommands.forEach(item => {
      const listItem = document.createElement("li");
      listItem.textContent = spokenKeys(item[0]) + ": " + item[1];
      commandMasteredList.append(listItem);
    });
    commandReviewList.replaceChildren();
    if (missedCommands.size) {
      const list = document.createElement("ul");
      missedCommands.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = spokenKeys(item[0]) + ": " + item[1];
        list.append(listItem);
      });
      commandReviewList.append(list);
    } else {
      const none = document.createElement("p");
      none.textContent = "None. You completed every command without a missed attempt.";
      commandReviewList.append(none);
    }
    const suggestedReview = reviewLinks[category.value];
    commandSuggestedReview.href = suggestedReview[0];
    commandSuggestedReview.textContent = suggestedReview[1];
  }

  start.addEventListener("click", () => {
    active = true;
    usingMacBuilder = true;
    resetModifiers();
    correctCount = 0;
    attempts = 0;
    position = 0;
    announcedLevel = "";
    order = [...categories[category.value]];
    if (!window.CommandPracticeCourses?.[category.value] && sessionLength.value !== "all") order = order.slice(0, Number(sessionLength.value));
    missedCommands.clear();
    practiceMissed.disabled = true;
    if (completionActions) completionActions.hidden = true;
    showPracticeResults(false);
    if (random.checked && !window.CommandPracticeCourses?.[category.value]) order.sort(() => Math.random() - 0.5);
    start.disabled = true;
    stop.disabled = false;
    repeat.disabled = false;
    if (spoken.checked) {
      status.removeAttribute("role");
      status.setAttribute("aria-live", "off");
    } else {
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "assertive");
    }
    updateScore();
    if (isMacPractice()) {
      document.getElementById("captureInstructions").textContent = "VO means Control plus Option. Build the combination using the labeled controls below, or focus this area for physical key practice. VoiceOver may handle a shortcut before this page can detect it; no response is not a failed attempt. System shortcuts use the command builder only. Tab leaves this area. Control alone repeats. Escape returns to Command Practice.";
      const resultLabel = document.getElementById("commandMasteredHeading");
      if (resultLabel) resultLabel.textContent = "Commands practiced";
    }
    if (window.CommandPracticeCourses?.[category.value]) {
      capture.setAttribute("aria-describedby", "captureInstructions");
      document.getElementById("captureInstructions").textContent = "Press the requested keys here, or use Build the command. For protected commands, press and release each named key separately. The prompt explains how the real shortcut is held. Build the command is an optional alternative if a key is not detected. Enter sequence steps in order. Correct commands advance automatically. Control alone repeats unless Control is the next practice key. Tab moves to the page controls when it is not the requested command. Escape returns to Command Practice unless Escape is the requested key.";
      const resultLabel=document.getElementById("commandMasteredHeading");
      if (resultLabel) resultLabel.textContent="Commands practiced";
    }
    showCommand();
  });

  repeat.addEventListener("click", () => {
    speak(describe());
    capture.focus();
  });

  next.addEventListener("click", () => {
    if (!active) return;
    clearAutoAdvance();
    awaitingAdvance = false;
    position += 1;
    if (position >= order.length) {
      active = false;
      start.disabled = false;
      stop.disabled = true;
      repeat.disabled = true;
      next.disabled = true;
      const missedCount = missedCommands.size;
      status.textContent = missedCount
        ? missedCount + " command" + (missedCount === 1 ? " is" : "s are") + " ready to practice again."
        : "Practice complete. No missed commands remain.";
      practiceMissed.disabled = false;
      if (completionActions) completionActions.hidden = false;
      fillCommandResults();
      showPracticeResults(true);
      speak("Practice complete. You practiced " + correctCount + " commands correctly in " + attempts + " attempts. " + status.textContent);
      practiceMissed.focus();
      return;
    }
    showCommand();
  });

  practiceMissed.addEventListener("click", () => {
    if (!missedCommands.size) {
      start.click();
      return;
    }
    order = [...missedCommands.values()];
    missedCommands = new Map();
    active = true;
    announcedLevel = "";
    position = 0;
    correctCount = 0;
    attempts = 0;
    start.disabled = true;
    stop.disabled = false;
    repeat.disabled = false;
    practiceMissed.disabled = true;
    if (completionActions) completionActions.hidden = true;
    showPracticeResults(false);
    updateScore();
    showCommand();
  });

  practiceExit?.addEventListener("click", () => {
    window.location.href = "command-practice.html";
  });

  document.addEventListener("keydown", event => {
    if (!focusedSession || !["Escape", "Esc"].includes(event.key) || event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;
    // Escape belongs to the native key-choice menu while a select has focus.
    if (event.defaultPrevented || (isMacPractice() && event.target.tagName === "SELECT")) return;
    if (event.target === capture && active) return;
    event.preventDefault();
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    window.location.href = "command-practice.html";
  });

  stop.addEventListener("click", () => {
    active = false;
    awaitingAdvance = false;
    clearAutoAdvance();
    resetModifiers();
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    if (focusedSession) {
      window.location.href = "command-practice.html";
      return;
    }
    showPracticeResults(false);
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

  practiceStyle.addEventListener("change", () => {
    if (active) showCommand();
  });

  function releasedKeyDown(event) {
    const key = keyName(event);
    if (key === "control" && releasedKeyPosition === 0 && !heldPracticeKeys.size &&
        !releaseBlocked && practiceKeyName(currentPracticeKey()) !== "control") return false;
    controlTapPending = false;
    if (event.repeat || heldPracticeKeys.has(key)) return true;
    const otherModifierHeld = (event.ctrlKey && key !== "control") || (event.altKey && key !== "alt") ||
      (event.shiftKey && key !== "shift") || (event.metaKey && key !== "windows");
    const overlap = heldPracticeKeys.size > 0 || otherModifierHeld;
    heldPracticeKeys.add(key);
    if (releaseBlocked || overlap) {
      releasedKeyPosition = 0;
      releasePendingKey = "";
      releaseBlocked = true;
      renderCoursePrompt();
      status.textContent = "Release all keys. In this practice, press and release one key at a time.";
      speak(status.textContent);
      return true;
    }
    releasePendingKey = key;
    detected.textContent = displaySignature(key);
    status.textContent = "Release " + displaySignature(key) + ".";
    return true;
  }

  function releasedKeyUp(event) {
    const key = keyName(event);
    if (!heldPracticeKeys.has(key) && !releaseBlocked) return false;
    event.preventDefault();
    event.stopPropagation();
    heldPracticeKeys.delete(key);
    if (releaseBlocked) {
      if (!heldPracticeKeys.size && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey) {
        releaseBlocked = false;
        status.textContent = "Now press and release " + currentPracticeKey() + ".";
        speak(status.textContent);
      }
      return true;
    }
    if (awaitingAdvance || key !== releasePendingKey) return true;
    releasePendingKey = "";
    if (key !== practiceKeyName(currentPracticeKey())) {
      releasedKeyPosition = 0;
      recordAttempt(key);
      renderCoursePrompt();
      return true;
    }
    releasedKeyPosition += 1;
    if (releasedKeyPosition === practiceStepKeys().length) {
      releasedKeyPosition = 0;
      recordAttempt(normalizeExpected(expectedStep()));
    } else {
      renderCoursePrompt();
      status.textContent = displaySignature(key) + " entered. Now press and release " + currentPracticeKey() + ".";
      speak(status.textContent);
    }
    return true;
  }

  capture.addEventListener("keydown", event => {
    if (!active) return;
    const expected = normalizeExpected(expectedStep());
    // Keep keyboard navigation available unless Tab is the requested command.
    if (event.key === "Tab" && !event.ctrlKey && !event.altKey && !event.metaKey) {
      const tabCommand = usesReleasedKeys()
        ? practiceKeyName(currentPracticeKey()) === "tab"
        : event.shiftKey ? expected === "shift+tab" : expected === "tab" || expected === "insert+tab";
      if (awaitingAdvance || !tabCommand) {
        resetModifiers();
        return;
      }
    }
    event.preventDefault();
    event.stopPropagation();

    if (event.key === "Escape" && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey &&
        !(usesReleasedKeys() && !awaitingAdvance && practiceKeyName(currentPracticeKey()) === "escape")) {
      stop.click();
      return;
    }
    if (awaitingAdvance) return;
    if (usesReleasedKeys() && releasedKeyDown(event)) return;
    if (isMacPractice() && command[3] === "builder") {
      status.textContent = "Use the command builder for this system shortcut.";
      return;
    }
    if (event.repeat) return;
    const protectedSequence = protectedSequences[expected];
    const pressedKey = keyName(event);
    const isProtectedModifier = protectedSequence &&
      pressedKey === protectedSequence.modifier &&
      !event.shiftKey && !event.metaKey &&
      (protectedSequence.modifier === "control" ? !event.altKey : !event.ctrlKey);
    if (isProtectedModifier) {
      protectedModifierArmed = protectedSequence.modifier;
      controlTapPending = false;
      detected.textContent = displaySignature(protectedSequence.modifier) + " ready";
      status.textContent = displaySignature(protectedSequence.modifier) + " ready. Release it, then press " + displaySignature(protectedSequence.finalKey) + " by itself.";
      speak(status.textContent);
      return;
    }
    if (event.key === "Enter" && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && !next.disabled) {
      next.click();
      return;
    }
    if (event.key === "Control") {
      controlTapPending = true;
      detected.textContent = "Control";
      return;
    }
    if (event.ctrlKey) controlTapPending = false;
    if (event.key === "Insert") {
      insertHeld = true;
      detected.textContent = "Insert";
      status.textContent = "Insert ready. Press the final key for the screen-reader command.";
      speak(status.textContent);
      return;
    }
    if (["Alt", "Shift", "Meta"].includes(event.key)) {
      detected.textContent = displaySignature(keyName(event));
      return;
    }

    let pressed = normalizeExpected(signature(event));
    // JAWS and NVDA may consume Insert before the browser receives it.
    // When the expected command uses Insert, accept the final key as a
    // confirmation after the screen reader handles the real chord.
    if (!insertHeld && expected.startsWith("insert+") &&
      !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey) {
      pressed = "insert+" + pressed;
    }
    // Consume Insert once, even if the browser misses its release event.
    insertHeld = false;
    if (
      protectedSequence &&
      protectedModifierArmed === protectedSequence.modifier &&
      !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey &&
      pressedKey === protectedSequence.finalKey
    ) {
      pressed = expected;
    }
    protectedModifierArmed = "";
    usingMacBuilder = false;
    recordAttempt(pressed);
  }, true);

  function recordAttempt(pressed, built = false) {
    if (!active || awaitingAdvance) return;
    const expected = normalizeExpected(expectedStep());
    attempts += 1;
    detected.textContent = displaySignature(pressed);
    const normalizedExpected = expected.replace("ctrl", "control");
    // Function-key settings vary. Both documented versions of these system
    // shortcuts can be rehearsed without changing the real screen reader.
    const functionVariant = built && isMacPractice() && command[3] === "builder" &&
      pressed.replace("fn+", "") === normalizedExpected.replace("fn+", "");

    if (pressed === normalizedExpected || functionVariant) {
      if (sequencePosition + 1 < commandSteps().length) {
        attempts -= 1; // Count complete-command attempts, not successful prefix keys.
        sequencePosition += 1;
        releasedKeyPosition = 0;
        if (hasCourse()) renderCoursePrompt();
        status.textContent = "Step " + sequencePosition + " correct. " + (usesReleasedKeys() && !built
          ? "Now press and release " + currentPracticeKey() + ". " + normalStepInstruction()
          : "Now " + spokenKeys(expectedStep()) + ".");
        if (coursePanel) {
          document.getElementById("courseStep").textContent = "Step " + (sequencePosition+1) + " of " + commandSteps().length;
          document.getElementById("courseBuilderCue").textContent = command[1]+" Step "+(sequencePosition+1)+": "+spokenKeys(expectedStep())+".";
        }
        if (built) { courseKey.value=""; for(const modifier of courseModifiers)document.getElementById("courseMod"+modifier.replaceAll(" ", "")).checked=false; courseKey.focus(); }
        speak(status.textContent);
        return;
      }
      correctCount += 1;
      awaitingAdvance = true;
      if (isMacPractice() && macCheck) macCheck.disabled = true;
      capture.classList.remove("is-incorrect");
      capture.classList.add("is-correct");
      tone(true);
      const feedback = built ? "Correct combination. You built " : usesReleasedKeys() ? "Correct. You practiced " : "Correct. You pressed ";
      status.textContent = feedback + displaySignature(pressed) + ". Moving to the next task.";
      next.disabled = false;
      speak(
        feedback + spokenKeys(command[0]) + ". " + (hasCourse() ? commandExplanation() : briefExplanation(command[1])),
        () => {
          if (active && awaitingAdvance) next.click();
        }
      );
      if (!built) capture.focus();
    } else {
      missedCommands.set(command[0]+"|"+command[1], command);
      capture.classList.remove("is-correct");
      capture.classList.add("is-incorrect");
      tone(false);
      status.textContent = "Not quite. You " + (built ? "built " : "pressed ") + displaySignature(pressed) + ". Try " + spokenKeys(expectedStep()) + ".";
      if (usesReleasedKeys() && !built) status.textContent = "Not quite. Start this step again. " + releasedKeyInstruction();
      speak(status.textContent);
      if (!built) capture.focus();
    }
    updateScore();
  }

  capture.addEventListener("keyup", event => {
    if (active && usesReleasedKeys() && releasedKeyUp(event)) return;
    if (event.key === "Insert") {
      event.preventDefault();
      insertHeld = false;
    }
    if (event.key === "Control" && controlTapPending) {
      event.preventDefault();
      event.stopPropagation();
      controlTapPending = false;
      detected.textContent = "Control";
      status.textContent = spoken.checked
        ? "Repeating the current command aloud."
        : describe();
      speak(describe());
      capture.focus();
    }
    if (event.key === "Alt" && protectedModifierArmed === "alt") {
      event.preventDefault();
      event.stopPropagation();
    }
    if (event.key === "Control" && protectedModifierArmed === "control") {
      event.preventDefault();
      event.stopPropagation();
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
