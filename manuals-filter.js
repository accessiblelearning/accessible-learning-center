(() => {
  "use strict";
  const search = document.getElementById("manualSearch");
  const type = document.getElementById("manualType");
  const clear = document.getElementById("clearManualFilters");
  const status = document.getElementById("manualFilterStatus");
  const items = [...document.querySelectorAll("[data-manual-item]")];
  const groups = [...document.querySelectorAll("[data-manual-group]")];

  function update() {
    const query = search.value.trim().toLowerCase();
    const selectedType = type.value;
    let visible = 0;
    for (const item of items) {
      const matchesText = !query || item.dataset.search.includes(query);
      const matchesType = selectedType === "all" || item.dataset.type === selectedType;
      item.hidden = !(matchesText && matchesType);
      if (!item.hidden) visible += 1;
    }
    for (const group of groups) {
      group.hidden = !group.querySelector("[data-manual-item]:not([hidden])");
    }
    status.textContent = `${visible} ${visible === 1 ? "manual" : "manuals"} shown.`;
  }

  search.addEventListener("input", update);
  type.addEventListener("change", update);
  clear.addEventListener("click", () => {
    search.value = "";
    type.value = "all";
    update();
    search.focus();
  });
  update();
})();
