/* Chrome for Windows: shortcut mappings checked against Google Help on 2026-10-01.
   Teaching notes are original. Browser shortcuts use separate key releases. */
(() => {
  "use strict";

  const source = "https://support.google.com/chrome/answer/157179?hl=en";
  const category = "Google Chrome browser";
  function level(name, entries) {
    return entries.map(([keys, explanation, detail]) => [
      keys, explanation, "In Google Chrome on Windows. " + detail, "safe",
      { level: name, source, steps: keys.split(" then ") }
    ]);
  }

  const basic = [
    ["Control+L", "Selects the address bar.", "Use this when you want to type a website address. The current address is highlighted, so typing replaces it. After entering an address, press Enter to visit it."],
    ["Alt+D", "Selects the address bar.", "This is another way to reach the address bar from a webpage. Try it when moving between reading a page and entering a new destination."],
    ["Control+T", "Starts a new browser tab.", "Keep your current page available while starting another task in the same window. The new tab is ready for a web address or search."],
    ["Control+N", "Starts a separate browser window.", "Use another window when you want to keep two groups of pages apart. Each window has its own row of tabs."],
    ["Tab", "Moves to the next link or control.", "With a webpage active, move through its interactive items. Listen for each item's name before activating it. A screen reader's navigation mode can affect which keys reach the page."],
    ["Shift+Tab", "Moves to the previous link or control.", "Use this when you move past a button, link, or field. It reverses the direction of Tab without activating the item."],
    ["Control+F", "Finds text within the current page.", "Type a distinctive word from the page into the Find bar. This searches the page you already have open; it does not search the whole web."],
    ["F3", "Opens the page's Find bar.", "This is another way to start looking for text on the current page. Enter a search word, then use the next-match or previous-match command to review results."],
    ["Control+G", "Moves to the next Find match.", "First search for a word with the Find bar. This moves forward through occurrences of that word without changing your search."],
    ["Control+Shift+G", "Moves to the previous Find match.", "With a page search already active, use this to revisit an earlier occurrence. It is useful when you move past the result you wanted."],
    ["Alt+Left Arrow", "Returns to the previous page.", "Use the current tab's browsing history to return to a page you just left. This does not undo text you typed into a form."],
    ["Alt+Right Arrow", "Goes forward in the tab's history.", "After going back, use this to return to the page you left. It needs a later page in the current tab's history."],
    ["Alt+Home", "Visits your configured home page.", "The destination depends on Chrome's home-page setting. This replaces the page in the current tab rather than opening a separate tab."],
    ["Control+R", "Refreshes the current page.", "Use this to request the page again when its information appears out of date. Finish or save any form work before refreshing a real page."],
    ["F5", "Refreshes the current page.", "This function key is an alternative to Control plus R. On some keyboards you also need the keyboard's Fn setting to send F5."],
    ["Escape", "Stops a page that is still loading.", "Use this while Chrome is loading a page. Here, Escape counts as the requested practice key; during other exercises it returns to the topic list."],
    ["Control+D", "Bookmarks the current page.", "Save a page you want to revisit. In Chrome, review the bookmark's name and folder before confirming it."],
    ["Control+P", "Shows print options for the page.", "Use the print preview to choose a printer or a PDF destination. Opening these options does not immediately print the page."],
    ["Control+S", "Shows options for saving the page.", "Choose where to keep a local copy of the webpage. This is different from adding a bookmark, which saves a way to return to its web address."],
    ["Control+O", "Lets you choose a local file to open.", "Use the file picker to find a file Chrome can display, such as a PDF or an HTML page. The practice rehearses opening the picker, not selecting a real file."],
    ["Control+Shift+Equals", "Enlarges the text and images on the page.", "On a US keyboard, Shift with the Equals key produces the plus sign used for zooming in. Increase zoom a step at a time to find a comfortable size."],
    ["Control+-", "Reduces the page's zoom level.", "Use the Minus key with Control to make the page smaller. This can help bring more of a page into view after zooming in."],
    ["Control+0", "Restores the page's default zoom.", "Use the number zero, not the letter O. This returns to the default page zoom set in Chrome's settings."],
    ["Space", "Scrolls down by about one screen.", "Use this with the page body active. In a text field it types a space, and on a button it may activate the button instead."],
    ["Shift+Space", "Scrolls up by about one screen.", "Use this with the page body active to return to the preceding screen of content. Check where focus is before trying it in a real page."],
    ["Page Down", "Scrolls farther down the page.", "Move through a long article a screen at a time. This changes the view; a screen reader may use its own commands to move its reading position."],
    ["Page Up", "Scrolls farther up the page.", "Return toward earlier content in a long page. If your keyboard combines this key with an arrow key, use the keyboard's Page Up function."],
    ["Home", "Jumps to the top of the page.", "Use this with the page itself active. Inside an editable field, Home may move the text cursor within that field instead."],
    ["End", "Jumps to the bottom of the page.", "Use this with the page itself active to reach the end of a long page. The result differs when the cursor is inside an editable field."]
  ];

  const intermediate = [
    ["Control+Tab", "Switches to the next browser tab.", "Use the tab order to move between an article and a reference page. Listen for the destination tab's title before continuing."],
    ["Control+Page Down", "Switches to the next browser tab.", "This is an alternative to Control plus Tab. It changes tabs rather than scrolling within the current page."],
    ["Control+Shift+Tab", "Switches to the previous browser tab.", "Move backward through your open tabs. This reverses the direction of Control plus Tab."],
    ["Control+Page Up", "Switches to the previous browser tab.", "Use this as another way to return to an earlier tab in the window. Page Up by itself scrolls instead."],
    ...Array.from({ length: 8 }, (_, index) => {
      const number = index + 1;
      return ["Control+" + number, "Switches to tab " + number + ".", "Count tabs from the left side of the current window. This jumps directly to position " + number + " when that tab exists, rather than stepping through tabs one at a time."];
    }),
    ["Control+9", "Switches to the last browser tab.", "Nine means the last tab in the current window, even if you have fewer or more than nine tabs open."],
    ["Control+W", "Closes the current browser tab.", "Check the active tab's title before using this in Chrome. Closing the last tab also closes that window. Here you enter the keys separately."],
    ["Control+F4", "Closes the current browser tab.", "This is another tab-closing command on Windows. It affects the current tab, while Alt plus F4 closes the whole window."],
    ["Control+Shift+T", "Brings back a recently closed tab.", "Use this after closing a page you still need. Repeating the command restores earlier closed tabs in order."],
    ["Control+Shift+W", "Closes the current browser window.", "This affects the window and its open tabs. Save any work in those tabs first when using the command in Chrome."],
    ["Alt+F4", "Closes the active Chrome window.", "Windows sends this command to the active application window. In this course, practice each key separately so the browser window stays available."],
    ["Control+H", "Shows your browsing history.", "Use the History page to look for a website you visited earlier. A saved bookmark and a history entry are different ways to find a page again."],
    ["Control+J", "Shows your downloads.", "Find the status and names of files downloaded with Chrome. Confirm which file you want before opening it."],
    ["Control+Shift+O", "Opens the bookmark organizer.", "Use the Bookmark Manager to find, rename, move, or remove saved bookmarks. The final key is the letter O, not the number zero."],
    ["Control+Shift+B", "Shows or hides the bookmarks bar.", "Use this to make saved bookmarks available on the browser's toolbar or to regain space for the page. Your bookmarks remain saved when the bar is hidden."],
    ["Control+Shift+D", "Bookmarks all open tabs in a folder.", "Use this to save a group of research pages together. Choose a folder name that will help you recognize the group later."],
    ["Control+K", "Starts a search from the address bar.", "Use this while reading a page when you want to begin a new web search. Type the search terms and press Enter in Chrome."],
    ["Control+E", "Starts a search from the address bar.", "This is an alternative to Control plus K. Chrome uses the search engine configured for the address bar."],
    ["Control+Left Arrow", "Moves back one word in a text field.", "Use this with the cursor in the address bar or another editable text field. It moves the cursor without highlighting the word."],
    ["Control+Right Arrow", "Moves forward one word in a text field.", "Use this while editing an address or other text. Focus must be in the editable field for this text-movement command."],
    ["Control+Backspace", "Deletes the word before the text cursor.", "Use this in an editable text field, such as the address bar. Check the cursor position so you remove the intended word."],
    ["F6", "Moves focus between browser areas.", "Cycle through the page, browser toolbars, and any available dialog. Listen to the focused area's name so you know whether your next key will affect Chrome or the page."],
    ["Control+F6", "Moves focus to the webpage content.", "Use this when you are in Chrome's controls and want to return to the page. Your screen reader may then use its own reading or navigation commands."],
    ["Alt+Shift+T", "Focuses the first toolbar item.", "Use this to reach Chrome's toolbar from the keyboard. Listen to the focused control before navigating or activating anything."],
    ["F10", "Focuses the last toolbar item.", "This reaches the right end of Chrome's toolbar. The available controls depend on your browser setup and extensions."],
    ["F7", "Switches caret browsing on or off.", "Caret browsing places a movable text cursor in webpage content. Read any confirmation Chrome shows. It is separate from a screen reader's browse mode."]
  ];

  const advanced = [
    ["Alt+F", "Opens Chrome's main menu.", "Use the arrow keys to explore menu items, then Enter to choose one. This is Chrome's menu, not a File menu inside a website such as Google Docs."],
    ["Alt+E", "Opens Chrome's main menu.", "This is another shortcut for the same Chrome menu. Practice recognizing which menu has focus before using an arrow key or Enter."],
    ["Alt+F then X", "Exits Chrome from its menu.", "With Chrome's interface in English, open its menu with Alt plus F, release those keys, then press X. Save work before using this in the real browser."],
    ["Alt+Space then N", "Minimizes the Chrome window.", "With the Windows window menu in English, hold Alt and press Space, release both, then press N. The window stays open and can be restored from the taskbar."],
    ["Alt+Space then X", "Maximizes the Chrome window.", "With the Windows window menu in English, open the window menu using Alt plus Space, release the keys, then press X. This enlarges the window without entering Chrome's full-screen view."],
    ["Control+Shift+N", "Starts an Incognito window.", "Use a separate Incognito session when you need that browsing mode. Incognito does not make your browsing anonymous to websites or your network."],
    ["Control+Shift+R", "Refreshes the page using fresh content.", "Use this when a normal refresh still shows an old version of a page. It bypasses cached content for the reload; save form work first."],
    ["Shift+F5", "Refreshes the page using fresh content.", "This is another way to bypass cached page content during a reload. It has a different purpose from simply returning to the top of the page."],
    ["Control+Shift+Delete", "Shows browsing-data deletion options.", "Opening the dialog does not delete data by itself. In Chrome, review the time range and selected data types before confirming any deletion."],
    ["Shift+Escape", "Opens Chrome's task manager.", "Use Chrome's own Task Manager to inspect browser tasks. It is different from Windows Task Manager. Opening it does not stop a tab or process."],
    ["Control+Shift+M", "Shows Chrome's profile choices.", "Use the profile menu when you need a different browser profile or Guest browsing. Check which profile you choose before continuing with account-related work."],
    ["Alt+Shift+I", "Opens Chrome's feedback form.", "Use the browser's feedback form to describe an issue. This exercise only rehearses opening the form and does not send feedback."],
    ["Alt+Shift+A", "Focuses an inactive browser dialog.", "Use this when Chrome has a dialog waiting outside the current focus. It requires a suitable dialog to be present; it does not create one."],
    ["Alt+Shift+N", "Starts split view for the active tab.", "Use split view to work with pages side by side inside Chrome. This shortcut applies to Chrome versions that provide the split-view feature."],
    ["F11", "Toggles Chrome's full-screen view.", "Full-screen view gives the page more room and hides some browser controls. Press F11 again in Chrome to return to the normal window view."],
    ["Control+Shift+Page Up", "Moves the current tab to the left.", "Rearrange the tab's position within its window. This moves the tab itself; Control plus Page Up without Shift changes which tab you are using."],
    ["Control+Shift+Page Down", "Moves the current tab to the right.", "Place the active tab later in the window's tab order. Listen for the tab position if your screen reader announces it."],
    ["Alt+Enter", "Runs an address-bar search in a new tab.", "First type search terms in Chrome's address bar. Use this shortcut to open the search in a new tab while keeping the original page available."],
    ["Control+Enter", "Completes a dot-com address in this tab.", "With a site name such as example typed in the address bar, Chrome adds www. and .com. Use the full address normally for sites with other endings."],
    ["Control+Shift+Enter", "Completes a dot-com address in a new window.", "First enter the site name in the address bar. Chrome adds www. and .com and opens the resulting address in another window."],
    ["Down Arrow then Shift+Delete", "Removes a selected address-bar suggestion.", "With address-bar predictions showing, move down to the unwanted suggestion, then use Shift plus Delete. Only suggestions Chrome permits you to remove will respond."],
    ["Control+U", "Shows the page's HTML source.", "Use this to inspect the source behind a page. This view contains markup rather than the page's normal reading layout, and does not edit the website."],
    ["Control+Shift+J", "Opens developer tools at the console.", "This technical tool displays page messages and provides a JavaScript console. The practice teaches the opening command; no code needs to be entered."],
    ["F12", "Opens developer tools.", "Chrome's developer tools help inspect a page and investigate technical problems. Their controls are separate from the webpage and ordinary browser toolbars."],
    ["F1", "Opens Chrome's help resources.", "Use this when you need instructions for a browser feature. On keyboards that reserve the function row for hardware controls, use the keyboard's F1 function."]
  ];

  window.CommandPracticeCourses ||= {};
  window.CommandPracticeCourses[category] = [
    ...level("basic", basic), ...level("intermediate", intermediate), ...level("advanced", advanced)
  ];
  window.CommandPracticeCourseNotes ||= {};
  window.CommandPracticeCourseNotes[category] = "Google Chrome on Windows. Menu-letter sequences use English menus. Browser shortcuts are rehearsed one key at a time, with instructions for holding the real shortcut.";
})();
