import type { SkillGroup } from '@/types';

/**
 * Categorías de siempre (Backend, Frontend, Móvil, Datos y DevOps) más un
 * bloque de Videojuegos & IA. Cada herramienta indica si ya la aplico o si
 * está en desarrollo activo, sin promotionalismos ni niveles inflados.
 */
export const STACK: SkillGroup[] = [
  {
    id: 'backend',
    label: 'Backend',
    subtitle: 'El motor del sistema',
    description:
      'Lenguajes, frameworks y lógica de negocio: APIs, autenticación, reglas y servicios que sostienen el producto.',
    accent: '#6A4DAB',
    icon: 'skull',
    skills: [
      { name: 'Python', level: 88, hint: 'Automatización y lógica de negocio', stage: 'aplico', fossil: 'skull' },
      { name: 'Django', level: 82, hint: 'Backends administrables y rápidos', stage: 'aplico', fossil: 'rib' },
      {
        name: 'Django REST Framework',
        level: 80,
        hint: 'Serialización, autenticación y vistas',
        stage: 'aplico',
        fossil: 'vertebra',
      },
      {
        name: 'JavaScript (ES6+)',
        level: 86,
        hint: 'Lógica de web y Node.js',
        stage: 'aplico',
        fossil: 'tooth',
      },
      { name: 'Node.js', level: 82, hint: 'Servicios y APIs en JavaScript', stage: 'aplico', fossil: 'spine' },
      { name: 'Express', level: 78, hint: 'Rutas y middleware minimalistas', stage: 'aplico', fossil: 'footprint' },
      {
        name: 'Payload CMS',
        level: 55,
        hint: 'CMS headless con Node y React',
        stage: 'desarrollo',
        fossil: 'tooth',
      },
      { name: 'TypeScript', level: 62, hint: 'Tipado en proyectos React/Next.js', stage: 'desarrollo', fossil: 'egg' },
      { name: 'NestJS', level: 60, hint: 'Arquitectura modular en Node.js', stage: 'desarrollo', fossil: 'rib' },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    subtitle: 'La interfaz que se mueve',
    description:
      'Componentes, layout, animación y gráficos interactivos: la capa que el usuario ve, toca y recuerda.',
    accent: '#3E9D7B',
    icon: 'tricera',
    skills: [
      { name: 'HTML5', level: 90, hint: 'Semántica y accesibilidad', stage: 'aplico', fossil: 'rib' },
      { name: 'CSS3', level: 86, hint: 'Layout, grid y movimiento', stage: 'aplico', fossil: 'claw' },
      {
        name: 'Tailwind CSS',
        level: 78,
        hint: 'Sistema de diseño de este portafolio',
        stage: 'aplico',
        fossil: 'claw',
      },
      {
        name: 'Framer Motion',
        level: 70,
        hint: 'Entradas y microinteracciones',
        stage: 'aplico',
        fossil: 'wing',
      },
      { name: 'React', level: 72, hint: 'Componentes y estado declarativo', stage: 'desarrollo', fossil: 'tricera' },
      { name: 'Next.js', level: 68, hint: 'App Router y renderizado en servidor', stage: 'desarrollo', fossil: 'spine' },
      { name: 'Three.js', level: 64, hint: 'Escenas 3D en el navegador', stage: 'desarrollo', fossil: 'egg' },
      {
        name: 'React Three Fiber',
        level: 62,
        hint: '3D declarativa dentro de React',
        stage: 'desarrollo',
        fossil: 'egg',
      },
      { name: 'WebGL', level: 50, hint: 'Nociones de renderizado y shaders', stage: 'desarrollo', fossil: 'tooth' },
    ],
  },
  {
    id: 'movil',
    label: 'Móvil',
    subtitle: 'Código en el bolsillo',
    description:
      'Aplicaciones multiplataforma que llevan el mismo producto a Android e iOS sin duplicar esfuerzo.',
    accent: '#3A2370',
    icon: 'footprint',
    skills: [
      {
        name: 'Flutter',
        level: 74,
        hint: 'Apps nativas multiplataforma',
        stage: 'aplico',
        fossil: 'footprint',
      },
      {
        name: 'React Native',
        level: 58,
        hint: 'Móvil con ecosistema React',
        stage: 'desarrollo',
        fossil: 'footprint',
      },
    ],
  },
  {
    id: 'datos',
    label: 'Bases de Datos',
    subtitle: 'La memoria del sistema',
    description:
      'Persistencia relacional y documental: esquemas, kardex, transacciones y consultas que no mienten.',
    accent: '#2B775D',
    icon: 'egg',
    skills: [
      {
        name: 'PostgreSQL',
        level: 80,
        hint: 'Persistencia relacional estricta',
        stage: 'aplico',
        fossil: 'egg',
      },
      { name: 'MySQL', level: 76, hint: 'Esquemas transaccionales', stage: 'aplico', fossil: 'egg' },
      {
        name: 'MongoDB',
        level: 72,
        hint: 'Documentos flexibles y esquemas vivos',
        stage: 'aplico',
        fossil: 'vertebra',
      },
      {
        name: 'SQLite',
        level: 76,
        hint: 'Base ligera integrada en Django',
        stage: 'aplico',
        fossil: 'tooth',
      },
    ],
  },
  {
    id: 'devops',
    label: 'DevOps & Herramientas',
    subtitle: 'Herramientas de campo',
    description:
      'Control de versiones, integración continua y contenedores: el equipo que mantiene todo en su sitio.',
    accent: '#6A4DAB',
    icon: 'claw',
    skills: [
      { name: 'Git / GitHub', level: 82, hint: 'Historial, ramas y colaboración', stage: 'aplico', fossil: 'spine' },
      {
        name: 'GitHub Actions',
        level: 72,
        hint: 'CI que ejecuta pruebas en cada push',
        stage: 'aplico',
        fossil: 'wing',
      },
      {
        name: 'Docker',
        level: 62,
        hint: 'Entornos reproducibles de despliegue',
        stage: 'desarrollo',
        fossil: 'claw',
      },
    ],
  },
  {
    id: 'videojuegos',
    label: 'Videojuegos & IA',
    subtitle: 'Ruta en formación',
    description:
      'Área que estoy explorando con proyectos pequeños: mecánicas, aprendizaje automático y lenguajes para videojuegos.',
    accent: '#C4A35A',
    icon: 'wing',
    skills: [
      {
        name: 'Inteligencia Artificial',
        level: 68,
        hint: 'Integración y dominio en práctica',
        stage: 'desarrollo',
        fossil: 'wing',
      },
      { name: 'C#', level: 45, hint: 'Ruta de aprendizaje para videojuegos', stage: 'desarrollo', fossil: 'claw' },
      { name: 'Rust', level: 40, hint: 'Ruta de aprendizaje para videojuegos', stage: 'desarrollo', fossil: 'tooth' },
    ],
  },
];
