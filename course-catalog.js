(() => {
  "use strict";

  const filter = document.getElementById("courseFilter");
  const topicFilter = document.getElementById("courseTopicFilter");
  const startedOnly = document.getElementById("startedCoursesOnly");
  const status = document.getElementById("courseFilterStatus");
  const sections = [...document.querySelectorAll('main > section[id$="-lessons"]')];
  if (!filter || !topicFilter || !startedOnly || !status || !sections.length) return;

  startedOnly.disabled = true;
  startedOnly.checked = false;
  const progressNotice = document.createElement("span");
  progressNotice.id = "courseProgressNotice";
  progressNotice.setAttribute("role", "status");
  startedOnly.setAttribute("aria-describedby", progressNotice.id);
  startedOnly.closest("p").append(" ", progressNotice);

  const API_URL = "https://accessible-learning-api.aaccessabilitylearningcenter.workers.dev";
  let studentId = "";
  try { studentId = localStorage.getItem("accessibleLearningStudentId") || ""; } catch (error) {}
  const courseData = {
    "thunderbird": {"name": "Thunderbird Email", "topics": "communication other"},
    "firefox": {"name": "Firefox", "topics": "screen-readers windows"},
    "zoomtext-fusion": {"name": "ZoomText and Fusion", "topics": "screen-readers windows"},
    "bookshare": {"name": "Bookshare", "topics": "other braille"},
    "learning-ally": {"name": "Learning Ally", "topics": "other"},

    jaws: { name: "JAWS Screen Reader", topics: "windows screen-readers" },
    windows: { name: "Windows 11", topics: "windows screen-readers" },
    "ai-fundamentals": { name: "AI Fundamentals", topics: "ai" },
    chatgpt: { name: "ChatGPT", topics: "ai" },
    word: { name: "Microsoft Word", topics: "microsoft" },
    excel: { name: "Microsoft Excel", topics: "microsoft" },
    powerpoint: { name: "Microsoft PowerPoint", topics: "microsoft" },
    copilot: { name: "Microsoft Copilot", topics: "microsoft ai" },
    chrome: { name: "Google Chrome", topics: "google screen-readers" },
    docs: { name: "Google Docs", topics: "google" },
    calendar: { name: "Google Calendar", topics: "google" },
    gemini: { name: "Google Gemini", topics: "google ai" },
    pdf: { name: "Adobe Acrobat and Accessible PDFs", topics: "other" },
    cybersecurity: { name: "Cybersecurity for Screen Reader Users", topics: "other" },
    "job-search": { name: "Accessible Job Search", topics: "employment" },
    focus: { name: "Focus 40 Blue", topics: "braille" },
    mantis: { name: "Mantis Q40", topics: "braille" },
    ereader: { name: "NLS Braille eReader", topics: "braille" },
    brailleblaster: { name: "BrailleBlaster", topics: "braille" },
    "free-office": { name: "Choosing a Free Office Suite", topics: "other" },
    "libreoffice-writer": { name: "LibreOffice Writer", topics: "other" },
    "libreoffice-calc": { name: "LibreOffice Calc", topics: "other" },
    "libreoffice-impress": { name: "LibreOffice Impress", topics: "other" },
    sheets: { name: "Google Sheets", topics: "google" },
    slides: { name: "Google Slides", topics: "google" }
  };

  sections.forEach(section => {
    const heading = section.querySelector(":scope > h2");
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    const courseName = heading?.textContent.replace(/ lessons$/i, "") || "course";
    const slug = section.id.replace(/-lessons$/, "");
    section.dataset.slug = slug;
    section.dataset.topics = courseData[slug]?.topics || "other";
    section.dataset.started = "false";
    summary.textContent = "Show manual, ten lessons, and final quiz for " + courseName;
    [...section.children].filter(child => child !== heading).forEach(child => details.append(child));
    details.prepend(summary);
    section.append(details);
    section.dataset.searchText = section.textContent.toLowerCase();
  });

  function applyFilter() {
    const query = filter.value.trim().toLowerCase();
    const selectedTopic = topicFilter.value;
    let visibleCount = 0;
    sections.forEach(section => {
      const matches = !query || section.dataset.searchText.includes(query);
      const matchesTopic = selectedTopic === "all" || section.dataset.topics.split(/\s+/).includes(selectedTopic);
      const matchesStarted = !startedOnly.checked || section.dataset.started === "true";
      section.hidden = !(matches && matchesTopic && matchesStarted);
      if (!section.hidden) {
        visibleCount += 1;
        if (query) section.querySelector("details").open = true;
      }
    });
    status.textContent = visibleCount + " course" + (visibleCount === 1 ? "" : "s") + " shown.";
  }

  filter.addEventListener("input", applyFilter);
  topicFilter.addEventListener("change", applyFilter);
  startedOnly.addEventListener("change", applyFilter);
  document.getElementById("expandCourses").addEventListener("click", () => {
    sections.filter(section => !section.hidden).forEach(section => { section.querySelector("details").open = true; });
  });
  document.getElementById("collapseCourses").addEventListener("click", () => {
    sections.forEach(section => { section.querySelector("details").open = false; });
  });

  applyFilter();
  function revealLinkedCourse() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch (error) { return; }
    const target = document.getElementById(id);
    if (!sections.includes(target)) return;
    filter.value = "";
    topicFilter.value = "all";
    startedOnly.checked = false;
    target.querySelector("details").open = true;
    applyFilter();
    target.scrollIntoView?.({ block: "start" });
  }
  revealLinkedCourse();
  window.addEventListener("hashchange", revealLinkedCourse);

  if (!studentId) {
    progressNotice.textContent = "Enter a Student ID to use this filter.";
    return;
  }

  function progressUnavailable(message) {
    startedOnly.disabled = true;
    startedOnly.checked = false;
    progressNotice.textContent = message;
    applyFilter();
  }

  progressNotice.textContent = "Checking saved course progress...";
  fetch(API_URL + "/progress?student_id=" + encodeURIComponent(studentId))
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(records => {
      if (!Array.isArray(records)) throw new Error("Invalid progress response");
      let currentId = "";
      try { currentId = localStorage.getItem("accessibleLearningStudentId") || ""; } catch (error) {}
      if (currentId !== studentId) {
        progressUnavailable("The Student ID changed or could not be checked. Reload to show the current learner's saved progress. You can still browse all courses.");
        return;
      }
      const validRecords = records.filter(record => record && typeof record === "object" && !Array.isArray(record));
      sections.forEach(section => {
        const slug = section.dataset.slug;
        const courseName = courseData[slug]?.name;
        const details = section.querySelector("details");
        const summary = details.querySelector("summary");
        const lessonLinks = [...details.querySelectorAll('.course-lesson-list a')];
        // Reject coercible booleans/arrays and nonexistent lessons before using
        // a record for either completion counts or the Started courses filter.
        const courseRecords = validRecords.filter(record =>
          record.course === courseName &&
          (typeof record.lesson_number === "number" || typeof record.lesson_number === "string") &&
          Number.isInteger(Number(record.lesson_number)) &&
          Number(record.lesson_number) >= 1 && Number(record.lesson_number) <= lessonLinks.length
        );
        const completed = courseRecords.filter(record =>
          ["completed", "submitted"].includes(record.status)
        );
        section.dataset.started = String(courseRecords.some(record =>
          ["in_progress", "completed", "submitted"].includes(record.status)));
        const completedNumbers = new Set(completed.map(record => Number(record.lesson_number)));
        const nextIndex = lessonLinks.findIndex((link, index) => !completedNumbers.has(index + 1));
        summary.textContent = completedNumbers.size + " of " + lessonLinks.length + " lessons complete. Show course details for " +
          section.querySelector("h2").textContent.replace(/ lessons$/i, "");
        if (nextIndex >= 0 && section.dataset.started === "true") {
          const continueParagraph = document.createElement("p");
          continueParagraph.className = "course-continue";
          const continueLink = document.createElement("a");
          continueLink.href = lessonLinks[nextIndex].getAttribute("href");
          continueLink.textContent = "Continue with " + lessonLinks[nextIndex].textContent;
          continueParagraph.append(continueLink);
          section.insertBefore(continueParagraph, details);
        }
      });
      startedOnly.disabled = false;
      progressNotice.textContent = "";
      applyFilter();
    })
    .catch(() => {
      progressUnavailable("Saved course progress is temporarily unavailable. You can still browse courses. Reload to try the progress check again.");
    });
})();
