import type { EraGroup } from '@/types';

/**
 * Stack real de Alexandra, organizado por eras geológicas.
 * Niveles honestos según lo que ella domina de verdad:
 * - TypeScript: "no tanto" → nivel conservador en consolidación.
 * - Three.js: librería de 3D del navegador (no un lenguaje), en práctica con este portafolio.
 */
export const ERAS: EraGroup[] = [
  {
    era: 'triassic',
    label: 'Era Triásica',
    range: '252 – 201 Ma',
    subtitle: 'Cimientos & Núcleo (Backend)',
    description:
      'La base rocosa: lenguajes de programación, servidores, bases de datos y contenedores. Todo sistema vivo comienza aquí, en la corteza profunda del stack.',
    accent: '#9C6B3F',
    skills: [
      { name: 'Python', level: 88, hint: 'Automatización, scripts y lógica de negocio' },
      { name: 'JavaScript', level: 88, hint: 'El lenguaje universal de la web' },
      { name: 'TypeScript', level: 62, hint: 'Lo uso en proyectos, aún en consolidación' },
      { name: 'Node.js', level: 85, hint: 'APIs y servicios en tiempo real' },
      { name: 'Django', level: 82, hint: 'Backends robustos y administrables' },
      { name: 'NestJS', level: 76, hint: 'Arquitectura modular y escalable' },
      { name: 'PostgreSQL', level: 80, hint: 'Persistencia relacional estricta' },
      { name: 'MySQL', level: 74, hint: 'Esquemas clínicos y transaccionales' },
      { name: 'MongoDB', level: 72, hint: 'Documentos flexibles y esquemas vivos' },
      { name: 'Docker', level: 76, hint: 'Hábitats reproducibles de despliegue' },
    ],
  },
  {
    era: 'jurassic',
    label: 'Era Jurásica',
    range: '201 – 145 Ma',
    subtitle: 'Expansión & Interfaz (Frontend)',
    description:
      'La era de las grandes superficies: interfaces dinámicas, animación, diseño responsivo y experiencias que respiran con el usuario.',
    accent: '#2E8B62',
    skills: [
      { name: 'React', level: 86, hint: 'Componentes y estado declarativo' },
      { name: 'Next.js', level: 82, hint: 'App Router, SSR y rendimiento' },
      { name: 'HTML5', level: 90, hint: 'Semántica y accesibilidad' },
      { name: 'CSS3', level: 86, hint: 'Layout, grid y motion moderno' },
      { name: 'Tailwind CSS', level: 78, hint: 'Sistemas de diseño de utilidad' },
      { name: 'Framer Motion', level: 60, hint: 'En práctica: coreografía de interfaz' },
    ],
  },
  {
    era: 'cretaceous',
    label: 'Era Cretácica',
    range: '145 – 66 Ma',
    subtitle: 'Apogeo: Móvil, 3D & Game Dev',
    description:
      'La cumbre de la biodiversidad: aplicaciones móvil, gráficos 3D en tiempo real y videojuegos donde el código se convierte en criatura viva.',
    accent: '#6657E2',
    skills: [
      { name: 'Flutter', level: 74, hint: 'Apps nativas multiplataforma' },
      { name: 'React Native', level: 68, hint: 'Móvil con ecosistema React' },
      { name: 'Three.js', level: 64, hint: 'Librería 3D del navegador · en práctica' },
      { name: 'React Three Fiber', level: 60, hint: 'Declaración 3D dentro de React' },
      { name: 'WebGL', level: 50, hint: 'Nociones de shaders y renderizado' },
      { name: 'Game Development', level: 80, hint: 'Mecánicas, bucles y mundos indie' },
    ],
  },
];
