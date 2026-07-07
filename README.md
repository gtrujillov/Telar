# Telar — web

Generada con [Eleventy](https://www.11ty.dev/) a partir de `src/`. Multi-página: home + sección de Noticias con una página estática real por artículo (buena para SEO y para compartir). Se construye en GitHub Actions y se publica en GitHub Pages en cada push a `main`.

## Estructura

```
src/
  _includes/layout.njk   cabecera, nav, footer, scripts — compartido por todas las páginas
  _data/noticias.json    datos de las noticias (ver "Sección de Noticias" abajo)
  index.njk               página de inicio
  noticias/index.njk       listado de noticias
  noticias/articulo.njk    plantilla: genera una página por cada entrada de noticias.json
  sitemap.njk              sitemap.xml generado a partir de las páginas + noticias
  assets/                  CSS, JS, imágenes, favicon (se copian tal cual)
  robots.txt

.github/workflows/deploy.yml   build (Eleventy) + deploy a GitHub Pages en cada push a main
legacy-dc-prototype/            prototipo original del editor visual (no se usa en producción)
```

## Sección de Noticias

Cada noticia es una entrada en `src/_data/noticias.json`:

```json
{
  "slug": "onu-ia-avanza-mas-rapido-que-las-normas",
  "titulo": "La ONU avisa: la IA avanza más rápido que las normas que la regulan",
  "resumen": "2-4 frases, es un resumen/curación — no el artículo completo.",
  "categoria": "Regulación",
  "fecha": "2026-07-01",
  "fuente_nombre": "Noticias ONU",
  "fuente_url": "https://news.un.org/es/story/2026/07/1541630"
}
```

Es contenido **curado**, no artículos originales: cada página de noticia muestra el resumen y enlaza de forma prominente a la fuente original (`fuente_url`), con atribución (`fuente_nombre`). No se reproduce el artículo completo.

Al añadir una entrada nueva a `noticias.json` (recomendado: al principio del array, para que salga primero en el listado) y hacer build, Eleventy genera automáticamente:
- Su propia página en `/noticias/<slug>/`
- Su tarjeta en `/noticias/`
- Su entrada en `sitemap.xml`

**Pendiente para conectar con n8n** (fuera del alcance de esta entrega, a decidir juntos): el mecanismo por el que la automatización añade entradas a `noticias.json` y dispara el rebuild — lo más directo es que n8n haga commit del JSON actualizado vía la API de contenidos de GitHub sobre este repo, lo que dispara `deploy.yml` automáticamente. Antes de dar a n8n un token con permiso de escritura sobre el repo, conviene revisar juntos exactamente qué va a escribir.

## Antes de publicar — pendiente de sustituir

Estos datos son placeholders, buscar `TODO` en `src/_includes/layout.njk` y `src/index.njk`:

- Email de contacto (`hola@telar.es`)
- Teléfono (`+34 910 000 000`)
- Ciudad del estudio (`Madrid, España`)
- Dominio real (`https://www.telar.es/`) en `<link rel="canonical">`, Open Graph y `sitemap.njk`

## Desarrollo local

```bash
npm install
npm run dev      # servidor local con recarga en cambios (http://localhost:8080)
npm run build    # genera el sitio final en _site/
```

## Desplegar

Automático: cada push a `main` dispara `.github/workflows/deploy.yml`, que compila con Eleventy y publica el resultado en GitHub Pages. No hace falta build ni commit manual del contenido generado (`_site/` está en `.gitignore`).

Si se quisiera mover a otro hosting está­tico (Netlify, Vercel, Cloudflare Pages): build command `npm run build`, publish directory `_site`.
