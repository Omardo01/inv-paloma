# Créditos de los assets de `/quince`

## `fotos/*.webp` — sesión de Yesenia

Las que usa el sitio. Salen de los originales en `Fotos yesi/`, que pesan 6–8 MB
cada uno y **no** se sirven (van ignorados en git). Mapa:

| Web | Original |
| --- | --- |
| `portada.webp` | `Portada.jpg` |
| `vestido-01…08.webp` | `IMG_6691-1`, `6693`, `6723`, `6755`, `6774`, `6818`, `6824`, `6826` |
| `casual-01…06.webp` | `IMG_6921`, `6947`, `6950`, `6957`, `6974`, `6980` |

Para regenerarlas (lado largo 1600 px, 2000 px la portada):

```bash
sips -Z 1600 origen.jpg --out tmp.jpg && cwebp -q 80 -m 6 tmp.jpg -o destino.webp
```

## `hero-muestra.jpg` — YA NO SE USA

Foto de relleno («Quinceañeras in Texas», D.C.Atty, CC BY 2.0) que servía para
ver el encuadre antes de tener la sesión. Sustituida por `fotos/portada.webp`;
se puede borrar.

## `deco/estrella-*.png` y `deco/lirio-*.png`

Recortes de las dos imágenes de decoración que mandó la familia; se les quitó
el fondo blanco y se separó cada elemento en su propio PNG con transparencia.
