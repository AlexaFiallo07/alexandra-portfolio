import type { SkillGroup } from '@/types';

/**
 * Stack real de Alexandra, organizado por categorías.
 * Niveles honestos según lo que ella domina de verdad:
 * - TypeScript: "no tanto" → nivel conservador en consolidación.
 * - Three.js: es una librería de 3D del navegador (no un lenguaje), en práctica con este portafolio.
 * - Tailwind / Framer Motion / WebGL: niveles conservadores (sin confirmación explícita).
 */
export const STACK: SkillGroup[] = [
  {
    id: 'backend',
    label: 'Backend',
    subtitle: 'El motor del sistema',
    description:
      'Lenguajes, frameworks y lógica de negocio: APIs, autenticación, reglas de negocio y todo lo que ocurre detrás de la interfaz.',
    accent: '#A98FD6',
    icon: 'skull',
    skills: [
      { name: 'Python', level: 88, hint: 'Automatización, scripts y lógica de negocio', fossil: 'skull' },
      { name: 'JavaScript', level: 88, hint: 'El lenguaje universal de la web', fossil: 'tooth' },
      { name: 'TypeScript', level: 62, hint: 'Lo uso en proyectos, aún en consolidación', fossil: 'egg' },
      { name: 'Node.js', level: 85, hint: 'APIs y servicios en tiempo real', fossil: 'vertebra' },
      { name: 'Django', level: 82, hint: 'Backends robustos y administrables', fossil: 'skull' },
      { name: 'NestJS', level: 76, hint: 'Arquitectura modular y escalable', fossil: 'rib' },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    subtitle: 'La interfaz que se mueve',
    description:
      'Componentes, layout, animación y gráficos 3D en tiempo real: la capa que el usuario ve, toca y recuerda.',
    accent: '#C4A35A',
    icon: 'tricera',
    skills: [
      { name: 'React', level: 86, hint: 'Componentes y estado declarativo', fossil: 'tricera' },
      { name: 'Next.js', level: 82, hint: 'App Router, SSR y rendimiento', fossil: 'spine' },
      { name: 'HTML5', level: 90, hint: 'Semántica y accesibilidad', fossil: 'rib' },
      { name: 'CSS3', level: 86, hint: 'Layout, grid y motion moderno', fossil: 'claw' },
      { name: 'Tailwind CSS', level: 78, hint: 'Sistemas de diseño de utilidad', fossil: 'claw' },
      { name: 'Framer Motion', level: 60, hint: 'En práctica: coreografía de interfaz', fossil: 'wing' },
      { name: 'Three.js', level: 64, hint: 'Librería 3D del navegador · en práctica', fossil: 'egg' },
      { name: 'React Three Fiber', level: 60, hint: 'Declaración 3D dentro de React', fossil: 'egg' },
      { name: 'WebGL', level: 50, hint: 'Nociones de shaders y renderizado', fossil: 'tooth' },
    ],
  },
  {
    id: 'movil',
    label: 'Móvil',
    subtitle: 'Código en el bolsillo',
    description:
      'Aplicaciones multiplataforma que llevan el mismo producto a Android e iOS sin duplicar esfuerzo.',
    accent: '#8F7BD8',
    icon: 'footprint',
    skills: [
      { name: 'Flutter', level: 74, hint: 'Apps nativas multiplataforma', fossil: 'footprint' },
      { name: 'React Native', level: 68, hint: 'Móvil con ecosistema React', fossil: 'footprint' },
    ],
  },
  {
    id: 'datos',
    label: 'Bases de Datos',
    subtitle: 'La memoria del sistema',
    description:
      'Persistencia relacional y documental: esquemas, kardex, transacciones y consultas que no mienten.',
    accent: '#6FCF97',
    icon: 'egg',
    skills: [
      { name: 'PostgreSQL', level: 80, hint: 'Persistencia relacional estricta', fossil: 'egg' },
      { name: 'MySQL', level: 74, hint: 'Esquemas transaccionales', fossil: 'egg' },
      { name: 'MongoDB', level: 72, hint: 'Documentos flexibles y esquemas vivos', fossil: 'vertebra' },
      { name: 'SQLite', level: 76, hint: 'Base ligera integrada (Django)', fossil: 'tooth' },
    ],
  },
  {
    id: 'devops',
    label: 'DevOps & Herramientas',
    subtitle: 'Herramientas de campo',
    description:
      'Contenedores, control de versiones e integración continua: el equipo de excavación que mantiene todo en su sitio.',
    accent: '#A98FD6',
    icon: 'claw',
    skills: [
      { name: 'Docker', level: 76, hint: 'Hábitats reproducibles de despliegue', fossil: 'claw' },
      { name: 'Git', level: 80, hint: 'Historial limpio, ramas y colaboración', fossil: 'spine' },
      { name: 'GitHub Actions', level: 72, hint: 'CI que ejecuta la suite en cada push', fossil: 'wing' },
    ],
  },
];
