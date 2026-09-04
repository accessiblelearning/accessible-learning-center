(() => {
  "use strict";

  const root = document.documentElement;
  const storageKey = "accessibleLearningPreferences";
  const minScale = 90;
  const maxScale = 150;
  const scaleStep = 10;
  const analyticsEndpoint =
    "https://accessible-learning-api.aaccessabilitylearningcenter.workers.dev/analytics/collect";
  const analyticsHosts = new Set([
    "accessiblelearning.github.io",
    "accessiblelearningcenter.org",
    "www.accessiblelearningcenter.org"
  ]);
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

  function recordAnonymousPageView() {
    const currentPage = location.pathname.split("/").pop() || "index.html";

    if (
      !analyticsHosts.has(location.hostname) ||
      currentPage === "site-traffic.html" ||
      navigator.doNotTrack === "1"
    ) {
      return;
    }

    const payload = JSON.stringify({
      path: location.pathname,
      title: document.title,
      referrer: document.referrer
    });

    if (navigator.sendBeacon && navigator.sendBeacon(
        analyticsEndpoint,
        new Blob([payload], { type: "text/plain;charset=UTF-8" })
      )) {
      return;
    }

    fetch(analyticsEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true
    }).catch(() => {
      // Analytics must never interrupt a learner's page.
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    recordAnonymousPageView();
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
        <a href="start-here.html">Start here</a>
        <a href="manuals.html">Manuals</a>
        <a href="lessons.html">Lessons</a>
        <a href="quizzes.html">Quizzes</a>
        <a href="resources.html">Help &amp; search</a>
        <a href="troubleshooting-lab.html">Mission Control Sim</a>
      </div>
    `;

    const currentPage = location.pathname.split("/").pop() || "index.html";
    if (currentPage.endsWith("-manual.html")) {
      const reviewNote = document.createElement("p");
      reviewNote.className = "manual-review-date";
      reviewNote.innerHTML = "<strong>Last accessibility and structure review:</strong> September 2, 2026. Software interfaces can change; confirm differences using the official references in this manual.";
      document.querySelector("body > header")?.append(reviewNote);
    }
    nav.querySelectorAll("a").forEach((link) => {
      if (link.getAttribute("href") === currentPage) {
        link.setAttribute("aria-current", "page");
      }
    });

    // Keep the skip link first so it is the first keyboard stop on every page.
    document.body.prepend(skipLink, panel, nav);

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

    document.addEventListener("click", (event) => {
      const link = event.target.closest('.manual-contents a[href^="#"]');
      if (!link) return;

      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;

      target.setAttribute("tabindex", "-1");
      window.setTimeout(() => target.focus({ preventScroll: true }), 0);
    });
  });
})();
