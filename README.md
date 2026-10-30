# Motokartódromo El Nono — Sitio web

Sitio del Motokartódromo El Nono (Campeonato 2026): inicio, calendario, categorías,
tablas de posiciones de las 7 categorías, galería y contacto.

Diseñado en **Figma Make** y exportado a este repositorio. El frontend está completo;
por ahora todos los datos son **estáticos** (archivos TypeScript en `src/data/`).
El próximo paso es reemplazarlos por un backend.

## Stack

- React 19 + TypeScript
- Vite 8 (sitio **multipágina**: cada sección tiene su propio `index.html`)
- Tailwind CSS v4
- Node 22+ y pnpm 10 (ver `.mise.toml`)

## Cómo correrlo

```bash
pnpm install
pnpm dev        # servidor de desarrollo en http://localhost:8443
pnpm build      # genera el sitio estático en dist/
pnpm preview    # sirve dist/ para probar el build
```

> Las imágenes (`public/**/*.png|jpg|webp`) se guardan con **Git LFS**. Git para Windows
> ya lo trae; en Mac/Linux instalalo (`brew install git-lfs` / `apt install git-lfs`) y
> corré `git lfs install` una vez antes de clonar.

## Estructura

```
index.html, calendario/, categorias/, posiciones/, galeria/, contacto/
                       → una página HTML por sección (entradas de Vite)
src/
  App.tsx              → página de inicio
  pages/               → Calendario, Categorias, Posiciones, Galeria, Contacto
  entries/             → monta cada página en su HTML
  components/          → Layout (header/footer), Logo, CategoryRail, TrackMap, etc.
  data/
    site.ts            → datos generales, categorías, calendario, sponsors, galería
    standings.ts       → puntos por piloto y por fecha de cada categoría
    compute.ts         → calcula total, posición, victorias y diferencia
public/
  brand/               → emblema y favicon
  img/                 → fotos
.figma/                → archivos de Figma Make (permiten reimportar el repo en Figma)
```

## Guía para el backend

Todo el contenido dinámico sale de `src/data/`. Estos son los modelos que el backend
tiene que proveer (los tipos ya están definidos en esos archivos):

| Recurso | Tipo en el código | Dónde se usa | Sugerencia de endpoint |
|---|---|---|---|
| Datos del sitio (nombre, temporada, email, teléfono, dirección, horarios, redes) | `SITE` en `site.ts` | Header, footer, contacto | `GET /api/site` |
| Categorías (7) | `Category` | Inicio, Categorías, Posiciones, formulario | `GET /api/categorias` |
| Calendario / fechas | `Round` (`status`: `done` \| `next` \| `upcoming`) | Inicio, Calendario, Posiciones, Galería | `GET /api/fechas` |
| Posiciones por categoría | `StandingRow` (`points[i]` = puntos en la fecha `i+1`, `null` = no corrió) | Inicio, Categorías, Posiciones | `GET /api/categorias/:slug/posiciones` |
| Galería | `Photo` (`round`, `type`: `carrera` \| `prueba`) | Galería, Inicio | `GET /api/fotos` |
| Sponsors | `string[]` | Inicio | `GET /api/sponsors` |
| Formulario de contacto / inscripción | campos `nombre`, `telefono`, `categoria`, `mensaje` | Contacto | `POST /api/contacto` |

Notas:

- **Posiciones:** el backend solo necesita guardar los puntos de cada piloto en cada
  fecha. El total, el orden (desempate por victorias = fechas con 25 pts) y la diferencia
  con el líder los calcula `rankCategory()` en `src/data/compute.ts`. Ese cálculo se puede
  mover al backend si se prefiere.
- **Contacto:** hoy el formulario (`src/pages/Contacto.tsx`, función `submit`) abre el
  cliente de correo con `mailto:`. Hay que reemplazarlo por un `fetch` al endpoint.
- **Fotos:** hoy son archivos en `public/img/`. Si se suben desde un panel, el backend
  debería devolver la URL completa en `src`.
- Un panel de administración para cargar resultados de cada fecha sería el caso de uso
  principal del backend.
- Para apuntar a la API en desarrollo se puede usar una variable `VITE_API_URL` en un
  archivo `.env` (ya está ignorado por git) y leerla con `import.meta.env.VITE_API_URL`.
