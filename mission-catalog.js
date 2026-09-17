(() => {
  "use strict";

  /* Keep entries in the same general order as the Manuals page. Each set is
     independently available; no completion or passing requirement is used. */
  window.MissionControlCatalog = [
    {
      id: "screen-readers",
      label: "Screen Readers: JAWS, Narrator, and NVDA",
      commandSets: [
        { id: "web-navigation", label: "Screen Readers: Web Navigation Commands", category: "Web and screen-reader navigation" },
        { id: "jaws-commands", label: "JAWS: Window, Focus, and Navigation Commands", category: "JAWS commands" },
        { id: "narrator-commands", label: "Narrator: Window, Scan Mode, and Navigation Commands", category: "Narrator commands" },
        { id: "nvda-commands", label: "NVDA: Window, Focus, and Navigation Commands", category: "NVDA commands" }
      ],
      missionSets: [
        { id: "jaws-active-window", label: "JAWS: Identify the Active Window", mission: "0", reader: "jaws" },
        { id: "narrator-active-window", label: "Narrator: Identify the Active Window", mission: "0", reader: "narrator" },
        { id: "nvda-active-window", label: "NVDA: Identify the Active Window", mission: "0", reader: "nvda" }
      ]
    },
    {
      id: "windows",
      label: "Windows 11 and File Explorer",
      commandSets: [
        { id: "windows-files", label: "Windows and File Explorer: Navigation and File Commands", category: "Windows and File Explorer" }
      ],
      missionSets: [
        { id: "rename-file", label: "Windows and File Explorer: Rename the Correct File", mission: "7" }
      ]
    },
    {
      id: "microsoft-word",
      label: "Microsoft Word",
      commandSets: [
        { id: "editing-basics", menuLabel: "Microsoft Word — Editing", label: "Microsoft Word: Essential Editing Commands", category: "General editing" },
        { id: "word-documents", menuLabel: "Microsoft Word — Navigation and Formatting", label: "Microsoft Word: Document Navigation and Formatting Commands", category: "Microsoft Word and documents" }
      ],
      missionSets: [
        { id: "risky-word-edit", label: "Microsoft Word: Recover a Risky Edit", mission: "3" }
      ]
    },
    {
      id: "microsoft-excel",
      label: "Microsoft Excel",
      commandSets: [
        { id: "excel-spreadsheets", label: "Microsoft Excel: Worksheet and Cell Commands", category: "Microsoft Excel and spreadsheets" }
      ],
      missionSets: []
    },
    {
      id: "microsoft-powerpoint",
      label: "Microsoft PowerPoint",
      commandSets: [
        { id: "presentation-commands", label: "Microsoft PowerPoint: Slide and Formatting Commands", category: "Presentations" }
      ],
      missionSets: []
    },
    {
      id: "google-applications",
      label: "Google Applications",
      commandSets: [
        { id: "google-docs", label: "Google Docs: Editing and Formatting Commands", category: "Google Docs and applications" }
      ],
      missionSets: [
        { id: "letters-navigate", label: "Google Applications: Letters Navigate Instead of Typing", mission: "1" }
      ]
    },
    {
      id: "cybersecurity",
      label: "Cybersecurity for Screen Reader Users",
      commandSets: [],
      missionSets: [
        { id: "suspicious-popup", label: "Cybersecurity: Close a Suspicious Pop-up Safely", mission: "6" }
      ]
    },
    {
      id: "braille-displays",
      label: "Braille Displays",
      commandSets: [
        { id: "braille-keyboard", label: "Braille Displays: Keyboard Navigation Commands", category: "Braille display keyboard practice" }
      ],
      missionSets: []
    },
    {
      id: "microsoft-outlook",
      label: "Microsoft Outlook",
      commandSets: [],
      missionSets: [
        { id: "protect-message", label: "Microsoft Outlook: Protect an Unsent Message", mission: "2" }
      ]
    },
    {
      id: "onedrive",
      label: "Microsoft OneDrive and Cloud Storage",
      commandSets: [],
      missionSets: [
        { id: "preserve-original", label: "OneDrive: Copy a File Without Losing the Original", mission: "4" }
      ]
    },
    {
      id: "online-meetings",
      label: "Zoom and Online Meetings",
      commandSets: [],
      missionSets: [
        { id: "live-microphone", label: "Zoom: Protect a Live Microphone", mission: "5" }
      ]
    }
 ,
{
    "id": "thunderbird",
    "label": "Thunderbird Email",
    "commandSets": [
        {
            "id": "thunderbird-commands",
            "menuLabel": "Thunderbird Email",
            "label": "Thunderbird Email: Thunderbird email",
            "category": "Thunderbird email"
        }
    ],
    "missionSets": [
        {
            "id": "thunderbird-mission",
            "label": "Thunderbird Email: Protect a Thunderbird draft",
            "mission": "8"
        }
    ]
},
{
    "id": "firefox",
    "label": "Firefox",
    "commandSets": [
        {
            "id": "firefox-commands",
            "menuLabel": "Firefox",
            "label": "Firefox: Firefox browser",
            "category": "Firefox browser"
        }
    ],
    "missionSets": [
        {
            "id": "firefox-mission",
            "label": "Firefox: Recover a closed Firefox article",
            "mission": "9"
        }
    ]
},
{
    "id": "zoomtext-fusion",
    "label": "ZoomText and Fusion",
    "commandSets": [
        {
            "id": "zoomtext-fusion-commands",
            "menuLabel": "ZoomText and Fusion — Desktop magnification",
            "label": "ZoomText and Fusion: ZoomText and Fusion Desktop magnification",
            "category": "ZoomText and Fusion Desktop magnification"
        }
    ],
    "missionSets": [
        {
            "id": "zoomtext-fusion-mission",
            "label": "ZoomText and Fusion: Regain context while magnified",
            "mission": "10"
        }
    ]
},
{
    "id": "bookshare",
    "label": "Bookshare",
    "commandSets": [
        {
            "id": "bookshare-commands",
            "menuLabel": "Bookshare",
            "label": "Bookshare: Bookshare Reader on the web",
            "category": "Bookshare Reader on the web"
        }
    ],
    "missionSets": [
        {
            "id": "bookshare-mission",
            "label": "Bookshare: Keep a Bookshare study passage",
            "mission": "11"
        }
    ]
},
{
    "id": "learning-ally",
    "label": "Learning Ally",
    "commandSets": [
        {
            "id": "learning-ally-commands",
            "menuLabel": "Learning Ally",
            "label": "Learning Ally: Learning Ally control navigation",
            "category": "Learning Ally control navigation"
        }
    ],
    "missionSets": [
        {
            "id": "learning-ally-mission",
            "label": "Learning Ally: Pause before choosing a chapter",
            "mission": "12"
        }
    ]
}
  ].sort((a, b) => a.label.localeCompare(b.label));
})();
