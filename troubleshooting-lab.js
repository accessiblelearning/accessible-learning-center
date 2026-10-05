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
        { command: "TITLE", prompt: "Identify the active window before making changes.", hint: "Ask your screen reader for the window title.", success: "Window title: Downloads — File Explorer. You are not in the report.", why: "You identified the active window without changing it." },
        { command: "ALT+TAB", prompt: "Return to the Microsoft Word report.", hint: "Use Alt plus Tab to switch back to the report.", success: "Quarterly Report — Microsoft Word. Editing area.", why: "You returned to the document after confirming where focus was." },
        { command: "CTRL+S", prompt: "Save the report now that you are back in Microsoft Word.", hint: "Press Control plus S to save.", success: "Document saved.", why: "You protected the report after safely returning to it." }
      ],
      hint: "Begin by asking the screen reader to announce the active window title."
    },
    {
      category: "Google applications", title: "Letters navigate instead of typing",
      problem: "On a web form, pressing H moves to a heading instead of typing. Locate the edit field and enter interaction mode without using the mouse.",
      steps: [
        { command: "E", prompt: "Locate the email address edit field.", hint: "Press E to find the next edit field.", success: "Email address, edit box.", why: "Browse-mode edit-field navigation located the intended field." },
        { command: "ENTER", prompt: "Enter interaction mode in the email address field.", hint: "Press Enter on the edit field.", success: "Forms mode on. Email address, edit.", why: "Enter placed the screen reader in the field’s interaction mode." }
      ],
      hint: "Use a screen-reader navigation key to find the next edit field before changing modes."
    },
    {
      category: "Email and calendar", title: "Protect the unsent Outlook message",
      problem: "An Outlook message contains important unsent work. You need to protect the draft before leaving the message.",
      steps: [
        { command: "CTRL+S", prompt: "Save the unsent Outlook draft.", hint: "Press Control plus S to save the draft.", success: "Draft saved.", why: "You saved the message before attempting to leave it." },
        { command: "ALT+F4", prompt: "Close the saved message and return to the Outlook Inbox.", hint: "Use Alt plus F4 to close the saved message.", success: "Inbox — Outlook. Draft retained.", why: "You closed the protected message and returned to the Inbox." }
      ],
      hint: "Protect the draft before trying to leave the message."
    },
    {
      category: "Microsoft applications", title: "The risky Word edit",
      problem: "A large block of text disappeared in Microsoft Word. Do not retype it. Recover the edit and save the corrected document.",
      steps: [
        { command: "CTRL+Z", prompt: "Recover the missing text in Microsoft Word.", hint: "Press Control plus Z to undo the last edit.", success: "Undo. Selected text restored.", why: "Undo reversed the most recent destructive edit." },
        { command: "CTRL+S", prompt: "The text is restored. Now save the corrected document.", hint: "Press Control plus S to save the corrected document.", success: "Document saved.", why: "You saved immediately after verifying the recovery." }
      ],
      hint: "Use the standard command that reverses the most recent action."
    },
    {
      category: "Cloud storage", title: "Move without losing the original",
      problem: "A practice file is selected in a synchronized OneDrive folder. The original must remain where it is while you place a copy in the open destination folder.",
      steps: [
        { command: "CTRL+C", prompt: "Copy the selected file, keeping the original in place.", hint: "Press Control plus C to copy.", success: "Copied: Interview Notes.docx. The simulator now places focus in the destination folder; Copy alone does not switch folders.", why: "Copy preserves the original; Cut would move it." },
        { command: "CTRL+V", prompt: "Paste the copied file into the open destination folder.", hint: "Press Control plus V to paste.", success: "Pasted: Interview Notes.docx. Synchronization pending.", why: "You created one copy in the verified destination." }
      ],
      hint: "Choose the clipboard command that preserves the original file."
    },
    {
      category: "Online meetings", title: "The live microphone",
      problem: "You are in a Zoom meeting and hear private conversation nearby. Mute immediately, then open the participant list to confirm who is present.",
      steps: [
        { command: "ALT+A", prompt: "Mute your Zoom microphone.", hint: "Use Alt plus A to mute.", success: "Audio muted.", why: "You used Zoom’s microphone command immediately." },
        { command: "ALT+U", prompt: "Open the Zoom participant list to check who is present.", hint: "Use Alt plus U to open the participant list.", success: "Participants panel. Twelve participants.", why: "You opened the participant list after protecting the microphone." }
      ],
      hint: "Use Zoom’s Windows command for mute before inspecting anything else."
    },
    {
      category: "Privacy and cybersecurity", title: "The suspicious pop-up",
      problem: "A pop-up says your computer is infected and tells you to press Enter to call support. Close only the suspicious window without activating its button.",
      steps: [
        { command: "ALT+F4", prompt: "Close the suspicious pop-up without activating its button.", hint: "Use Alt plus F4 to close the active window.", success: "Suspicious pop-up closed. Browser remains open.", why: "You closed the active pop-up without activating its fraudulent control." }
      ],
      hint: "Do not press Enter. Use the command that closes the active window."
    },
    {
      category: "Files and folders", title: "Rename the correct file",
      problem: "Resume Final Copy.docx is selected in File Explorer. Start renaming it without opening it, then confirm the supplied name Professional Resume.docx.",
      steps: [
        { command: "F2", prompt: "Begin renaming the selected file without opening it.", hint: "Press F2 to start renaming.", success: "Resume Final Copy, filename edit. The name is selected and the .docx extension remains protected.", why: "F2 opened rename mode without opening the file." },
        { command: "ENTER", prompt: "Confirm the supplied name Professional Resume.docx.", hint: "Press Enter to confirm the supplied name.", success: "Renamed: Professional Resume.docx.", why: "The simulator supplied the practice name and Enter confirmed it." }
      ],
      hint: "Use File Explorer’s rename command on the selected file."
    }
,
{
    "category": "Thunderbird",
    "title": "Protect a Thunderbird draft",
    "problem": "You are in the Thunderbird composition window with an unfinished message. Save the draft, then open the file picker to attach a practice document. This simulation does not send mail. For the attachment command, press and release Control, then press A by itself.",
    "hint": "Save with Control plus S, then use the composition attachment command.",
    "steps": [
        {
            "command": "CTRL+S",
            "prompt": "Save the unfinished Thunderbird draft.",
            "hint": "Press Control plus S to save the draft.",
            "success": "Practice draft saved. The composition window remains active.",
            "why": "Saving protects the unfinished message without sending it."
        },
        {
            "command": "CTRL+SHIFT+A",
            "prompt": "Open the attachment file picker for the saved Thunderbird draft.",
            "hint": "In this protected practice, press and release Control, then press A by itself. This simulates Control plus Shift plus A.",
            "success": "Simulated attachment file picker opened.",
            "why": "You reached the attachment action from the composition window, where this shortcut applies."
        }
    ]
},
{
    "category": "Firefox",
    "title": "Recover a closed Firefox article",
    "problem": "You accidentally closed an article tab in Firefox. Reopen the tab, then bookmark it so you can return later. Use protected practice here: press and release Control, then T to simulate reopening; press and release Control, then D to simulate bookmarking. Do not hold the real browser shortcuts in this exercise.",
    "hint": "The real commands are Control plus Shift plus T, then Control plus D. Here, release Control before pressing T or D by itself.",
    "steps": [
        {
            "command": "CTRL+SHIFT+T",
            "prompt": "Reopen the accidentally closed Firefox article tab.",
            "hint": "In this protected practice, press and release Control, then press T by itself. This simulates Control plus Shift plus T.",
            "success": "Simulated article reopened. The title matches your reading task.",
            "why": "You recovered the closed page instead of starting another search."
        },
        {
            "command": "CTRL+D",
            "prompt": "Bookmark the recovered Firefox article.",
            "hint": "In this protected practice, press and release Control, then press D by itself. This simulates Control plus D.",
            "success": "Simulated bookmark editor opened.",
            "why": "You can now review the bookmark name and location before saving it."
        }
    ]
},
{
    "category": "ZoomText and Fusion Desktop",
    "title": "Regain context while magnified",
    "problem": "Text is too small in a practice document. Increase magnification once, then compare it with the whole screen. Use ZoomText or Fusion Desktop commands. Here, press and release Caps Lock before the final key; real software uses the held combination.",
    "hint": "Caps Lock plus Up Arrow increases zoom. Caps Lock plus Enter compares with 1x. In this simulator release Caps Lock before the final key.",
    "steps": [
        {
            "command": "CAPSLOCK+ARROWUP",
            "prompt": "Increase magnification once in the practice document.",
            "hint": "Press and release Caps Lock, then press Up Arrow.",
            "success": "Simulated magnification increased. The text is larger.",
            "why": "You changed one level before checking readability."
        },
        {
            "command": "CAPSLOCK+ENTER",
            "prompt": "Compare the magnified view with the whole screen.",
            "hint": "Press and release Caps Lock, then press Enter.",
            "success": "Simulated 1x view. The whole window is visible.",
            "why": "You regained surrounding context. In the application, the same toggle returns to your working level."
        }
    ]
},
{
    "category": "Bookshare Reader web",
    "title": "Keep a Bookshare study passage",
    "problem": "A book is open in Bookshare Reader on the web. Mark this passage, then open the bookmarks list to find it again. This is a simulation. For Alt commands, press and release Alt, then the final key.",
    "hint": "Alt plus B adds a bookmark. Alt plus Shift plus B opens the bookmarks list; use the complete combination or the protected Alt sequence.",
    "steps": [
        {
            "command": "ALT+B",
            "prompt": "Bookmark the current Bookshare passage.",
            "hint": "Press and release Alt, then press B.",
            "success": "Simulated bookmark added at the current passage.",
            "why": "A saved marker helps you return deliberately."
        },
        {
            "command": "ALT+SHIFT+B",
            "prompt": "Open the Bookshare bookmarks list to find the saved passage.",
            "hint": "Press and release Alt, then press Shift plus B. This simulates Alt plus Shift plus B.",
            "success": "Simulated bookmarks list opened with your passage listed.",
            "why": "You can verify the saved location instead of assuming the current playback position is a bookmark."
        }
    ]
},
{
    "category": "Learning Ally",
    "title": "Pause before choosing a chapter",
    "problem": "The simulated Learning Ally player is speaking. Its Pause button already has focus. Activate it, then use the focused chapter navigation control. This exercise practices labeled controls, not app-wide shortcuts.",
    "hint": "Press Enter on the focused Pause button. Listen to the new focus description, then press Enter on the chapter control.",
    "steps": [
        {
            "command": "ENTER",
            "prompt": "Activate the focused Pause button in Learning Ally.",
            "hint": "Press Enter on the Pause button.",
            "success": "Narration paused. The simulator now places focus on the chapter navigation button.",
            "why": "Pausing makes spoken control labels easier to hear."
        },
        {
            "command": "ENTER",
            "prompt": "Open the chapter list using the focused chapter navigation button.",
            "hint": "Press Enter on the chapter navigation button.",
            "success": "Simulated chapter list opened. You can now review chapter names.",
            "why": "You activated the identified navigation control instead of guessing an unlabeled shortcut."
        }
    ]
}
  ];
  // Append only: numeric IDs 0–12 remain compatible with saved progress.
  missions.push(...[
  {
    "category": "Google Chrome",
    "title": "Recover and keep a Chrome resource",
    "problem": "In Chrome on Windows, a useful training tab was accidentally closed. Reopen it, then bookmark it. Protected practice: release Control before pressing T or D by itself; do not run the real browser shortcuts here.",
    "hint": "Press and release Control, then T. This simulates Control plus Shift plus T.",
    "source": "https://support.google.com/chrome/answer/157179?hl=en",
    "steps": [
      {
        "command": "CTRL+SHIFT+T",
        "prompt": "Recover the closed training tab.",
        "hint": "Press and release Control, then T. This simulates Control plus Shift plus T.",
        "success": "Training resource reopened. Focus is on the recovered page.",
        "why": "The most recently closed tab is available again."
      },
      {
        "command": "CTRL+D",
        "prompt": "Bookmark the recovered training resource.",
        "hint": "Press and release Control, then D. This simulates Control plus D.",
        "success": "Bookmark dialog opened for the recovered resource.",
        "why": "In Chrome, review the name and folder before confirming the bookmark. This mission ends at the dialog."
      }
    ]
  },
  {
    "category": "Microsoft Excel",
    "title": "Repair a worksheet total",
    "problem": "In Excel for Windows, cell B4 has the incorrect formula =SUM(B1:B2). Start editing that cell, confirm the supplied correction =SUM(B1:B3), then save. The simulator supplies the corrected formula; you are practicing edit, confirm, and save.",
    "hint": "Press F2 to edit the active cell.",
    "source": "https://support.microsoft.com/en-us/accessibility/excel/keyboard-shortcuts-in-excel",
    "steps": [
      {
        "command": "F2",
        "prompt": "Start editing the selected total cell B4.",
        "hint": "Press F2 to edit the active cell.",
        "success": "Editing B4. The simulator supplies =SUM(B1:B3).",
        "why": "The formula is being edited in the selected cell."
      },
      {
        "command": "ENTER",
        "prompt": "Confirm the supplied formula =SUM(B1:B3).",
        "hint": "Press Enter to finish the cell entry.",
        "success": "Formula accepted. In this simulation, selection moves to B5.",
        "why": "The corrected total includes all three rows."
      },
      {
        "command": "CTRL+S",
        "prompt": "Save the corrected workbook.",
        "hint": "Press Control plus S.",
        "success": "Workbook saved.",
        "why": "The worksheet correction is now saved."
      }
    ]
  },
  {
    "category": "Microsoft PowerPoint",
    "title": "Recover from an extra slide",
    "problem": "In PowerPoint for Windows, slide 2 is selected in the thumbnail pane. Practice adding a slide, undoing that unwanted addition, then saving the restored presentation.",
    "hint": "Press Control plus M.",
    "source": "https://support.microsoft.com/en-us/accessibility/powerpoint/use-keyboard-shortcuts-to-create-powerpoint-presentations",
    "steps": [
      {
        "command": "CTRL+M",
        "prompt": "Add a slide after slide 2.",
        "hint": "Press Control plus M.",
        "success": "New slide 3 added and selected in the simulated thumbnail pane.",
        "why": "A new slide follows the selected slide."
      },
      {
        "command": "CTRL+Z",
        "prompt": "Remove the accidental addition using Undo.",
        "hint": "Press Control plus Z.",
        "success": "The extra slide is removed. Slide 2 is selected again.",
        "why": "Undo reverses the most recent change."
      },
      {
        "command": "CTRL+S",
        "prompt": "Save the restored presentation.",
        "hint": "Press Control plus S.",
        "success": "Presentation saved.",
        "why": "The original slide sequence is preserved."
      }
    ]
  },
  {
    "category": "Mac VoiceOver",
    "title": "Find the app menu on a Mac",
    "problem": "Practice navigating the Mac menu bar with VoiceOver. Here, press M, Right Arrow, and Space by themselves to simulate the VO commands, so your real screen reader can stay running. VO normally means Control and Option held together, or your configured VoiceOver modifier.",
    "hint": "The real command is VO plus M. Press M alone here.",
    "source": "https://support.apple.com/en-ca/guide/voiceover/mchlp2748/mac",
    "steps": [
      {
        "command": "VO+M",
        "prompt": "Move to the menu bar. Press M by itself in this simulator.",
        "hint": "The real command is VO plus M. Press M alone here.",
        "success": "Simulated menu bar: Apple menu.",
        "why": "VoiceOver has moved from the application into the menu bar."
      },
      {
        "command": "VO+ARROWRIGHT",
        "prompt": "Move to the app menu. Press Right Arrow alone here.",
        "hint": "The real command is VO plus Right Arrow.",
        "success": "Simulated menu bar: TextEdit menu.",
        "why": "You moved to the next menu without opening it."
      },
      {
        "command": "VO+SPACE",
        "prompt": "Open the TextEdit menu. Press Space alone here.",
        "hint": "The real command is VO plus Space.",
        "success": "Simulated TextEdit menu opened. About TextEdit is the first item.",
        "why": "The menu is open. In real VoiceOver, navigate its items before activating one."
      }
    ]
  },
  {
    "category": "Braille displays",
    "title": "Read beyond a Focus display width",
    "problem": "This models a Focus 40 Blue, fifth generation, with JAWS and default panning assignments. The first 40 simulated cells read: Please bring your braille display to the. The line continues. Right and Left Arrow on your computer are simulator substitutes for the hardware panning buttons, not real display shortcuts.",
    "hint": "On the Focus, use the right panning button. Use Right Arrow only for this simulation.",
    "source": "https://www.freedomscientific.com/Content/Documents/Manuals/Focus/Focus-Blue-Online-Users-Guide.htm",
    "steps": [
      {
        "command": "ARROWRIGHT",
        "prompt": "Read the continuation. Press Right Arrow here to simulate the right panning button.",
        "hint": "On the Focus, use the right panning button. Use Right Arrow only for this simulation.",
        "success": "The simulated display now reads: lesson on Friday at ten.",
        "why": "Panning changes the displayed portion without editing the document."
      },
      {
        "command": "ARROWLEFT",
        "prompt": "Return to the earlier portion. Press Left Arrow here to simulate the left panning button.",
        "hint": "On the Focus, use the left panning button. Use Left Arrow only here.",
        "success": "The display returns to: Please bring your braille display to the.",
        "why": "You returned to the earlier text. Custom JAWS button assignments can differ."
      }
    ]
  }
]);
  // Append only: the numeric identifiers above are stored in existing progress.
  missions.push({
    category: "Microsoft Excel",
    title: "Keep a fixed total instead of a formula",
    problem: "Excel for Windows, English dialogs. B4 contains a formula totaling 60. An ordinary paste into C4 copied that formula, so C4 now calculates from the wrong column. C4 is selected. Undo that paste, copy B4 again, and use Paste Special to keep the value 60 in C4. Finish by saving. This is a simulation; the cells and Clipboard described here are fictional.",
    source: "https://support.microsoft.com/en-us/accessibility/excel/keyboard-shortcuts-in-excel",
    steps: [
      {command:"CTRL+Z",prompt:"C4 is selected with the unwanted formula. Undo the last paste.",hint:"Press Control plus Z.",success:"The paste is undone. C4 is blank and still selected.",why:"Undo removes the recent paste while leaving the source total in B4.",recovery:"C4 still contains the unwanted formula. Undo the paste before copying again."},
      {command:"ARROWLEFT",prompt:"C4 is blank. Move left to the source total in B4.",hint:"Press Left Arrow once.",success:"Worksheet focus: B4, value 60, formula =SUM(B1:B3).",why:"You selected the source cell without changing it.",recovery:"C4 is still selected. Move one cell left to B4."},
      {command:"CTRL+C",prompt:"B4, total 60, is selected. Copy this source cell.",hint:"Press Control plus C.",success:"B4 copied. Worksheet focus remains on B4.",why:"Copy makes the source available for pasting; it does not move the selection.",recovery:"B4 is still selected. Copy it before moving to the destination."},
      {command:"ARROWRIGHT",prompt:"B4 is copied. Move right to the blank destination C4.",hint:"Press Right Arrow once.",success:"Worksheet focus: C4, blank. B4 remains the copied source.",why:"You moved to the destination separately from copying.",recovery:"Focus remains on B4. Move right to C4 before pasting."},
      {command:"CTRL+ALT+V",prompt:"C4 is selected. Open Paste Special. Here, press V alone to simulate Control plus Alt plus V.",hint:"The real command is Control plus Alt plus V. Press V alone here.",success:"Simulated focus: Paste Special dialog. All is selected; nothing has been pasted yet.",why:"This dialog lets you choose which part of a copied cell to keep.",recovery:"C4 is still blank. Open Paste Special to choose values instead of the formula."},
      {command:"V",prompt:"Paste Special is open. Choose Values.",hint:"Press V inside this simulated English Paste Special dialog.",success:"Values selected. Focus remains in Paste Special; confirmation is still needed.",why:"Values keeps the result 60 rather than the formula that calculated it.",recovery:"Paste Special remains open. Choose Values with V; do not confirm All."},
      {command:"ENTER",prompt:"Values is selected in Paste Special. Confirm the paste.",hint:"Press Enter.",success:"Dialog closed. Worksheet focus: C4, value 60, no formula.",why:"C4 now holds a fixed snapshot even if B4 changes later.",recovery:"Values is selected but has not been pasted. Confirm with Enter."},
      {command:"CTRL+S",prompt:"C4 holds the fixed total 60. Save the workbook.",hint:"Press Control plus S.",success:"Workbook saved with 60 in C4.",why:"You recovered from the wrong paste, chose values and saved the result.",recovery:"The value is correct in C4 but the workbook is not saved yet."}
    ]
  }, {
    category: "Microsoft PowerPoint",
    title: "Uncover a title with the Selection pane",
    problem: "PowerPoint for Windows. A decorative rectangle is covering the slide title. The title is immediately behind the rectangle. Open the Selection pane, focus its object list, select the title, bring it forward one position, then save. This simulation supplies a fixed object list and focus order; in PowerPoint, use F6 as often as needed to reach the pane.",
    source: "https://support.microsoft.com/en-us/accessibility/powerpoint/use-keyboard-shortcuts-to-create-powerpoint-presentations",
    steps: [
      {command:"ALT+F10",prompt:"The title is covered. Open the Selection pane. Here, press and release Alt, then F10.",hint:"Normally hold Alt and press F10. Here, release Alt before F10.",success:"Selection pane opened. In this simulation, focus is still on the slide.",why:"Opening a pane and placing focus in its list are separate actions.",recovery:"The title remains covered and the Selection pane is closed. Open the pane first."},
      {command:"F6",prompt:"The Selection pane is open. Move focus into its object list.",hint:"Press F6. This simulation uses one step; the number can vary in PowerPoint.",success:"Simulated focus: Selection pane, Cover rectangle, item 1 of 3. Title is next.",why:"The object list lets you reach an item hidden behind another object.",recovery:"Focus remains on the slide. Use F6 to reach the Selection pane."},
      {command:"ARROWDOWN",prompt:"Cover rectangle is focused in the object list. Move down to Title.",hint:"Press Down Arrow once.",success:"Selection pane focus: Title, item 2 of 3. It is not selected yet.",why:"Moving list focus lets you inspect an object before selecting it.",recovery:"Cover rectangle remains focused. Move down to Title before selecting."},
      {command:"SPACE",prompt:"Title is focused in the Selection pane. Select it.",hint:"Press Space to select the focused title object.",success:"Title selected. Focus stays in the Selection pane.",why:"The selected title can now be moved within the slide’s stacking order.",recovery:"Title has focus but is not selected. Select it with Space."},
      {command:"CTRL+SHIFT+F",prompt:"Title is selected in the Selection pane. Bring it forward one position. Press F alone here.",hint:"Normally press Control plus Shift plus F in the Selection pane. Press F alone in this simulator.",success:"Title moved in front of Cover rectangle. The title is now visible; Selection pane focus stays on Title.",why:"This changes object stacking, not the words or font of the title.",recovery:"Title is still behind the rectangle. Use the Selection pane’s bring-forward command."},
      {command:"CTRL+S",prompt:"The title is visible in front of the rectangle. Save the presentation.",hint:"Press Control plus S.",success:"Presentation saved with the title visible.",why:"You used the object list to select an obscured object and correct its stacking order.",recovery:"The title is visible, but the presentation is not saved yet."}
    ]
  });
  // Append only: saved mission numbers are permanent identifiers.
  missions.push(...[
  {
    "category": "Google Chrome",
    "title": "Recover the right Find result and copy its address",
    "problem": "Chrome on Windows. The Find bar already contains class and is at match 3 of 3 in a training article. The date you need is at match 2. Return to that match, leave the Find bar for the page, and copy the page address for your notes. This fixed simulation supplies the search text and results. Press the final key alone for Control commands here; do not run real browser shortcuts.",
    "source": "https://support.google.com/chrome/answer/157179?hl=en",
    "steps": [
      {
        "command": "CTRL+SHIFT+G",
        "prompt": "Find bar: class, match 3 of 3. Return to the previous match. Press G alone here.",
        "hint": "Normally Control plus Shift plus G. Press G alone in this simulator.",
        "success": "Find bar: class, match 2 of 3. The article says: The class starts October 12.",
        "why": "Previous match lets you recover from passing the result you need.",
        "recovery": "The search is still at match 3. Choose the previous match, not the next one."
      },
      {
        "command": "CTRL+F6",
        "prompt": "Match 2 gives the class date. Move from the Find bar to the web contents. Press F6 alone here.",
        "hint": "Normally Control plus F6 skips to web contents. Press F6 alone here.",
        "success": "Simulated focus: article content at the matching class date.",
        "why": "The Find bar and the article are different focus regions.",
        "recovery": "The Find bar still has focus. Move to web contents before continuing."
      },
      {
        "command": "CTRL+L",
        "prompt": "The article has focus. Select its address bar to copy the source address. Press L alone here.",
        "hint": "Normally Control plus L. Press L alone here.",
        "success": "Address bar focused; the complete page address is selected.",
        "why": "Selecting the address prepares the source link for copying.",
        "recovery": "Article content still has focus. Select the address bar first."
      },
      {
        "command": "CTRL+C",
        "prompt": "The full page address is selected. Copy it. Press C alone here.",
        "hint": "Normally Control plus C. Press C alone here.",
        "success": "The simulated Clipboard contains the article address. Address bar focus is unchanged.",
        "why": "You copied a link to the article, not the text of the matching sentence.",
        "recovery": "The address is selected but has not been copied yet."
      },
      {
        "command": "CTRL+F6",
        "prompt": "The source address is copied. Return to the article. Press F6 alone here.",
        "hint": "Normally Control plus F6. Press F6 alone here.",
        "success": "Simulated focus: article content. The source address remains copied.",
        "why": "You recovered the date and prepared its source for your notes. No real Clipboard content changed.",
        "recovery": "The address bar still has focus. Return to web contents to finish."
      }
    ]
  },
  {
    "category": "Mac VoiceOver",
    "title": "Leave a group to reach Save",
    "problem": "A simulated Mac lesson-player settings window has a Playback group followed by Save. VoiceOver starts on the group. Turn on Repeat inside it, then leave the group and save. This models standard group interaction with Quick Nav off; apps and interaction settings can differ. VO means your VoiceOver modifier. Use plain arrow keys and Space here instead of real VO chords.",
    "source": "https://support.apple.com/guide/voiceover/interaction-commands-cpvokys07/mac",
    "steps": [
      {
        "command": "VO+SHIFT+ARROWDOWN",
        "prompt": "VoiceOver cursor: Playback group. Begin interacting. Press Down Arrow alone here.",
        "hint": "Normally VO plus Shift plus Down Arrow. Use Down Arrow alone in this simulation.",
        "success": "Inside Playback. VoiceOver cursor: Play button. Repeat checkbox is next.",
        "why": "Interacting gives access to controls inside this group.",
        "recovery": "The cursor remains on the Playback group. Begin interacting before looking for Repeat."
      },
      {
        "command": "VO+ARROWRIGHT",
        "prompt": "Inside Playback, Play is focused. Move to Repeat. Press Right Arrow alone here.",
        "hint": "Normally VO plus Right Arrow. Use Right Arrow alone here.",
        "success": "VoiceOver cursor: Repeat checkbox, unchecked.",
        "why": "Moving to a control does not change its setting.",
        "recovery": "Play is still focused. Move right to Repeat before activating a control."
      },
      {
        "command": "VO+SPACE",
        "prompt": "Repeat is unchecked. Turn it on. Press Space alone here.",
        "hint": "Normally VO plus Space activates the current item. Use Space alone here.",
        "success": "Repeat checked. VoiceOver cursor stays on Repeat inside Playback.",
        "why": "Activation changed the checkbox; it did not leave the group.",
        "recovery": "Repeat is still unchecked. Activate it before leaving Playback."
      },
      {
        "command": "VO+SHIFT+ARROWUP",
        "prompt": "Repeat is checked. Stop interacting with Playback to reach the outer controls. Press Up Arrow alone here.",
        "hint": "Normally VO plus Shift plus Up Arrow. Use Up Arrow alone here.",
        "success": "VoiceOver cursor: Playback group at the outer window level.",
        "why": "Leaving the group makes the following Save button reachable in this modeled window.",
        "recovery": "You are still inside Playback. Stop interacting before moving to Save."
      },
      {
        "command": "VO+ARROWRIGHT",
        "prompt": "At the outer level, Playback is focused. Move to Save. Press Right Arrow alone here.",
        "hint": "Normally VO plus Right Arrow. Use Right Arrow alone here.",
        "success": "VoiceOver cursor: Save button. The Repeat change is not saved yet.",
        "why": "Focus on Save is separate from activating Save.",
        "recovery": "Playback is still focused at the outer level. Move right to Save."
      },
      {
        "command": "VO+SPACE",
        "prompt": "Save has focus. Save the Repeat setting. Press Space alone here.",
        "hint": "Normally VO plus Space. Use Space alone here.",
        "success": "Simulated settings saved. Repeat is on.",
        "why": "You entered a group, changed a control, left the group and saved. No Mac setting changed.",
        "recovery": "Save remains focused; activate it to finish."
      }
    ]
  },
  {
    "category": "Braille displays",
    "title": "Check a Focus word before correcting it",
    "problem": "Focus 40 Blue, fifth generation, with JAWS, uncontracted output and Braille Study Mode off. A simulated text editor contains cot but should say cat. Display cells 1, 2 and 3 show c, o and t. Check cell 2 and its word, route the cursor there, correct the letter, then save. C, W and R below are simulator substitutes for hardware controls, not Focus keyboard shortcuts.",
    "source": "https://www.freedomscientific.com/Content/Documents/Manuals/Focus/Focus-Blue-Online-Users-Guide.htm",
    "steps": [
      {
        "command": "FOCUS_CHARACTER",
        "prompt": "Display cell 2 is o. Ask JAWS to identify that cell. Press C here.",
        "hint": "On Focus, press either NAV Mode button with the Cursor Router above cell 2. Press C only in this simulator.",
        "success": "Simulated JAWS response: o. The editing cursor has not moved.",
        "why": "A character check helps identify a cell without changing the text.",
        "recovery": "Cell 2 is still waiting for a character check. Use the NAV Mode and router combination; C simulates it.",
        "inputKey": "C"
      },
      {
        "command": "FOCUS_WORD",
        "prompt": "JAWS identified o. Ask it to read and spell the word at that cell. Press W here.",
        "hint": "On Focus, press either Selector button with that Cursor Router. Press W only here.",
        "success": "Simulated JAWS response: cot, c o t. The text is unchanged.",
        "why": "The word check confirms the context before making a correction.",
        "recovery": "The word has not been checked. Use Selector with the router; W simulates it.",
        "inputKey": "W"
      },
      {
        "command": "FOCUS_ROUTE",
        "prompt": "The word is cot. Route the editing cursor to o in cell 2. Press R here.",
        "hint": "With Study Mode off in this text editor, press the Cursor Router above cell 2 by itself. Press R only here.",
        "success": "Editing cursor: immediately before o in cot.",
        "why": "Routing positions the cursor; it does not replace the character.",
        "recovery": "The editing cursor has not been routed. Press the router by itself; R simulates it.",
        "inputKey": "R"
      },
      {
        "command": "DELETE",
        "prompt": "The cursor is before o. Remove this wrong letter with the computer Delete key.",
        "hint": "Press Delete, not Backspace. Delete removes the character after the cursor.",
        "success": "Simulated text: ct. Cursor is between c and t.",
        "why": "Delete removed the wrong letter; Backspace at the earlier position would target c.",
        "recovery": "The text is still cot with the cursor before o. Use Delete to remove o."
      },
      {
        "command": "A",
        "prompt": "The text is ct with the cursor between c and t. Type a on the computer keyboard.",
        "hint": "Press the letter A without Shift. This step uses the computer keyboard, not Braille input.",
        "success": "Simulated text: cat. Cursor is after a.",
        "why": "The replacement letter completes the intended word.",
        "recovery": "The text is still ct. Insert a between c and t."
      },
      {
        "command": "CTRL+S",
        "prompt": "The word is now cat. Save the simulated document.",
        "hint": "Press Control plus S, or S alone here.",
        "success": "Simulated document saved with cat.",
        "why": "You checked the cell and word, routed, corrected and saved. No real document or display changed.",
        "recovery": "The word is corrected but the document has not been saved."
      }
    ]
  }
]);
  window.MissionControlMissionCount = missions.length;

  const perspective = document.getElementById("atPerspective");
  const missionSelect = document.getElementById("missionSelect");
  const missionControl = document.getElementById("missionControlStation");
  const title = document.getElementById("missionTitle");
  const category = document.getElementById("missionCategory");
  const problem = document.getElementById("missionProblem");
  const transcript = document.getElementById("transcript");
  const lastCommand = document.getElementById("lastCommand");
  const log = document.getElementById("missionLog");
  const nextButton = document.getElementById("nextMission");
  const retryResultButton = document.getElementById("retryMissionResult");
  const missionResults = document.getElementById("missionResults");
  const missionResultsSummary = document.getElementById("missionResultsSummary");
  const missionMasteredList = document.getElementById("missionMasteredList");
  const missionReviewList = document.getElementById("missionReviewList");
  const missionCompletedCount = document.getElementById("missionCompletedCount");
  const missionAttemptResult = document.getElementById("missionAttemptResult");
  const missionCompletedResult = document.getElementById("missionCompletedResult");
  const missionReviewResult = document.getElementById("missionReviewResult");
  const missionSuggestedReview = document.getElementById("missionSuggestedReview");
  const missionBriefing = document.querySelector(".mission-briefing");
  const missionResponse = document.querySelector(".mission-response");
  const missionShortcuts = document.querySelector(".practice-session-shortcuts");
  const missionLogPanel = document.querySelector(".mission-log-panel");
  const progress = document.getElementById("missionProgress");
  const count = document.getElementById("missionCount");
  const simulatedVoice = document.getElementById("simulatedVoice");
  const focusedMissionSession = document.body.dataset.missionSession === "true";
  let current = 0;
  let step = 0;
  let active = false;
  let completed = new Set();
  let missionAttempts = 0;
  let missionCommandsToReview = new Map();
  let audioContext = null;
  const soundFeedbackEnabled = new URLSearchParams(window.location.search).get("sounds") !== "0";

  const missionReviewLinks = {
    "Google Chrome": ["chrome-manual.html", "Review Chrome"],
    "Microsoft Excel": ["excel-manual.html", "Review Excel"],
    "Microsoft PowerPoint": ["powerpoint-manual.html", "Review PowerPoint"],
    "Mac VoiceOver": ["mac-voiceover-manual.html", "Review Mac VoiceOver"],
    "Braille displays": ["focus-manual.html", "Review the Focus display"],
    "Thunderbird": ["thunderbird-manual.html", "Review Thunderbird"],
    "Firefox": ["firefox-manual.html", "Review Firefox"],
    "ZoomText and Fusion Desktop": ["zoomtext-fusion-manual.html", "Review ZoomText and Fusion layouts"],
    "Bookshare Reader web": ["bookshare-manual.html", "Review Bookshare Reader"],
    "Learning Ally": ["learning-ally-manual.html", "Review Learning Ally"],
    "Screen-reader recovery": ["jaws-lesson-2.html", "Review Screen Readers Lesson 2"],
    "Google applications": ["google-services-manual.html", "Review the Google Services Manual"],
    "Email and calendar": ["outlook-manual.html", "Review the Microsoft Outlook Manual"],
    "Microsoft applications": ["word-lesson-2.html", "Review Microsoft Word Lesson 2"],
    "Cloud storage": ["onedrive-manual.html", "Review the OneDrive Manual"],
    "Online meetings": ["online-meetings-manual.html", "Review the Online Meetings Manual"],
    "Privacy and cybersecurity": ["cybersecurity-lesson-2.html", "Review cybersecurity lessons"],
    "Files and folders": ["windows-lesson-4.html", "Review Windows Lesson 4"]
  };

  try {
    const saved = JSON.parse(localStorage.getItem("missionControlCompleted") || "[]");
    completed = new Set(Array.isArray(saved) ? saved.filter(index => Number.isInteger(index) && index >= 0 && index < missions.length) : []);
  } catch (error) {
    completed = new Set();
  }

  function save() {
    try { localStorage.setItem("missionControlCompleted", JSON.stringify([...completed])); } catch (error) {}
  }

  function speak(text) {
    if (!simulatedVoice.checked || !("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;
    stopVoice();
    try { speechSynthesis.speak(new SpeechSynthesisUtterance(text)); } catch (error) {
      window.dispatchEvent(new CustomEvent("missionspeecherror"));
      document.getElementById("transcript").setAttribute("aria-live", "polite");
    }
  }

  function stopVoice() {
    try { window.speechSynthesis?.cancel(); } catch (error) { /* Keep keyboard controls usable. */ }
  }

  function tone(correct) {
    if (!soundFeedbackEnabled) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      audioContext ||= new AudioContextClass();
      if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
      const notes = correct ? [523.25, 659.25] : [180];
      notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const startAt = audioContext.currentTime + index * 0.1;
        oscillator.frequency.value = frequency;
        oscillator.type = correct ? "sine" : "square";
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(correct ? 0.1 : 0.06, startAt + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.18);
        oscillator.connect(gain).connect(audioContext.destination);
        oscillator.start(startAt);
        oscillator.stop(startAt + 0.2);
      });
    } catch (error) {
      // A sound failure must not prevent a learner from completing a step.
      audioContext = null;
    }
  }

  function announce(text, state = "") {
    transcript.textContent = text;
    transcript.className = "scenario-feedback" + (state ? " is-" + state : "");
    missionControl.classList.remove("is-correct", "is-incorrect");
    if (state) missionControl.classList.add("is-" + state);
    speak(transcript.textContent);
  }

  function updateProgress() {
    const total = missions[current].steps.length;
    progress.max = total;
    progress.value = step;
    progress.textContent = step + " of " + total + " steps completed";
    count.textContent = "Step " + Math.min(step + 1, total) + " of " + total;
  }

  function displayedCommand(command) {
    const sr = screenReaders[perspective.value];
    const hardwareLabels = {FOCUS_CHARACTER:"Focus NAV Mode plus Cursor Router", FOCUS_WORD:"Focus Selector plus Cursor Router", FOCUS_ROUTE:"Focus Cursor Router"};
    if (hardwareLabels[command]) return hardwareLabels[command];
    if (command.startsWith("VO+")) {
      const names = {VO:"VoiceOver", SHIFT:"Shift", ARROWRIGHT:"Right Arrow", ARROWLEFT:"Left Arrow", ARROWUP:"Up Arrow", ARROWDOWN:"Down Arrow", SPACE:"Space"};
      return command.split("+").map(key => names[key] || key).join(" plus ");
    }
    if (command.startsWith("CAPSLOCK+")) return command.replace("CAPSLOCK", "Caps Lock").replace("ARROWUP", "Up Arrow").replace("ENTER", "Enter");
    return command === "TITLE" ? sr.title : command === "FOCUS" ? sr.focus : command === "MODE" ? sr.mode : command;
  }

  function finalKeyFor(command) {
    if (command === "TITLE") return "T";
    if (command === "FOCUS") return "TAB";
    if (command === "MODE") return perspective.value === "jaws" ? "Z" : "SPACE";
    return command.includes("+") ? command.split("+").pop() : "";
  }

  function normalizedKey(event) {
    const parts = [];
    if (event.metaKey) parts.push("META");
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
  const protectedControlCommands = new Set(["CTRL+SHIFT+T", "CTRL+D", "CTRL+SHIFT+A"]);
  let altModifierArmed = false;
  let controlModifierArmed = false;
  function resetModifiers() {
    modifierHeld = false;
    altModifierArmed = false;
    controlModifierArmed = false;
  }
  missionControl.addEventListener("blur", resetModifiers);
  window.addEventListener("blur", resetModifiers);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) resetModifiers();
  });
  document.querySelector(".focused-mission").addEventListener("click", event => {
    if (active && !event.target.closest("a, button, input, select, textarea, details, [contenteditable]")) {
      missionControl.focus({ preventScroll: true });
    }
  });
  document.addEventListener("keydown", event => {
    if (!focusedMissionSession || !["Escape", "Esc"].includes(event.key) || event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;
    event.preventDefault();
    stopVoice();
    window.location.replace("topic-missions.html");
  }, true);
  missionControl.addEventListener("keydown", event => {
    if (!active) return;
    const expectedCommand = missions[current].steps[step].command;
    if (event.key === "Tab" && !event.ctrlKey && !event.altKey && !event.metaKey) {
      const tabCommand = !event.shiftKey &&
        (expectedCommand === "FOCUS" || (expectedCommand === "ALT+TAB" && altModifierArmed));
      if (!tabCommand) {
        resetModifiers();
        return;
      }
    }
    // A held key belongs to the original attempt, not the next mission step.
    if (event.repeat) {
      event.preventDefault();
      return;
    }
    if (event.key === "F1" && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey && expectedCommand !== "F1") {
      event.preventDefault();
      modifierHeld = false;
      altModifierArmed = false;
      controlModifierArmed = false;
      lastCommand.textContent = "F1: hint provided";
      announce("Strategy hint: " + missions[current].steps[step].hint);
      return;
    }
    if (event.key === "Alt" && !event.ctrlKey && !event.shiftKey && !event.metaKey) {
      event.preventDefault();
      altModifierArmed = true;
      modifierHeld = false;
      controlModifierArmed = false;
      lastCommand.textContent = "Alt ready; release it, then press the remaining key";
      announce("Protected Alt command ready. Release Alt, then press the remaining key by itself.");
      return;
    }
    if (event.key === "Control" && !event.altKey && !event.shiftKey && !event.metaKey) {
      event.preventDefault();
      controlModifierArmed = true;
      modifierHeld = false;
      altModifierArmed = false;
      lastCommand.textContent = "Control ready; press the remaining key";
      if (protectedControlCommands.has(expectedCommand)) {
        announce(currentStepPrompt() + " Protected practice. Release Control, then press " + finalKeyFor(expectedCommand) + " by itself. The simulator will count this as " + displayedCommand(expectedCommand) + ".");
      }
      return;
    }
    if (event.key === "CapsLock" && expectedCommand.startsWith("CAPSLOCK+")) {
      event.preventDefault();
      modifierHeld = true;
      altModifierArmed = false;
      controlModifierArmed = false;
      announce("Caps Lock ready. Release it, then press the final key.");
      return;
    }
    if (normalizedKey(event) === "MODIFIER") {
      modifierHeld = true;
      altModifierArmed = false;
      controlModifierArmed = false;
      event.preventDefault();
      lastCommand.textContent = screenReaders[perspective.value].name + " key ready; press the remaining key";
      announce(screenReaders[perspective.value].name + " key ready. Press the remaining key for " + displayedCommand(expectedCommand) + ".");
      return;
    }
    // Modifier keydown events are parts of a chord, never answers themselves.
    // Keep the armed Alt / reader modifier while Shift is being held.
    if (["Shift", "Control", "Alt", "Meta"].includes(event.key)) {
      if (event.key === "Meta") resetModifiers();
      return;
    }
    let command = normalizedKey(event);
    if (modifierHeld && !event.ctrlKey && !event.altKey) {
      const key = event.key.toUpperCase() === " " ? "SPACE" : event.key.toUpperCase();
      command = expectedCommand.startsWith("CAPSLOCK+") ? "CAPSLOCK+" + key : key === "T" ? "TITLE" : key === "TAB" ? "FOCUS" : key === "Z" || key === "SPACE" ? "MODE" : "SCREENREADER+" + key;
    } else if (altModifierArmed && !event.altKey && !event.ctrlKey && !event.metaKey) {
      const key = event.key.toUpperCase() === " " ? "SPACE" : event.key.toUpperCase();
      command = "ALT+" + (event.shiftKey ? "SHIFT+" : "") + key;
    }
    modifierHeld = false;
    altModifierArmed = false;
    controlModifierArmed = false;
    // Screen readers may consume their modifier and the browser may receive
    // only the final key. Accept that final key as confirmation for the
    // screen-reader commands practiced in this simulator.
    if (!command.includes("+") &&
      ["TITLE", "FOCUS", "MODE"].includes(expectedCommand) &&
      command === finalKeyFor(expectedCommand)) {
      command = expectedCommand;
    }
    const inputKey = missions[current].steps[step].inputKey;
    if (inputKey && command === inputKey) command = expectedCommand;
    if (!command || command.endsWith("+")) return;
    if (!command.includes("+") && command === finalKeyFor(expectedCommand)) command = expectedCommand;
    event.preventDefault();
    processCommand(command);
  });
  missionControl.addEventListener("keyup", event => {
    if (!active || event.key !== "Control" || !controlModifierArmed) return;
    event.preventDefault();
    if (protectedControlCommands.has(missions[current].steps[step].command)) return;
    controlModifierArmed = false;
    lastCommand.textContent = "Control: repeated current step";
    announce(currentStepPrompt());
  });

  function currentStepPrompt() {
    return "Step " + (step + 1) + " of " + missions[current].steps.length + ". " + missions[current].steps[step].prompt;
  }

  function processCommand(command) {
    const mission = missions[current];
    try {
      sessionStorage.setItem("missionControlSettings", JSON.stringify({
        speech: simulatedVoice.checked ? "voice" : "own",
        reader: perspective.value,
        mission: String(current)
      }));
    } catch (error) {}
    const expected = mission.steps[step];
    missionAttempts += 1;
    lastCommand.textContent = displayedCommand(command);
    const item = document.createElement("li");
    if (command === expected.command) {
      tone(true);
      item.textContent = displayedCommand(command) + ": " + expected.success;
      log.append(item);
      step += 1;
      updateProgress();
      if (step === mission.steps.length) finishMission(expected.success + " " + expected.why);
      else {
        problem.textContent = missions[current].steps[step].prompt;
        announce(expected.success + " " + expected.why + " " + currentStepPrompt(), "correct");
      }
    } else {
      tone(false);
      missionCommandsToReview.set(expected.command, expected);
      const response = expected.recovery
        ? "That command did not complete this step. " + expected.recovery
        : wrongResponse(command, expected.command);
      item.textContent = displayedCommand(command) + ": " + response;
      log.append(item);
      announce(response + " " + currentStepPrompt() + " Press F1 for a hint.", "incorrect");
    }
  }

  function showMissionResults(show) {
    if (!missionResults) return;
    missionResults.hidden = !show;
    missionBriefing.hidden = show;
    missionControl.hidden = show;
    missionResponse.hidden = show;
    missionShortcuts.hidden = show;
    missionLogPanel.hidden = show;
  }

  function fillMissionResults() {
    const mission = missions[current];
    missionResultsSummary.textContent = "You solved " + mission.title + " in " + missionAttempts + " command attempt" + (missionAttempts === 1 ? "" : "s") + ".";
    if (missionAttemptResult) missionAttemptResult.textContent = String(missionAttempts);
    if (missionCompletedResult) missionCompletedResult.textContent = completed.size + " of " + missions.length;
    if (missionReviewResult) missionReviewResult.textContent = String(missionCommandsToReview.size);
    missionMasteredList.replaceChildren();
    mission.steps.forEach(item => {
      const listItem = document.createElement("li");
      listItem.textContent = displayedCommand(item.command) + ": " + item.why;
      missionMasteredList.append(listItem);
    });
    missionReviewList.replaceChildren();
    if (missionCommandsToReview.size) {
      const list = document.createElement("ul");
      missionCommandsToReview.forEach((item, command) => {
        const listItem = document.createElement("li");
        listItem.textContent = displayedCommand(command) + ": " + item.why;
        list.append(listItem);
      });
      missionReviewList.append(list);
    } else {
      const none = document.createElement("p");
      none.textContent = "None. You solved every step without a missed command.";
      missionReviewList.append(none);
    }
    missionCompletedCount.textContent = "Missions completed: " + completed.size + " of " + missions.length + ".";
    const suggestedReview = missionReviewLinks[mission.category] || ["manuals.html", "Choose a manual to review"];
    missionSuggestedReview.href = suggestedReview[0];
    missionSuggestedReview.textContent = suggestedReview[1];
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
    announce(finalStepFeedback + " Mission complete. You solved " + missions[current].title + ".", "correct");
    fillMissionResults();
    showMissionResults(true);
    nextButton.focus();
  }

  function startMission() {
    current = Number(missionSelect.value);
    step = 0;
    active = true;
    missionAttempts = 0;
    missionCommandsToReview = new Map();
    const mission = missions[current];
    category.textContent = mission.title;
    title.textContent = mission.title;
    problem.textContent = mission.problem;
    log.replaceChildren();
    lastCommand.textContent = "None yet";
    missionControl.classList.remove("is-correct", "is-incorrect");
    modifierHeld = false;
    altModifierArmed = false;
    controlModifierArmed = false;
    missionLogPanel.open = false;
    showMissionResults(false);
    updateProgress();
    const briefing = "Mission briefing. " + mission.title + ". " + mission.problem;
    transcript.setAttribute("aria-live", "off");
    transcript.textContent = "Waiting for your command. Press F1 for a hint.";
    transcript.className = "scenario-feedback";
    speak(briefing);
    missionControl.focus();
    if (!simulatedVoice.checked) {
      transcript.setAttribute("aria-live", "polite");
    }
  }

  missions.forEach((mission, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = mission.category + ": " + mission.title;
    missionSelect.append(option);
  });
  document.getElementById("startMission").addEventListener("click", startMission);
  document.getElementById("restartMission").addEventListener("click", () => {
    document.querySelector(".mission-log-panel").open = false;
    startMission();
  });
  retryResultButton.addEventListener("click", startMission);
  nextButton.addEventListener("click", () => {
    missionSelect.value = String((current + 1) % missions.length);
    startMission();
  });
  perspective.addEventListener("change", () => {
    if (active) announce("Screen-reader perspective changed to " + screenReaders[perspective.value].name + ".");
  });
  window.addEventListener("pagehide", stopVoice);
  updateProgress();
})();
