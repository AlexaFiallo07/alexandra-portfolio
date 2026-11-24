import type { Project } from '@/types';

export const PROJECTS: Project[] = [
  {
    id: 'effiadmi',
    title: 'EffiAdmi',
    subtitle: 'Gestión de Inventario Inteligente en Tiempo Real',
    description:
      'Proyecto de grado: sistema web de control de inventarios automatizado con kardex, pedidos, facturación y reportes, integrado con EFFI — un asistente de IA (Google Gemini) para la toma estratégica de decisiones. Incluye versión portada a Node.js + MongoDB.',
    category: 'pyme',
    status: 'destacado',
    year: '2025',
    stack: [
      'Python',
      'Django 6',
      'Django REST + JWT',
      'SQLite / PostgreSQL',
      'Gemini IA (SDK OpenAI)',
      'Chart.js',
    ],
    highlights: [
      'Inventario multi-sucursal con kardex trazable y alertas de stock bajo con recomendación IA',
      'Flujo completo pedidos → facturación con anulación y devolución automática de stock',
      'EFFI: chat con contexto real del negocio, borradores de correo y frases de alerta con IA',
      'Landing pública, API REST con JWT y roles admin/operador con auditoría de accesos',
      '≈305 tests + CI en GitHub Actions + pruebas de carga con Locust',
      'Port a Express + MongoDB con backup automático por cron (PM2)',
    ],
    architecture: [
      {
        layer: 'Cliente',
        detail:
          'Plantillas Django con HTML/CSS/JS + Chart.js (SSR), landing pública de 7 páginas, íconos Material Symbols y estilos propios. Sin framework JS: el frontend se sirve desde el backend.',
      },
      {
        layer: 'API',
        detail:
          'Django REST Framework con SimpleJWT (rotación y blacklist de tokens), CORS, throttling y ~77 vistas organizadas en módulos de negocio.',
      },
      {
        layer: 'Dominio',
        detail:
          'Inventario + kardex (entrada/salida/ajuste), pedidos → facturación, clientes y proveedores, reportes operador→admin, notificaciones, correos con adjuntos y facturas de compra con exportación a Excel.',
      },
      {
        layer: 'IA (EFFI)',
        detail:
          'Servicio con SDK OpenAI contra Google Gemini (gemini-3.1-flash-lite): chat con contexto real del inventario y ventas, borradores de correo y recomendaciones de stock, con lista de temas bloqueados y defensa anti prompt-injection.',
      },
      {
        layer: 'Datos',
        detail:
          'SQLite por defecto, PostgreSQL/Supabase opcional vía psycopg, Redis opcional para caché/throttling y respaldos JSON exportables y restaurables desde comandos propios.',
      },
      {
        layer: 'Ops',
        detail:
          'Waitress + WhiteNoise, seguridad endurecida (CSP, admin por IP, /media/ autenticado, rate-limit de IA), CI con chequeo --deploy, pruebas Locust y guía de despliegue en PythonAnywhere.',
      },
    ],
    repoUrl: 'https://github.com/AlexaFiallo07/EFFIADMI_1.git',
    emoji: '🦴',
  },
  {
    id: 'multiverso',
    title: 'Multiverso Jurásico',
    subtitle: 'Portafolio interactivo estilo estudio luminoso',
    description:
      'Este mismo sitio: una experiencia de portafolio luminosa donde un T-Rex verde con gafas moradas reacciona al cursor, un Velociraptor pixel art salta obstáculos al hacer scroll y dinosaurios chibi celebran tus clics.',
    category: 'web',
    status: 'destacado',
    year: '2026',
    stack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'SVG Interactivo', 'Framer Motion'],
    highlights: [
      'Escena interactiva del Hero con seguimiento de cursor, parallax y stickers dev',
      'Velociraptor pixel art sincronizado con el porcentaje de scroll y cactus/tags',
      'IntersectionObserver + animaciones suaves a 60fps solo con transform/opacity',
      'Formulario de contacto con API route y validación serverless',
    ],
    architecture: [
      {
        layer: 'Cliente',
        detail:
          'Next.js 15 (App Router) con React, Tailwind CSS y Framer Motion bajo una paleta clara de estudio (#F4F4F7, #FFFFFF, #7C3AED, #10B981).',
      },
      {
        layer: 'Interactividad',
        detail:
          'SVG animado reactivo al puntero (T-Rex con gafas moradas, ventanas flotantes en parallax, dino chibi bailarín y fósiles blueprint).',
      },
      {
        layer: 'Animación',
        detail:
          'Keyframes CSS para el elenco (correr, volar, bailar, flotar) + framer-motion para entradas escalonadas a 60fps.',
      },
      {
        layer: 'Servidor',
        detail: 'API route /api/contact en Next.js con validación, honeypot y rate-limit básico.',
      },
    ],
    emoji: '🌌',
  },
  {
    id: 'tienda-virtual',
    title: 'Tienda Virtual',
    subtitle: 'Espacio reservado para tu próximo e-commerce',
    description:
      'Ficha plantilla lista para alojar tu desarrollo real de tienda virtual: sustituye este texto por el resumen verdadero del proyecto y añade los enlaces a GitHub y a la demo en vivo.',
    category: 'tienda',
    status: 'en-excavacion',
    year: '2026',
    stack: ['Carrito', 'Catálogo', 'Pagos', 'Panel de pedidos'],
    highlights: [
      'Plantilla pendiente: describe aquí las pantallas y flujos que sí construiste',
      'Añade repoUrl y liveUrl para que el botón lleve a GitHub y a la demo',
    ],
    emoji: '🛒',
    isPlaceholder: true,
  },
  {
    id: 'api-rest',
    title: 'API REST',
    subtitle: 'Espacio reservado para tu próximo servicio',
    description:
      'Ficha plantilla lista para alojar una de tus APIs REST: documenta endpoints, autenticación y despliegue reales, y enlaza el repositorio de GitHub con la documentación viva.',
    category: 'api',
    status: 'en-excavacion',
    year: '2026',
    stack: ['Endpoints', 'JWT', 'Validación', 'Documentación'],
    highlights: [
      'Plantilla pendiente: lista los módulos y verbos que sí implementaste',
      'Añade repoUrl y liveUrl (docs Swagger/Postman, por ejemplo)',
    ],
    emoji: '🔌',
    isPlaceholder: true,
  },
];

export const FEATURED_PROJECT = PROJECTS[0];
