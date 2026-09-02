(() => {
  "use strict";

  const form = document.getElementById("resourceSearchForm");
  const queryInput = document.getElementById("resourceQuery");
  const typeSelect = document.getElementById("resourceType");
  const clearButton = document.getElementById("clearResourceSearch");
  const status = document.getElementById("resourceSearchStatus");
  const results = document.getElementById("resourceSearchResults");
  let entries = [];

  const synonyms = new Map([
    ["word", ["writer", "document", "docx"]],
    ["excel", ["calc", "sheets", "spreadsheet", "xlsx"]],
    ["powerpoint", ["impress", "slides", "presentation", "pptx"]],
    ["screenreader", ["screen reader", "jaws", "narrator", "nvda"]],
    ["braille", ["focus", "mantis", "ereader", "brf"]],
    ["file", ["files", "folder", "save", "saved", "open"]],
    ["stuck", ["help", "troubleshoot", "problem", "error"]],
    ["upload", ["assignment", "submission", "safari"]]
  ]);

  function normalizedTokens(value) {
    const tokens = value.toLowerCase().trim().split(/[^a-z0-9]+/).filter(token => token.length > 1);
    const expanded = new Set(tokens);
    for (const token of tokens) {
      const related = synonyms.get(token);
      if (related) related.forEach(word => expanded.add(word));
    }
    return [...expanded];
  }

  function score(entry, query, tokens) {
    const title = entry.title.toLowerCase();
    const course = entry.course.toLowerCase();
    let value = title.includes(query) ? 100 : 0;
    for (const token of tokens) {
      if (title.includes(token)) value += 24;
      if (course.includes(token)) value += 16;
      if (entry.text.includes(token)) value += 4;
    }
    return value;
  }

  function render() {
    const query = queryInput.value.trim().toLowerCase();
    const type = typeSelect.value;
    results.replaceChildren();

    const url = new URL(window.location.href);
    if (query) url.searchParams.set("q", queryInput.value.trim());
    else url.searchParams.delete("q");
    if (type !== "all") url.searchParams.set("type", type);
    else url.searchParams.delete("type");
    history.replaceState(null, "", url);

    if (!query) {
      status.textContent = "Enter one or more words to search 25 manuals and 250 lessons.";
      return;
    }

    const tokens = normalizedTokens(query);
    let matches = entries
      .filter(entry => type === "all" || entry.type === type)
      .map(entry => ({ entry, rank: score(entry, query, tokens) }))
      .filter(item => item.rank > 0)
      .sort((a, b) => b.rank - a.rank || a.entry.title.localeCompare(b.entry.title));

    const everyTokenMatches = matches.filter(item =>
      tokens.filter(token => ![...synonyms.values()].flat().includes(token)).every(token => item.entry.text.includes(token))
    );
    if (everyTokenMatches.length) matches = everyTokenMatches;
    matches = matches.slice(0, 30);

    if (!matches.length) {
      status.textContent = 'No results found for "' + queryInput.value.trim() + '". Try fewer words or browse the organized resources below.';
      return;
    }

    status.textContent = matches.length + (matches.length === 30 ? " top" : "") + " results found.";
    const fragment = document.createDocumentFragment();
    for (const { entry } of matches) {
      const item = document.createElement("li");
      const article = document.createElement("article");
      const heading = document.createElement("h3");
      const link = document.createElement("a");
      const meta = document.createElement("p");
      const summary = document.createElement("p");

      link.href = entry.url;
      link.textContent = entry.title;
      heading.appendChild(link);
      meta.className = "search-result__meta";
      meta.textContent = (entry.type === "manual" ? "Manual" : entry.type === "lesson" ? "Lesson" : "Website help") + " · " + entry.course;
      summary.textContent = entry.snippet;
      article.append(heading, meta, summary);
      item.appendChild(article);
      fragment.appendChild(item);
    }
    results.appendChild(fragment);
    results.querySelector("a")?.focus();
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    render();
  });
  typeSelect.addEventListener("change", () => {
    if (queryInput.value.trim()) render();
  });
  clearButton.addEventListener("click", () => {
    queryInput.value = "";
    typeSelect.value = "all";
    render();
    queryInput.focus();
  });

  const params = new URLSearchParams(window.location.search);
  queryInput.value = params.get("q") || "";
  typeSelect.value = ["manual", "lesson", "help"].includes(params.get("type")) ? params.get("type") : "all";

  fetch("search-index.json?v=resource-search-1", { cache: "no-store" })
    .then(response => {
      if (!response.ok) throw new Error("Search index unavailable");
      return response.json();
    })
    .then(data => {
      entries = Array.isArray(data.entries) ? data.entries : [];
      if (queryInput.value.trim()) render();
      else status.textContent = "Search is ready. Enter one or more words to search 25 manuals and 250 lessons.";
    })
    .catch(() => {
      status.textContent = "Search is temporarily unavailable. Use the organized resource links below.";
    });
})();