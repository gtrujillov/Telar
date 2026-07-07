# Telar — web

Web estática (HTML/CSS/JS puro, sin dependencias ni build). Se sirve tal cual desde cualquier hosting estático.

## Estructura

```
index.html          página única
assets/styles.css    estilos
assets/script.js      toggle de tema claro/oscuro (persistido en localStorage)
assets/favicon.svg    icono de pestaña
robots.txt
sitemap.xml
legacy-dc-prototype/  prototipo original del editor visual (no se usa en producción)
```

## Antes de publicar — pendiente de sustituir

Estos datos son placeholders, buscar `TODO` en `index.html`, `robots.txt` y `sitemap.xml`:

- Email de contacto (`hola@telar.es`)
- Teléfono (`+34 910 000 000`)
- Ciudad del estudio (`Madrid, España`)
- Dominio real (`https://www.telar.es/`) en `<link rel="canonical">`, Open Graph, `robots.txt` y `sitemap.xml`

## Probar en local

Cualquier servidor estático sirve. Por ejemplo:

```bash
python3 -m http.server 8000
```

y abrir `http://localhost:8000`.

## Desplegar

No requiere build. Cualquiera de estas opciones funciona sin configuración adicional:

- **Netlify**: arrastrar la carpeta del proyecto a app.netlify.com/drop, o conectar el repositorio Git (build command vacío, publish directory `.`).
- **Vercel**: `vercel` desde la carpeta del proyecto, o importar el repo en vercel.com (framework preset: "Other").
- **GitHub Pages**: subir el repo a GitHub, activar Pages apuntando a la rama `main` / carpeta raíz.
- **Cualquier otro hosting estático** (S3+CloudFront, Cloudflare Pages, servidor propio con Nginx/Apache): copiar todos los archivos de la raíz (excepto `legacy-dc-prototype/` y `.claude/`) al servidor.
