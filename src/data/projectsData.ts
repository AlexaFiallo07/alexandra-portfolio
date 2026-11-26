import type { Project } from '@/types';

export const PROJECTS: Project[] = [
  {
    id: 'effiadmi',
    title: 'EffiAdmi',
    subtitle: 'En desarrollo · Sistema de gestión administrativa para PYMES',
    description:
      'Sistema de gestión administrativa web y móvil para PYMES (inventarios, productos, pedidos, facturación, proveedores, atención al cliente, alertas y reportes) enfocado en aliviar la carga operativa empresarial.',
    category: 'pyme',
    status: 'destacado',
    year: '2025',
    stack: ['Python', 'Django', 'Django REST Framework', 'Flutter', 'Bases de datos relacionales'],
    highlights: [
      'Inventario y kardex con productos, entradas, salidas y alertas de stock bajo',
      'Pedidos, facturación y proveedores integrados en un mismo flujo',
      'Atención al cliente y reportes para reducir tareas repetitivas',
      'Acceso web y móvil para operar desde la oficina o en campo',
    ],
    architecture: [
      {
        layer: 'Web',
        detail:
          'Panel administrativo con inventario, productos, pedidos, facturación, proveedores y reportes.',
      },
      {
        layer: 'API',
        detail:
          'Django REST Framework para operaciones CRUD, validaciones, autenticación y permisos por rol.',
      },
      {
        layer: 'Móvil',
        detail:
          'Flutter para consultar inventario, pedidos y alertas desde el teléfono.',
      },
      {
        layer: 'Datos',
        detail:
          'Bases de datos relacionales con kardex, transacciones y trazabilidad de la operación.',
      },
      {
        layer: 'Procesos',
        detail:
          'Alertas de stock y reportes operativos pensados para simplificar la rutina diaria.',
      },
    ],
    repoUrl: 'https://github.com/AlexaFiallo07/EFFIADMI_1.git',
    emoji: '📊',
  },
  {
    id: 'excavacion-3d',
    title: 'Excavación Paleontológica 3D',
    subtitle: 'Prototipo interactivo · Three.js + Blender',
    description:
      'Minijuego integrado en el portafolio, construido con Three.js y Blender, para descubrir fósiles 3D usando herramientas de campo.',
    category: 'web',
    status: 'en-excavacion',
    year: '2026',
    stack: ['Three.js', 'React Three Fiber', 'Blender', 'GLB'],
    highlights: [
      'Excavación con mouse sobre un yacimiento 3D',
      'Herramientas de campo como acento interactivo',
      'Fósiles modelados y exportados desde Blender',
    ],
    architecture: [
      {
        layer: 'Escena',
        detail:
          'React Three Fiber con Box3, boundingSphere y zoom acotado para mantener la figura completa.',
      },
      {
        layer: 'Modelos',
        detail:
          'Piezas preparadas en Blender y exportadas como GLB con materiales y animaciones ligeras.',
      },
      {
        layer: 'Interacción',
        detail:
          'Herramientas de campo y descubrimiento progresivo del fósil sin recargar la página.',
      },
    ],
    emoji: '🦴',
  },
  {
    id: 'tienda-virtual',
    title: 'Tienda Virtual',
    subtitle: 'Próximamente · Desarrollo empresarial',
    description:
      'Espacio reservado para un futuro e-commerce dentro de la línea de desarrollos empresariales.',
    category: 'tienda',
    status: 'en-excavacion',
    year: '2026',
    stack: ['Catálogo', 'Carrito', 'Pedidos', 'Panel'],
    highlights: [
      'Plantilla pendiente: describe aquí las pantallas y flujos que construyas',
      'Añade repoUrl y liveUrl cuando el proyecto esté listo',
    ],
    emoji: '🛒',
    isPlaceholder: true,
  },
  {
    id: 'api-rest',
    title: 'API REST',
    subtitle: 'Próximamente · Desarrollo empresarial',
    description:
      'Espacio reservado para un próximo servicio REST con documentación y despliegue reales.',
    category: 'api',
    status: 'en-excavacion',
    year: '2026',
    stack: ['Endpoints', 'Validación', 'Autenticación', 'Documentación'],
    highlights: [
      'Plantilla pendiente: lista los módulos y verbos que implementes',
      'Añade repoUrl y liveUrl con la documentación de la API',
    ],
    emoji: '🔌',
    isPlaceholder: true,
  },
  {
    id: 'videojuegos-formativos',
    title: 'Videojuegos formativos',
    subtitle: 'En desarrollo · Aprendizaje y agilidad mental',
    description:
      'Espacio reservado para prototipos de videojuegos que entrenen habilidades y conocimientos de forma intuitiva y divertida.',
    category: 'web',
    status: 'en-excavacion',
    year: '2026',
    stack: ['Prototipo', 'Mecánicas', '3D'],
    highlights: [
      'Plantilla pendiente: describe aquí la mecánica y el objetivo de aprendizaje',
      'Ruta de aprendizaje en C# y Rust para videojuegos',
    ],
    emoji: '🎮',
    isPlaceholder: true,
  },
];

export const FEATURED_PROJECT = PROJECTS[0];
