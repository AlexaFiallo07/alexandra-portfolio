# Modelos 3D

Coloca aquí tus archivos `.glb` / `.gltf` (cráneos, dinosaurios, props, etc.).

Ejemplo de uso con `@react-three/drei`:

```tsx
import { useGLTF } from '@react-three/drei';

function SkullModel() {
  const { scene } = useGLTF('/models/skull.glb');
  return <primitive object={scene} />;
}

useGLTF.preload('/models/skull.glb');
```

> Nota: los modelos actuales del portafolo (cráneo fósil del hero y dino bebé)
> son 100% procedurales, así que la app funciona sin archivos externos.
