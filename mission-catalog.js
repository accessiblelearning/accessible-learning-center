(() => {
  "use strict";

  /*
   * Mission Control's setup screen reads this catalog. A manual can offer
   * command sets, topic-mission sets, or both. Add another set inside a manual
   * to make it appear in the appropriate practice list.
   */
  window.MissionControlCatalog = [
    {
      id: "screen-readers-web", label: "Screen Readers and Web Navigation",
      commandSets: [{ id: "web-navigation", label: "Web and screen-reader navigation", category: "Web and screen-reader navigation" }],
      missionSets: [{ id: "unexpected-window", label: "The unexpected window", mission: "0" }]
    },
    {
      id: "google-applications", label: "Google Applications",
      commandSets: [{ id: "google-docs", label: "Google Docs editing commands", category: "Google Docs and applications" }],
      missionSets: [{ id: "letters-navigate", label: "Letters navigate instead of typing", mission: "1" }]
    },
    {
      id: "microsoft-outlook", label: "Microsoft Outlook", commandSets: [],
      missionSets: [{ id: "protect-message", label: "Protect the unsent Outlook message", mission: "2" }]
    },
    {
      id: "microsoft-word", label: "Microsoft Word and Documents",
      commandSets: [{ id: "word-documents", label: "Word and document commands", category: "Microsoft Word and documents" }],
      missionSets: [{ id: "risky-word-edit", label: "The risky Word edit", mission: "3" }]
    },
    {
      id: "onedrive", label: "Microsoft OneDrive and Cloud Storage", commandSets: [],
      missionSets: [{ id: "preserve-original", label: "Move without losing the original", mission: "4" }]
    },
    {
      id: "online-meetings", label: "Zoom and Online Meetings", commandSets: [],
      missionSets: [{ id: "live-microphone", label: "The live microphone", mission: "5" }]
    },
    {
      id: "cybersecurity", label: "Privacy and Cybersecurity", commandSets: [],
      missionSets: [{ id: "suspicious-popup", label: "The suspicious pop-up", mission: "6" }]
    },
    {
      id: "windows-file-explorer", label: "Windows and File Explorer",
      commandSets: [{ id: "windows-files", label: "Windows and File Explorer commands", category: "Windows and File Explorer" }],
      missionSets: [{ id: "rename-file", label: "Rename the correct file", mission: "7" }]
    },
    {
      id: "general-editing", label: "General Editing",
      commandSets: [{ id: "editing-basics", label: "Essential editing commands", category: "General editing" }], missionSets: []
    },
    {
      id: "microsoft-excel", label: "Microsoft Excel and Spreadsheets",
      commandSets: [{ id: "excel-spreadsheets", label: "Excel and spreadsheet commands", category: "Microsoft Excel and spreadsheets" }], missionSets: []
    },
    {
      id: "presentations", label: "Microsoft PowerPoint and Presentations",
      commandSets: [{ id: "presentation-commands", label: "Presentation commands", category: "Presentations" }], missionSets: []
    },
    {
      id: "jaws", label: "JAWS",
      commandSets: [{ id: "jaws-commands", label: "JAWS commands", category: "JAWS commands" }], missionSets: []
    },
    {
      id: "nvda", label: "NVDA",
      commandSets: [{ id: "nvda-commands", label: "NVDA commands", category: "NVDA commands" }], missionSets: []
    },
    {
      id: "narrator", label: "Narrator",
      commandSets: [{ id: "narrator-commands", label: "Narrator commands", category: "Narrator commands" }], missionSets: []
    },
    {
      id: "braille-displays", label: "Braille Display Keyboard",
      commandSets: [{ id: "braille-keyboard", label: "Braille display keyboard commands", category: "Braille display keyboard practice" }], missionSets: []
    }
  ];
})();
