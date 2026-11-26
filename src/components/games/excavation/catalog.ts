import type { FossilSpec } from './types';

/**
 * Catálogo del yacimiento. Para sustituir un fósil procedural por un GLB
 * real (Sketchfab,etc.) basta con añadir `glb: '/models/mi-fosil.glb'`.
 * Consulta `README.md` en esta carpeta para las convenciones de exportación.
 */
export const FOSSIL_CATALOG: FossilSpec[] = [
  {
    id: 'trex',
    shape: 'trex',
    name: 'Tyrannosaurus rex',
    common: 'El rey del Cretácico',
    period: 'Cretácico superior · 68–66 Ma',
    fact: 'Su mordida superaba las 35.000 newtons: capaz de triturar hueso, no solo carne.',
    accent: '#6A4DAB',
    elevation: 0.8,
    burial: 0.1,
    footprint: [0.78, 0.44],
    href: '#proyectos',
    hrefLabel: 'Ver proyectos desbloqueados',
  },
  {
    id: 'raptor',
    shape: 'claw',
    name: 'Velociraptor mongoliensis',
    common: 'Garra de la mano',
    period: 'Cretácico superior · 75–71 Ma',
    fact: 'La garra curva del pie medía ~6 cm y servía para fijar y desgarrar a la presa.',
    accent: '#3E9D7B',
    elevation: 0.88,
    burial: 0.1,
    footprint: [0.44, 0.4],
  },
  {
    id: 'ammonite',
    shape: 'ammonite',
    name: 'Ammonoidea sp.',
    common: 'Amonita mineralizada',
    period: 'Jurásico · 201–145 Ma',
    fact: 'Aunque parecen fósiles de dinosaurio, son cefalópodos marinos emparentados con los calamares.',
    accent: '#3A2370',
    elevation: 0.24,
    burial: 0.09,
    footprint: [0.5, 0.5],
  },
  {
    id: 'vertebra',
    shape: 'vertebra',
    name: 'Sauropoda indet.',
    common: 'Vértebra dorsal',
    period: 'Jurásico superior · 155–145 Ma',
    fact: 'Las vértebras de los saurópodos tenían cámaras huecas: hueso ligero pero muy resistente.',
    accent: '#2B775D',
    elevation: 0.92,
    burial: 0.1,
    footprint: [0.46, 0.46],
    href: '#contacto',
    hrefLabel: 'Hablemos de paleo‑UI',
  },
];
