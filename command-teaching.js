/* Reviewed teaching additions. Main prompts and protected-input handling remain in command-practice.js. */
(() => {
  const courses = window.CommandPracticeCourses;
  if (!courses) return;
  const teaching = {
  "Windows and File Explorer": {
    "Windows+E": "Open a file-management window before choosing a document. For example, find a practice letter in Documents; opening Explorer alone does not open the letter.",
    "Tab": "Move between Explorer regions such as the navigation pane, file list and search controls. Listen to the region name before using arrows: the same arrow can navigate a folder tree or a list of files.",
    "Shift+Tab": "Return to the previous Explorer control when Tab has moved past the region you need. For example, leave the search controls and find the file list again before selecting a document.",
    "Enter": "Open the selected folder or launch the selected file in its associated app. Read the selected name first; selecting a file and opening it are separate actions.",
    "F2": "Edit the selected item’s name. For example, change Draft to Practice letter, then confirm with Enter. Preserve the file extension when it is shown; Escape cancels the rename.",
    "Control+C": "Copy the selected file for reuse elsewhere. Next open the destination folder and paste. Copying does not change which folder you are viewing.",
    "Control+X": "Mark the selected file for moving. Open the destination and paste to finish the move; the file has not moved merely because you pressed Cut.",
    "Control+V": "Paste the copied or cut item into the folder currently open. Check the destination path first. A name-conflict dialog requires a separate decision; pasting is not always the final step.",
    "Control+Z": "Reverse the latest file operation if Explorer supports undoing it. For example, undo an accidental rename promptly. Check the result; this is not a backup or a guarantee that every deletion is recoverable.",
    "Control+A": "Select all items in the active file list before a batch action. Check the selection count and folder first. With focus in a text field, this selects that field’s text instead.",
    "Alt+Left Arrow": "Retrace the last location you visited in this Explorer window. If you jumped from Documents to Downloads, Back returns to Documents; it does not necessarily go up one folder level.",
    "Alt+Right Arrow": "Return along forward history after using Back. For example, revisit Downloads after backing out to Documents. Forward is unavailable when there is no later location in this window’s history.",
    "Alt+Up Arrow": "Leave the current folder for its containing folder. From Documents/Practice, this takes you to Documents regardless of which location you visited previously.",
    "Alt+D": "Select Explorer’s address field so you can inspect or replace the current path. For example, enter a known folder path and confirm with Enter instead of searching through unrelated folders.",
    "Control+E": "Focus the search field for the current Explorer location. Start in the folder you want to search, then enter a useful part of the filename. This is different from searching the web.",
    "Control+Shift+N": "Create a new folder in the location currently open. Name it, then confirm with Enter. For example, make a Practice folder before organizing this week’s documents.",
    "F5": "Ask Explorer to update the current listing. Use it when a newly created file has not appeared. Refreshing does not restore a missing file or undo a change.",
    "Alt+Enter": "Inspect the selected item’s Properties dialog, for example its type, size or location. Opening Properties does not open the document for editing; close the dialog to return to the file list.",
    "Shift+F10": "Open actions for the selected item. Check its name first, then inspect the menu choices before activating one. Escape dismisses the menu without choosing an action.",
    "Alt+P": "Show or hide a preview alongside the file list. Choose a supported document to inspect it without opening its editing app. A blank preview can reflect the file type or preview support.",
    "Alt+Shift+P": "Show or hide information about the selected item in the Details pane. Use it to compare file information while keeping the file list available; it is separate from the contents shown in Preview.",
    "Control+Shift+E": "Expand the navigation tree to help inspect folder relationships. For example, identify the parent of your current practice folder. Expanding tree entries does not open every file inside them.",
    "Control+N": "Open another Explorer window so two folder locations can remain available. For example, keep the source folder in one window while checking the destination in another.",
    "Control+W": "Close the active Explorer tab; if it is the only tab, close that window. Check which location is active before closing it. This does not delete the folder or its files.",
    "Windows+D": "Reveal the desktop, then use the same command to restore the windows. Use it to reach a desktop shortcut without closing the document you were editing.",
    "Windows+I": "Open Windows Settings to adjust device preferences. Opening Settings does not change anything by itself; choose the relevant category before changing a setting.",
    "Windows+R": "Open the Run dialog for a known application name or path. For example, enter notepad and confirm to start a blank text editor. Enter only commands you understand.",
    "Windows+L": "Lock your Windows session when stepping away from a shared computer. Your apps remain open, but signing back in is required. Practice the separated keys here so your real session stays available.",
    "Alt+Tab": "Choose another open window. Hold Alt while pressing Tab to cycle, then release Alt on the window you want. Check the announced title before typing into it.",
    "Alt+F4": "Close the active application window. An unsaved document may ask whether to save; review that prompt before answering. Closing a window is different from switching away from it.",
    "Control+Shift+Escape": "Open Task Manager to inspect running apps and resource use. Opening it does not end an app. Ending a task is a separate action that can discard unsaved work.",
    "Windows+Tab": "Open Task View to inspect open windows and virtual desktops. Choose the workspace you need; opening this overview does not close your existing work.",
    "Control+Windows+D": "Create another virtual desktop for a separate group of windows. For example, keep research separate from writing. This is a workspace in the same account, not another user account.",
    "Control+Windows+Right Arrow": "Switch to the virtual desktop on the right when one exists. Apps on the desktop you leave remain open. Confirm the new workspace before continuing your task.",
    "Control+Windows+Left Arrow": "Return to the virtual desktop on the left when one exists. Use it to return from a research workspace to your writing workspace without closing either set of windows."
},
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
  // Keep application/focus requirements in the short task, with examples in
  // More explanation. Keys, ordering and stages remain stable for these courses.
  const contextualTeaching = {
    "NVDA commands": {
      "Insert+Page Up": ["In Desktop layout, review the previous page.", "Use the review cursor to revisit an earlier page in an application that supports page review. For example, check a name on the preceding page before continuing. This course uses NVDA’s Desktop layout with Insert as the NVDA key; Laptop layout assigns these keys differently."],
      "Insert+Page Down": ["In Desktop layout, review the next page.", "Continue reviewing a multipage text without selecting its contents. Page review depends on the application exposing pages. For example, move forward after checking a reference on the previous page. A review movement is not an instruction to type at a new insertion point."],
      "Alt+Insert+Home": ["Review the beginning of the highlighted text.", "Move the review cursor to the first character of an existing selection. For example, check whether your highlighted quotation begins with the intended word. Make the selection first; this command does not begin a new selection."],
      "Alt+Insert+End": ["Review the end of the highlighted text.", "Inspect the last character in the text already selected. For example, check whether the final punctuation is included before copying a quotation. This moves the review cursor to the selection boundary; it does not extend the selection."],
      "Insert+F9": ["Mark where a review selection will begin.", "Place the review cursor on the first character you want, then set the start marker. For example, mark the beginning of a reference number you need to copy. Next move the review cursor to its final character. The start marker alone neither selects nor copies the range."],
      "Insert+F10": ["Finish the review selection with one press.", "After marking a start with Insert plus F9, move the review cursor to the final character you want. The first Insert plus F10 selects that range, including the current character, and can move the editing cursor to it when supported. A second press copies the selection. Here you rehearse the first press; your real Clipboard is unchanged."],
      "Shift+Insert+F9": ["Return to the marked review starting point.", "Find the start marker you previously set with Insert plus F9. For example, recheck the beginning of a reference number before finishing its selection. Returning to the marker does not set a different start or copy anything."],
      "Control+Insert+G": ["Open NVDA’s General settings.", "Review overall preferences such as interface language and update checking. For example, check which language NVDA uses in its own dialogs. Opening the category leaves its settings unchanged until you make and confirm a choice."],
      "Control+Insert+V": ["Open NVDA’s Speech settings.", "Review the current voice and speech characteristics. For example, adjust rate while checking how clearly a voice reads a familiar paragraph. These are NVDA’s speech preferences; the learning website’s instruction voice has its own settings."],
      "Control+Insert+S": ["Open NVDA’s synthesizer chooser.", "Choose the speech engine NVDA uses from those available on the computer. For example, select an installed engine that supports the language you need. An engine can offer several voices; choosing a voice within it is a separate Speech setting."],
      "Control+Insert+U": ["Open NVDA’s Audio settings.", "Review where and how NVDA’s audio plays. For example, check the output device when speech should come through headphones. Audio routing and the way other audio is lowered are different from changing the voice’s pronunciation or speaking rate."],
      "Control+Insert+W": ["Open NVDA’s built-in Magnifier settings.", "In NVDA versions with the built-in magnifier, review its visual behavior before using it to enlarge a small control. These preferences belong to NVDA’s magnifier. Opening this dialog does not configure ZoomText or change the website’s print-size setting."],
      "Control+Insert+K": ["Open NVDA’s Keyboard settings.", "Check the keyboard layout, NVDA modifier keys and typing feedback. For example, verify Desktop layout and Insert before following this course’s commands. Changing the layout can change shortcut meanings even on the same physical keyboard."],
      "Control+Insert+M": ["Open NVDA’s Mouse settings.", "Review feedback and tracking associated with the mouse pointer. For example, check whether moving the pointer over a label should make NVDA read it. The mouse pointer can be over a different item from the one receiving keyboard input."],
      "Control+Insert+O": ["Open NVDA’s Object Presentation settings.", "Choose which information NVDA reports about application controls. For example, review how much detail you hear while exploring an unfamiliar dialog. These preferences affect descriptions of objects; they do not rearrange the dialog’s buttons."],
      "Control+Insert+B": ["Open NVDA’s Browse Mode settings.", "Review behavior used while reading web pages and other browse-mode documents. For example, inspect automatic focus-mode choices when moving into an editable field. Confirm the current mode before typing: navigation letters and text entry have different purposes."],
      "Control+Insert+D": ["Open NVDA’s Document Formatting settings.", "Choose which document details NVDA announces during reading, such as font information. For example, enable the details you need to check a document’s appearance. Reporting bold or font size does not apply formatting to the document."],
      "Control+Insert+C": ["Save NVDA’s current configuration.", "Keep the NVDA preferences you have chosen, such as a comfortable voice rate, for later use. This saves screen-reader settings rather than the document you are editing. Use the document application’s Save command separately for your written work."],
      "Control+Insert+R": ["Restore NVDA’s saved settings with one press.", "Return to the last saved configuration after trying an unwanted setting. For example, recover a familiar speech setup after an experiment. This exercise teaches one press. In real NVDA, pressing the command three times loads factory defaults without an undo dialog. The simulator does not change your settings."]
    },
    "Thunderbird email": {
      "Control+N": ["In Thunderbird Mail, start a new message.", "Start a blank message from the Mail window. For example, write a new question to your instructor instead of reusing an unrelated conversation. Check the sending account, then add the recipient and subject."],
      "Control+S": ["In the compose window, save the draft.", "Keep your unfinished reply so you can return to it later. Saving a draft does not send it. Focus matters: from the message list, these keys save the selected received message as a file instead."],
      "Control+Shift+A": ["In the compose window, attach a file.", "Choose the file you want to include with your draft, such as a completed practice worksheet. After the picker closes, check the attachment name. In the message list, these keys select a thread instead of attaching a file."],
      "Control+R": ["Reply to the selected message’s sender.", "Select the message you want to answer, then open a reply addressed to its sender. For example, answer the person who asked a question without replying to the whole group. Check the recipient before writing; in a compose window this shortcut can rewrap text instead."],
      "Control+Shift+R": ["Reply to everyone on the selected message.", "Open a group reply when all participants need the answer, such as confirming a shared meeting time. Review the To and Cc fields before sending so the response reaches the intended people."],
      "Control+L": ["Forward the selected message.", "Pass an existing message to another recipient. For example, forward directions to someone joining an event. Add the recipient, then review the earlier conversation and any attachments before sending."],
      "Control+Shift+K": ["In Thunderbird Mail, open Quick Filter.", "Narrow the current folder or view to messages you need, such as messages with attachments about class. Choose which fields to match. Clear the filter with Escape as needed when you want the full list again; filtered-out messages have not been deleted."],
      "F6": ["Move to the next main Thunderbird area.", "Move among the major parts of the Mail window. For example, reach the folder pane to choose Drafts, then find the message list. Listen to the new area name before using arrows; arrows act on the area that has focus."],
      "Control+K": ["In Thunderbird Mail, search across messages.", "Use global search when you remember a word but not the folder containing it. For example, search for a project name that may appear in several accounts. Check the sender and date in the results before opening a message. In composition, these keys insert a link instead."],
      "Control+Shift+F": ["In Thunderbird Mail, open advanced message search.", "Choose a folder and combine search conditions, such as a particular sender and a date range. This is useful when a common word produces too many results. Check the search scope before concluding that a message is missing."],
      "Control+F": ["Find text inside the displayed message.", "Locate a word within the message you are reading, such as the word entrance in a long set of directions. This helps find a passage after you have opened the right message; it is not a search across your mail folders."],
      "N": ["Move to the next unread message.", "With focus in mail navigation, jump to another message that still has unread status. For example, work through unread announcements. A message you already read may be skipped. In a draft or search field, an ordinary letter is text input."],
      "P": ["Move to the previous unread message.", "Return to an earlier unread message in mail navigation. This follows unread status, not simply the previous row or the last message you viewed. If the message you want is already read, locate it in the list instead."],
      "M": ["Toggle the selected message’s read status.", "Mark a selected message unread when you want to return to it, or read when you have finished with it. Check the new status after the toggle. Marking unread does not send a reply or create a reminder with a due date."],
      "S": ["Add or remove the selected message’s star.", "Use a star to mark a message for follow-up, such as an appointment you need to confirm. Pressing the command again removes the star. You can use the starred Quick Filter to find marked messages later."],
      "A": ["Archive the selected message.", "Move a finished message into the account’s configured archive location. For example, keep an old class announcement for reference while clearing the inbox. Find it in the archive or search later. Check which messages are selected before archiving a group."],
      "J": ["Mark the selected message as junk.", "Classify unwanted mail using Thunderbird’s junk controls. Use this for spam, rather than for an ordinary message you have finished reading. Your junk settings determine what happens to the message after classification."],
      "Shift+J": ["Mark the selected message as not junk.", "Correct a message that Thunderbird or you classified as junk by mistake. For example, select a legitimate class announcement in Junk and mark it not junk. Check where it appears afterward; classification and folder location are related but separate things to verify."],
      "F8": ["Show or hide the message pane.", "Change whether you can read the selected message beside or below the list. Hiding the pane can leave more space for the message list; showing it lets you inspect a message without opening a separate tab. The message itself is unchanged."],
      "Shift+F6": ["Move to the previous main Thunderbird area.", "Move backward among the main areas when you have passed the pane you need. For example, return from a message-reading area toward the message list. Confirm the focused area before issuing a single-letter message command."],
      "Control+Shift+B": ["Open Thunderbird’s address book.", "Look up a saved contact before addressing a message. For example, check which of two similar names has the correct email address. Opening the address book alone does not add a recipient or send a message."],
      "F5": ["Get messages for the current account.", "Ask the active account for new mail. For example, refresh your class mailbox without refreshing every other account. Check the active account and connection; no new messages is different from a failed connection."],
      "Shift+F5": ["Get messages for all Thunderbird accounts.", "Check for new mail across the accounts already configured in Thunderbird. This is useful when you are waiting for a message but are unsure which address was used. Each account still needs a working connection."],
      "Control+Shift+L": ["Reply to the selected message’s mailing list.", "Use Reply to List for a message with recognized mailing-list information. For example, answer a discussion list rather than sending only to the individual author. Inspect the resulting recipient because list configuration determines where the reply goes."],
      "Control+E": ["Edit the selected message as a new message.", "Reuse an existing message as a starting point, such as last week’s reminder. Update its date, content, recipients and attachments before sending. This creates another message; it does not revise a copy that someone has already received."],
      "Control+U": ["View the selected message’s source.", "Inspect the raw message, including its headers, when investigating how it was delivered. For example, find the Message-ID while discussing a delivery problem with your mail administrator. Viewing the source does not edit or forward the message."],
      "Control+Shift+O": ["From the message list, open its conversation.", "Explore related messages so you can follow a discussion before replying. Start with a message selected in the list. In a compose window the same keys paste a quotation, so confirm which window has focus first."],
      "Control+Shift+M": ["Repeat the previous message move or copy.", "Apply the last move or copy operation to another selected message. For example, file a second class message in the folder you just used. Remember both the destination and whether the previous operation moved or copied; repeating the command repeats that choice."],
      "Control+Enter": ["In the compose window, send the message now.", "Use this after checking the recipients, subject, message and attachment list. For example, send a completed reply once the correct worksheet is attached. In this practice you only rehearse the keys; the site never sends an email."],
      "Control+Shift+Enter": ["In the compose window, queue the message for later.", "Place the message in the outgoing queue for later sending. For example, finish a reply while working offline, then review queued mail before sending it. This shortcut does not choose a future delivery date or time. The simulator never queues real mail."],
      "Control+Shift+V": ["In a draft, paste text without its formatting.", "Insert copied words at the writing cursor using the draft’s surrounding style. For example, paste an address from a colorful webpage into a plain message. Check the cursor first so the text appears in the intended paragraph."],
      "F9": ["In the compose window, show or hide contacts.", "Open or close the contacts sidebar while writing a message. Use it to look up a recipient without leaving the draft. Showing the sidebar does not automatically add every visible contact; choose the intended person."],
      "Alt+M": ["In the compose window, show or hide attachments.", "Inspect the draft’s attachment pane before sending. For example, confirm that the final worksheet is attached instead of an earlier draft. Hiding this pane does not remove the attached files."],
      "F10": ["Reveal Thunderbird’s menu bar.", "Reach the application menus when you need a command whose shortcut you do not remember. Move through the menus and read a choice before activating it. Escape leaves a menu without choosing an action."],
      "Shift+F10": ["Open the selected message’s context menu.", "Explore actions for the message currently selected in the list. For example, inspect available tagging or filing choices. Check the selected message first; opening the menu does not apply an action until you choose one."],
      "Control+Shift+T": ["Restore the last closed Thunderbird tab.", "Reopen a message tab that you closed by mistake. This restores the tab for reading; it does not retrieve deleted mail from Trash. Check the restored subject before continuing your work."]
    },
    "ZoomText and Fusion Desktop magnification": {
      "Caps Lock+Up Arrow": ["Increase magnification in Desktop layout.", "Make screen content larger using the Desktop hotkey layout. For example, enlarge a small form label until it is readable. Less surrounding content fits in the magnified view as zoom increases; check where the focused control is before continuing."],
      "Caps Lock+Down Arrow": ["Decrease magnification in Desktop layout.", "Show more surrounding content by lowering the zoom level. For example, zoom out enough to understand how a form is arranged, then enlarge it again for reading. This changes your view, not the document’s saved font size."],
      "Caps Lock+Enter": ["Switch between magnification and 1x in Desktop layout.", "Temporarily view the screen at its ordinary size, then return to the previous magnification. Use this to orient yourself when you have lost track of the window layout. Switching to 1x does not close the magnifier."],
      "Caps Lock+C": ["Turn color enhancements on or off.", "Compare your configured color enhancement with the usual screen colors. For example, use your preferred low-glare scheme while reading a long page. The hotkey toggles the chosen enhancement; choosing a different color scheme is a separate setting."],
      "Caps Lock+R": ["Turn text-cursor highlighting on or off.", "Make the text insertion point easier to locate while editing. For example, find where the next letter will appear in a draft. This is the text cursor, rather than the mouse pointer or the outline around a focused button."],
      "Caps Lock+F": ["Turn keyboard-focus highlighting on or off.", "Make the active control easier to locate when navigating with the keyboard. For example, follow the highlight as Tab moves among form fields and buttons. This visual aid helps locate focus; it does not move focus or activate the control."],
      "Caps Lock+P": ["Turn mouse-pointer highlighting on or off.", "Make the mouse pointer easier to find against a busy background. For example, locate it before pointing to a small toolbar control. Pointer highlighting follows the mouse; use focus highlighting to track keyboard navigation."],
      "Caps Lock+I": ["Turn Smart Invert on or off when inversion is active.", "Keep supported photos looking natural while an inverted brightness or color scheme is active. In Chrome, this requires the Smart Invert extension. For example, compare a photo on an otherwise inverted page. The command alone does not set up inversion or install the extension."],
      "Caps Lock+X": ["Cycle the magnifier’s smoothing mode.", "Compare how enlarged text and edges look with different smoothing modes. Try the same short line at the same zoom level so you can judge its appearance. This changes screen rendering, rather than proofreading the text or changing its font."],
      "Alt+Caps Lock+K": ["In ZoomText Reader, change typing echo.", "Choose the feedback you hear as you type: individual keys, completed words, both, or no typing echo. For example, listen to letters while checking an unfamiliar name. This exercise uses ZoomText Reader; Fusion’s speech is supplied by JAWS."],
      "Alt+Caps Lock+M": ["In ZoomText Reader, change mouse echo.", "Choose how text beneath the mouse pointer is spoken, including immediate, delayed hover, or no echo. For example, use hover feedback to hear a label after placing the pointer over it. Keyboard focus need not be on the item you point to."],
      "Alt+Caps Lock+B": ["In ZoomText Reader, change spoken detail.", "Cycle the amount of information announced about program controls. More detail can help while learning an unfamiliar dialog; less can reduce repetition once you know it. Verbosity changes how much is described, not how quickly the voice speaks."],
      "Alt+Caps Lock+V": ["In ZoomText Reader, select a voice.", "Choose the voice used for ZoomText Reader’s speech. For example, compare how clearly voices pronounce names in a practice paragraph. Available voices depend on the installed speech options; changing this does not select the learning website’s instruction voice."],
      "Alt+Caps Lock+Up Arrow": ["In ZoomText Reader, increase speech speed.", "Make ZoomText Reader speak faster when you can comfortably follow its current pace. Try a familiar paragraph to judge the change. This exercise uses the Reader voice-rate command, not a change to your typing-speed target or the website’s voice setting."],
      "Alt+Caps Lock+Down Arrow": ["In ZoomText Reader, decrease speech speed.", "Slow ZoomText Reader when listening to unfamiliar instructions or checking details. For example, slow down to review a difficult word before returning to a faster rate. This changes speech pace, not the amount of information announced."],
      "Alt+Caps Lock+Enter": ["In ZoomText Reader, turn speech on or off.", "Toggle ZoomText Reader’s voice when you want to switch between listening and visual reading. Magnification remains separate from speech. The key practice here only rehearses the command; it does not turn your assistive technology or site voice off."],
      "Caps Lock+Space then Y then D": ["In ZoomText Reader, hear the current date.", "Check the computer’s current date before dating a letter. Enter the layered commands, choose the Say group with Y, then choose date with D. Each part is a separate step; this reports the date rather than inserting it into your document."],
      "Caps Lock+Space then Y then T": ["In ZoomText Reader, hear the current time.", "Check the computer’s time without leaving your task to inspect the clock. For example, check whether you are ready for a scheduled call. In the Say layer, T requests time; it does not set an alarm or change the clock."],
      "Caps Lock+Space then Y then F": ["In ZoomText Reader, hear the focused control.", "Check which program control currently has keyboard focus before acting. For example, distinguish Save from Cancel in a dialog. The Say Focus command describes the current control; it does not click it or move focus to a different control."],
      "Caps Lock+Space then Y then S": ["In ZoomText Reader, hear the highlighted text.", "Review the text you have selected before replacing or copying it. For example, confirm that a whole sentence is highlighted rather than just its last word. Make the selection first; this command reads the selection instead of creating one."],
      "Caps Lock+Space then Y then W": ["In ZoomText Reader, hear the active window’s title.", "Identify the active window before typing or closing anything. For example, check which document is open when two windows look similar under magnification. Reading the title does not switch to another window."],
      "Caps Lock+Space then Y then P": ["In ZoomText Reader, hear the Clipboard’s text.", "Review text you copied before pasting it elsewhere. For example, check that you copied the full address. This reads available Clipboard text without pasting it. The website exercise does not read or change your real Clipboard."],
      "Caps Lock+Space then Y then U": ["In ZoomText Reader, hear the status bar.", "Review information the current application exposes in its status bar, such as document position or activity. Availability and contents depend on the application. The status bar is different from the focused control or the window title."]
    }
  };
  for (const [name, notes] of Object.entries(contextualTeaching)) {
    for (const entry of courses[name]) {
      const note = notes[entry[0]];
      if (note) [entry[1], entry[2]] = note;
    }
  }
  const zoomText = courses["ZoomText and Fusion Desktop magnification"];
  for (const entry of zoomText) {
    if (entry[0].startsWith("Caps Lock+Space then Y then ")) {
      entry[4] = {...entry[4], stepGoals: [
        "In ZoomText Reader, enter layered commands.",
        "Choose ZoomText Reader’s Say command group.",
        entry[1]
      ]};
    }
  }
  window.CommandPracticeCourseNotes["Thunderbird email"] = "Thunderbird for Windows: message navigation, composing and advanced mail tools. Check whether focus is in Mail or a compose window. Practice never sends mail.";
  window.CommandPracticeCourseNotes["ZoomText and Fusion Desktop magnification"] = "Desktop hotkey layout. Begin with magnification, then practice ZoomText Reader speech. Fusion uses JAWS speech commands; its Laptop hotkey layout also differs. These exercises rehearse keys without changing your assistive technology.";
  const explorer = courses["Windows and File Explorer"];
  for (const entry of explorer) {
    entry[4].source = "https://support.microsoft.com/en-us/accessibility/windows/keyboard-shortcuts-in-windows";
    if (entry[0] === "Control+Shift+E") entry[1] = "Expand the folder tree in the navigation pane.";
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
  const macSources = {
    general: "https://support.apple.com/guide/voiceover/general-commands-cpvokys01/mac",
    text: "https://support.apple.com/guide/voiceover/text-commands-cpvokys06/mac",
    reading: "https://support.apple.com/guide/voiceover/vo2706/mac",
    selection: "https://support.apple.com/guide/voiceover/mchlp2741/mac",
    help: "https://support.apple.com/guide/voiceover/mchlp2687/mac",
    panels: "https://support.apple.com/guide/voiceover/unac078/mac",
    quickNav: "https://support.apple.com/guide/voiceover/vo27943/mac",
    verbosity: "https://support.apple.com/guide/voiceover/mchlp2703/mac",
    notifications: "https://support.apple.com/guide/voiceover/vo082d92ca69/mac",
    commands: "https://support.apple.com/guide/voiceover/vo14096/mac",
    curtain: "https://support.apple.com/guide/voiceover/vo2726/mac",
    visuals: "https://support.apple.com/guide/voiceover/vo15626/mac"
  };
  // The same arrows mean different things while interacting with text. Apply
  // these tasks only to the advanced entries, preserving basic item navigation.
  const macAdvanced = {
    "VO+P": ["In text, read the current paragraph.", "First interact with the document's text. Read the paragraph around your current position to hear a complete thought, such as a delivery instruction. This reviews the paragraph without highlighting it.", "reading"],
    "VO+L": ["In text, read the current line.", "While interacting with text, check the line at your current position. For example, listen to the address line you just reached before moving farther down the document. This reads the current line rather than the next one.", "reading"],
    "VO+S": ["In text, read the current sentence.", "While interacting with a draft, reread the sentence containing a correction. This can help you judge whether the whole sentence still makes sense after changing a word; it does not select the sentence for editing.", "reading"],
    "VO+W": ["In text, read the current word.", "While interacting with text, check one word, such as a surname in an appointment note. One press reads it; repeat the command to hear its spelling, then again for phonetic spelling. This exercise rehearses the first press.", "reading"],
    "VO+C": ["In text, read the current character.", "While interacting with text, inspect one character in a short reference code. For example, check a letter or punctuation mark before changing it. This task concerns text, not a table header or an interface control.", "text"],
    "VO+V": ["Open the Verbosity rotor.", "Choose how much detail VoiceOver speaks. For example, use Left or Right Arrow to find Punctuation, then Up or Down Arrow to choose a level and Space to select it. Escape closes the rotor. This changes spoken detail, not the document's punctuation.", "verbosity"],
    "VO+Q": ["Toggle single-key Quick Nav.", "Single-key Quick Nav makes letter keys navigate, such as B for a button, instead of acting as ordinary typing. Listen for the new on/off state. Turn it off before a task that needs those letters as input; this practice page does not change the setting for you.", "quickNav"],
    "Shift+VO+Q": ["Toggle arrow-key Quick Nav.", "Arrow-key Quick Nav lets arrows navigate without holding the VoiceOver modifier. Listen for whether it is on or off before continuing. For example, turn it off when you need plain arrows to reach an application's own controls rather than use Quick Nav navigation.", "quickNav"],
    "Command+F5": ["Turn VoiceOver on or off.", "This system shortcut changes whether VoiceOver is running. Rehearse the separate keys or use Build the command here so your screen reader stays available. Completing the exercise changes only the practice score, not your Mac's accessibility settings.", "general"],
    "VO+Fn+F8": ["Open VoiceOver Utility.", "Open the place where you review VoiceOver preferences, such as navigation or spoken detail. Opening the utility does not itself change a setting. Use Build the command here; it accepts the version without Fn when your Mac uses standard function keys.", "general"],
    "VO+Semicolon": ["Lock or unlock the VoiceOver modifier.", "Lock the modifier when you want to enter several VoiceOver commands without holding it each time. Unlock it before ordinary typing. For example, a letter you intend to type could otherwise be interpreted as a command. This exercise only rehearses the shortcut.", "general"],
    "VO+Command+Fn+F8": ["Open the VoiceOver Tutorial.", "Start Apple's interactive tutorial to learn and rehearse essential VoiceOver skills on your Mac. This opens the learning tutorial, while VO plus Fn plus F8 opens settings. Use this when you want guided practice rather than to change a preference.", "help"],
    "Shift+VO+H": ["Read the current item's help tag.", "Put the VoiceOver cursor on an unfamiliar control before asking for its help tag. For example, learn what a toolbar button does before activating it. If the app provides no help tag, VoiceOver tells you that; the command does not press the button.", "help"],
    "Shift+VO+N": ["Hear how to use the current item.", "Ask for VoiceOver's usage hint while the cursor is on the item you need. For example, find out how to work with an unfamiliar control before trying to change its value. This requests a hint about using the item, rather than the app's help tag.", "help"],
    "Shift+VO+F": ["Open Find Commands.", "Use the Find Commands menu when you remember an action you need but not its keyboard shortcut. For example, look for a reading action before returning to your document. Finding a command is different from searching the words in the document itself.", "general"],
    "VO+N": ["Open the Notifications menu.", "Review notifications currently displayed on the screen. Use VO plus Up or Down Arrow to choose one, then VO plus Space to open it. For example, inspect an alert without assuming its arrival placed the cursor there. Older missed notifications may require Notification Center instead.", "notifications"],
    "VO+Fn+F7": ["Read the current date and time.", "Check the Mac's date and time without navigating away to look for a clock. For example, check whether it is nearly time for a lesson. This exercise uses one press; repeated presses of this command have other status-reporting functions.", "general"],
    "VO+Tab": ["Pass the next keypress to the application.", "Tell VoiceOver to let the next key or combination go to the application. Use this for one application command that VoiceOver would otherwise intercept. It does not turn VoiceOver off or permanently change its shortcuts. Here, rehearse using separate keys or the builder.", "general"],
    "VO+Command+Fn+F11": ["Show or hide VoiceOver's visual aids.", "Temporarily hide or restore the VoiceOver cursor and caption or braille panels together. For example, clear these overlays while a sighted colleague views a page, then restore them for a lesson. This controls the visual aids, not whether VoiceOver is running.", "panels"],
    "VO+Command+Fn+F10": ["Show or hide the caption panel.", "Display VoiceOver's spoken words on screen, or hide that caption panel again. This can help a sighted instructor follow what the learner hears. The panel is a visual aid; hiding it does not mean the screen reader has stopped speaking.", "panels"],
    "Shift+VO+Fn+F10": ["Move or resize the caption panel.", "Show the caption panel first. Repeat this command to choose moving or resizing, then use the VoiceOver modifier with arrows to adjust it. Press Escape when finished. For example, move the panel away from a control it covers without changing the page itself.", "panels"],
    "VO+Command+Fn+F9": ["Show or hide the braille panel.", "Show an on-screen representation of Braille with its text translation. It can help an instructor follow Braille output; it is not a physical braille display. This shortcut switches the panel setting on or off rather than connecting a device.", "panels"],
    "Shift+VO+Fn+F9": ["Move or resize the braille panel.", "With the braille panel shown, choose moving or resizing by repeating the command. Adjust it with the VoiceOver modifier and arrows; press Escape to finish. For example, reposition the panel while keeping the learner's working area visible.", "panels"],
    "VO+Fn+F10": ["Center the current item with tile visuals.", "Tile visuals brings the item under the VoiceOver cursor to the center and dims the surrounding screen. It can help a learner or instructor follow the current item while navigating. Use the same command again to restore the normal view.", "visuals"],
    "Shift+VO+K": ["Toggle VoiceOver Option-key commands.", "Enable or disable the additional method of controlling VoiceOver with Option-key assignments. These assignments can be customized, so check what is assigned on your Mac before relying on a particular letter. This differs from single-key Quick Nav and from holding Control plus Option as VO.", "commands"],
    "Shift+VO+Fn+F11": ["Toggle the screen curtain.", "The screen curtain makes the Mac's screen black while you use VoiceOver. Use the same command again to reveal the screen. In this simulator, use separated keys or the builder so the actual display stays available; practicing does not turn on the real curtain.", "curtain"],
    "VO+A": ["In text, read from the current position.", "First interact with the document's text to read from the VoiceOver cursor toward the end. For example, resume reading a letter from the paragraph you reached. Without interacting, Read All can begin from the top instead, so check your text context first.", "reading"],
    "Shift+VO+A": ["Select the text in the VoiceOver cursor.", "Use this with text in the VoiceOver cursor, for example a passage you want to reuse. Check which text is highlighted before copying or replacing it. This creates a selection; the plain VO plus A command reads text instead.", "text"],
    "VO+Enter": ["In a text field, start or stop selection.", "Text selection tracking must be on. Put the VoiceOver cursor at the start, press VO plus Return, navigate through the text to select, then press VO plus Return again. For example, mark a short phrase before copying it. Return is the Mac key called Enter in this practice.", "selection"],
    "VO+T": ["In text, describe the formatting.", "Inspect the formatting at the VoiceOver cursor before making a change. For example, check the emphasis on a title in your draft. This reports text attributes; it does not apply bold, italics or a new style.", "text"],
    "Shift+VO+Page Down": ["In text, read the next paragraph.", "While interacting with text, move forward one paragraph rather than reading a line at a time. For example, continue from an introduction to the next instruction. This is paragraph review, not a command to turn a document page.", "text"],
    "Shift+VO+Page Up": ["In text, read the previous paragraph.", "While interacting with text, return to the preceding paragraph. For example, revisit the delivery details after reading a closing sentence. The unit is a paragraph, even though the shortcut uses the Page Up key.", "text"],
    "VO+Command+Page Down": ["In text, read the next sentence.", "While interacting with text, advance by one sentence. For example, review the next step of a written procedure without starting another full paragraph. Command distinguishes sentence movement from the paragraph shortcut that uses Shift.", "text"],
    "VO+Command+Page Up": ["In text, read the previous sentence.", "While interacting with text, reread the sentence just before your current position. For example, check the condition that applies to the instruction you are reading. This reviews the earlier sentence without highlighting it.", "text"],
    "VO+Down Arrow": ["In text, read the next line.", "First interact with the text area, then move forward line by line. For example, review the next line of an address. Outside text, the same keys can navigate interface items, so listen to the current context before using them.", "reading"],
    "VO+Up Arrow": ["In text, read the previous line.", "While interacting with text, revisit the preceding line. For example, check the street name above a city and postal code. This is line review in a text area, rather than moving up through an unrelated menu.", "reading"],
    "VO+Right Arrow": ["In text, read the next word.", "First interact with the text area, then review one word at a time. For example, check the words following a name in a note. Outside text, these keys move between interface items; they do not always mean next word.", "reading"],
    "VO+Left Arrow": ["In text, read the previous word.", "While interacting with text, return to the word just before your current position. For example, reread an amount's label before correcting it. This text-review task is separate from the earlier command for the previous interface item.", "reading"],
    "VO+Delete": ["In the TextEdit ruler, delete a tab stop.", "The VoiceOver cursor must be on a tab stop in TextEdit's ruler. Remove that layout marker, for example after deciding a custom text alignment is unnecessary. This is not a general command to delete the current word or paragraph.", "text"],
    "VO+Fn+F3": ["In text, report the current word and character.", "Use one press to report the word and character at the VoiceOver cursor while reviewing text. For example, confirm your position within a reference code. The text context matters: elsewhere this command describes the current item, and repeated presses provide different information.", "text"]
  };
  for (const entry of mac) {
    if (entry[4].level !== "advanced" || !macAdvanced[entry[0]]) continue;
    const [goal, note, source] = macAdvanced[entry[0]];
    entry[1] = goal; entry[2] = note;
    entry[4] = {...entry[4], source: macSources[source]};
    if (/\+Fn\+F(?:[1-9]|1[0-2])$/.test(entry[0])) entry[4].fnOptional = true;
  }
  // Legacy links remain useful focused practice. The main topic still contains the full course.
  const copy = entry => [entry[0], entry[1], entry[2], entry[3], {...entry[4]}];
  const editingKeys = new Set(["Control+X", "Control+C", "Control+V", "Control+A", "Control+Z", "Control+Y", "Control+Shift+V", "Control+B", "Control+I", "Control+U", "Control+[", "Control+]", "Control+E", "Control+L", "Control+R", "Control+Alt+C", "Control+Alt+V"]);
  courses["General editing"] = courses["Microsoft Word and documents"].filter(e => editingKeys.has(e[0])).map(copy);
  // Preserve the existing 24-task reading/settings route by task identity,
  // rather than making its coverage depend on wording or a reference URL.
  const textKeys = new Set(["VO+P", "VO+L", "VO+S", "VO+W", "VO+C", "VO+V", "VO+T", "VO+Fn+F8", "VO+Delete", "VO+Fn+F3", "Shift+VO+A", "VO+Enter", "VO+Q", "Shift+VO+Q", "Command+F5", "VO+A", "Shift+VO+Page Down", "Shift+VO+Page Up", "VO+Command+Page Down", "VO+Command+Page Up", "VO+Down Arrow", "VO+Up Arrow", "VO+Right Arrow", "VO+Left Arrow"]);
  courses["Mac VoiceOver reading and settings"] = mac.filter(e => e[4].level === "advanced" && textKeys.has(e[0])).map(copy);
  const reading = new Set(courses["Mac VoiceOver reading and settings"].map(e => e[1]));
  courses["Mac VoiceOver navigation and web"] = mac.filter(e => !reading.has(e[1])).map(copy);
  for (const name of ["General editing", "Mac VoiceOver reading and settings", "Mac VoiceOver navigation and web"]) {
    courses[name].forEach((e, i, all) => e[4].level = i < Math.ceil(all.length / 3) ? "basic" : i < Math.ceil(all.length * 2 / 3) ? "intermediate" : "advanced");
  }
  window.CommandPracticeCourseNotes["General editing"] = "A focused editing course for Microsoft Word on Windows: selecting, moving, formatting and reusing text. The Microsoft Word topic includes the full application course.";
  window.CommandPracticeCourseNotes["Mac VoiceOver reading and settings"] = "Focused VoiceOver text review and reading settings on Mac. The main VoiceOver topic retains the complete course.";
  window.CommandPracticeCourseNotes["Mac VoiceOver navigation and web"] = "Focused VoiceOver navigation, interaction and interface exploration on Mac. The main VoiceOver topic retains the complete course.";
})();
