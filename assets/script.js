(() => {
  "use strict";

  const STORAGE_KEY = "telar-tema";
  const root = document.documentElement;
  const toggleBtn = document.getElementById("theme-toggle");

  function aplicarTema(tema) {
    if (tema === "oscuro") {
      root.dataset.theme = "oscuro";
    } else {
      delete root.dataset.theme;
    }
    if (toggleBtn) {
      toggleBtn.textContent = tema === "oscuro" ? "Claro" : "Oscuro";
    }
  }

  const guardado = localStorage.getItem(STORAGE_KEY);
  aplicarTema(guardado === "oscuro" ? "oscuro" : "claro");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const actual = root.dataset.theme === "oscuro" ? "oscuro" : "claro";
      const siguiente = actual === "oscuro" ? "claro" : "oscuro";
      aplicarTema(siguiente);
      localStorage.setItem(STORAGE_KEY, siguiente);
    });
  }
})();

/* ============================================================
   ANIMACIÓN Y EFECTOS
   ============================================================ */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* --- Intro de cortina: se retira del DOM tras su animación --- */
  const intro = document.querySelector(".page-intro");
  if (intro) {
    if (reduceMotion) {
      intro.remove();
    } else {
      setTimeout(() => intro.remove(), 1300);
    }
  }

  /* --- Barra de progreso de scroll --- */
  const progressBar = document.querySelector(".scroll-progress");
  if (progressBar) {
    let ticking = false;
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progressBar.style.width = pct + "%";
      ticking = false;
    };
    updateProgress();
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  /* --- Titular del hero: revelado palabra a palabra --- */
  const heroH1 = document.querySelector(".hero h1");
  if (heroH1 && !reduceMotion) {
    const words = heroH1.textContent.trim().split(/\s+/);
    heroH1.innerHTML = words.map((word, i) => {
      const isAccent = /papeleo/i.test(word);
      return `<span class="word"><span class="word-inner${isAccent ? " accent-text" : ""}" style="--i:${i}">${word}</span></span>`;
    }).join(" ");
  }

  /* --- Revelado en scroll: asigna .reveal + retardo escalonado --- */
  const revealGroups = [
    { selector: ".problema-card", step: 90 },
    { selector: ".paso", step: 100 },
    { selector: ".sector", step: 90 },
    { selector: ".escenario", step: 140 },
    { selector: ".section-title", step: 0 },
    { selector: ".cta-inner > *", step: 80 }
  ];

  const revealTargets = [];
  revealGroups.forEach(({ selector, step }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add("reveal");
      if (step) el.style.setProperty("--reveal-delay", (i * step) + "ms");
      revealTargets.push(el);
    });
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  /* --- Nav: resalta la sección visible --- */
  const navLinks = Array.from(document.querySelectorAll("nav a.nav-link[href^='#']"));
  const navSections = navLinks
    .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
    .filter(Boolean);

  if (navLinks.length && navSections.length && "IntersectionObserver" in window) {
    const setActive = (id) => {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + id);
      });
    };
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
    navSections.forEach((section) => navObserver.observe(section));
  }

  /* --- Botones magnéticos (solo con ratón de precisión) --- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".btn-primary, .btn-dark, .btn-cta").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0, 0)";
      });
    });
  }

  /* --- Cifras animadas al entrar en pantalla --- */
  const countTargets = document.querySelectorAll(".count-target");
  if (countTargets.length && !reduceMotion && "IntersectionObserver" in window) {
    const animateCount = (el) => {
      const target = parseFloat(el.dataset.count || el.textContent, 10);
      if (!isFinite(target)) return;
      const duration = 1100;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
    };
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    countTargets.forEach((el) => countObserver.observe(el));
  }
})();
