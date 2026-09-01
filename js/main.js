/* =========================================================
   VERSIFX — MAIN JS
   Vanilla JS. No dependencies.
   ========================================================= */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky nav shadow on scroll ---------- */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".mobile-menu");
  var backdrop = document.querySelector(".mobile-menu-backdrop");
  var closeBtn = document.querySelector(".mobile-menu-close");

  function openMenu() {
    if (!menu) return;
    menu.classList.add("is-open");
    if (backdrop) backdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";
    toggle.setAttribute("aria-expanded", "true");
    menu.removeAttribute("aria-hidden");
    menu.removeAttribute("inert");
    var firstLink = menu.querySelector("a");
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("is-open");
    if (backdrop) backdrop.classList.remove("is-open");
    document.body.style.overflow = "";
    toggle.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
    menu.setAttribute("inert", "");
    toggle.focus();
  }

  if (toggle && menu) {
    toggle.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (backdrop) backdrop.addEventListener("click", closeMenu);
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) closeMenu();
    });
  }

  /* ---------- Scroll reveal (single, restrained) ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length && !reduceMotion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Contact form (Web3Forms) ---------- */
  var form = document.querySelector("#contact-form");
  if (form) {
    var WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

    var submitBtn = form.querySelector("button[type='submit']");
    var btnLabel = submitBtn ? submitBtn.querySelector(".btn-label") : null;
    var statusEl = form.querySelector(".form-status");
    var nameInput = form.querySelector("#name");
    var emailInput = form.querySelector("#email");

    var defaultBtnText = btnLabel ? btnLabel.textContent : (submitBtn ? submitBtn.textContent : "Start the Conversation");

    function setFieldError(input, message) {
      if (!input) return;
      var field = input.closest(".field");
      var errorEl = field ? field.querySelector(".field-error") : null;
      if (message) {
        if (field) field.classList.add("field--invalid");
        if (errorEl) {
          errorEl.textContent = message;
          errorEl.hidden = false;
        }
        input.setAttribute("aria-invalid", "true");
      } else {
        if (field) field.classList.remove("field--invalid");
        if (errorEl) {
          errorEl.textContent = "";
          errorEl.hidden = true;
        }
        input.removeAttribute("aria-invalid");
      }
    }

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validateForm() {
      var valid = true;

      if (!nameInput.value.trim()) {
        setFieldError(nameInput, "Please enter your name.");
        valid = false;
      } else {
        setFieldError(nameInput, null);
      }

      var emailValue = emailInput.value.trim();
      if (!emailValue) {
        setFieldError(emailInput, "Please enter your email.");
        valid = false;
      } else if (!isValidEmail(emailValue)) {
        setFieldError(emailInput, "Please enter a valid email address.");
        valid = false;
      } else {
        setFieldError(emailInput, null);
      }

      return valid;
    }

    function showStatus(message, type) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.hidden = false;
      statusEl.classList.remove("is-success", "is-error");
      if (type) statusEl.classList.add(type);
    }

    function setLoading(isLoading) {
      if (!submitBtn) return;
      submitBtn.disabled = isLoading;
      if (btnLabel) {
        btnLabel.textContent = isLoading ? "Sending…" : defaultBtnText;
      } else {
        submitBtn.textContent = isLoading ? "Sending…" : defaultBtnText;
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot: if this hidden field has a value, silently drop the submission.
      var honeypot = form.querySelector("[name='botcheck']");
      if (honeypot && honeypot.checked) {
        return;
      }

      if (!validateForm()) {
        showStatus("Please fix the highlighted fields and try again.", "is-error");
        return;
      }

      var formData = new FormData(form);
      var payload = Object.fromEntries(formData);
      payload.subject = "New VERSIFX Contact — " + nameInput.value.trim();
      payload.from_name = "VERSIFX Website";

      setLoading(true);
      showStatus("Sending…", "");

      fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok && result.data && result.data.success) {
            showStatus("Message sent successfully — we'll be in touch soon.", "is-success");
            form.reset();
            setFieldError(nameInput, null);
            setFieldError(emailInput, null);
          } else {
            showStatus("Something went wrong. Please try again.", "is-error");
          }
        })
        .catch(function () {
          showStatus("Something went wrong. Please try again.", "is-error");
        })
        .finally(function () {
          setLoading(false);
        });
    });
  }
})();