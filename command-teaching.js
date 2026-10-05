/* Reviewed teaching additions. Main prompts and protected-input handling remain in command-practice.js. */
(() => {
  const courses = window.CommandPracticeCourses;
  if (!courses) return;
  const teaching = {
  "Microsoft Word and documents": {
    "Control+O": "Choose an existing document to work on. For example, open yesterday’s letter before making corrections; this does not create a new blank document.",
    "Control+N": "Start a blank document. Use this when beginning a new letter rather than replacing the contents of the document already open.",
    "Control+S": "Save changes to the current document. A new document may first ask for a name and location. After correcting an error, save the corrected version.",
    "Control+X": "Move highlighted text onto the Clipboard. Place the cursor at the new location and paste to move a paragraph within your document.",
    "Control+Shift+V": "Paste text without carrying over the source formatting. Try it when bringing a quotation from another document into a consistently formatted report.",
    "Control+I": "Apply italics to highlighted text, such as a book title. Using the command again on italic text toggles italics off.",
    "Control+U": "Underline highlighted text. Apply it to a short label, then use the command again to remove the underline.",
    "Control+Y": "Redo an action that you just undid, when Word can redo it. For example, restore a formatting change after using Undo by mistake.",
    "Control+F3": "Collect highlighted text in Word’s Spike. You can cut several separate pieces into this collection before pasting them together with Control plus Shift plus F3.",
    "Control+Shift+F3": "Insert the text collected in the Spike at the cursor. Use it after collecting several passages with Control plus F3; check the insertion point first.",
    "Control+Alt+C": "Copy the appearance of highlighted text. For example, copy a heading’s formatting, select a second heading, and paste the formatting onto it.",
    "Control+Alt+V": "Apply previously copied text formatting to the highlighted text. This reuses the appearance, such as font and emphasis, rather than inserting the source words.",
    "Control+[": "Make highlighted text one point smaller. The left bracket is the [ key beside P on a US keyboard. It is a different key from comma and the less-than sign.",
    "Control+]": "Make highlighted text one point larger. Use a single step when adjusting a label that only needs a small size change.",
    "Control+E": "Center the paragraph containing the cursor, or the selected paragraphs. For example, center the title at the top of a letter.",
    "Control+L": "Align the current or selected paragraphs with the left margin. Use this to return body text to left alignment after a centered heading.",
    "Control+R": "Align the current or selected paragraphs with the right margin. For example, align a short date line on the right.",
    "Control+Shift+W": "Underline the words in highlighted text while leaving the spaces unlined. Compare this with ordinary underline, which also covers the spaces.",
    "Control+Shift+D": "Apply a double underline to highlighted text. Use it to distinguish an important label, then check that this emphasis suits the document.",
    "Control+Alt+S": "Split the document window so you can view different parts of the same document. This can help compare a paragraph near the beginning with one near the end.",
    "Alt+Shift+C": "Remove the split view and return to one document pane. This changes the view without deleting text.",
    "Control+F1": "Collapse or expand the ribbon. Collapsing it provides more document space; expand it again when you want to browse the editing controls."
  },
  "Google Docs and applications": {
    "Control+X": "Move highlighted text to the Clipboard. Place the cursor at another location and paste to move that passage there.",
    "Control+Shift+V": "Paste the copied words using the destination formatting. Use it when text copied from a website has distracting fonts or colors.",
    "Control+Shift+Z": "Redo an edit that you just undid. For example, restore a deleted sentence after deciding that the deletion was useful.",
    "Control+K": "Add a link to highlighted words or edit the current link. For example, make “course manual” link to the manual’s web address.",
    "Alt+Enter": "Follow the link at the cursor. Put the cursor in the linked text first. In this simulator use the protected input sequence so the browser does not run a conflicting command.",
    "Control+/": "Open the Google Docs shortcut reference. The final key is forward slash, /, on the same US keyboard key as question mark; it is not period.",
    "Control+S": "Google Docs saves edits automatically. This familiar save command does not replace checking the document’s saving status and internet connection.",
    "Control+H": "Find matching text and replace it. For example, change a repeated spelling error; review matches before choosing a replacement for every occurrence.",
    "Control+G": "Move to the next match for your current search. Use it to inspect the next occurrence of a name without entering the search again.",
    "Control+Shift+G": "Return to the previous match for your current search. Use it when you have moved past the occurrence you wanted to review.",
    "Control+Enter": "Start the following text on a new page with a page break. Use it before a new section instead of inserting a long series of blank lines.",
    "Alt+/": "Search for a Google Docs tool by name. For example, find a formatting feature when you do not remember which menu contains it.",
    "Control+I": "Italicize highlighted text, such as the title of a book. Repeat the command on italic text to turn italics off.",
    "Control+U": "Underline highlighted text. Use it for a short piece of emphasis and repeat the command to remove the underline.",
    "Control+Home": "Move to the beginning of the document. This moves the cursor without selecting the text you pass.",
    "Control+End": "Move to the end of the document. Use it before adding a final paragraph; check the insertion point before typing.",
    "Control+Shift+.": "Increase the font size of highlighted text. On a US keyboard, hold Control and Shift and press the period key, which also carries the greater-than sign.",
    "Control+Shift+,": "Decrease the font size of highlighted text. On a US keyboard, hold Control and Shift and press the comma key, which also carries the less-than sign.",
    "Control+Alt+C": "Copy the formatting of highlighted text. Use it to capture a heading’s appearance before applying that appearance to another heading.",
    "Control+Alt+V": "Paste the formatting you copied onto highlighted text. The destination keeps its words while taking on the copied appearance."
  },
  "Mac VoiceOver basics": {
    "VO+K": "Explore the keyboard without issuing the commands you are trying. VoiceOver keyboard help describes keys and commands; Escape leaves help. Here, rehearse using the protected keys or optional builder.",
    "VO+M": "Move the VoiceOver cursor to the menu bar. Use VO plus Right Arrow to reach an application menu, then VO plus Space to open it.",
    "VO+D": "Move the VoiceOver cursor to the Dock. Explore the apps there, then activate the one you want; moving to the Dock alone does not open an app.",
    "VO+Space": "Activate the item under the VoiceOver cursor, such as a button or menu. First listen to its name so you know what you are about to choose.",
    "Shift+VO+Down Arrow": "Begin interacting with a group such as a table or scroll area. You can then explore the items inside it instead of moving past the whole group.",
    "Shift+VO+Up Arrow": "Stop interacting with the current group. Use this to leave a table’s contents and resume exploring the surrounding window.",
    "VO+P": "Read the paragraph at the VoiceOver cursor. This helps check a whole thought without selecting it or changing the text.",
    "VO+L": "Read the line at the VoiceOver cursor. Use it to check your current position after navigating within a document.",
    "VO+S": "Read the sentence at the VoiceOver cursor. Listen for meaning and punctuation while reviewing a draft.",
    "VO+W": "Read the word at the VoiceOver cursor. Use it when a particular name or term needs closer attention.",
    "VO+C": "Read the character at the VoiceOver cursor. This is useful when checking a punctuation mark or the spelling of a short code.",
    "VO+T": "Describe the formatting of text at the VoiceOver cursor. Use this to check whether a heading has the font or emphasis you intended.",
    "VO+V": "Open the verbosity rotor to adjust how much detail VoiceOver announces. Choose a setting appropriate to what you are reading; this changes spoken detail rather than the document.",
    "VO+N": "Read notifications. Use it to review an alert you may have missed without assuming the alert has moved keyboard focus.",
    "VO+Tab": "Pass the next key combination through to the application. This is a one-command exception when VoiceOver would otherwise handle that combination.",
    "VO+Fn+F8": "Open VoiceOver Utility to review screen-reader settings. This simulator rehearses the command and does not change your Mac’s settings.",
    "VO+Delete": "In TextEdit, with the VoiceOver cursor on a tab stop in the ruler, remove that tab stop. In a text paragraph, this is not a general delete-text instruction."
  }
};
  for (const [name, notes] of Object.entries(teaching)) {
    for (const entry of courses[name]) {
      if (notes[entry[0]]) entry[2] = notes[entry[0]];
    }
  }
  // These lessons depend on the active pane or dialog. Keep that context in
  // the short prompt too; the learner should not have to expand an explanation.
  const excel = courses["Microsoft Excel and spreadsheets"];
  const pasteOptions = {
    A: ["all cell contents and formatting", "Use this when the destination should receive both the data and its appearance."],
    T: ["formatting only", "Reuse a sample cell’s appearance while keeping the destination’s existing data."],
    C: ["comments and notes only", "Carry a reviewer’s annotation to another cell without replacing that cell’s value."],
    N: ["data validation only", "Reuse an input rule, such as an allowed list of choices, in another entry cell."],
    H: ["all cell contents with source formatting", "Check the result when copying between differently styled ranges."],
    X: ["everything except borders", "Keep the destination table’s border design while bringing in the copied content."],
    W: ["column widths only", "Make another report’s columns the same width without replacing its values."],
    F: ["formulas only", "Reuse a calculation in another range. Relative references can change at the destination; check the new formula."],
    V: ["values only", "Keep a fixed snapshot of a calculated total. Later changes to the source formula will not update that snapshot."],
    R: ["formulas and number formats", "Reuse a calculation and its currency or percentage display, without copying every visual style."],
    U: ["values and number formats", "Keep a fixed result with its currency or percentage display, without keeping the source formula."]
  };
  for (const entry of excel) {
    const option = pasteOptions[entry[0]];
    if (!option || !/^Paste /.test(entry[1])) continue;
    const key = entry[0], [what, example] = option;
    entry[0] = "Control+Alt+V then " + key + " then Enter";
    entry[1] = "Paste " + what + ".";
    entry[2] = "In Excel for Windows with English dialog labels, first copy the source cells and select the destination. Open Paste Special, choose " + what + ", then confirm. The letter " + key + " selects an option inside that dialog; it is not a worksheet command. " + example;
    entry[3] = "safe";
    entry[4] = {...entry[4], steps:["Control+Alt+V", key, "Enter"], stepGoals:[
      "After copying cells, open Paste Special at the destination.",
      "In Paste Special, choose " + what + ".",
      "Confirm to paste " + what + "."
    ]};
  }
  const excelNotes = {
    "Alt+H then H": "Open the fill-color choices for the selected cells. For example, mark an input range with a background color. Opening the palette alone does not choose a color; review a color and confirm it.",
    "Alt+H then A then C": "Center the contents within the selected cells. This changes alignment, not the stored values, and does not merge cells. Try it on a short table heading.",
    "Alt+H then B": "Open border choices for the selected cells. Choose a border style for a table boundary; opening this menu alone does not apply a particular border.",
    "Alt+H then D then C": "Delete the worksheet column containing the selected cell. Other columns shift to fill the gap. Review the column header first; this removes a whole column, not just one cell’s contents.",
    "Alt+M": "Move to the Formulas ribbon tab. From there, choose a function or inspect calculations. Opening the tab alone does not insert a formula or recalculate the sheet.",
    "Alt+N": "Move to the Insert ribbon tab. Use it before choosing a chart or PivotTable for the selected data. You must choose a tool after opening the tab.",
    "Alt+W": "Move to the View ribbon tab. Use its controls to change how the worksheet is displayed, such as zoom or frozen panes, while keeping the underlying cell values.",
    "Control+'": "Bring the formula from the cell above into the current cell or formula bar. Read the copied references before confirming; use this when the formula above is a useful starting point.",
    "Control+8": "Show or hide the controls for an existing worksheet outline: its grouping levels and expand or collapse symbols. This does not create a group. For example, reveal the controls before exploring grouped monthly rows.",
    "Control+Shift+U": "Expand the formula bar to inspect a long formula, then collapse it when finished. This changes the available reading space, not the calculation.",
    "Control+Alt+Shift+F9": "Recheck formula dependencies and perform a full calculation across open workbooks. Use this when checking whether totals are up to date; it does not repair an incorrect formula.",
    "Control+Shift+A": "While editing a formula immediately after its function name, insert its argument placeholders. For example, after typing =SUM, use this as a guide to the values or range the function expects.",
    "Alt+Equals": "Insert an AutoSum formula for a likely nearby range. Check the proposed cells before confirming: a blank row or a different table layout can make the suggested range unsuitable.",
    "F4": "While editing a formula with a cell reference selected, cycle its relative and absolute forms. For example, lock a tax-rate reference so it stays fixed when the formula is copied. Outside this context, F4 can have another purpose."
  };
  for (const entry of excel) {
    if (excelNotes[entry[0]]) entry[2] = excelNotes[entry[0]];
    if (entry[0] === "Control+A" && /Function Arguments/.test(entry[1])) {
      entry[1] = "In a formula after a function name, open Function Arguments.";
      entry[2] = "Place the editing cursor immediately after a function name, such as =SUM. Open its argument dialog to review the inputs. With worksheet focus instead, Control plus A selects cells.";
    }
    if (entry[0] === "Control+End" && /formula bar/.test(entry[1])) entry[2] = "With the text cursor inside the formula bar, move to the end of the formula text. With worksheet focus, this shortcut moves to the last used cell instead. Check your focus before using it.";
    if (entry[0] === "Control+Shift+End" && /formula bar/.test(entry[1])) entry[2] = "While editing in the formula bar, highlight from the cursor to the end of its text. Use this before replacing the end of a formula. With worksheet focus, it selects cells instead.";
  }
  const presentations = courses["Presentations"];
  const presentationNotes = {
    "Control+G": "With multiple objects selected on the slide, group them so they can be moved or resized together. For example, keep a diagram’s label and arrow together. This does not combine separate slides.",
    "Control+Shift+G": "With a group selected on the slide, separate it into individual objects. Use this before adjusting one label without moving the rest of the diagram.",
    "Control+Shift+J": "Regroup objects that were previously ungrouped. Select an object from that former group first; this restores that grouping rather than grouping unrelated objects.",
    "Alt+Right Arrow": "With an object selected, rotate it clockwise by 15 degrees. Use small steps to adjust an arrow’s direction; this rotates the object rather than moving text focus.",
    "Alt+Left Arrow": "With an object selected, rotate it counterclockwise by 15 degrees. Check the resulting direction before making another adjustment.",
    "Alt+F10": "Open the Selection pane to inspect the slide’s objects by name. Use F6 as needed to reach the pane, then navigate its list. This is useful when overlapping objects are difficult to select on the slide.",
    "Control+Space then C": "With focus in a task pane, open its pane menu and choose Close. This closes that pane rather than the presentation. In slide text, Control plus Space can instead clear character formatting.",
    "Alt+H then L": "Open layout choices for the selected slide. Choose an arrangement that fits the content, such as a title and two content areas, then review where the placeholders are placed.",
    "Alt+W then P then N": "Show or hide the Notes pane in Normal view. Use it to prepare speaker reminders that are separate from the slide’s visible text.",
    "Alt+N then X": "Begin inserting a text box. You still need to place the box and enter its text. Use a text box for an extra label, and review its reading order afterward.",
    "Alt+N then P then D": "Open the picture picker for a file on your device. Choose a suitable image, then review its size, placement and text alternative on the slide.",
    "Control+Shift+C": "Copy the selected text or object’s formatting. Then select the destination before pasting that appearance; the copied style is separate from the object’s content.",
    "Control+Shift+V": "Apply the formatting you previously copied to the selected text or object. For example, make two callout boxes consistent without replacing their different labels."
  };
  for (const entry of presentations) {
    if (presentationNotes[entry[0]]) entry[2] = presentationNotes[entry[0]];
    if (entry[1] === "Expand a focused group." || entry[1] === "Collapse a focused group.") {
      const expand = entry[1].startsWith("Expand");
      // The main-row + / - were incorrectly substituted for numeric-keypad keys.
      // Microsoft also documents these arrow alternatives, usable on laptops.
      entry[0] = expand ? "Right Arrow" : "Left Arrow";
      entry[1] = "In the Selection pane, " + (expand ? "expand" : "collapse") + " a focused group.";
      entry[2] = expand ? "With a collapsed group focused in the Selection pane, reveal its members with Right Arrow. This lets you inspect objects inside the group without ungrouping them." : "With an expanded group focused in the Selection pane, hide its members from the list with Left Arrow. The objects remain on the slide and stay grouped.";
      entry[4] = {...entry[4], steps:[entry[0]]};
    }
    if (entry[0] === "Alt+Shift+1") entry[2] = /Outline/.test(entry[1])
      ? "In Outline view, reduce the outline to slide-level headings so you can review the presentation’s structure. Slide content is not deleted. In the Selection pane, the same keys collapse object groups."
      : "In the Selection pane’s object list, collapse all groups to simplify the list. This keeps the objects grouped and visible on the slide. In Outline view, these keys have a different purpose.";
  }
  // Remove only repeated actions reviewed as identical, never context-dependent arrow commands.
  const sameAction = {
    "Microsoft Word and documents": new Set(["Control+B", "Control+I", "Control+U"]),
    "Microsoft Excel and spreadsheets": new Set(["Alt+M"]),
    "Presentations": new Set(["Control+Shift+Tab"]),
    "Mac VoiceOver basics": new Set(["VO+K", "VO+Q", "Shift+VO+Q", "VO+P", "VO+L", "VO+S", "VO+W", "VO+C"])
  };
  for (const [name, keys] of Object.entries(sameAction)) {
    const seen = new Set();
    courses[name] = courses[name].filter(entry => {
      if (!keys.has(entry[0])) return true;
      if (seen.has(entry[0])) return false;
      seen.add(entry[0]); return true;
    });
  }
  const mac = courses["Mac VoiceOver basics"];
  const malformed = mac.find(entry => entry[0] === "Shift+VO+H");
  if (malformed) malformed[1] = "Read the help tag for the current item.";
  // Legacy links remain useful focused practice. The main topic still contains the full course.
  const copy = entry => [entry[0], entry[1], entry[2], entry[3], {...entry[4]}];
  const editingKeys = new Set(["Control+X", "Control+C", "Control+V", "Control+A", "Control+Z", "Control+Y", "Control+Shift+V", "Control+B", "Control+I", "Control+U", "Control+[", "Control+]", "Control+E", "Control+L", "Control+R", "Control+Alt+C", "Control+Alt+V"]);
  courses["General editing"] = courses["Microsoft Word and documents"].filter(e => editingKeys.has(e[0])).map(copy);
  const textKeys = new Set(["VO+P", "VO+L", "VO+S", "VO+W", "VO+C", "VO+V", "VO+T", "VO+Fn+F8", "VO+Delete", "VO+Fn+F3", "Shift+VO+A", "VO+Enter"]);
  courses["Mac VoiceOver reading and settings"] = mac.filter(e => textKeys.has(e[0]) || /paragraph|sentence|text-commands/.test(e[1] + ' ' + e[4].source)).map(copy);
  const reading = new Set(courses["Mac VoiceOver reading and settings"].map(e => e[1]));
  courses["Mac VoiceOver navigation and web"] = mac.filter(e => !reading.has(e[1])).map(copy);
  for (const name of ["General editing", "Mac VoiceOver reading and settings", "Mac VoiceOver navigation and web"]) {
    courses[name].forEach((e, i, all) => e[4].level = i < Math.ceil(all.length / 3) ? "basic" : i < Math.ceil(all.length * 2 / 3) ? "intermediate" : "advanced");
  }
  window.CommandPracticeCourseNotes["General editing"] = "A focused editing course for Microsoft Word on Windows: selecting, moving, formatting and reusing text. The Microsoft Word topic includes the full application course.";
  window.CommandPracticeCourseNotes["Mac VoiceOver reading and settings"] = "Focused VoiceOver text review and reading settings on Mac. The main VoiceOver topic retains the complete course.";
  window.CommandPracticeCourseNotes["Mac VoiceOver navigation and web"] = "Focused VoiceOver navigation, interaction and interface exploration on Mac. The main VoiceOver topic retains the complete course.";
})();
