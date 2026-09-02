(() => {
  "use strict";

  const root = document.documentElement;
  const storageKey = "accessibleLearningPreferences";
  const minScale = 90;
  const maxScale = 150;
  const scaleStep = 10;
  let preferences = {
    textScale: 100,
    darkMode: false,
    highContrast: false,
    reduceMotion: false
  };

  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (stored && typeof stored === "object") {
      preferences = {
        textScale: Number(stored.textScale) || 100,
        darkMode: Boolean(stored.darkMode),
        highContrast: Boolean(stored.highContrast),
        reduceMotion: Boolean(stored.reduceMotion)
      };
    }
  } catch (error) {
    // Keep safe defaults when browser storage is unavailable.
  }

  function savePreferences() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(preferences));
    } catch (error) {
      // Controls still work for the current page when storage is unavailable.
    }
  }

  function applyPreferences() {
    preferences.textScale = Math.min(
      maxScale,
      Math.max(minScale, preferences.textScale)
    );
    root.style.fontSize = preferences.textScale + "%";
    root.dataset.theme = preferences.darkMode ? "dark" : "light";
    root.style.colorScheme = preferences.darkMode ? "dark" : "light";
    root.dataset.contrast = preferences.highContrast ? "high" : "standard";
    root.dataset.reduceMotion = preferences.reduceMotion ? "true" : "false";
  }

  applyPreferences();

  document.addEventListener("DOMContentLoaded", () => {
    const main = document.querySelector("main");
    const firstHeading = document.querySelector("h1");
    const skipTarget = main || firstHeading;

    if (skipTarget && !skipTarget.id) {
      skipTarget.id = "main-content";
    }

    const skipLink = document.createElement("a");
    skipLink.className = "skip-link";
    skipLink.href = "#" + (skipTarget ? skipTarget.id : "main-content");
    skipLink.textContent = "Skip to main content";
    document.body.prepend(skipLink);

    const panel = document.createElement("section");
    panel.className = "accessibility-panel";
    panel.setAttribute("aria-label", "Website accessibility settings");
    panel.innerHTML = `
      <div class="accessibility-panel__inner">
        <details class="accessibility-menu">
          <summary id="accessibility-controls-heading">Website accessibility settings</summary>
          <div class="accessibility-menu__content" aria-describedby="accessibility-controls-note">
            <p id="accessibility-controls-note" class="accessibility-note">
              Optional page controls that complement your browser, screen reader, and device settings.
            </p>
            <div class="accessibility-controls">
              <button type="button" data-action="decrease">Decrease text size</button>
              <button type="button" data-action="increase">Increase text size</button>
              <button type="button" data-action="reset-text">Reset text size</button>
              <button type="button" data-action="dark" aria-pressed="false">Dark mode</button>
              <button type="button" data-action="contrast" aria-pressed="false">High contrast</button>
              <button type="button" data-action="motion" aria-pressed="false">Reduce motion</button>
            </div>
            <p class="accessibility-status" role="status" aria-live="polite"></p>
          </div>
        </details>
      </div>
    `;

    const nav = document.createElement("nav");
    nav.className = "site-nav";
    nav.setAttribute("aria-label", "Primary navigation");
    nav.innerHTML = `
      <div class="site-nav__inner">
        <a href="index.html">Home</a>
        <a href="manuals.html">Manuals</a>
        <a href="lessons.html">Lessons</a>
        <a href="student-progress.html">My progress</a>
      </div>
    `;

    const currentPage = location.pathname.split("/").pop() || "index.html";
    nav.querySelectorAll("a").forEach((link) => {
      if (link.getAttribute("href") === currentPage) {
        link.setAttribute("aria-current", "page");
      }
    });

    document.body.insertBefore(nav, document.body.firstChild);
    document.body.insertBefore(panel, document.body.firstChild);

    const status = panel.querySelector(".accessibility-status");
    const darkButton = panel.querySelector('[data-action="dark"]');
    const contrastButton = panel.querySelector('[data-action="contrast"]');
    const motionButton = panel.querySelector('[data-action="motion"]');

    function updateButtons() {
      darkButton.setAttribute(
        "aria-pressed",
        String(preferences.darkMode)
      );
      contrastButton.setAttribute(
        "aria-pressed",
        String(preferences.highContrast)
      );
      motionButton.setAttribute(
        "aria-pressed",
        String(preferences.reduceMotion)
      );
    }

    function announce(text) {
      status.textContent = "";
      window.setTimeout(() => {
        status.textContent = text;
      }, 20);
    }

    updateButtons();

    panel.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;

      const action = button.dataset.action;

      if (action === "decrease") {
        preferences.textScale -= scaleStep;
        announce("Text size " + Math.max(minScale, preferences.textScale) + " percent.");
      } else if (action === "increase") {
        preferences.textScale += scaleStep;
        announce("Text size " + Math.min(maxScale, preferences.textScale) + " percent.");
      } else if (action === "reset-text") {
        preferences.textScale = 100;
        announce("Text size reset to 100 percent.");
      } else if (action === "dark") {
        preferences.darkMode = !preferences.darkMode;
        announce(
          preferences.darkMode
            ? "Dark mode turned on."
            : "Dark mode turned off."
        );
      } else if (action === "contrast") {
        preferences.highContrast = !preferences.highContrast;
        announce(
          preferences.highContrast
            ? "High contrast turned on."
            : "High contrast turned off."
        );
      } else if (action === "motion") {
        preferences.reduceMotion = !preferences.reduceMotion;
        announce(
          preferences.reduceMotion
            ? "Reduced motion turned on."
            : "Reduced motion turned off."
        );
      }

      applyPreferences();
      updateButtons();
      savePreferences();
    });
  });
})();
