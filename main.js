(function () {
  "use strict";

  const STORAGE_KEY = "theme";
  const navbar = document.getElementById("navbar");
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const iconOpen = document.getElementById("icon-open");
  const iconClose = document.getElementById("icon-close");
  const themeToggle = document.getElementById("theme-toggle");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  const contactForm = document.getElementById("contact-form");
  const formError = document.getElementById("form-error");
  const formSuccess = document.getElementById("form-success");

  /* ---- Theme ---- */

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    }
  }

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const current = document.documentElement.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* ---- Footer year & login time ---- */

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const loginEl = document.getElementById("login-time");
  if (loginEl) {
    loginEl.textContent = new Date().toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  /* ---- Mobile menu ---- */

  let menuOpen = false;

  function setMenuOpen(open) {
    menuOpen = open;
    menuBtn.setAttribute("aria-expanded", String(open));
    mobileMenu.classList.toggle("is-hidden", !open);
    mobileMenu.classList.toggle("hidden", !open);
    iconOpen.classList.toggle("hidden", open);
    iconClose.classList.toggle("hidden", !open);
  }

  menuBtn.addEventListener("click", function () {
    setMenuOpen(!menuOpen);
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      setMenuOpen(false);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menuOpen) setMenuOpen(false);
  });

  /* ---- Navbar scroll ---- */

  function updateNavbar() {
    navbar.classList.toggle("is-scrolled", window.scrollY > 16);
  }

  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();

  /* ---- Active section nav ---- */

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + id);
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });

  /* ---- Contact form ---- */

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    formError.classList.add("hidden");
    formSuccess.classList.add("hidden");

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      formError.textContent =
        "error: all fields required (--name, --email, --message)";
      formError.classList.remove("hidden");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formError.textContent = "error: invalid email format";
      formError.classList.remove("hidden");
      return;
    }

    const subject = encodeURIComponent("Portfolio inquiry from " + name);
    const body = encodeURIComponent(
      "Name: " + name + "\nEmail: " + email + "\n\n" + message
    );

    window.location.href =
      "mailto:hello@37kiranp.com?subject=" + subject + "&body=" + body;

    formSuccess.textContent = "→ opening mail client...";
    formSuccess.classList.remove("hidden");
  });
})();