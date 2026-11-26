# Assets de BlendSwap (retirados)

Esta carpeta solo conserva localmente `Robot-T-Rex.blend` (ignorado por Git) junto a `BLENDSWAP_LICENSE.txt`, para poder regenerar el GLB de la vitrina. Los demás `.blend`, `.glb` y `.zip` se eliminaron con los personajes que el portafolio ya no muestra: dinosaurio en vitrina, dinosaurio que corre, compañero robótico, Brachiosaurus con café y Parasaurolophus histórico. El GLB resultante vive en `public/models/trex_hero.glb`.

## Registro histórico de descargas

| Asset | Autor | Licencia declarada | Estado |
| --- | --- | --- | --- |
| [Robot T-Rex #23140](https://blendswap.com/blend/23140) | sorenfroststaal | CC0 | `.blend` local + GLB en `public/models/trex_hero.glb` |
| [Robot-Dinosaur #2712](https://blendswap.com/blend/2712) | Jikz | CC0 | Eliminado |
| [Parasaurolophus #29831](https://blendswap.com/blend/29831) | Iagoms | CC BY 4.0 | Eliminado |
| [Plesiosaurus #30922](https://blendswap.com/blend/30922) | Plako_Plako | CC BY NC 4.0 | Eliminado |
| [Gallimimus #29407](https://blendswap.com/blend/29407) | Iagoms | CC BY 4.0 | Eliminado |
| [Brachiosaurus #28516](https://blendswap.com/blend/28516) | Iagoms | CC BY 4.0 | Eliminado |

Las licencias fueron **declaradas por el uploader y no verificadas por BlendSwap**. Las descargas costaron **0 créditos** (cuota gratuita diaria); el reintento de Gallimimus tras un corte de red se marcó como `repeat` y no se cobró. No se guarda ninguna credencial en el repositorio.

Los GLB que consume el sitio hoy son `trex_hero.glb` (robot T-Rex esquelético de la vitrina de Stack, preparado desde este `.blend` con `scripts/prepare-blendswap.py`) y `fossil_skull.glb` (generado localmente con `npm run generate:models`). Consulta `public/models/README.md` para los detalles de encuadre y validación.
