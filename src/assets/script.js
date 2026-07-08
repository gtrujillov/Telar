(() => {
  "use strict";

  const STORAGE_KEY = "yuulia-tema";
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

  /* --- Vídeo de presentación: solo autorreproduce sin reduced-motion, y se pausa fuera de pantalla --- */
  const breakVideo = document.querySelector(".visual-break-video");
  if (breakVideo) {
    if (reduceMotion) {
      breakVideo.removeAttribute("loop");
      breakVideo.setAttribute("controls", "");
    } else {
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) breakVideo.play().catch(() => {});
          else breakVideo.pause();
        });
      }, { threshold: 0.3 });
      videoObserver.observe(breakVideo);
    }
  }

  /* --- Barra de progreso de scroll + parallax de la foto de fondo --- */
  const progressBar = document.querySelector(".scroll-progress");
  const parallaxImg = document.querySelector(".visual-break-media img");
  const parallaxContainer = document.querySelector(".visual-break-media");

  if (progressBar || (parallaxImg && !reduceMotion)) {
    let ticking = false;
    const updateScrollFx = () => {
      if (progressBar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
        progressBar.style.width = pct + "%";
      }
      if (parallaxImg && parallaxContainer && !reduceMotion) {
        const rect = parallaxContainer.getBoundingClientRect();
        const vh = window.innerHeight;
        if (rect.bottom > 0 && rect.top < vh) {
          const centerDelta = (rect.top + rect.height / 2) - vh / 2;
          const offset = Math.max(-40, Math.min(40, centerDelta * -0.08));
          parallaxImg.style.transform = `scale(1.08) translateY(${offset}px)`;
        }
      }
      ticking = false;
    };
    updateScrollFx();
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollFx);
        ticking = true;
      }
    }, { passive: true });
    window.addEventListener("resize", updateScrollFx);
  }

  /* --- Titular del hero: revelado palabra a palabra --- */
  const heroH1 = document.querySelector(".hero h1");
  if (heroH1 && !reduceMotion) {
    const words = heroH1.textContent.trim().split(/\s+/);
    heroH1.innerHTML = words.map((word, i) => {
      const isAccent = /repetitivo/i.test(word);
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
    { selector: ".cta-inner > *", step: 80 },
    { selector: ".visual-break-text, .visual-break-credit", step: 100 },
    { selector: ".noticia-card", step: 90 },
    { selector: ".noticia-articulo-fuente, .noticia-articulo-otras", step: 100 },
    { selector: ".section-cta", step: 0 }
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

  /* --- Inclinación 3D de las tarjetas al pasar el ratón --- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".problema-card, .escenario, .noticia-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const rx = (-py * 6).toFixed(2);
        const ry = (px * 6).toFixed(2);
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* --- CTA fijo: aparece tras el primer scroll, se oculta sobre #contacto --- */
  const stickyCta = document.querySelector(".sticky-cta");
  if (stickyCta) {
    const contacto = document.getElementById("contacto");
    let ctaTicking = false;
    const updateStickyCta = () => {
      let show = window.scrollY > 480;
      if (contacto && contacto.getBoundingClientRect().top < window.innerHeight) {
        show = false;
      }
      stickyCta.classList.toggle("visible", show);
      ctaTicking = false;
    };
    updateStickyCta();
    window.addEventListener("scroll", () => {
      if (!ctaTicking) {
        requestAnimationFrame(updateStickyCta);
        ctaTicking = true;
      }
    }, { passive: true });
    window.addEventListener("resize", updateStickyCta);
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
