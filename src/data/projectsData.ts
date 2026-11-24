import type { Project } from '@/types';

export const PROJECTS: Project[] = [
  {
    id: 'effiadmi',
    title: 'EffiAdmi',
    subtitle: 'Gestión de Inventario Inteligente en Tiempo Real',
    description:
      'Proyecto de grado: sistema web de control de inventarios automatizado con kardex, pedidos, facturación y reportes, integrado con EFFI — un asistente de IA (Google Gemini) para la toma estratégica de decisiones. Incluye versión portada a Node.js + MongoDB.',
    era: 'cretaceous',
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
    id: 'terra-run',
    title: 'Terra Run',
    subtitle: 'Videojuego indie de plataformas generativo',
    description:
      'Metroidvania 2D con niveles generados proceduralmente, física jugable y arte pixel-art. Proyecto en excavación.',
    era: 'cretaceous',
    status: 'en-excavacion',
    year: '2026',
    stack: ['Godot', 'GDScript', 'Aseprite', 'FMOD'],
    highlights: ['Generación procedural de biomas', 'Sistema de guardado incremental', 'Jefes con patrones aprendidos'],
    emoji: '🌋',
  },
  {
    id: 'strata-ui',
    title: 'Strata UI',
    subtitle: 'Design system editorial para la web',
    description:
      'Biblioteca de componentes con temática fósil minimalista, tokens de diseño y documentación viva. Proyecto en excavación.',
    era: 'jurassic',
    status: 'en-excavacion',
    year: '2026',
    stack: ['React', 'TypeScript', 'Storybook', 'Tailwind CSS'],
    highlights: ['Tokens semánticos multi-tema', 'Accesibilidad AA verificada', 'Storybook con tests visuales'],
    emoji: '🧱',
  },
  {
    id: 'amber-notes',
    title: 'Amber Notes',
    subtitle: 'App móvil de notas con captura inteligente',
    description:
      'Notas con reconocimiento de voz y etiquetado automático. Fosilizada en fase de investigación.',
    era: 'triassic',
    status: 'fosilizado',
    year: '2024',
    stack: ['Flutter', 'Dart', 'SQLite', 'ML Kit'],
    highlights: ['Dictado sin conexión', 'Etiquetado automático por IA'],
    emoji: '🪨',
  },
];

export const FEATURED_PROJECT = PROJECTS[0];
