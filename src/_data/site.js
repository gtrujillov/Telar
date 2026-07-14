// Única fuente de verdad para la URL absoluta del sitio (sin barra final).
// La usan canonical, Open Graph, JSON-LD, sitemap.xml y robots.txt.
//
// IMPORTANTE: mientras el sitio se sirva desde GitHub Pages, la URL debe ser
// la que Google puede rastrear de verdad. Un canonical que apunta a un dominio
// sin publicar (yuulia.com aún no resuelve) le dice a Google "esta página no
// es la buena" y bloquea la indexación de todo el sitio.
//
// TODO: cuando yuulia.com esté publicado y sirviendo este sitio, cambiar url a
// "https://www.yuulia.com" y, a la vez, pathPrefix a "/" en .eleventy.js.
module.exports = {
  url: "https://gtrujillov.github.io/Telar",
  nombre: "Yuulia",
};
