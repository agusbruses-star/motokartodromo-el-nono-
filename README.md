# Motokartódromo El Nono · rediseño del sitio

Sitio del campeonato de karting en tierra de La Leonesa, Chaco. Esta rama guarda el rediseño en estado de revisión, antes de pasarlo a WordPress.

> **Estado:** vista previa. Todavía no está publicado en WordPress. Ver [Pendientes](#pendientes).

## Ver el sitio

Hace falta [Node.js](https://nodejs.org). Abrir `index.html` con doble clic no alcanza, porque parte del sitio necesita un servidor local.

```bash
git clone -b rediseno-racing https://github.com/agusbruses-star/motokartodromo-el-nono-.git
cd motokartodromo-el-nono-
node fuente/serve.js el-nono-sitio 4178
```

Después abrir <http://localhost:4178> y probar también en tamaño celular.

## Qué hay en cada carpeta

| Carpeta | Contenido |
|---|---|
| `el-nono-sitio/` | El sitio terminado: HTML, CSS, JS, fotos y fuentes. Es lo que se publica. |
| `fuente/build.js` | Genera `el-nono-sitio/`. Contiene la portada, el Calendario, la pantalla Más y los textos cambiados. |
| `fuente/estilos-base.css` y `fuente/estilos-detalle.css` | Estilos del rediseño. Se unen en `assets/app.css`. Las reglas se fueron agregando por etapas, así que las últimas pisan a las anteriores. |
| `fuente/app.js` | Cuenta regresiva, slider de galería, selector de categorías y selector día/noche. |
| `fuente/original-3-11/` | Versión del 3/11 de la que parte todo. No editar: es la base. |
| `fuente/imagenes/` | Logo original, fotos de la pista, foto del predio y referencias del hero. |

## Cómo seguir trabajando

**No conviene editar `el-nono-sitio/` a mano**, porque cada generación borra esa carpeta y la crea de nuevo. Los cambios van en `fuente/`:

```bash
cd fuente
npm install
npm run build
npm start
```

`npm run build` regenera el sitio y `npm start` lo sirve en <http://localhost:4178>.

Conviene revisar siempre en 360 px, 375 px y 1440 px.

### Cómo funcionan los colores

El sitio original era oscuro y se pasó a claro invirtiendo sus variables de color, por eso los nombres engañan: `text-white` hoy es azul marino y `bg-white` es un panel azul marino. Las zonas oscuras (encabezados, pie, banda de líderes) vuelven a definir esas variables. Los valores están al comienzo de `fuente/estilos-base.css`.

## Decisiones de diseño tomadas

Son las preferencias que surgieron revisando el sitio. Conviene respetarlas para no volver atrás.

**Sí**

- Fondo claro con detalles racing **sutiles**, y azul noche en hero, barras, encabezados y pie.
- Paleta del logo: azul, cian y un toque de verde.
- Botones inclinados con gradiente y **bandera a cuadros en el extremo**, todos con la calidad del "Soy piloto" del header. En celular la bandera se mueve sola, porque no hay mouse.
- Franja del header en azul, cian y verde, en movimiento continuo. Es solo un detalle.
- Navegación tipo app en celular: pestañas abajo, sin menú emergente.
- Hero grande con ticket de la próxima fecha y cuenta regresiva.
- Selector de categorías con la placa del número del líder en el color oficial, y bandera blanca y negra bien visible.
- Celular con al menos la misma calidad visual que desktop.

**No**

- Vidrio, animaciones de entrada ni diseños cargados.
- Rayitas o líneas de velocidad antes de los títulos.
- Franjas tipo piano de pista blancas y azules.
- Colores RGB tipo arcoíris.
- Indicadores que muestren el avance del scroll.
- Fondo que cambia de color al bajar, o franjas y banderas grandes en el fondo.
- Grillas de tarjetas iguales que se vean genéricas.

## Pendientes

- [ ] **Confirmar el horario de la Fecha 6:** la portada y Soy público dicen 9:00 hs, y Calendario dice "Horarios a confirmar". La cuenta regresiva usa las 9:00 (`fuente/build.js`).
- [ ] **Imagen del hero:** está generada con IA y puede tener marcas o detalles inventados. Conviene reemplazarla por fotos reales.
- [ ] **Foto de noche de la pista:** tiene poca resolución para pantallas grandes.
- [ ] **Soy piloto:** falta probar el recorrido completo, con credencial, fichas y PDF.
- [ ] **Revisión real:** probar en un celular de verdad y revisar las páginas en desktop.
- [ ] **Páginas con menos detalle:** Posiciones, Contacto, Sponsors y Reglamento todavía están por debajo de la portada y el Calendario.
- [ ] **Contacto:** los botones "Consultar" de Sponsors llevan al grupo general de WhatsApp. Definir si hay un número para consultas.
- [ ] **Textos por validar:** "Parrilla y mesas" en Circuito, "cierre del campeonato" en la Gran final y las frases de la pantalla Más.
- [ ] **Galería:** las fotos solo están clasificadas como Carreras o Pruebas. Para filtrar por categoría hay que indicar a cuál corresponde cada foto.
- [ ] **Datos del campeonato:** el ticket de la próxima fecha y las posiciones están fijos en el HTML y hay que actualizarlos a mano.
- [ ] **Antes de publicar en WordPress:** sacar `noindex, nofollow` de todas las páginas y definir cómo montar este HTML.
