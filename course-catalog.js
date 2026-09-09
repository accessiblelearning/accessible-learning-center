(() => {
  "use strict";

  const filter = document.getElementById("courseFilter");
  const topicFilter = document.getElementById("courseTopicFilter");
  const startedOnly = document.getElementById("startedCoursesOnly");
  const status = document.getElementById("courseFilterStatus");
  const sections = [...document.querySelectorAll('main > section[id$="-lessons"]')];
  if (!filter || !topicFilter || !startedOnly || !status || !sections.length) return;

  const API_URL = "https://accessible-learning-api.aaccessabilitylearningcenter.workers.dev";
  const studentId = localStorage.getItem("accessibleLearningStudentId");
  const courseData = {
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

  const target = location.hash ? document.querySelector(location.hash) : null;
  target?.querySelector("details")?.setAttribute("open", "");
  applyFilter();

  if (!studentId) {
    startedOnly.disabled = true;
    startedOnly.closest("p").append(" Enter a Student ID to use this filter.");
    return;
  }

  fetch(API_URL + "/progress?student_id=" + encodeURIComponent(studentId))
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(records => {
      if (!Array.isArray(records)) return;
      sections.forEach(section => {
        const slug = section.dataset.slug;
        const courseName = courseData[slug]?.name;
        const completed = records.filter(record =>
          record.course === courseName &&
          ["completed", "submitted"].includes(record.status)
        );
        section.dataset.started = String(completed.length > 0);
        const details = section.querySelector("details");
        const summary = details.querySelector("summary");
        const lessonLinks = [...details.querySelectorAll('.course-lesson-list a')];
        const completedNumbers = new Set(completed.map(record => Number(record.lesson_number)));
        const nextIndex = lessonLinks.findIndex((link, index) => !completedNumbers.has(index + 1));
        summary.textContent = completed.length + " of " + lessonLinks.length + " lessons complete. Show course details for " +
          section.querySelector("h2").textContent.replace(/ lessons$/i, "");
        if (nextIndex >= 0 && completed.length > 0) {
          const continueParagraph = document.createElement("p");
          continueParagraph.className = "course-continue";
          const continueLink = document.createElement("a");
          continueLink.href = lessonLinks[nextIndex].getAttribute("href");
          continueLink.textContent = "Continue with " + lessonLinks[nextIndex].textContent;
          continueParagraph.append(continueLink);
          section.insertBefore(continueParagraph, details);
        }
      });
      applyFilter();
    })
    .catch(() => {
      startedOnly.disabled = true;
      startedOnly.closest("p").append(" Started-course filtering is temporarily unavailable.");
    });
})();
