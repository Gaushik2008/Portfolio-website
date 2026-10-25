const root = document.documentElement;
const themeButton = document.querySelector("[data-theme-toggle]");
const menuButton = document.querySelector(".menu-toggle");
const siteHeader = document.querySelector(".site-header");
const themeColor = document.querySelector('meta[name="theme-color"]');

try {
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "light" || savedTheme === "dark") root.dataset.theme = savedTheme;
} catch {
  // The page still works when browser storage is unavailable.
}

root.classList.add("js");

const revealSections = document.querySelectorAll("[data-reveal]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealSections.forEach((section) => section.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

  revealSections.forEach((section) => revealObserver.observe(section));
}

function setTheme(theme) {
  root.dataset.theme = theme;
  themeButton.setAttribute("aria-pressed", String(theme === "light"));
  themeButton.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
  themeButton.querySelector("span").textContent = theme === "dark" ? "Light" : "Dark";
  themeColor.content = theme === "dark" ? "#111410" : "#edf0e8";

  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch {
    // Theme switching remains available for this visit.
  }
}

setTheme(root.dataset.theme === "light" ? "light" : "dark");

themeButton.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

function setMenuOpen(open) {
  siteHeader.dataset.menuOpen = String(open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", `${open ? "Close" : "Open"} navigation`);
}

menuButton.addEventListener("click", () => {
  setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
});

document.querySelectorAll("#site-nav a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuButton.focus();
  }
});

document.querySelector("[data-year]").textContent = new Date().getFullYear();
