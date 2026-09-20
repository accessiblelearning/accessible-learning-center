// Original one-hand lessons, aligned with the downloadable manuals.
// US QWERTY, using a movable hand around the central F G H J landmarks.
(function (root) {
  "use strict";
  const lessons = [
  {
    "title": "Finding F and J",
    "new": "fj ",
    "goal": "Find two tactile landmarks and type with one hand.",
    "locate": "F and J are on the middle letter row. Most keyboards have a small raised mark on each. Moving right from F, pass G and H to reach J. The wide Spacebar is below the letters.",
    "left": "Use your left little finger for F and your left index finger for J. Let your thumb find a comfortable place on the Spacebar. If the little finger is difficult to use, move the hand and use a stronger finger.",
    "right": "Use your right index finger for F and your right little finger for J. Let your thumb find a comfortable place on the Spacebar. If the little finger is difficult to use, move the hand and use a stronger finger.",
    "practice": [
      "f j f j",
      "ff jj fj jf",
      "fj jf fj jf"
    ],
    "instruction": "Type each group as shown. The next group appears automatically; do not press Enter between groups."
  },
  {
    "title": "Adding G and H",
    "new": "gh",
    "goal": "Build a central resting position on F G H J.",
    "locate": "G is immediately right of F. H is immediately left of J. The four central keys run from left to right as F G H J.",
    "left": "From left to right, place the left little finger on F, ring finger on G, middle finger on H, and index finger on J.",
    "right": "From left to right, place the right index finger on F, middle finger on G, ring finger on H, and little finger on J.",
    "practice": [
      "fg hj gh jh",
      "fghj jhgf",
      "fg hg jh gf"
    ],
    "instruction": "Type each group as shown. The next group appears automatically; do not press Enter between groups."
  },
  {
    "title": "Reaching D and A",
    "new": "da",
    "goal": "Move the hand toward the left edge and return to the centre.",
    "locate": "D is one key left of F. To find A from F on the same row, pass D and S, then reach A. S is a landmark today; you will practise it in the next lesson.",
    "left": "Move your left hand and forearm left together. Use a comfortable index or middle finger for the distant A; use the little finger for D only if it is comfortable. Return using the F bump.",
    "right": "Move your right hand left as a unit. Use your index finger for D and A, or use the middle finger if that gives better control. Refind F before returning to F G H J.",
    "practice": [
      "fd df fa af",
      "dad add fad",
      "a dad had a fad"
    ],
    "instruction": "Type each group as shown. The next group appears automatically; do not press Enter between groups."
  },
  {
    "title": "Completing the home row letters",
    "new": "skl",
    "goal": "Add S K L and combine the home row letters.",
    "locate": "S is between A and D. K is one key right of J. L is two keys right of J. Semicolon is farther right; it is taught later.",
    "left": "For S, move the hand left and use an index or middle finger. For K and L, move right from J and lead with the index finger. Find J again before settling at the centre.",
    "right": "Use the index finger after moving left to S. For K and L, move the hand right and use an index or middle finger instead of pulling the little finger sideways.",
    "practice": [
      "ds sd jk kl lj",
      "ask sad glad flask",
      "a lad has a flag"
    ],
    "instruction": "Type each group as shown. The next group appears automatically; do not press Enter between groups."
  },
  {
    "title": "Adding E and I",
    "new": "ei",
    "goal": "Use the top letter row to make more words.",
    "locate": "E is above D and a little to its left on a typical staggered keyboard. I is above K and a little to its left. Rows are offset; they are not straight vertical columns.",
    "left": "Move left for E and use the index or middle finger. Move right for I and use the index finger. Let the hand travel; return to F or J when you lose your place.",
    "right": "Use the index finger for E after moving left. Move the hand right for I and choose the index or middle finger. Do not hold the little finger on J while reaching.",
    "practice": [
      "de ed ki ik",
      "idea file hide life",
      "a lad has a file"
    ],
    "instruction": "Type each group as shown. The next group appears automatically; do not press Enter between groups."
  },
  {
    "title": "Adding R and T",
    "new": "rt",
    "goal": "Use two top row keys near the centre.",
    "locate": "R is above F and slightly left. T is above G and slightly left. E R T appear consecutively from left to right on the top letter row.",
    "left": "Try the little finger for R and the ring finger for T from the central position. If either is awkward, shift the hand and use an index or middle finger.",
    "right": "Try the index finger for R and the middle finger for T. Return those fingers to F and G after each short group.",
    "practice": [
      "fr rf gt tg",
      "red tree gate first",
      "the red flag is at the gate"
    ],
    "instruction": "Type each group as shown. The next group appears automatically; do not press Enter between groups."
  },
  {
    "title": "Adding U and O",
    "new": "uo",
    "goal": "Reach the upper right letter area with one hand.",
    "locate": "U is above J and slightly left. O is above L and slightly left. The top row sequence in this area is U I O.",
    "left": "Use the index finger for U near J. For O, move the whole left hand farther right and use an index or middle finger.",
    "right": "Try the little finger for U only if the movement is comfortable. For O, reposition the hand and use an index or middle finger. Return to J by touch.",
    "practice": [
      "ju uj lo ol",
      "our guide good door",
      "our guide held the door"
    ],
    "instruction": "Type each group as shown. The next group appears automatically; do not press Enter between groups."
  },
  {
    "title": "Adding W and Y",
    "new": "wy",
    "goal": "Reach both sides of the top row without twisting the wrist.",
    "locate": "W is between Q and E, above S and slightly left. Y is between T and U, above H and slightly left. Q is only a landmark here.",
    "left": "Move left and use an index or middle finger for W. From the centre, try the middle finger for Y and return to H.",
    "right": "Move left and use the index finger for W. From the centre, try the ring finger for Y; switch to a stronger finger after moving the hand if needed.",
    "practice": [
      "ew we hy yh",
      "way yellow wish style",
      "we saw the yellow flag"
    ],
    "instruction": "Type each group as shown. The next group appears automatically; do not press Enter between groups."
  },
  {
    "title": "Adding Q and P",
    "new": "qp",
    "goal": "Find the two outer letters of the top row.",
    "locate": "Q is the first letter on the top letter row, immediately right of Tab. P is right of O. Bracket keys lie farther right and are outside this lesson.",
    "left": "Move left to Q and right to P with the whole hand. Use an index or middle finger for both distant keys. Return to the F or J bump between groups.",
    "right": "Lead with the index finger for the far left Q. Move right for P and use a comfortable index or middle finger rather than forcing a long little finger stretch.",
    "practice": [
      "wq qw op po",
      "quit quiet paper proper",
      "please quit the task"
    ],
    "instruction": "Type each group as shown. The next group appears automatically; do not press Enter between groups."
  },
  {
    "title": "Adding V and N",
    "new": "vn",
    "goal": "Find two keys on the bottom letter row.",
    "locate": "V is below F and slightly right. N is below H and slightly right. The Spacebar lies below this row.",
    "left": "Try the little finger for V and the middle finger for N. Move the hand and use a stronger finger if either motion is difficult.",
    "right": "Try the index finger for V and the ring finger for N. Let the fingers lift freely instead of keeping them pressed on home keys.",
    "practice": [
      "fv vf hn nh",
      "van even night never",
      "leave a note on the desk"
    ],
    "instruction": "Type each group as shown. The next group appears automatically; do not press Enter between groups."
  },
  {
    "title": "Adding B and M",
    "new": "bm",
    "goal": "Connect the centre and bottom row in useful words.",
    "locate": "B is between V and N, below G and slightly right. M is right of N, below J and slightly right.",
    "left": "Try the ring finger for B and the index finger for M. Use a small hand movement if needed; release each key before the next.",
    "right": "Try the middle finger for B and the little finger for M. A stronger finger after repositioning is a suitable alternative for M.",
    "practice": [
      "gb bg jm mj",
      "book bring home number",
      "bring my book home"
    ],
    "instruction": "Type each group as shown. The next group appears automatically; do not press Enter between groups."
  },
  {
    "title": "Completing the alphabet",
    "new": "cxz",
    "goal": "Add C X Z and practise all 26 letters.",
    "locate": "C is below D and slightly right. X is below S and slightly right. Z is below A and slightly right. Z X C appear consecutively along the bottom row.",
    "left": "Move your left hand left for these keys and use a comfortable index or middle finger. Return to F after each short group.",
    "right": "Move the right hand left as a unit. Lead with the index finger for Z X C; use the middle finger if it improves control.",
    "practice": [
      "dc cx xz zc",
      "box zip six exact",
      "six boxes can fit"
    ],
    "instruction": "Type each group as shown. The next group appears automatically; do not press Enter between groups."
  },
  {
    "title": "Capitals and periods",
    "new": "ABCDEFGHIJKLMNOPQRSTUVWXYZ.",
    "goal": "Write complete sentences using one hand.",
    "locate": "Shift is below the home row at the outside edges. The period key is on the bottom row, after comma and before slash. Learn its position by counting two keys right from M.",
    "left": "Choose the Shift key that your left hand reaches comfortably. For period, move right and use an index or middle finger. Refind J afterward.",
    "right": "Choose either Shift key by comfort. Move the right hand toward the period and use an index or middle finger if the little finger reach is awkward.",
    "practice": [
      "Sam has a red book.",
      "I can type a full sentence.",
      "My hand can move and return."
    ],
    "instruction": "Turn on Sticky Keys in your device keyboard accessibility settings before practising capitals. With Sticky Keys on, press and release Shift once, then press the letter. Use period without Shift. Avoid Caps Lock if your screen reader uses it as a modifier."
  },
  {
    "title": "Numbers in short messages",
    "new": "1234$",
    "goal": "Add 1 2 3 4 and the dollar sign within ordinary writing.",
    "locate": "The number row is above the top letter row. Its first four digit keys, from left to right, are 1 2 3 4. On a US keyboard, dollar sign is Shift with 4.",
    "left": "Move the left hand upward and left as needed. Use an index or middle finger for the number row, then use F to find your way back.",
    "right": "Move the right hand left and upward. Use the index finger for the first four numbers, with the whole hand travelling instead of stretching.",
    "practice": [
      "I have 2 pens and 3 pads.",
      "A pen is $3.",
      "I paid $4 for 1 pad."
    ],
    "instruction": "With Sticky Keys on, press and release Shift, then 4 for dollar sign. Digits need no Shift. Read each amount back."
  },
  {
    "title": "More numbers in daily writing",
    "new": "567890",
    "goal": "Complete the number row while writing quantities and amounts.",
    "locate": "Continue right from 4 to 5 6 7 8 9 0. Zero is the last digit key before the minus key. Use the top number row; a separate numeric keypad is not required.",
    "left": "Move the left hand along the number row in short groups. Lead with the index or middle finger for the rightmost digits and return by the J bump.",
    "right": "Move your right hand with each group. Use an index or middle finger for accuracy, then return to J or F before typing letters.",
    "practice": [
      "I have 5 blue pens and 6 red pens.",
      "The book is $7.50.",
      "We need 8 pads and 90 labels."
    ],
    "instruction": "Type each group as shown. The next group appears automatically; do not press Enter between groups."
  },
  {
    "title": "Commas questions and apostrophes",
    "new": ",?'",
    "goal": "Add common punctuation to messages.",
    "locate": "Comma is immediately right of M. Slash is immediately right of period; Shift with slash makes question mark. Apostrophe is right of semicolon on the home row.",
    "left": "Move the left hand toward the right edge and use an index or middle finger for punctuation. Use a separate Shift press for question mark when Sticky Keys is enabled.",
    "right": "Move the right hand to the punctuation area and choose a controlled finger. Do not twist the wrist to keep the hand anchored at F G H J.",
    "practice": [
      "Sam's pen is blue.",
      "I need pens, pads, and tape.",
      "Can we meet at 2?"
    ],
    "instruction": "Use comma and apostrophe without Shift. With Sticky Keys on, press and release Shift, then slash for question mark."
  },
  {
    "title": "Times addresses and symbols",
    "new": ";:-/@\"()+=",
    "goal": "Type useful symbols in a time, an address, and a short note.",
    "locate": "Semicolon is right of L; Shift makes colon. Apostrophe with Shift makes quotation mark. Minus is right of 0; equals is right of minus. Shift with equals makes plus.",
    "left": "Use a movable left hand and an index or middle finger for edge symbols. Keep the same finger choice each time when it is comfortable.",
    "right": "Use a movable right hand and an index or middle finger for edge symbols. Return to the central landmarks whenever you need to reset.",
    "practice": [
      "Meet at 2:30; bring 3-4 pens.",
      "Practice date 9/20/2026.",
      "sam@example.com",
      "Sam said \"yes\" (2 + 2 = 4)."
    ],
    "instruction": "On US QWERTY, Shift with 2 makes at sign, Shift with 9 makes opening parenthesis, and Shift with 0 makes closing parenthesis. Use Sticky Keys to press and release Shift before the symbol key. The example email is practice text only."
  },
  {
    "title": "Moving and correcting text",
    "new": "",
    "goal": "Practise accurate sentences, then learn editing in a practice document.",
    "locate": "The arrow keys are usually at the lower right. Backspace is usually at the top right of the typing area. Delete, Home, and End vary on laptops. Locate them on your own keyboard first.",
    "left": "Move the left hand to the editing keys as a unit. Use an index or middle finger, then return to F or J by touch. Dedicated editing keys may reduce the need for Fn combinations.",
    "right": "Move your right hand to the editing keys and return to the centre afterward. Choose a finger that avoids reaching past another finger.",
    "practice": [
      "Sam has a blue pen.",
      "Sam has a red pad.",
      "I can check and correct my text."
    ],
    "instruction": "Here, copy each correct sentence. This guided typing area does not edit text with arrows or Delete. Afterward, use lesson 18 in your manual in a separate practice document to try Backspace, Home, arrows, and Delete."
  },
  {
    "title": "Saving copying and reopening",
    "new": "",
    "goal": "Practise useful text, then save, copy, and reopen it in a practice document.",
    "locate": "Ctrl and Alt are usually on the bottom row. With Sticky Keys on, press and release Ctrl before the next key. Test shortcuts in your practice file.",
    "left": "Use the left Ctrl key if it is easier for your left hand. After releasing it, move freely to the letter key; you do not need to span both keys.",
    "right": "Use whichever Ctrl key your right hand reaches comfortably. Release it before moving to the letter key. A right Ctrl key is helpful but not required.",
    "practice": [
      "I saved my typing practice."
    ],
    "instruction": "Here, copy the sentence. Afterward, use lesson 19 in your manual in Notepad or your text editor to save, copy, paste, and reopen a practice file. Use those shortcuts in the editor; Control repeats instructions in this typing area."
  },
  {
    "title": "Writing an independent message",
    "new": "",
    "goal": "Copy a useful message, then write and save your own.",
    "locate": "Use your central landmarks and the letter and symbol routes learned in the previous lessons. Keep a short list of your personal finger adaptations nearby.",
    "left": "Use only the left hand for this task, including Space, Enter, capitals, numbers, and editing. Move the whole hand when needed and pause to reset.",
    "right": "Use only the right hand for this task, including Space, Enter, capitals, numbers, and editing. Move the whole hand when needed and pause to reset.",
    "practice": [
      "Hello Sam,",
      "Can we meet at 2:30?",
      "I have 4 pens and 2 pads.",
      "The total is $8.50.",
      "Thank you."
    ],
    "instruction": "Copy each line of the message here. Then choose Untimed Free Typing for an original sentence, or follow lesson 20 in your manual to write, edit, and save your own message in a practice document."
  },
  {
    "title": "Returning to the central landmarks",
    "new": "",
    "goal": "Build a reliable return to F G H J between words.",
    "locate": "Find the raised marks on F and J. G and H lie between them. Space is below the letters.",
    "left": "Reset your left little, ring, middle, and index fingers across F G H J. Use a stronger finger after moving the hand if that is easier.",
    "right": "Reset your right index, middle, ring, and little fingers across F G H J. Use a stronger finger after moving the hand if that is easier.",
    "practice": [
      "fig jig high",
      "My hand can find F and J.",
      "I pause, return, and begin again."
    ],
    "instruction": "Read a whole group before typing. After each group, lift the hand briefly and find a landmark again. Avoid pressing while searching.",
    "check": "Can you return to a raised mark after each group without random key presses?"
  },
  {
    "title": "Travelling to the left edge",
    "new": "",
    "goal": "Type left-edge letters and return with controlled hand movement.",
    "locate": "Q A Z are the outer letter keys on the left. W S X are one letter column inward; E D C are next.",
    "left": "Move your left hand and forearm together toward Q A Z. Use your index or middle finger instead of forcing a little-finger stretch.",
    "right": "Slide your right hand left toward Q A Z. Lead with the index or middle finger, then move back to F.",
    "practice": [
      "we saw a wax seal",
      "A quiet cat waits by the desk.",
      "Zoe can read six clear words."
    ],
    "instruction": "Locate each outer key before the first group. Type at a pace that lets you move rather than twist. Refind F between groups.",
    "check": "Check Q versus W, A versus S, and Z versus X. Repeat the pair that needs work."
  },
  {
    "title": "Travelling to the right edge",
    "new": "",
    "goal": "Use the selected hand for right-edge letters and punctuation.",
    "locate": "P is right of O on the top row. K and L are right of J. Period is two keys right of M.",
    "left": "Move your left hand right past J to K L and P. Use the index or middle finger and let the forearm follow.",
    "right": "Move your right hand toward K L and P. Reposition and use an index or middle finger if the little finger would have to stretch.",
    "practice": [
      "look pool pupil",
      "Jill put a purple cup on the shelf.",
      "I can reach P, L, and period."
    ],
    "instruction": "Read through the punctuation before typing. Return by the J landmark whenever you lose position. Use the same hand for the final period.",
    "check": "Check that periods and spaces are intentional, with no accidental semicolons."
  },
  {
    "title": "Top row travel",
    "new": "",
    "goal": "Connect top-row letters into longer words.",
    "locate": "The top letter row runs Q W E R T Y U I O P. It sits below the number row.",
    "left": "Try the left little finger near R, ring near T, middle near Y, and index near U. Move the hand for the outer letters.",
    "right": "Try the right index finger near R, middle near T, ring near Y, and little near U. Move the hand for the outer letters.",
    "practice": [
      "type writer quiet poetry",
      "We write a reply to your query.",
      "The quiet writer will type a report."
    ],
    "instruction": "Let each word guide a series of small moves along the row. Return to F or J between words when useful. Do not keep the other fingers planted.",
    "check": "Did every key press stay on the letter row rather than the number row?"
  },
  {
    "title": "Bottom row control",
    "new": "",
    "goal": "Type bottom-row letters without accidental spaces.",
    "locate": "The bottom letter row runs Z X C V B N M. The wide Spacebar is below it.",
    "left": "Near the centre, try left little on V, ring on B, middle on N, and index on M. Move left for Z X C.",
    "right": "Near the centre, try right index on V, middle on B, ring on N, and little on M. Move left for Z X C.",
    "practice": [
      "mix box cabin move",
      "Max can move six boxes.",
      "Bring my blue bag back home."
    ],
    "instruction": "Use short downward movements. Release each letter before using the thumb for Space. Reposition instead if a downward reach is awkward.",
    "check": "Check N versus M, B versus V, and any spaces inside words."
  },
  {
    "title": "Moving between rows",
    "new": "",
    "goal": "Combine outward and return movements across all letter rows.",
    "locate": "Use F or J to identify the middle row before moving up or down. The rows are staggered.",
    "left": "Move your left hand between rows as a unit for distant letters. Use the central finger pattern only where comfortable.",
    "right": "Move your right hand between rows as a unit for distant letters. Use the central finger pattern only where comfortable.",
    "practice": [
      "garden window basket",
      "The blue basket is near the window.",
      "I can move from row to row."
    ],
    "instruction": "Read the next word before moving. Pause between words if needed; avoid stopping with a key held down.",
    "check": "Which row change caused an error? Practise that movement, then retry the sentence."
  },
  {
    "title": "Repeated letters",
    "new": "",
    "goal": "Press and release clearly when the same letter occurs twice.",
    "locate": "Repeated letters use the same key twice. The key must rise between presses.",
    "left": "Keep your left hand relaxed during doubled letters. Use the same controlled finger for both taps.",
    "right": "Keep your right hand relaxed during doubled letters. Use the same controlled finger for both taps.",
    "practice": [
      "bookkeeper letter coffee",
      "Jill will bring a yellow balloon.",
      "I need a little more coffee."
    ],
    "instruction": "Say the doubled letters quietly or review them with speech. Tap twice with a full release rather than holding the key for automatic repetition.",
    "check": "Check that doubled letters appear exactly twice, especially in bookkeeper and balloon."
  },
  {
    "title": "Longer words in small parts",
    "new": "",
    "goal": "Type longer words while keeping their spelling and spacing.",
    "locate": "All letters are already available. Use the tactile landmarks whenever a long word carries the hand away from the centre.",
    "left": "Move your left hand freely through each part of the word. Use a stronger left finger for distant keys.",
    "right": "Move your right hand freely through each part of the word. Use a stronger right finger for distant keys.",
    "practice": [
      "information conversation appointment",
      "Please confirm the appointment.",
      "The information is in my notebook."
    ],
    "instruction": "Read or hear the whole word, then type it in small remembered parts. Do not insert spaces between parts of the same word.",
    "check": "Check the middle and ending of each long word, not just its first letters."
  },
  {
    "title": "Sentence rhythm",
    "new": "",
    "goal": "Build an even rhythm through a complete sentence.",
    "locate": "Space separates words. A capital begins each sentence, and period ends it.",
    "left": "Use only your left hand for letters, Space, Shift, and period. Move to a modifier, release it, then continue with Sticky Keys.",
    "right": "Use only your right hand for letters, Space, Shift, and period. Move to a modifier, release it, then continue with Sticky Keys.",
    "practice": [
      "I will read the sentence before I type.",
      "A steady pace helps me place each letter.",
      "I can pause between words and continue."
    ],
    "instruction": "Aim for a repeatable pace rather than maximum speed. With Sticky Keys on, press and release Shift once before the opening capital.",
    "check": "Check the opening capital, one space between words, and one final period."
  },
  {
    "title": "Connected sentences",
    "new": "",
    "goal": "Copy a short paragraph in meaningful sections.",
    "locate": "A paragraph uses the same keys as its sentences. Keep the hand free to move for each word.",
    "left": "Use the left hand throughout each sentence, including its capital and period. Reset near F or J between groups.",
    "right": "Use the right hand throughout each sentence, including its capital and period. Reset near F or J between groups.",
    "practice": [
      "I opened my notebook this morning.",
      "I wrote a short list for the day.",
      "Then I checked the list and added a time.",
      "Now my notes are ready to use."
    ],
    "instruction": "Read all four sentences first. The website presents one sentence per group. In a practice document, join them with one space to make a paragraph.",
    "check": "Read the paragraph back in order and confirm that no sentence was skipped."
  },
  {
    "title": "Amounts and decimal points",
    "new": "",
    "goal": "Type quantities and money accurately within messages.",
    "locate": "Use the top number row. Period separates the decimal part; Shift with 4 produces dollar sign on US QWERTY.",
    "left": "Move your left hand upward for digits and right for period. Refind F or J before returning to words.",
    "right": "Move your right hand along the number row and to period. Use an index or middle finger after repositioning.",
    "practice": [
      "The notebook costs $12.50.",
      "I bought 3 pads for $7.20.",
      "The total is $19.70 for 4 items.",
      "Please bring $20.00."
    ],
    "instruction": "Read amounts digit by digit. Use Sticky Keys for dollar sign, then release each digit normally. Keep one decimal point in each amount.",
    "check": "Compare every digit with the target. Check zero versus O and one versus lowercase l."
  },
  {
    "title": "Dates and appointment times",
    "new": "",
    "goal": "Enter dates and times without losing separators.",
    "locate": "Slash is right of period. Colon is Shift with semicolon, which is right of L.",
    "left": "Move your left hand between the number row and right-side punctuation. Use separate Shift and key presses with Sticky Keys.",
    "right": "Move your right hand between the number row and punctuation. Let the hand travel instead of holding fingers in place.",
    "practice": [
      "Appointment: 10/24/2026 at 9:15.",
      "The class runs from 1:30 to 2:45.",
      "Please arrive 10 minutes early."
    ],
    "instruction": "These are copy exercises; date formats vary. Match the order shown, including slashes and colons, without guessing the next number.",
    "check": "Read each complete date and time back, then review the individual separators."
  },
  {
    "title": "Names and practice addresses",
    "new": "",
    "goal": "Copy names and address lines with correct capitals.",
    "locate": "Capitals use Shift with a letter. Digits and comma were taught earlier.",
    "left": "Use your left hand for each capital by pressing and releasing Shift before the letter with Sticky Keys on.",
    "right": "Use your right hand for each capital by pressing and releasing Shift before the letter with Sticky Keys on.",
    "practice": [
      "Robin Lee",
      "24 Maple Lane",
      "Practice City, AB 12345",
      "Please write the name on line 1."
    ],
    "instruction": "Use this fictional address for practice. Copy the name and each line exactly. Move to the next group automatically on the website; use Enter between address lines in a document.",
    "check": "Check the capitals and all five digits. Do not substitute personal contact information."
  },
  {
    "title": "Questions and short replies",
    "new": "!",
    "goal": "Distinguish questions, statements, and exclamations.",
    "locate": "Question mark is Shift with slash. Exclamation point is Shift with 1 on US QWERTY.",
    "left": "Move your left hand left for 1 and right for slash. With Sticky Keys, release Shift before travelling to either key.",
    "right": "Move your right hand left for 1 and right for slash. With Sticky Keys, release Shift before travelling to either key.",
    "practice": [
      "Are you ready?",
      "Yes, I am ready.",
      "That is great!",
      "Can we begin at 9?"
    ],
    "instruction": "Introduce exclamation point slowly: press and release Shift, then 1. Match each sentence ending rather than using period automatically.",
    "check": "Check that each question ends with question mark and the exclamation has exactly one exclamation point."
  },
  {
    "title": "Apostrophes in messages",
    "new": "",
    "goal": "Type contractions and ownership without extra spaces.",
    "locate": "Apostrophe is right of semicolon. It needs no Shift for these examples.",
    "left": "Move your left hand to apostrophe with an index or middle finger. Return toward J before the next word.",
    "right": "Move your right hand to apostrophe with a comfortable finger. Reposition if reaching would pull the little finger sideways.",
    "practice": [
      "I'm ready for today's class.",
      "Sam's notebook is on Jill's desk.",
      "We can't meet until 3.",
      "I'll bring the team's notes."
    ],
    "instruction": "Keep the apostrophe inside the word. Read the complete word before typing so the punctuation does not break your spelling rhythm.",
    "check": "Check that there is no space before or after an apostrophe inside a word."
  },
  {
    "title": "Quotation marks and dialogue",
    "new": "",
    "goal": "Copy short quotations with opening and closing marks.",
    "locate": "On US QWERTY, quotation mark is Shift with apostrophe. Comma, question mark, and period remain separate keys.",
    "left": "Use your left hand to press and release Shift, then reach the apostrophe key with Sticky Keys on.",
    "right": "Use your right hand to press and release Shift, then reach the apostrophe key with Sticky Keys on.",
    "practice": [
      "Sam said, \"I can bring the notes.\"",
      "\"Can we meet at 2?\" Jill asked.",
      "\"Yes,\" Sam replied."
    ],
    "instruction": "Read the whole group before typing. Check both quotation marks and their neighbouring punctuation. Use the straight quotation mark shown in the target.",
    "check": "Does every quotation have both an opening and closing mark?"
  },
  {
    "title": "Percentages in everyday text",
    "new": "%",
    "goal": "Add percent signs to numbers in useful sentences.",
    "locate": "Percent sign is Shift with 5 on the top number row of US QWERTY.",
    "left": "Move your left hand toward 5. With Sticky Keys, press and release Shift, then tap 5 with a controlled finger.",
    "right": "Move your right hand left toward 5. With Sticky Keys, press and release Shift, then tap 5 with a controlled finger.",
    "practice": [
      "The battery is at 75%.",
      "I finished 50% of the list.",
      "The discount is 10%.",
      "We checked 100% of the pages."
    ],
    "instruction": "Introduce percent sign by locating 5 first. In these examples there is no space between the number and percent sign.",
    "check": "Review the digits, percent sign, and final period as separate characters."
  },
  {
    "title": "Number signs and labels",
    "new": "#",
    "goal": "Use number signs in room and item labels.",
    "locate": "Number sign is Shift with 3 on US QWERTY. It is also called hash.",
    "left": "Move your left hand to 3 after a separate Shift press with Sticky Keys on.",
    "right": "Move your right hand left to 3 after a separate Shift press with Sticky Keys on.",
    "practice": [
      "Open folder #3.",
      "The meeting is in Room #12.",
      "Please check item #8 on page 4."
    ],
    "instruction": "Locate 3 before starting. Type number sign immediately before the digits in each label. Use the same hand for the modifier and the digit.",
    "check": "Check that number sign appears before the number rather than after it."
  },
  {
    "title": "Ampersands in names",
    "new": "&",
    "goal": "Type ampersands within short names and labels.",
    "locate": "Ampersand is Shift with 7 on the US number row.",
    "left": "Move your left hand right along the number row to 7. Use Sticky Keys so the hand can move after releasing Shift.",
    "right": "Move your right hand toward 7. Use Sticky Keys so the hand can move after releasing Shift.",
    "practice": [
      "Pens & Paper",
      "Sam & Jill will help today.",
      "Copy the label: Notes & Files."
    ],
    "instruction": "Introduce ampersand with a separate Shift press followed by 7. Include the spaces on both sides when the target has them.",
    "check": "Check the ampersand and its spaces without substituting the word and."
  },
  {
    "title": "Hyphens and underscores",
    "new": "_",
    "goal": "Distinguish hyphens from underscores in labels and filenames.",
    "locate": "Hyphen is the key immediately right of 0. Shift with that key produces underscore.",
    "left": "Move your left hand to the right end of the number row. Use an index or middle finger for hyphen and Sticky Keys for underscore.",
    "right": "Move your right hand to the right end of the number row. Reposition for hyphen and use Sticky Keys for underscore.",
    "practice": [
      "part-time step-by-step",
      "Save as class_notes_2.txt.",
      "The label is follow-up_notes."
    ],
    "instruction": "Practise hyphen without Shift, then underscore with a separate Shift press. Filenames here are copy text; saving is practised in your text editor.",
    "check": "Check the exact separator and verify that there are no spaces inside the filename."
  },
  {
    "title": "Comparison signs",
    "new": "<>",
    "goal": "Type less-than and greater-than signs in simple comparisons.",
    "locate": "Less-than is Shift with comma. Greater-than is Shift with period on US QWERTY.",
    "left": "Move your left hand right to comma or period after pressing and releasing Shift with Sticky Keys on.",
    "right": "Move your right hand to comma or period after pressing and releasing Shift with Sticky Keys on.",
    "practice": [
      "2 < 5",
      "9 > 4",
      "The comparison is 12 < 20.",
      "Check both: 8 > 3 and 6 < 10."
    ],
    "instruction": "Locate comma and period before adding Shift. Read the direction of the sign and match one space on each side in these examples.",
    "check": "Check that each sign points in the same direction as the target."
  },
  {
    "title": "Square brackets",
    "new": "[]",
    "goal": "Enter paired square brackets around a short note.",
    "locate": "The two bracket keys are immediately right of P. Press them without Shift for square brackets.",
    "left": "Move your left hand right past P. Use an index or middle finger for each bracket, then return toward J.",
    "right": "Move your right hand right past P. Reposition and use an index or middle finger if the outer reach is awkward.",
    "practice": [
      "[Note] Bring a pen.",
      "The file is [ready].",
      "Read pages [2-4] before class."
    ],
    "instruction": "Locate opening bracket, then closing bracket. Copy both marks in order and include spaces only where shown.",
    "check": "Check that every opening bracket has a closing bracket."
  },
  {
    "title": "Braces backslash and vertical bar",
    "new": "{}\\|",
    "goal": "Learn the remaining symbols near the right edge.",
    "locate": "Shift with the bracket keys makes braces. Backslash is usually above Enter or beside the brackets on US keyboards; Shift with it makes vertical bar.",
    "left": "Move your left hand to the right edge for these keys. With Sticky Keys, release Shift before reaching the bracket or backslash key.",
    "right": "Move your right hand to the right edge. Reposition for each key and release Shift before it with Sticky Keys on.",
    "practice": [
      "{note} {ready}",
      "C:\\Practice\\notes.txt",
      "Name | Date | Task"
    ],
    "instruction": "Confirm the backslash key on your keyboard before typing. These are copy examples, not commands to run. Distinguish backslash from the forward slash beside period.",
    "check": "Review each paired brace, each backslash, and each vertical bar individually."
  },
  {
    "title": "Asterisks and carets",
    "new": "*^",
    "goal": "Type two more shifted symbols from the number row.",
    "locate": "Asterisk is Shift with 8. Caret is Shift with 6 on US QWERTY.",
    "left": "Move your left hand along the number row to 8 or 6. Release Shift first with Sticky Keys, then move to the target.",
    "right": "Move your right hand along the number row to 8 or 6. Release Shift first with Sticky Keys, then move to the target.",
    "practice": [
      "* Required field",
      "Copy the pattern: 2^3.",
      "The label is *note*."
    ],
    "instruction": "Locate each base digit before adding Shift. These are literal typing examples; do not interpret them as an application command or calculation.",
    "check": "Check asterisk versus the letter x and caret versus an apostrophe."
  },
  {
    "title": "Grave accents and tildes",
    "new": "`~",
    "goal": "Locate the last US QWERTY printable symbol key.",
    "locate": "On many US keyboards, the grave accent key is immediately left of 1. Shift with that key makes tilde.",
    "left": "Move your left hand to the far left of the number row. Use a controlled finger, and release Shift before tilde with Sticky Keys.",
    "right": "Move your right hand to the far left of the number row. Use a controlled finger, and release Shift before tilde with Sticky Keys.",
    "practice": [
      "`note`",
      "~draft~",
      "Copy exactly: `file_2` and ~5."
    ],
    "instruction": "Confirm the key label on your keyboard. Grave accent is different from the apostrophe beside semicolon. These marks are practice text only.",
    "check": "Check that the grave accents slope differently from ordinary apostrophes and that tildes match the target."
  },
  {
    "title": "Email addresses and web addresses",
    "new": "",
    "goal": "Copy common address patterns accurately.",
    "locate": "At sign is Shift with 2. Period, hyphen, underscore, colon, and slash have all been introduced.",
    "left": "Move your left hand across the whole keyboard for each address. Use Sticky Keys for at sign or colon, then return to ordinary letters.",
    "right": "Move your right hand across the whole keyboard for each address. Use Sticky Keys for at sign or colon, then return to ordinary letters.",
    "practice": [
      "sam.lee@example.com",
      "class_notes@example.org",
      "https://example.com/notes",
      "Please copy the address exactly."
    ],
    "instruction": "These reserved example addresses are typing practice only. Do not send a message or open a link. Type each address without internal spaces.",
    "check": "Review the address character by character, especially at sign, periods, and slashes."
  },
  {
    "title": "Numbered instructions",
    "new": "",
    "goal": "Type a short ordered list with consistent formatting.",
    "locate": "Digits, periods, capitals, and Space form the numbered steps. Enter makes a new line in a document.",
    "left": "Use your left hand for every part of the list, including numbers and capitals. Refind F or J between steps.",
    "right": "Use your right hand for every part of the list, including numbers and capitals. Refind F or J between steps.",
    "practice": [
      "1. Open the practice document.",
      "2. Type a short note.",
      "3. Check the spelling and punctuation.",
      "4. Save the note in Documents."
    ],
    "instruction": "Copy the instructions as text. In the website each step is one group. In your document put each numbered step on a new line using Enter with the same hand.",
    "check": "Check the step numbers, periods, and the single space before each opening word."
  },
  {
    "title": "A practical work message",
    "new": "",
    "goal": "Combine details into a clear multi-line message.",
    "locate": "This message combines capitals, punctuation, a time, a room label, a percentage, and a filename.",
    "left": "Use only the left hand for the entire message. Move rather than stretching for digits, symbols, or final punctuation.",
    "right": "Use only the right hand for the entire message. Move rather than stretching for digits, symbols, or final punctuation.",
    "practice": [
      "Hello Jill,",
      "We will meet at 10:30 in Room #4.",
      "The notes are 90% complete.",
      "Please bring class_notes_2.txt.",
      "Thank you, Sam."
    ],
    "instruction": "Read the complete message first. Copy one line at a time and check its details before continuing. Use separate Shift presses with Sticky Keys for shifted symbols.",
    "check": "Confirm the name, time, room number, percentage, and filename against the target."
  },
  {
    "title": "Sustained paragraph practice",
    "new": "",
    "goal": "Maintain accuracy through two connected paragraphs.",
    "locate": "No new keys are introduced. Plan returns to the tactile landmarks between phrases, and take breaks between groups.",
    "left": "Keep the left hand free to move for every row. Use the finger choices that have been most reliable in earlier lessons.",
    "right": "Keep the right hand free to move for every row. Use the finger choices that have been most reliable in earlier lessons.",
    "practice": [
      "This morning I opened my practice file.",
      "I typed a message about the meeting at 2:30.",
      "Then I checked the names, numbers, and punctuation.",
      "After a short break, I read the message again.",
      "I corrected one word and saved my work.",
      "The finished note was clear and ready to use."
    ],
    "instruction": "The first three sentences form one paragraph; the last three form another. The website shows one sentence per group. In a document, separate the paragraphs with Enter. Timing remains optional.",
    "check": "Review sentence order and spacing. Record where a pause helped you keep control."
  },
  {
    "title": "Final one hand typing challenge",
    "new": "",
    "goal": "Use the complete course to produce a useful, accurate message.",
    "locate": "Use the letter rows, number row, and punctuation routes from the course. No help from the other hand is required.",
    "left": "Complete every key press with your left hand, including modifiers and Space. Reposition freely and use your established finger adaptations.",
    "right": "Complete every key press with your right hand, including modifiers and Space. Reposition freely and use your established finger adaptations.",
    "practice": [
      "Hello Robin,",
      "Our next class is on 10/24/2026 at 9:15.",
      "Please bring 2 notebooks and a pen to Room #3.",
      "The notebooks cost $12.50, including a 10% discount.",
      "Save your notes as class_notes_3.txt.",
      "Can you reply to class_notes@example.org?",
      "Thank you for your help!"
    ],
    "instruction": "Copy the message carefully. After the website practice, use a separate document to add a sentence of your own, correct an error, save, and reopen the file. Use Sticky Keys for shortcuts, one key at a time. Completion is based on accuracy; speed is optional.",
    "check": "Check every detail and confirm the saved file in your editor. Record which tasks you completed independently and which you want to repeat."
  }
];

  const shiftedKeys = { "~": "`", "!": "1", "@": "2", "#": "3", "$": "4", "%": "5", "^": "6", "&": "7", "*": "8", "(": "9", ")": "0", "_": "-", "+": "=", "{": "[", "}": "]", "|": "\\", ":": ";", "\"": "'", "<": ",", ">": ".", "?": "/" };

  function lessonFor(index, hand) {
    const item = lessons[index];
    const allowed = Array.from(new Set(lessons.slice(0, index + 1).map(lesson => lesson.new).join(""))).join("");
    return {
      number: index + 1,
      title: item.title,
      description: item.goal,
      allowed,
      focus: item.new || allowed,
      practiceGroups: item.practice.slice(),
      introduction: item.locate + " " + item[hand] + " " + item.instruction,
      handPosition: hand === "left"
        ? "Use your left hand only. From left to right, rest the little finger on F, ring finger on G, middle finger on H, and index finger on J. Use your thumb for Space."
        : "Use your right hand only. From left to right, rest the index finger on F, middle finger on G, ring finger on H, and little finger on J. Use your thumb for Space."
    };
  }

  function keyFinger(character, hand) {
    const lower = String(character || "").toLowerCase();
    const key = shiftedKeys[lower] || lower;
    const groups = hand === "left"
      ? [["Little finger", "frv"], ["Ring finger", "gtb"], ["Middle finger", "hyn"], ["Index finger", "jum"]]
      : [["Index finger", "frv"], ["Middle finger", "gtb"], ["Ring finger", "hyn"], ["Little finger", "jum"]];
    const match = groups.find(group => group[1].includes(key));
    return {
      hand: hand === "left" ? "Left hand" : "Right hand",
      handId: hand,
      finger: key === " " ? "Thumb" : match ? match[0] : "Index or middle finger; move the whole hand",
      key
    };
  }

  root.ALCOneHandCurriculum = {
    count: lessons.length,
    lessonFor,
    keyFinger,
    // Preserve earlier side-filtered records without applying them to new lessons.
    progressPrefix: hand => "en:" + hand + ":one-hand-v1:"
  };
})(globalThis);
