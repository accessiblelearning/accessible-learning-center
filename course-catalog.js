(() => {
  "use strict";

  const filter = document.getElementById("courseFilter");
  const status = document.getElementById("courseFilterStatus");
  const sections = [...document.querySelectorAll('main > section[id$="-lessons"]')];
  if (!filter || !status || !sections.length) return;

  sections.forEach(section => {
    const heading = section.querySelector(":scope > h2");
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    const courseName = heading?.textContent.replace(/ lessons$/i, "") || "course";
    summary.textContent = "Show manual, ten lessons, and final quiz for " + courseName;
    [...section.children].filter(child => child !== heading).forEach(child => details.append(child));
    details.prepend(summary);
    section.append(details);
    section.dataset.searchText = section.textContent.toLowerCase();
  });

  function applyFilter() {
    const query = filter.value.trim().toLowerCase();
    let visibleCount = 0;
    sections.forEach(section => {
      const matches = !query || section.dataset.searchText.includes(query);
      section.hidden = !matches;
      if (matches) {
        visibleCount += 1;
        if (query) section.querySelector("details").open = true;
      }
    });
    status.textContent = visibleCount + " course" + (visibleCount === 1 ? "" : "s") + " shown.";
  }

  filter.addEventListener("input", applyFilter);
  document.getElementById("expandCourses").addEventListener("click", () => {
    sections.filter(section => !section.hidden).forEach(section => { section.querySelector("details").open = true; });
  });
  document.getElementById("collapseCourses").addEventListener("click", () => {
    sections.forEach(section => { section.querySelector("details").open = false; });
  });

  const target = location.hash && document.querySelector(location.hash);
  target?.querySelector("details")?.setAttribute("open", "");
  applyFilter();
})();
