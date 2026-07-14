const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const iconos = require("./src/_data/iconos.js");

module.exports = function (eleventyConfig) {
  // Reescribe las URLs absolutas (/assets/..., /noticias/...) anteponiendo
  // pathPrefix en el HTML generado. Necesario porque GitHub Pages sirve el
  // sitio bajo /Telar/, no en la raíz del dominio.
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  eleventyConfig.addPassthroughCopy("src/assets");

  // {% icon "reloj" %} — icono SVG inline, trazo único, hereda color del texto.
  eleventyConfig.addShortcode("icon", function (nombre) {
    const trazo = iconos[nombre];
    if (!trazo) throw new Error(`Icono desconocido: "${nombre}"`);
    return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${trazo}</svg>`;
  });

  return {
    // TODO: cuando el sitio se sirva desde un dominio propio en la raíz
    // (p. ej. www.yuulia.com), cambiar a "/".
    pathPrefix: "/Telar/",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
