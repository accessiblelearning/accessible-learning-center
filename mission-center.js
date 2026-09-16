(() => {
  "use strict";

  const menu = document.getElementById("missionCenterMenu");
  if (!menu) return;
  const items = [...menu.querySelectorAll("a")];

  function setActive(item) {
    items.forEach(option => { option.tabIndex = option === item ? 0 : -1; });
  }

  items.forEach((item, index) => {
    item.tabIndex = index === 0 ? 0 : -1;
    item.addEventListener("focus", () => setActive(item));
  });

  menu.addEventListener("keydown", event => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const activeIndex = Math.max(0, items.indexOf(document.activeElement));
    let nextIndex = activeIndex;
    if (event.key === "ArrowDown") nextIndex = (activeIndex + 1) % items.length;
    if (event.key === "ArrowUp") nextIndex = (activeIndex - 1 + items.length) % items.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = items.length - 1;
    items[nextIndex].focus();
  });

  document.addEventListener("keydown", event => {
    if (!["Escape", "Esc"].includes(event.key) || event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;
    event.preventDefault();
    window.location.href = "start-here.html";
  }, true);

  window.addEventListener("DOMContentLoaded", () => items[0]?.focus());
})();
