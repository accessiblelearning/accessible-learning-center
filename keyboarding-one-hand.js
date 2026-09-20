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
