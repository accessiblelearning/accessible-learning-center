(function () {
  "use strict";

  const PREVIEW_CODE = "KEYS2026";
  const STORAGE_KEY = "alcKeyboardingProgressV1";
  const EARLY_WORDS = new Set(["sad", "dad", "fad", "add", "ads", "dads", "fads", "had", "has", "gas", "gag", "half", "hall", "dash", "hash"]);
  const LEFT_KEYS = "qwertasdfgzxcvb12345`~!@#$%";
  const RIGHT_KEYS = "yuiophjklnm67890-=[]\\;',./^&*()_+{}|:\"<>?";
  const WORD_BANK = [
    "a", "add", "all", "ask", "at", "bad", "bag", "ball", "best", "big", "book", "bring", "calm", "can", "cat", "clear", "come", "day", "desk", "dog", "each", "easy", "fast", "find", "first", "from", "good", "great", "hand", "help", "home", "hope", "join", "jump", "keep", "key", "kind", "learn", "left", "light", "look", "make", "map", "milk", "move", "new", "next", "nice", "now", "open", "page", "place", "practice", "press", "quick", "read", "ready", "right", "row", "safe", "see", "slow", "small", "space", "start", "steady", "step", "still", "take", "text", "time", "today", "type", "use", "very", "voice", "word", "work", "write", "you"
  ];
  const SENTENCE_BANK = [
    "a fast reader starts at a safe rate.",
    "join in. you jump.",
    "keep your hands ready on the home row.",
    "type each word at a calm and steady pace.",
    "accuracy comes first and speed grows with practice.",
    "use a light touch and return each finger to home row.",
    "today i will type with care and correct my difficult keys.",
    "the quick brown fox jumps over the lazy dog.",
    "i practiced for 10 minutes and reached 25 words per minute!"
  ];

  // [title, goal, newly introduced keys, practice groups, lesson introduction]
  const lessonData = [
    ["Left Home Row ASDF", "Find F by its raised bump, then position the remaining left-hand fingers on D, S, and A.", "asdf", ["fdsa fdsa fdsa", "asdf asdf asdf", "fa fd fs da ds sa", "sad dad fad add", "ads dads fads"], "Find F by feeling for its raised bump. Place your left pointer finger on F. Moving to the left, place your middle finger on D, your ring finger on S, and your pinky finger on A. Use either thumb for Space."],
    ["Right Home Row JKL Semicolon", "Find J by its raised bump, then position the remaining right-hand fingers on K, L, and semicolon.", "jkl;", ["jkl; jkl; jkl;", ";lkj ;lkj ;lkj", "jk jl j; kl k; l;", "jkl jkj klk l;l", "j; kl; jkl;"], "Find J by feeling for its raised bump. Place your right pointer finger on J. Moving to the right, place your middle finger on K, your ring finger on L, and your pinky finger on semicolon."],
    ["G and H with the Full Home Row", "Reach to G and H, then return the index fingers to F and J.", "gh", ["fff ggg fg gf", "jjj hhh jh hj", "gh hg fgh ghj", "had has gas gag", "half hall dash hash", "asdf gh jkl;"], "Move the left index finger from F to G and the right index finger from J to H. Return to F and J after every reach."],
    ["Home Row Review", "Type home-row patterns and words with steady, even movement.", "asdfghjkl;", ["asdf jkl; fdsa ;lkj", "ask all fall glad", "salad glass flags", "shall flash halls", "a glad lad", "all flags fall"], "Keep both hands on the home row. Use a light touch and reset on F and J whenever your position feels uncertain."],
    ["Left Top Row QWER", "Reach from the left home row to Q, W, E, and R.", "qwer", ["aq aq sw sw de de fr fr", "qwer rewq qwer", "read dear seed free", "wear fear rear", "safe safer freed", "a red flag"], "Reach from A to Q, S to W, D to E, and F to R. Return each finger to the home row after pressing a top-row key."],
    ["T with the Left Top Row", "Reach the left index finger to T and combine it with learned keys.", "t", ["ft ft rt tr ft", "qwert trewq", "rest test fast start", "after street treat", "great draft taste", "a fast start"], "Reach the left index finger from F past R to T, then return it to F."],
    ["Right Top Row UIOP", "Reach from the right home row to U, I, O, and P.", "uiop", ["ju ju ki ki lo lo ;p ;p", "uiop poiu uiop", "oil pool look pull", "loop pill soup", "pour spoil polite", "pull it up"], "Reach from J to U, K to I, L to O, and semicolon to P. Return each finger to the home row."],
    ["Y with the Right Top Row", "Reach the right index finger to Y and combine both top-row hands.", "y", ["jy jy uy yu jy", "yuiop poiuy", "you your joy day", "play stay reply", "ready really pretty", "you did well"], "Reach the right index finger from J past U to Y, then return it to J."],
    ["Top Row and Home Row Practice", "Move between the top and home rows without losing hand position.", "qwertyuiopasdfghjkl;", ["quiet write power", "people follow today", "yellow flower water", "reader paper story", "please read it", "write your reply"], "Keep F and J as your anchors. Reach up for each top-row key and return home."],
    ["Building More Words", "Type longer words and short phrases with the top and home rows.", "qwertyuiopasdfghjkl;", ["weather airport railroad", "great laughter quality", "reported prepared started", "a quiet hour", "the yellow paper", "please start today"], "Notice the letters in each word, then type the word as one smooth unit. Use one Space between words."],
    ["Left Bottom Row ZXCV", "Reach from the left home row to Z, X, C, and V.", "zxcv", ["az az sx sx dc dc fv fv", "zxcv vcxz zxcv", "save cave race voice", "zero cover exact", "active creative", "save your work"], "Reach from A to Z, S to X, D to C, and F to V. Return each finger to the home row."],
    ["B with the Left Bottom Row", "Reach the left index finger to B and use it in words.", "b", ["fb fb vb bv fb", "zxcvb bvcxz", "bar bed best blue", "table about brave", "above bright trouble", "be ready to type"], "Reach the left index finger from F past V to B, then return it to F."],
    ["Right Bottom Row NM", "Reach from the right home row to N and M.", "nm", ["jn jn km km nm mn", "name home mine", "number morning moment", "learn remain normal", "many new words", "remember your home row"], "Reach the right index finger from J to N and the right middle finger from K to M. Return both fingers home."],
    ["Comma Period and Slash", "Find comma, period, and slash with the right hand.", ",./", ["k, k, l. l. ;/ ;/", "red, blue, green", "read. write. rest.", "yes/no on/off", "slow, calm, steady.", "type, check, continue."], "Reach from K to comma, L to period, and semicolon to slash. Return to K, L, and semicolon after each reach."],
    ["Full Alphabet Review", "Use every letter of the alphabet with correct finger movement.", "abcdefghijklmnopqrstuvwxyz", ["abcdefghijklmnopqrstuvwxyz", "zyxwvutsrqponmlkjihgfedcba", "quick brown fox", "jumps over lazy dog", "box five dozen jugs", "pack my red box."], "Reset on F and J before each group. This is an accuracy check, not a speed test."],
    ["Short Words and Phrases", "Type useful words and phrases with rhythm and clean spacing.", "abcdefghijklmnopqrstuvwxyz", ["open the file", "save the new work", "meet me at home", "bring your blue bag", "we can begin now", "please send a reply"], "Listen to the full phrase before typing it. Keep one Space between words and use Backspace to correct an error."],
    ["Shift and Capital Letters", "Use Shift with the opposite hand to type one capital letter.", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", ["A S D F", "J K L G H", "M R T P", "Sam Jill Mark", "Monday Friday", "Indiana Boston"], "Hold Shift with the hand opposite the letter, press the letter, and release both keys. Use Caps Lock only for several capitals in a row."],
    ["Capitalized Words and Names", "Type names, days, months, and places with initial capitals.", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", ["Rosa Jacob Alex", "Tuesday Saturday", "January September", "Indiana Chicago", "Main Street", "Lake View Road"], "Hold Shift only for the first letter of each capitalized word, then continue with lowercase letters."],
    ["Simple Sentences with 1 and 2", "Type complete sentences and introduce the number keys 1 and 2.", "12", ["1 1 1 2 2 2", "12 21 12 21", "I have 1 dog.", "Sam has 2 bags.", "The 2 dogs ran.", "I read 1 new book."], "Reach the left pinky to 1 and the left ring finger to 2. Return to the home row after each number."],
    ["Sentence Building with 3 and 4", "Add useful details to sentences and introduce 3 and 4.", "34", ["3 3 3 4 4 4", "34 43 1234", "I have 3 red hats.", "The 4 dogs ran home.", "Mark read 3 pages today.", "Jill packed 4 blue bags."], "Reach the left middle finger to 3 and the left index finger to 4, then return home."],
    ["Questions with 5 and 6", "Type questions and introduce the number keys 5 and 6.", "56?", ["5 5 5 6 6 6", "56 65 123456", "Do you have 5 bags?", "Did Sam read 6 pages?", "Are the 5 boxes ready?", "Can we meet at 6?"], "Reach the left index finger to 5 and the right index finger to 6. Hold left Shift and press slash with the right pinky for a question mark."],
    ["Questions and Answers with 7 and 8", "Type connected questions and answers while introducing 7 and 8.", "78", ["7 7 7 8 8 8", "78 87 12345678", "Did you get 7 books?", "Yes, I got 7 books.", "Are all 8 bags ready?", "No, 2 bags are not ready."], "Reach the right index finger to 7 and the right middle finger to 8. Use a question mark for a question and a period for an answer."],
    ["Exclamation Point with 9 and 0", "Use an exclamation point and complete the number row with 9 and 0.", "90!", ["9 9 9 0 0 0", "90 09 1234567890", "I got 9 right!", "We reached 10!", "That was a great job!", "Please stop!"], "Reach the right ring finger to 9 and the right pinky to 0. Hold right Shift and press 1 for an exclamation point."],
    ["Capitalization and Ending Punctuation", "Choose a period, question mark, or exclamation point for each sentence.", "ABCDEFGHIJKLMNOPQRSTUVWXYZ?!.", ["The meeting begins at 10.", "Will you arrive at 9?", "I finished all 8 pages!", "Please bring 2 blue folders.", "Did Mark call at 6?", "What a fast reply!"], "Use a period for a statement, a question mark for a direct question, and an exclamation point for strong feeling."],
    ["Money and the Dollar Sign", "Type dollar amounts inside complete sentences.", "$", ["$4 $9 $10 $25", "The blue bag costs $9.", "I saved $20.", "The 2 books cost $14.", "Did you pay $5?", "Yes! I paid $5."], "Hold right Shift and press 4 for the dollar sign. Place it directly before the amount with no Space."],
    ["Commas in a Series", "Use commas to separate three or more items.", ",", ["red, blue, and green", "books, folders, and pens", "I packed 2 shirts, 3 socks, and 1 hat.", "We need paper, tape, and boxes.", "Sam called Mark, Jill, and Alex.", "I paid $4, $6, and $8."], "Type one Space after each comma. Place a comma before the final and in each series."],
    ["Apostrophes in Contractions", "Use an apostrophe where letters are left out of a contraction.", "'", ["I am I'm", "do not don't", "can not can't", "it is it's", "I'm ready to begin.", "Don't close the file.", "It's 5 now."], "Press the apostrophe key with the right pinky. Keep the apostrophe inside a contraction with no Spaces around it."],
    ["Apostrophes in Possessives", "Use an apostrophe to show that something belongs to someone or something.", "'", ["Sam's hat", "Jill's book", "the dog's bowl", "Mark's 2 files", "Sam's bag costs $20.", "The dog's 4 toys are here.", "Is this Jill's folder?"], "For one owner, add an apostrophe and S. The apostrophe shows who owns the item."],
    ["Ages Dates and Quantities", "Use numbers naturally in practical sentences.", "0123456789", ["The class starts at 9.", "Read pages 4 and 5.", "Alex is 30 years old.", "The meeting is on September 12.", "Pack 3 boxes with 8 books each.", "I worked for 2 hours."], "Use numerals for dates, ages, times, page numbers, and exact quantities. Keep a Space between a number and the word after it."],
    ["Percent Sign in Sentences", "Type the percent sign with numbers in complete sentences.", "%", ["5% 10% 25% 90%", "I finished 50% of the work.", "The battery is at 20%.", "The price dropped by 10%.", "Did you score 80%?", "Yes! I scored 90%."], "Hold right Shift and press 5 for the percent sign. Place it directly after the number with no Space."],
    ["At Sign and Email Addresses", "Type the at sign and the basic parts of an email address.", "@", ["name@example.com", "sam12@mail.com", "jill.work@example.org", "My email is name@example.com.", "Send the file to sam12@mail.com.", "Did you email jill.work@example.org?"], "Hold right Shift and press 2 for the at sign. An email address contains no Spaces."],
    ["Number Sign in Practical Text", "Use the number sign for labels and short references.", "#", ["Room #4", "Order #25", "Item #8", "Please check order #25.", "The meeting is in room #4.", "I need item #8 by 3."], "Hold right Shift and press 3 for the number sign. It can label an item, room, order, or reference number."],
    ["Ampersand in Names and Labels", "Use the ampersand in names and compact labels.", "&", ["Smith & Jones", "Research & Development", "Q&A", "The file is named Q&A Notes.", "I called Smith & Jones at 9.", "Please open the Research & Development folder."], "Hold left Shift and press 7 for an ampersand. Use one Space on each side when it joins names."],
    ["Parentheses in Sentences", "Place extra information inside parentheses.", "()", ["(Monday)", "(2 pages)", "(Room 4)", "The class meets at 9 (Room 4).", "Please read the file (2 pages).", "Sam will call on Monday (September 12)."], "Hold left Shift and press 9 for an opening parenthesis and 0 for a closing parenthesis."],
    ["Quotation Marks", "Place exact spoken or written words inside quotation marks.", "\"", ["\"Please begin,\" Sam said.", "Jill said, \"I am ready.\"", "The sign reads, \"Open at 9.\"", "Mark asked, \"Is the file ready?\"", "\"Yes, it is ready,\" I said."], "Hold Shift and press the apostrophe key for a quotation mark. Use both an opening and closing quotation mark."],
    ["Dialogue Practice", "Type short exchanges with quotation marks and varied ending punctuation.", "\"", ["\"Are you ready?\" Jill asked.", "\"Yes, I am ready,\" Sam said.", "\"Please open file #4,\" Jill said.", "\"Does it cost $8?\" Mark asked.", "\"No, it costs $6,\" Sam replied."], "Keep each speaker's exact words inside quotation marks and let the meaning guide the ending punctuation."],
    ["Hyphens and Underscores", "Use a hyphen in joined words and an underscore in names or labels.", "-_", ["part-time", "well-known", "step-by-step", "student_notes", "lesson_4_notes", "I saved the step-by-step guide.", "Open the file named lesson_4_notes."], "Press the hyphen key with the right pinky. Hold Shift while pressing it for an underscore."],
    ["Longer Sentences", "Type longer sentences in meaningful groups rather than one letter at a time.", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,./?!'$%@#&()\"-_", ["The morning class begins at 9 and ends at 10.", "Please open file #4, read 2 pages, and save your notes.", "Sam paid $20 for 3 books at the store.", "Jill's new email address is jill.work@example.org.", "The battery reached 90% before the meeting began."], "Listen to the full sentence, then type one phrase at a time. Pause at a comma without adding an extra Space."],
    ["Sentence Practice 1", "Type complete statements with clear subjects and actions.", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,./?!'$%@#&()\"-_", ["The dog rested by the door.", "Sam opened the blue folder.", "Jill saved 3 files today.", "The class reviewed pages 8 and 9.", "My new keyboard works well."], "Type steadily from the capital letter through the final period."],
    ["Sentence Practice 2", "Join related ideas with and, but, or or.", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,./?!'$%@#&()\"-_", ["Sam opened the file, and Jill read it.", "I wanted the blue bag, but it cost $25.", "We can meet at 9, or we can meet at 10.", "The work was hard, but I finished it.", "Mark called, and I sent a reply."], "Use and to add an idea, but to show a difference, and or to show a choice."],
    ["Sentence Practice 3", "Type sentences that explain a reason or a result.", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,./?!'$%@#&()\"-_", ["I saved the file because the work was complete.", "Jill called because she needed help.", "The meeting ended early, so I went home.", "The battery was low, so I charged it.", "We packed 4 boxes because the move starts Monday."], "Because introduces a reason. So introduces a result."],
    ["Sentence Practice 4", "Type sentences that show when something happens.", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,./?!'$%@#&()\"-_", ["When the class ended, I saved my work.", "Before you close the file, check the name.", "After Sam called, I sent the 2 pages.", "I charged the battery before the meeting began.", "Jill smiled when she read the reply."], "Words such as when, before, and after connect actions in time."],
    ["Sentence Practice 5", "Type sentences that describe a condition or possibility.", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,./?!'$%@#&()\"-_", ["If the file opens, read page 4.", "If you need help, call me at 9.", "We can begin if all 8 people are ready.", "If the bag costs $20, I will buy it.", "The class will meet online if the room is closed."], "If introduces a condition. Use a comma after an opening if phrase."],
    ["Sentence Practice 6", "Combine capitals, numbers, punctuation, and symbols in detailed sentences.", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,./?!'$%@#&()\"-_", ["When Jill arrived at 9, she opened file #4 and read 50% of it.", "If the 2 books cost less than $20, Sam will buy them.", "Mark asked, \"Can you email the notes to me?\"", "Before Monday, save the file as lesson_8_notes.", "The class was part-time, but it included 10 useful lessons."], "Check capitals, Spaces, numbers, symbols, and final punctuation in every sentence."],
    ["Paragraph Practice 1", "Type a short paragraph made of connected sentences.", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,./?!'$%@#&()\"-_", ["Sam began work at 9.", "He opened the blue folder and reviewed 4 files.", "When he finished, he emailed the notes to Jill.", "The work took 2 hours."], "These four sentences form one paragraph about Sam's work. Type one sentence at a time."],
    ["Paragraph Practice 2", "Type a paragraph that includes a question and an answer.", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,./?!'$%@#&()\"-_", ["Jill checked her email before class.", "Did Sam send the new file?", "Yes, he sent it at 8.", "Jill opened file #6 and read all 3 pages before the meeting."], "Listen for the change from statement to question to answer as you type each sentence."],
    ["Practical Typing 1", "Type a clear personal or workplace message.", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,./?!'$%@#&()\"-_", ["Hi Jill,", "The meeting will begin at 9 in Room #4.", "Please bring the 2 blue folders.", "Let me know if you have any questions.", "Thank you,", "Sam"], "A clear message states its purpose, gives needed details, and ends politely. Each screen represents a new line."],
    ["Practical Typing 2", "Type short instructions in a clear order.", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,./?!'$%@#&()\"-_", ["1. Open the folder.", "2. Select file #4.", "3. Read pages 2 and 3.", "4. Save the notes as lesson_4_notes.", "5. Email the file to name@example.com."], "Type the numbered steps in order. Each screen represents one instruction."],
    ["Complex Sentence Practice", "Type a short paragraph with several connected sentence structures.", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,./?!'$%@#&()\"-_", ["Although the morning was busy,", "Jill arrived at 9 and opened the class files.", "She reviewed 5 lessons because the new group would begin on Monday.", "When Sam asked, \"Is everything ready?\"", "Jill replied, \"Yes, all 10 files are ready.\""], "Type one phrase at a time and keep the punctuation accurate while moving through longer ideas."],
    ["Final Keyboarding Challenge", "Use the full keyboarding course in one final practice.", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,./?!'$%@#&()\"-_", ["On Monday, September 12, Sam and Jill met at 9 in Room #4.", "They reviewed 10 files and corrected 2 email addresses.", "They completed 90% of the project before lunch.", "When Jill asked, \"Can we finish today?\"", "Sam replied, \"Yes!\"", "If we complete the last 3 pages,", "we can send the final file to name@example.com.", "The team saved the work as final_project_notes and finished by 4."], "Begin with your fingers on F and J. Work accurately, correct mistakes, and type one part at a time. This is a skill check, not a race."]
  ];

  const panels = ["unlockPanel", "setupPanel", "practiceMenuPanel", "settingsPanel", "statsPanel", "practicePanel", "resultsPanel"].map(id => document.getElementById(id));
  const lessonSetting = document.getElementById("lessonSetting");
  const modeSetting = document.getElementById("modeSetting");
  const handSetting = document.getElementById("handSetting");
  const setupMenu = document.getElementById("setupMenu");
  const targetPrompt = document.getElementById("targetPrompt");
  const freeTypeInput = document.getElementById("freeTypeInput");
  const finishFreeType = document.getElementById("finishFreeType");
  const typedText = document.getElementById("typedText");
  const practiceStatus = document.getElementById("practiceStatus");
  const lessonProgress = document.getElementById("lessonProgress");
  const progressText = document.getElementById("progressText");
  const previewToolbar = document.getElementById("previewToolbar");
  const voiceToggle = document.getElementById("voiceToggle");
  const websiteControlsToggle = document.getElementById("websiteControlsToggle");
  const keyboardGuide = document.getElementById("keyboardGuide");
  const visualKeyboard = document.getElementById("visualKeyboard");
  const handCue = document.getElementById("handCue");
  const handSymbol = document.getElementById("handSymbol");
  let useSiteVoice = true;
  let useSounds = true;
  let showKeyboard = true;
  let showCaptions = false;
  let keyboardDarkMode = false;
  try {
    keyboardDarkMode = localStorage.getItem("alcKeyboardingDarkMode") === "on";
  } catch (error) {
    keyboardDarkMode = false;
  }
  let rememberProgress = false;
  let audioContext = null;
  let session = null;
  let timerId = null;
  let controlUsedAsModifier = false;
  const sessionUnlockedLessons = { both: 0, left: 0, right: 0 };

  function show(panelId) {
    const selected = document.getElementById(panelId);
    panels.forEach(panel => { panel.hidden = panel !== selected; });
    document.body.classList.toggle("kb-results-active", panelId === "resultsPanel");
    document.body.classList.toggle("kb-practice-active", panelId === "practicePanel");
    const heading = selected.querySelector("h1, h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus();
    }
    const firstChoice = Array.from(selected.querySelectorAll(".kb-arrow-menu .kb-menu-option, .kb-auto-focus")).find(button => !button.hidden && !button.disabled);
    if (firstChoice) window.setTimeout(() => firstChoice.focus(), 0);
  }

  function setWebsiteControlsMinimized(minimized) {
    document.body.classList.toggle("kb-controls-minimized", minimized);
    websiteControlsToggle.setAttribute("aria-expanded", String(!minimized));
    websiteControlsToggle.textContent = minimized ? "Show Website Controls" : "Minimize Website Controls";
  }

  function speak(message, onComplete) {
    let finished = false;
    const complete = () => {
      if (finished) return;
      finished = true;
      if (onComplete) onComplete();
    };
    if (!useSiteVoice || !("speechSynthesis" in window)) {
      complete();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.9;
    utterance.onend = complete;
    utterance.onerror = complete;
    window.speechSynthesis.speak(utterance);
  }

  function setVoice(enabled, announce) {
    useSiteVoice = enabled;
    document.querySelector('input[name="voice"][value="site"]').checked = enabled;
    document.querySelector('input[name="voice"][value="screen-reader"]').checked = !enabled;
    voiceToggle.setAttribute("aria-pressed", String(enabled));
    voiceToggle.textContent = enabled ? "Voice: On" : "Voice: Off";
    const menuVoice = document.getElementById("menuVoiceValue");
    if (menuVoice) menuVoice.textContent = enabled ? "Site voice" : "My screen reader";
    if (!enabled && "speechSynthesis" in window) window.speechSynthesis.cancel();
    if (enabled && announce) speak("Site voice on.");
  }

  function tone(frequency, duration) {
    if (!useSounds) return;
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.1, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      // Visual feedback remains available if sound is blocked.
    }
  }

  function belongsToHand(character, hand) {
    if (character === " ") return true;
    const lower = character.toLowerCase();
    if (hand === "left") return LEFT_KEYS.includes(lower) || LEFT_KEYS.includes(character);
    if (hand === "right") return RIGHT_KEYS.includes(lower) || RIGHT_KEYS.includes(character);
    return true;
  }

  function lessonFor(index, hand) {
    let allowed = hand === "left" ? " f" : hand === "right" ? " j" : " fj";
    for (let i = 0; i <= index; i += 1) {
      for (const character of lessonData[i][2]) {
        if (belongsToHand(character, hand) && !allowed.includes(character)) allowed += character;
      }
    }
    let focus = Array.from(lessonData[index][2]).filter(character => belongsToHand(character, hand)).join("");
    const adapted = hand !== "both" && !focus.trim();
    if (adapted) focus = allowed.replace(/ /g, "").slice(-5) || (hand === "right" ? "j" : "f");
    const description = adapted
      ? "Continue strengthening " + hand + "-hand keys while this lesson introduces the other side of the keyboard."
      : lessonData[index][1];
    return {
      number: index + 1,
      title: lessonData[index][0],
      description,
      allowed,
      focus,
      practiceGroups: lessonData[index][3],
      introduction: lessonData[index][4]
    };
  }

  function fits(text, allowed) {
    return Array.from(text).every(character => character === " " || allowed.includes(character));
  }

  function buildPrompt(lesson, mode, hand) {
    const lowerAllowed = lesson.allowed.toLowerCase() + lesson.allowed.toUpperCase();
    let words = WORD_BANK.filter(word => fits(word, lowerAllowed));
    if (hand !== "both") words = words.filter(word => Array.from(word).every(character => belongsToHand(character, hand)));
    if (!words.length) words = [lesson.focus.replace(/ /g, "") || (hand === "right" ? "j" : "f")];
    const start = (lesson.number * 3) % words.length;
    const selectedWords = Array.from({ length: 12 }, (_, index) => words[(start + index) % words.length]);
    const sentences = SENTENCE_BANK.filter(sentence => fits(sentence.toLowerCase(), lowerAllowed) && (hand === "both" || Array.from(sentence.toLowerCase()).every(character => !/[a-z]/.test(character) || belongsToHand(character, hand))));
    if (mode === "guided") {
      if (hand === "both") return lesson.practiceGroups.slice();
      const handGroups = lesson.practiceGroups.filter(group => Array.from(group).every(character => belongsToHand(character, hand)));
      if (handGroups.length >= 2) return handGroups;
      const reviewKeys = Array.from(new Set(lesson.focus.replace(/ /g, ""))).slice(0, 6);
      const keyGroups = reviewKeys.map(character => character.repeat(4));
      return keyGroups.length ? keyGroups : [hand === "right" ? "jjjj" : "ffff"];
    }
    if (mode === "words") return selectedWords.slice(0, 8).join(" ");
    if (mode === "sentences") return sentences[lesson.number % Math.max(sentences.length, 1)] || selectedWords.slice(0, 8).join(" ");
    if (mode.startsWith("speed-")) return Array.from({ length: 200 }, () => selectedWords.join(" ")).join(" ");
    if (mode === "free") return "";
    return selectedWords.join(" ");
  }

  function getProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return {
        completed: saved && Array.isArray(saved.completed) ? saved.completed : [],
        difficult: saved && saved.difficult && typeof saved.difficult === "object" ? saved.difficult : {},
        sessions: saved && Array.isArray(saved.sessions) ? saved.sessions : []
      };
    }
    catch (error) { return { completed: [], difficult: {}, sessions: [] }; }
  }

  function saveProgress() {
    if (!rememberProgress || !session) return false;
    try {
      const progress = getProgress();
      const completion = "en:" + session.hand + ":" + session.lesson.number;
      if (session.mode === "guided" && session.passed && !progress.completed.includes(completion)) progress.completed.push(completion);
      Object.keys(session.mistakesByKey).forEach(key => {
        progress.difficult[key] = (progress.difficult[key] || 0) + session.mistakesByKey[key];
      });
      progress.sessions.push({
        mode: session.mode,
        lesson: session.lesson.number,
        accuracy: session.finalAccuracy,
        wpm: session.finalWpm,
        targetAccuracy: session.targetAccuracy,
        targetWpm: session.targetWpm,
        seconds: session.elapsedSeconds,
        completedAt: Date.now()
      });
      progress.sessions = progress.sessions.slice(-100);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      return true;
    } catch (error) { return false; }
  }

  function speakable(text) {
    const names = {
      " ": "space", ";": "semicolon", ",": "comma", ".": "period",
      "?": "question mark", "!": "exclamation point", "/": "slash",
      "'": "apostrophe", '"': "quotation mark", ":": "colon",
      "@": "at sign", "#": "number sign", "$": "dollar sign",
      "%": "percent sign", "&": "ampersand", "(": "opening parenthesis",
      ")": "closing parenthesis", "-": "hyphen", "_": "underscore"
    };
    return names[text] || text;
  }

  function speakableSequence(text) {
    return Array.from(text).map(speakable).join(", ");
  }

  function spokenExactSequence(text) {
    return Array.from(text).map(spokenKeyName).join(", ");
  }

  function needsShift(character) {
    return /^[A-Z]$/.test(character) || "~!@#$%^&*()_+{}|:\"<>?".includes(character);
  }

  function spokenKeyName(character) {
    return /^[A-Z]$/.test(character) ? "capital " + character : speakable(character);
  }

  function requiredShift(character) {
    if (!needsShift(character)) return "";
    const guidance = keyFinger(character);
    if (guidance.handId === "left") return "right Shift";
    if (guidance.handId === "right") return "left Shift";
    return "Shift";
  }

  const KEYBOARD_ROWS = [
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", { key: "Backspace", label: "Backspace", size: "backspace" }],
    [{ key: "Tab", label: "Tab", size: "tab" }, "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    [{ key: "CapsLock", label: "Caps Lock", size: "caps" }, "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", { key: "Enter", label: "Enter", size: "enter" }],
    [{ key: "ShiftLeft", label: "Shift", size: "shift-left" }, "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", { key: "ShiftRight", label: "Shift", size: "shift-right" }],
    [{ key: "ControlLeft", label: "Ctrl", size: "control" }, { key: "AltLeft", label: "Alt", size: "alt" }, { key: " ", label: "Space", size: "space" }, { key: "AltRight", label: "Alt", size: "alt" }, { key: "ControlRight", label: "Ctrl", size: "control" }]
  ];

  function keyFinger(character) {
    const key = String(character || "").toLowerCase();
    const shiftedKeys = { "~": "`", "!": "1", "@": "2", "#": "3", "$": "4", "%": "5", "^": "6", "&": "7", "*": "8", "(": "9", ")": "0", "_": "-", "+": "=", "{": "[", "}": "]", "|": "\\", ":": ";", "\"": "'", "<": ",", ">": ".", "?": "/" };
    const displayKey = shiftedKeys[key] || key;
    if (key === " ") return { hand: "Either hand", handId: "either", finger: "Thumb", key: " " };
    const groups = [
      ["left", "Pinky finger", "`1qaz~!"], ["left", "Ring finger", "2wsx@"],
      ["left", "Middle finger", "3edc#"], ["left", "Index finger", "45rtfgvb$%"],
      ["right", "Index finger", "67yuhjnm^&"], ["right", "Middle finger", "8ik,<*"],
      ["right", "Ring finger", "9ol.>("], ["right", "Pinky finger", "0p;/'-=[]\\_+{}|:\"?)"]
    ];
    const match = groups.find(group => group[2].includes(key));
    return match
      ? { hand: match[0] === "left" ? "Left hand" : "Right hand", handId: match[0], finger: match[1], key: displayKey }
      : { hand: "Either hand", handId: "either", finger: "", key: displayKey };
  }

  function buildVisualKeyboard() {
    KEYBOARD_ROWS.forEach(keys => {
      const row = document.createElement("div");
      row.className = "kb-key-row";
      keys.forEach(item => {
        const key = typeof item === "string" ? { key: item, label: item === " " ? "Space" : item } : item;
        const marker = document.createElement("span");
        marker.className = "kb-key" + (key.size ? " kb-key--special kb-key--" + key.size : "");
        marker.dataset.key = key.key;
        marker.textContent = key.label;
        row.appendChild(marker);
      });
      visualKeyboard.appendChild(row);
    });
  }

  function updateKeyGuide() {
    const visible = session && session.started && !session.finished && session.mode !== "free" && showKeyboard;
    keyboardGuide.hidden = !visible;
    if (!visible) return;
    const guidance = keyFinger(session.prompt[session.position]);
    const shift = requiredShift(session.prompt[session.position]);
    const shiftKey = shift === "left Shift" ? "ShiftLeft" : shift === "right Shift" ? "ShiftRight" : "";
    visualKeyboard.querySelectorAll(".kb-key").forEach(key => {
      const isTypingKey = key.dataset.key === guidance.key;
      const isShiftKey = shiftKey && key.dataset.key === shiftKey;
      key.classList.toggle("kb-key--active", Boolean(isTypingKey || isShiftKey));
    });
    handSymbol.dataset.hand = guidance.handId;
    handCue.textContent = (shift ? "Hold " + shift + " • " : "") + guidance.hand + (guidance.finger ? " • " + guidance.finger : "");
    document.querySelector(".kb-hand-cue").hidden = false;
  }

  function currentPromptGroup() {
    if (!session || !session.promptGroups) return "";
    return session.promptGroups[session.groupIndex] || "";
  }

  function currentPromptGroupStart() {
    if (!session || !session.groupOffsets) return 0;
    return session.groupOffsets[session.groupIndex] || 0;
  }

  function spokenPromptGroup(group) {
    const forwardAlphabet = "abcdefghijklmnopqrstuvwxyz";
    const reverseAlphabet = "zyxwvutsrqponmlkjihgfedcba";
    const lowerGroup = group.toLowerCase();
    if (lowerGroup === forwardAlphabet) {
      return "the alphabet, " + spokenExactSequence(group);
    }
    if (lowerGroup === reverseAlphabet) {
      return "the alphabet in reverse, " + spokenExactSequence(group);
    }
    if (/^[A-Z](?: [A-Z])+$/.test(group)) {
      return "these capital letters with a space between each letter, " + spokenExactSequence(group);
    }
    if (!session) return speakableSequence(group);
    const words = group.split(" ").filter(Boolean);
    if (session.lesson.number >= 4 || (words.length && words.every(word => EARLY_WORDS.has(word)))) return group;
    return speakableSequence(group);
  }

  function announceCurrentPromptGroup() {
    const group = currentPromptGroup();
    if (!group || !session) return;
    session.accepting = true;
    session.announcementToken += 1;
    session.segmentStartedAt = Date.now();
    if (!session.startedAt) session.startedAt = session.segmentStartedAt;
    const guidance = keyFinger(group[0]);
    const repeatedKey = group.length > 1 && Array.from(group).every(character => character === group[0]);
    const message = repeatedKey
      ? spokenPromptGroup(group) + ". " + guidance.hand + ", " + guidance.finger + "."
      : "Type " + spokenPromptGroup(group) + ".";
    practiceStatus.textContent = message;
    targetPrompt.setAttribute("aria-label", message);
    speak(message);
  }

  function closePromptGroupTimer() {
    if (!session || !session.segmentStartedAt) return;
    session.typingMilliseconds += Date.now() - session.segmentStartedAt;
    session.segmentStartedAt = null;
  }

  function updateLessonSummary() {
    const lesson = lessonFor(Number(lessonSetting.value || 0), handSetting.value);
    document.getElementById("lessonSummary").textContent = "Lesson " + lesson.number + ": " + lesson.title + ". " + lesson.description;
    renderCurriculum();
    updateSetupMenu();
  }

  function selectedText(select) {
    return select.options[select.selectedIndex]?.textContent || "";
  }

  function updateSetupMenu() {
    document.getElementById("menuLessonValue").textContent = selectedText(lessonSetting);
    document.getElementById("menuHandValue").textContent = selectedText(handSetting);
    document.getElementById("menuVoiceValue").textContent = useSiteVoice ? "Site voice" : "My screen reader";
    document.getElementById("menuSoundValue").textContent = document.getElementById("soundSetting").checked ? "On" : "Off";
    document.getElementById("menuCaptionValue").textContent = document.getElementById("captionSetting").checked ? "On" : "Off";
    document.getElementById("menuKeyboardValue").textContent = document.getElementById("keyboardSetting").checked ? "Shown" : "Hidden";
    document.getElementById("menuWpmValue").textContent = document.getElementById("wpmSetting").value + " WPM";
    document.getElementById("menuAccuracyValue").textContent = document.getElementById("accuracySetting").value + "%";
    document.getElementById("wpmMinus").setAttribute("aria-label", "Decrease passing speed. Current target " + document.getElementById("wpmSetting").value + " words per minute.");
    document.getElementById("wpmPlus").setAttribute("aria-label", "Increase passing speed. Current target " + document.getElementById("wpmSetting").value + " words per minute.");
    document.getElementById("accuracyMinus").setAttribute("aria-label", "Decrease passing accuracy. Current target " + document.getElementById("accuracySetting").value + " percent.");
    document.getElementById("accuracyPlus").setAttribute("aria-label", "Increase passing accuracy. Current target " + document.getElementById("accuracySetting").value + " percent.");
    document.getElementById("menuSizeValue").textContent = selectedText(document.getElementById("textSizeSetting"));
    document.getElementById("menuDarkValue").textContent = keyboardDarkMode ? "On" : "Off";
    document.getElementById("menuSaveValue").textContent = document.getElementById("saveSetting").checked ? "On" : "Off";
    document.getElementById("menuLanguageValue").textContent = selectedText(document.getElementById("languageSetting"));
  }

  function unlockedLessonIndex(hand) {
    const completed = getProgress().completed || [];
    const prefix = "en:" + hand + ":";
    let unlocked = 0;
    while (unlocked < lessonData.length - 1 && completed.includes(prefix + (unlocked + 1))) unlocked += 1;
    return Math.max(unlocked, sessionUnlockedLessons[hand] || 0);
  }

  function refreshLessonAvailability() {
    const unlocked = unlockedLessonIndex(handSetting.value);
    Array.from(lessonSetting.options).forEach((option, index) => {
      option.disabled = index > unlocked;
    });
    if (Number(lessonSetting.value) > unlocked) lessonSetting.value = String(unlocked);
  }

  function cycleSelect(select, direction) {
    const count = select.options.length;
    select.selectedIndex = (select.selectedIndex + direction + count) % count;
  }

  function stepSelect(select, direction) {
    select.selectedIndex = Math.max(0, Math.min(select.options.length - 1, select.selectedIndex + direction));
  }

  function applyTextSize() {
    const scale = Number(document.getElementById("textSizeSetting").value);
    document.documentElement.style.setProperty("--kb-scale", String(scale));
    document.body.classList.toggle("kb-large-results", scale > 1.25);
  }

  function applyKeyboardDarkMode() {
    document.body.classList.toggle("kb-keyboarding-dark", keyboardDarkMode);
    const checkbox = document.getElementById("darkModeSetting");
    if (checkbox) checkbox.checked = keyboardDarkMode;
    const value = document.getElementById("menuDarkValue");
    if (value) value.textContent = keyboardDarkMode ? "On" : "Off";
  }

  function applyCaptionVisibility() {
    practiceStatus.classList.toggle("kb-visually-hidden", !showCaptions);
    practiceStatus.classList.toggle("kb-caption", showCaptions);
  }

  function adjustPracticeTextSize(direction) {
    const sizeSetting = document.getElementById("textSizeSetting");
    stepSelect(sizeSetting, direction);
    applyTextSize();
    updateSetupMenu();
    const message = "Print size: " + selectedText(sizeSetting) + ".";
    practiceStatus.textContent = message;
    speak(message);
  }

  function repeatPracticeInstruction() {
    if (!session) return;
    if (!session.started) {
      const message = startInstruction();
      practiceStatus.textContent = message;
      speak(message);
      return;
    }
    if (session.promptGroups && !session.accepting) {
      announceCurrentPromptGroup();
      return;
    }
    const message = nextKeyInstruction();
    practiceStatus.textContent = message;
    speak(message);
  }

  function startFromMenu() {
    useSounds = document.getElementById("soundSetting").checked;
    showKeyboard = document.getElementById("keyboardSetting").checked;
    showCaptions = document.getElementById("captionSetting").checked;
    rememberProgress = document.getElementById("saveSetting").checked;
    applyTextSize();
    applyCaptionVisibility();
    startPractice();
  }

  function activateSetting(button, direction) {
    const setting = button.dataset.setting;
    if (setting === "back") return show("setupPanel");
    if (setting === "hand") cycleSelect(handSetting, direction);
    if (setting === "wpm") stepSelect(document.getElementById("wpmSetting"), direction);
    if (setting === "accuracy") stepSelect(document.getElementById("accuracySetting"), direction);
    if (setting === "size") cycleSelect(document.getElementById("textSizeSetting"), direction);
    if (setting === "dark") {
      keyboardDarkMode = !keyboardDarkMode;
      try {
        localStorage.setItem("alcKeyboardingDarkMode", keyboardDarkMode ? "on" : "off");
      } catch (error) {
        // The setting still works for this visit when browser storage is unavailable.
      }
      applyKeyboardDarkMode();
    }
    if (setting === "language") cycleSelect(document.getElementById("languageSetting"), direction);
    if (setting === "sound") document.getElementById("soundSetting").checked = !document.getElementById("soundSetting").checked;
    if (setting === "captions") document.getElementById("captionSetting").checked = !document.getElementById("captionSetting").checked;
    if (setting === "keyboard") document.getElementById("keyboardSetting").checked = !document.getElementById("keyboardSetting").checked;
    if (setting === "save") document.getElementById("saveSetting").checked = !document.getElementById("saveSetting").checked;
    if (setting === "voice") setVoice(!useSiteVoice, false);
    if (setting === "hand") refreshLessonAvailability();
    if (setting === "hand") updateLessonSummary();
    else updateSetupMenu();
    if (setting === "size") applyTextSize();
    speak(button.textContent.trim());
  }

  function updateStats() {
    const progress = getProgress();
    const sessions = progress.sessions;
    const prefix = "en:" + handSetting.value + ":";
    const completedLessons = new Set(progress.completed.filter(item => item.startsWith(prefix)).map(item => item.slice(prefix.length)));
    document.getElementById("statsLessons").textContent = completedLessons.size + " of 50";
    document.getElementById("statsSessions").textContent = String(sessions.length);
    document.getElementById("statsAccuracy").textContent = sessions.length ? Math.max(...sessions.map(item => Number(item.accuracy) || 0)) + "%" : "No sessions";
    document.getElementById("statsSpeed").textContent = sessions.length ? Math.max(...sessions.map(item => Number(item.wpm) || 0)) + " WPM" : "No sessions";
    const minutes = Math.round(sessions.reduce((total, item) => total + (Number(item.seconds) || 0), 0) / 60);
    document.getElementById("statsTime").textContent = minutes + (minutes === 1 ? " minute" : " minutes");
    const difficult = Object.keys(progress.difficult).sort((a, b) => progress.difficult[b] - progress.difficult[a]).slice(0, 5);
    document.getElementById("statsDifficult").textContent = difficult.length ? difficult.map(speakable).join(", ") : "None";
    document.getElementById("statsNote").textContent = sessions.length
      ? "These stats are saved only on this browser."
      : "Turn on Save progress in Settings to build your stats on this browser.";
    renderCurriculum();
  }

  function renderCurriculum() {
    const list = document.getElementById("curriculumList");
    const hand = handSetting.value;
    const completed = getProgress().completed || [];
    list.replaceChildren();
    lessonData.forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = "Lesson " + (index + 1) + ": " + item[0] + " — " + item[1];
      if (completed.includes("en:" + hand + ":" + (index + 1))) {
        const mark = document.createElement("span");
        mark.className = "kb-complete";
        mark.textContent = " Completed";
        li.append(" ", mark);
      }
      list.appendChild(li);
    });
  }

  function populateLessons() {
    lessonData.forEach((lesson, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = "Lesson " + (index + 1) + ": " + lesson[0];
      lessonSetting.appendChild(option);
    });
    const progress = getProgress();
    const prefix = "en:" + handSetting.value + ":";
    const nextLesson = lessonData.findIndex((item, index) => !progress.completed.includes(prefix + (index + 1)));
    lessonSetting.value = String(nextLesson < 0 ? lessonData.length - 1 : nextLesson);
    refreshLessonAvailability();
    updateLessonSummary();
  }

  function currentInstruction() {
    if (!session) return "";
    if (session.mode === "free") return "Type anything you would like. Select Finish Free Typing when you are done.";
    if (session.durationSeconds) {
      const minutes = session.durationSeconds / 60;
      return "Speed test for " + minutes + (minutes === 1 ? " minute" : " minutes") + ". Begin typing. Next character: " + speakable(session.prompt[session.position]) + ".";
    }
    const mastery = session.mode === "guided" ? " To move on, reach " + session.targetAccuracy + " percent accuracy and " + session.targetWpm + " words per minute." : "";
    if (session.promptGroups) {
      const group = currentPromptGroup() || session.promptGroups[0];
      const position = session.started ? " Current group: " : " First group: ";
      return session.lesson.description + mastery + position + spokenPromptGroup(group) + ".";
    }
    const remaining = session.prompt.slice(session.position);
    if (session.mode === "guided" && remaining.length <= 80) {
      return session.lesson.description + mastery + " Type this sequence: " + speakableSequence(remaining) + ".";
    }
    const nextCharacter = session.prompt[session.position];
    return session.lesson.description + mastery + (nextCharacter === undefined ? "" : " Next character: " + speakable(nextCharacter) + ".");
  }

  function startInstruction() {
    const controls = " Press Control to repeat these instructions. The Control key is located in the bottom-left corner of your keyboard. Press any key to start. Press Escape to exit.";
    if (!session) return controls.trim();
    if (session.mode === "guided") {
      if (session.hand !== "both") {
        return session.lesson.description + " Begin with your " + session.hand + " hand in its home-row position." + controls;
      }
      let handPosition = " Begin with your " + session.hand + " hand in its home-row position.";
      if (session.hand === "both" && session.lesson.number === 1) handPosition = " Keep those fingers resting on F, D, S, and A.";
      else if (session.hand === "both" && session.lesson.number === 2) handPosition = " Keep your right hand on J, K, L, and semicolon.";
      else if (session.hand === "both") handPosition = " Begin with your index fingers on the raised bumps on F and J.";
      return session.lesson.introduction + handPosition + controls;
    }
    return currentInstruction() + controls;
  }

  function nextKeyInstruction() {
    if (!session) return "";
    if (session.mode === "free") return "Free typing has no required next key.";
    const nextCharacter = session.prompt[session.position];
    if (nextCharacter === undefined) return "Sequence complete.";
    const guidance = keyFinger(nextCharacter);
    const shift = requiredShift(nextCharacter);
    let remaining = "";
    if (session.promptGroups) {
      const groupEnd = currentPromptGroupStart() + currentPromptGroup().length;
      remaining = session.prompt.slice(session.position, groupEnd);
    } else {
      remaining = session.prompt.slice(session.position, session.position + 40);
    }
    const remainderMessage = remaining ? "Continue: " + spokenExactSequence(remaining) + ". " : "";
    return remainderMessage + "Next key: " + spokenKeyName(nextCharacter) + ". " + (shift ? "Hold " + shift + ". " : "") + guidance.hand + ", " + guidance.finger + ".";
  }

  function incorrectKeyInstruction(character) {
    const shift = requiredShift(character);
    const shortMessage = "Incorrect. Press " + spokenKeyName(character) + "." + (shift ? " Hold " + shift + "." : "");
    if (!session || session.mode !== "guided" || session.lesson.number > 15) return shortMessage;
    const locations = {
      q: "on the top row above A", w: "on the top row above S", e: "on the top row above D", r: "on the top row above F", t: "on the top row above G",
      y: "on the top row above H", u: "on the top row above J", i: "on the top row above K", o: "on the top row above L", p: "on the top row above semicolon",
      a: "on the home row below Q", s: "on the home row below W", d: "on the home row below E", f: "on the home row below R", g: "on the home row below T",
      h: "on the home row immediately to the left of J", j: "on the home row below U", k: "on the home row below I", l: "on the home row below O", ";": "on the home row below P",
      z: "on the bottom row below A", x: "on the bottom row below S", c: "on the bottom row below D", v: "on the bottom row below F", b: "on the bottom row below G",
      n: "on the bottom row below J", m: "on the bottom row below K", ",": "on the bottom row below K", ".": "on the bottom row below L", "/": "on the bottom row below semicolon"
    };
    const key = character.toLowerCase();
    if (!locations[key]) return shortMessage;
    const guidance = keyFinger(character);
    const hand = guidance.hand.replace(" hand", "").toLowerCase();
    const finger = guidance.finger.toLowerCase();
    const locator = key === "f" || key === "j" ? " This key has a raised locator bump." : "";
    return shortMessage + " It is " + locations[key] + "." + locator + " Use your " + hand + " " + finger + ".";
  }

  function renderTrackedPrompt() {
    if (!session || session.mode === "free") return;
    const start = session.promptGroups ? currentPromptGroupStart() : session.durationSeconds ? Math.max(0, session.position - 20) : 0;
    const end = session.promptGroups ? start + currentPromptGroup().length : session.durationSeconds ? Math.min(session.prompt.length, start + 700) : session.prompt.length;
    const line = document.createElement("span");
    line.className = "kb-prompt-line";
    for (let index = start; index < end; index += 1) {
      const character = session.prompt[index];
      const marker = document.createElement("span");
      marker.className = "kb-char";
      if (character === " ") marker.classList.add("kb-char-space");
      if (index < session.position) marker.classList.add("kb-char-complete");
      if (index === session.position) marker.classList.add("kb-char-current");
      marker.textContent = character === " " ? "\u00a0" : character;
      line.appendChild(marker);
    }
    targetPrompt.replaceChildren(line);
    const currentMarker = line.querySelector(".kb-char-current");
    if (currentMarker) {
      window.requestAnimationFrame(() => {
        const centeredPosition = currentMarker.offsetLeft - ((line.clientWidth - currentMarker.offsetWidth) / 2);
        line.scrollLeft = Math.max(0, centeredPosition);
      });
    }
    updateKeyGuide();
  }

  function renderPractice() {
    if (!session) return;
    const total = session.prompt.length;
    const modeNames = {
      guided: "Lesson " + session.lesson.number + ": " + session.lesson.title,
      words: "Practice Words",
      sentences: "Practice Sentences",
      "speed-60": "One-Minute Speed Test",
      "speed-180": "Three-Minute Speed Test",
      "speed-360": "Six-Minute Speed Test",
      free: "Free Typing"
    };
    document.getElementById("practiceHeading").textContent = modeNames[session.mode];
    document.getElementById("practiceInstruction").textContent = session.mode === "guided"
      ? session.lesson.description + " Pass with " + session.targetAccuracy + "% accuracy and " + session.targetWpm + " WPM to move on."
      : currentInstruction();
    if (!session.started) {
      keyboardGuide.hidden = true;
      targetPrompt.hidden = false;
      freeTypeInput.hidden = true;
      finishFreeType.hidden = true;
      lessonProgress.hidden = true;
      typedText.hidden = true;
      practiceStatus.hidden = !showCaptions;
      applyCaptionVisibility();
      targetPrompt.className = "kb-prompt kb-ready-prompt";
      targetPrompt.textContent = "Press any key to start";
      targetPrompt.setAttribute("aria-label", startInstruction());
      progressText.textContent = session.durationSeconds
        ? "Ready: " + (session.durationSeconds / 60) + (session.durationSeconds === 60 ? " minute" : " minutes")
        : "Ready to begin";
      practiceStatus.textContent = showCaptions ? startInstruction() : "The timer has not started.";
      const startShortcut = document.getElementById("startShortcut");
      if (startShortcut) startShortcut.hidden = false;
      targetPrompt.focus();
      return;
    }
    const startShortcut = document.getElementById("startShortcut");
    if (startShortcut) startShortcut.hidden = true;
    const isFree = session.mode === "free";
    keyboardGuide.hidden = isFree;
    targetPrompt.hidden = isFree;
    freeTypeInput.hidden = !isFree;
    finishFreeType.hidden = !isFree;
    lessonProgress.hidden = isFree;
    typedText.hidden = isFree;
    practiceStatus.hidden = false;
    applyCaptionVisibility();
    const displayedPromptLength = session.promptGroups ? currentPromptGroup().length : session.prompt.length;
    targetPrompt.className = "kb-prompt" + (displayedPromptLength > 40 ? " kb-prompt--long" : "");
    renderTrackedPrompt();
    targetPrompt.setAttribute("aria-label", "Typing area. " + currentInstruction());
    typedText.textContent = session.promptGroups
      ? "Part " + (session.groupIndex + 1) + " of " + session.promptGroups.length
      : session.prompt.slice(0, session.position) || "Not started";
    lessonProgress.max = session.durationSeconds || total || 1;
    lessonProgress.value = session.position;
    lessonProgress.textContent = total ? Math.round((session.position / total) * 100) + " percent" : "0 percent";
    progressText.textContent = session.durationSeconds ? session.secondsLeft + " seconds remaining" : isFree ? "Type at your own pace." : session.promptGroups
      ? "Part " + (session.groupIndex + 1) + " of " + session.promptGroups.length
      : "Character " + (session.position + 1) + " of " + total;
    practiceStatus.textContent = "Begin typing.";
    if (isFree) {
      freeTypeInput.value = "";
      freeTypeInput.focus();
    } else targetPrompt.focus();
  }

  function startPractice() {
    if (timerId) window.clearInterval(timerId);
    const hand = handSetting.value;
    const lesson = lessonFor(Number(lessonSetting.value), hand);
    const mode = modeSetting.value;
    const builtPrompt = buildPrompt(lesson, mode, hand);
    const promptGroups = mode === "guided"
      ? (Array.isArray(builtPrompt) ? builtPrompt : [builtPrompt]).filter(Boolean)
      : null;
    const prompt = promptGroups ? promptGroups.join("") : builtPrompt;
    const groupOffsets = promptGroups ? promptGroups.map((group, index) => promptGroups.slice(0, index).reduce((total, item) => total + item.length, 0)) : null;
    const durationSeconds = mode.startsWith("speed-") ? Number(mode.split("-")[1]) : 0;
    const targetAccuracy = Number(document.getElementById("accuracySetting").value);
    const targetWpm = Number(document.getElementById("wpmSetting").value);
    session = {
      lesson, hand, mode, prompt, position: 0, correct: 0, mistakes: 0,
      mistakesByKey: {}, startedAt: null, durationSeconds,
      secondsLeft: durationSeconds, targetAccuracy, targetWpm,
      promptGroups, groupOffsets, groupIndex: 0, announcementToken: 0,
      typingMilliseconds: 0, segmentStartedAt: null,
      started: false, finished: false, accepting: false
    };
    show("practicePanel");
    renderPractice();
    speak(startInstruction());
  }

  function beginPractice() {
    if (!session || session.started || session.finished) return;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    session.started = true;
    renderPractice();
    if (session.promptGroups) {
      announceCurrentPromptGroup();
      return;
    }
    session.accepting = true;
    session.startedAt = Date.now();
    if (session.durationSeconds) {
      timerId = window.setInterval(() => {
        if (!session || session.finished) return;
        session.secondsLeft -= 1;
        progressText.textContent = session.secondsLeft + " seconds remaining";
        lessonProgress.value = session.durationSeconds - session.secondsLeft;
        if (session.secondsLeft <= 0) finishPractice();
      }, 1000);
    }
  }

  function finishPractice() {
    if (!session || session.finished) return;
    if (session.promptGroups) closePromptGroupTimer();
    session.finished = true;
    session.accepting = false;
    if (timerId) window.clearInterval(timerId);
    timerId = null;
    if (session.mode === "free") session.correct = freeTypeInput.value.length;
    const attempts = session.correct + session.mistakes;
    const accuracy = attempts ? Math.round((session.correct / attempts) * 100) : 0;
    const elapsedMilliseconds = session.promptGroups
      ? Math.max(session.typingMilliseconds, 1000)
      : Math.max(Date.now() - session.startedAt, 1000);
    const minutes = Math.max(elapsedMilliseconds / 60000, 1 / 60);
    const wpm = Math.round((session.correct / 5) / minutes);
    session.finalAccuracy = accuracy;
    session.finalWpm = wpm;
    session.passed = session.mode !== "guided" || (accuracy >= session.targetAccuracy && wpm >= session.targetWpm);
    if (session.mode === "guided" && session.passed) {
      sessionUnlockedLessons[session.hand] = Math.max(sessionUnlockedLessons[session.hand], Math.min(session.lesson.number, lessonData.length - 1));
    }
    session.elapsedSeconds = Math.max(1, Math.round(elapsedMilliseconds / 1000));
    const difficult = Object.keys(session.mistakesByKey).sort((a, b) => session.mistakesByKey[b] - session.mistakesByKey[a]).slice(0, 5);
    const saved = saveProgress();
    const activity = document.getElementById("practiceHeading").textContent;
    document.getElementById("resultsSummary").textContent = "You finished this attempt of " + activity + " with " + session.correct + " correct characters in " + attempts + " attempts.";
    document.getElementById("errorsResult").textContent = String(session.mistakes);
    document.getElementById("accuracyResult").textContent = accuracy + "%";
    document.getElementById("speedResult").textContent = String(wpm);
    document.getElementById("difficultResult").textContent = difficult.length ? difficult.map(speakable).join(", ") : "None";
    document.getElementById("saveResult").textContent = saved
      ? (session.mode === "guided" && session.passed ? "This completed lesson and its results were saved on this browser." : "These results were saved on this browser.")
      : "This session was not saved.";
    const nextLesson = lessonData[session.lesson.number];
    const lessonFinished = session.mode === "guided";
    const resultAction = document.getElementById("resultAction");
    const resultActionLabel = document.getElementById("resultActionLabel");
    if (lessonFinished && !session.passed) {
      resultAction.dataset.action = "retry";
      resultActionLabel.textContent = "Try Lesson Again";
      resultAction.setAttribute("aria-label", "Almost there. You need " + session.targetAccuracy + " percent accuracy and " + session.targetWpm + " words per minute to move on. Press Enter to try Lesson " + session.lesson.number + " again.");
    } else if (lessonFinished && nextLesson) {
      resultAction.dataset.action = "next";
      resultActionLabel.textContent = "Next Lesson";
      resultAction.setAttribute("aria-label", "Good job. Lesson " + session.lesson.number + " done. Press Enter for Lesson " + (session.lesson.number + 1) + ": " + nextLesson[0] + ".");
    } else if (lessonFinished) {
      resultAction.dataset.action = "done";
      resultActionLabel.textContent = "Done";
      resultAction.setAttribute("aria-label", "Good job. All lessons complete. Press Enter for Done.");
    } else {
      resultAction.dataset.action = "done";
      resultActionLabel.textContent = "Done";
      resultAction.setAttribute("aria-label", "Practice complete. Press Enter for Done.");
    }
    document.getElementById("resultsHeading").innerHTML = lessonFinished && !session.passed
      ? '<span class="kb-sparkle" aria-hidden="true">✦</span> Keep going! <span class="kb-sparkle" aria-hidden="true">✦</span>'
      : lessonFinished
        ? '<span class="kb-sparkle" aria-hidden="true">✦</span> Good job! <span class="kb-sparkle" aria-hidden="true">✦</span>'
      : '<span class="kb-sparkle" aria-hidden="true">✦</span> Practice complete! <span class="kb-sparkle" aria-hidden="true">✦</span>';
    document.getElementById("completionMessage").textContent = lessonFinished && !session.passed
      ? "Reach " + session.targetAccuracy + "% accuracy and " + session.targetWpm + " WPM to move on."
      : lessonFinished ? "Lesson " + session.lesson.number + " passed." : "Nice work!";
    refreshLessonAvailability();
    renderCurriculum();
    show("resultsPanel");
  }

  function openMenu() {
    if (timerId) window.clearInterval(timerId);
    timerId = null;
    session = null;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    updateLessonSummary();
    show("setupPanel");
  }

  document.getElementById("unlockForm").addEventListener("submit", event => {
    event.preventDefault();
    const entry = document.getElementById("previewCode").value.trim().toUpperCase();
    if (entry !== PREVIEW_CODE) {
      document.getElementById("unlockMessage").textContent = "That testing code is not correct.";
      return;
    }
    sessionStorage.setItem("alcKeyboardingPreview", "open");
    previewToolbar.hidden = false;
    setVoice(true, false);
    setWebsiteControlsMinimized(true);
    show("setupPanel");
  });

  document.getElementById("setupForm").addEventListener("submit", event => {
    event.preventDefault();
    startFromMenu();
  });

  document.querySelectorAll(".kb-arrow-menu").forEach(menu => {
    const buttons = Array.from(menu.querySelectorAll(".kb-menu-option"));
    menu.addEventListener("keydown", event => {
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      const availableButtons = buttons.filter(button => !button.hidden && !button.disabled);
      const adjustmentRow = document.activeElement.closest ? document.activeElement.closest(".kb-stepper-row") : null;
      if (adjustmentRow && adjustmentRow.querySelector(".kb-menu-option")) adjustmentRow.querySelector(".kb-menu-option").focus();
      const currentIndex = Math.max(0, availableButtons.indexOf(document.activeElement));
      let nextIndex = currentIndex;
      if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % availableButtons.length;
      else if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + availableButtons.length) % availableButtons.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = availableButtons.length - 1;
      event.preventDefault();
      availableButtons[nextIndex].focus();
    });
    buttons.forEach(button => button.addEventListener("focus", () => speak(button.getAttribute("aria-label") || button.textContent.trim())));
  });

  setupMenu.querySelectorAll("[data-main-action]").forEach(button => button.addEventListener("click", () => {
    const action = button.dataset.mainAction;
    if (action === "lesson") {
      modeSetting.value = "guided";
      startFromMenu();
    }
    if (action === "practice") show("practiceMenuPanel");
    if (action === "stats") {
      updateStats();
      show("statsPanel");
      speak(document.getElementById("statsPanel").innerText);
    }
    if (action === "settings") show("settingsPanel");
  }));

  document.querySelectorAll("[data-practice-mode]").forEach(button => button.addEventListener("click", () => {
    if (button.dataset.practiceMode === "back") return show("setupPanel");
    modeSetting.value = button.dataset.practiceMode;
    startFromMenu();
  }));

  document.querySelectorAll("[data-setting]").forEach(button => button.addEventListener("click", event => {
    activateSetting(button, event.shiftKey ? -1 : 1);
  }));

  document.querySelectorAll("[data-adjust]").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      const settingButton = document.querySelector('[data-setting="' + button.dataset.adjust + '"]');
      activateSetting(settingButton, Number(button.dataset.direction));
    });
    button.addEventListener("focus", () => speak(button.getAttribute("aria-label")));
  });

  function processPracticeCharacter(typedKey, capsLockOn) {
    const expected = session.prompt[session.position];
    const capsLockMismatch = Boolean(capsLockOn) && /^[a-z]$/.test(expected || "") &&
      typedKey === expected.toUpperCase();
    if (capsLockMismatch) {
      targetPrompt.classList.remove("correct");
      targetPrompt.classList.add("incorrect");
      const warning = "Caps Lock is on. Press Caps Lock to turn it off. Caps Lock is located directly to the left of the A key. Then press " + expected.toUpperCase() + ".";
      practiceStatus.textContent = warning;
      tone(190, 0.12);
      speak(warning);
      window.setTimeout(() => targetPrompt.classList.remove("incorrect"), 300);
      return;
    }
    if (typedKey === expected) {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      session.correct += 1;
      session.position += 1;
      const completedGroup = session.promptGroups && session.position >= currentPromptGroupStart() + currentPromptGroup().length;
      if (completedGroup) {
        closePromptGroupTimer();
        if (session.position < session.prompt.length) session.groupIndex += 1;
      }
      targetPrompt.classList.remove("incorrect");
      targetPrompt.classList.add("correct");
      tone(660, 0.08);
      typedText.textContent = session.promptGroups
        ? "Part " + Math.min(session.groupIndex + 1, session.promptGroups.length) + " of " + session.promptGroups.length
        : session.prompt.slice(Math.max(0, session.position - 120), session.position);
      renderTrackedPrompt();
      if (!session.durationSeconds) lessonProgress.value = session.position;
      progressText.textContent = session.durationSeconds ? session.secondsLeft + " seconds remaining" : session.promptGroups
        ? "Part " + Math.min(session.groupIndex + 1, session.promptGroups.length) + " of " + session.promptGroups.length
        : "Character " + Math.min(session.position + 1, session.prompt.length) + " of " + session.prompt.length;
      if (session.position >= session.prompt.length) {
        session.accepting = false;
        window.setTimeout(finishPractice, 220);
      } else if (completedGroup) {
        session.accepting = false;
        window.setTimeout(() => targetPrompt.classList.remove("correct"), 120);
        announceCurrentPromptGroup();
      } else {
        window.setTimeout(() => targetPrompt.classList.remove("correct"), 120);
      }
    } else {
      session.mistakes += 1;
      session.mistakesByKey[expected] = (session.mistakesByKey[expected] || 0) + 1;
      targetPrompt.classList.remove("correct");
      targetPrompt.classList.add("incorrect");
      const correction = incorrectKeyInstruction(expected);
      practiceStatus.textContent = correction;
      tone(190, 0.16);
      speak(correction);
      window.setTimeout(() => targetPrompt.classList.remove("incorrect"), 220);
    }

  }

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && document.getElementById("unlockPanel").hidden && document.getElementById("setupPanel").hidden) {
      event.preventDefault();
      openMenu();
      return;
    }
    if (document.getElementById("practicePanel").hidden || !session) return;
    const isLargerPrint = event.ctrlKey && (event.key === "+" || event.key === "=" || event.code === "NumpadAdd");
    const isSmallerPrint = event.ctrlKey && (event.key === "-" || event.code === "NumpadSubtract");
    if (isLargerPrint || isSmallerPrint) {
      event.preventDefault();
      controlUsedAsModifier = true;
      adjustPracticeTextSize(isLargerPrint ? 1 : -1);
      return;
    }
    if (event.ctrlKey && event.key !== "Control") controlUsedAsModifier = true;
    if (!session.started) {
      if (event.key === "Control") {
        event.preventDefault();
        if (!event.repeat) controlUsedAsModifier = false;
        return;
      }
      if (event.repeat || event.key === "Shift" || event.key === "Alt" || event.key === "Meta") return;
      event.preventDefault();
      const startingKey = event.key;
      const capsLockOn = event.getModifierState && event.getModifierState("CapsLock");
      beginPractice();
      if (session && session.mode !== "free" && session.accepting && startingKey.length === 1) {
        const expected = session.prompt[session.position];
        if (startingKey === expected || (capsLockOn && /^[a-z]$/.test(expected || "") &&
            startingKey === expected.toUpperCase())) {
          processPracticeCharacter(startingKey, capsLockOn);
        }
      }
      return;
    }
    if (event.key === "Control") {
      event.preventDefault();
      if (!event.repeat) controlUsedAsModifier = false;
      return;
    }
    if (session.mode === "free") return;
    if (!session.accepting || event.repeat || event.ctrlKey || event.altKey || event.metaKey || event.key.length !== 1) {
      if (!session.accepting && event.key.length === 1) event.preventDefault();
      return;
    }
    event.preventDefault();
    processPracticeCharacter(event.key, event.getModifierState && event.getModifierState("CapsLock"));
  });

  document.addEventListener("keyup", event => {
    if (event.key !== "Control") return;
    const practiceIsOpen = !document.getElementById("practicePanel").hidden && session;
    if (practiceIsOpen) {
      event.preventDefault();
      if (!controlUsedAsModifier) repeatPracticeInstruction();
    }
    controlUsedAsModifier = false;
  });

  lessonSetting.addEventListener("change", updateLessonSummary);
  handSetting.addEventListener("change", updateLessonSummary);
  document.getElementById("resultAction").addEventListener("click", event => {
    if (event.currentTarget.dataset.action === "retry") {
      startPractice();
      return;
    }
    if (event.currentTarget.dataset.action !== "next") {
      openMenu();
      return;
    }
    lessonSetting.value = String(Math.min(Number(lessonSetting.value) + 1, lessonData.length - 1));
    modeSetting.value = "guided";
    updateLessonSummary();
    startPractice();
  });
  document.getElementById("resultAction").addEventListener("focus", event => {
    speak(event.currentTarget.getAttribute("aria-label") || event.currentTarget.textContent.trim());
  });
  websiteControlsToggle.addEventListener("click", () => setWebsiteControlsMinimized(!document.body.classList.contains("kb-controls-minimized")));
  voiceToggle.addEventListener("click", () => setVoice(!useSiteVoice, true));
  document.querySelectorAll('input[name="voice"]').forEach(input => input.addEventListener("change", () => setVoice(input.value === "site", false)));
  document.getElementById("statsBack").addEventListener("click", () => show("setupPanel"));
  finishFreeType.addEventListener("click", finishPractice);
  freeTypeInput.addEventListener("input", () => {
    if (!session || session.mode !== "free") return;
    progressText.textContent = freeTypeInput.value.length + (freeTypeInput.value.length === 1 ? " character typed" : " characters typed");
  });
  buildVisualKeyboard();
  populateLessons();
  applyKeyboardDarkMode();
  setVoice(true, false);
  if (sessionStorage.getItem("alcKeyboardingPreview") === "open") {
    previewToolbar.hidden = false;
    setWebsiteControlsMinimized(true);
    show("setupPanel");
  }
})();
