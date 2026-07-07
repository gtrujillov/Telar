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
