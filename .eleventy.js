const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  // Reescribe las URLs absolutas (/assets/..., /noticias/...) anteponiendo
  // pathPrefix en el HTML generado. Necesario porque GitHub Pages sirve el
  // sitio bajo /Telar/, no en la raíz del dominio.
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  return {
    // TODO: cuando el sitio se sirva desde un dominio propio en la raíz
    // (p. ej. www.telar.es), cambiar a "/".
    pathPrefix: "/Telar/",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
