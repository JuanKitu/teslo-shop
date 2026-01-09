Sistema de Diseño: "SaaS Teslo Indigo"
1. Paleta de Colores & Atmósfera

Fondo General: Gris muy suave (bg-slate-50) para reducir la fatiga visual.
Color Primario (Acción): Índigo (text-indigo-600, bg-indigo-600). Se usa para botones principales, enlaces activos y estados de foco.
Color Secundario (Fondos sutiles): Índigo Lavanda (bg-indigo-50). Se usa para áreas activas, selecciones y tooltips.

Texto:
Principal: Gris oscuro casi negro (text-slate-900) para títulos.
Cuerpo: Gris medio (text-slate-700) para etiquetas y contenido.
Ayuda/Placeholder: Gris claro (text-slate-400 o text-slate-500).
Bordes: Sutiles y finos (border-slate-200 o border-slate-300).

2. Estructura y Layout (Grid)
Contenedor Central: Un ancho máximo controlado (max-w-7xl) centrado en la pantalla.

Distribución de Columnas:
Escritorio: Diseño de 2 columnas asimétricas. Izquierda (Principal) ocupa 2/3 (aprox. 66%) y Derecha (Lateral) ocupa 1/3 (aprox. 33%).
Móvil: Columna única apilada verticalmente.
Sticky Header: Una barra superior fija con fondo translúcido (backdrop-blur-md) que contiene el título y las acciones principales (Guardar/Publicar).

3. Componentes UI (El "Look & Feel")

Tarjetas (Cards):
Fondo blanco puro (bg-white) con esquinas redondeadas generosas (rounded-xl).
Sombra muy suave (shadow-sm) y borde fino (border border-slate-200).
Encabezado de tarjeta separado por una línea sutil (border-b border-slate-100).

Inputs y Formularios:
Estilo: Bordes redondeados (rounded-lg), fondo ligeramente grisáceo (bg-slate-50) que cambia a blanco o anillo índigo al recibir foco (focus:ring-2 focus:ring-indigo-500).
Tamaño: Altura cómoda para el dedo (py-2.5), tipografía pequeña pero legible (text-sm).
Labels: Texto en negrita media (font-medium) ubicado encima del input, con iconos de ayuda opcionales.

Botones:
Primarios: Fondo índigo sólido, texto blanco, esquinas redondeadas (rounded-lg), sombra suave.
Secundarios: Fondo transparente o blanco con borde gris, texto gris oscuro.
Chips/Etiquetas: Pequeñas píldoras redondeadas (rounded-full) con borde fino.

4. Patrones Específicos

Tablas de Datos (Variantes):
Encabezados con fondo gris muy claro (bg-slate-50) y texto en mayúsculas pequeñas (uppercase text-xs).
Celdas con fondo blanco y líneas divisorias muy finas.
Inputs dentro de tablas son más compactos y sin bordes fuertes para no saturar.
Selector de Tipo (Segmented Control):
Una barra de fondo gris (bg-slate-100) con botones internos que, al activarse, se vuelven blancos y elevados con sombra (shadow-md).

Multimedia:
Áreas de carga con borde discontinuo (border-dashed).
Grid de imágenes cuadradas (aspect-square) con bordes redondeados.

Iconografía:
Líneas finas y limpias (Estilo Lucide React).

Resumen para el Prompt del otro chat:
"Quiero diseñar una vista que siga el estilo 'SaaS Teslo Indigo'. Usa un fondo slate-50, tarjetas blancas con rounded-xl, shadow-sm y bordes slate-200. Los inputs deben tener fondo slate-50 y focus en indigo-500. La tipografía debe ser slate-800 sans-serif. Usa una estructura de 2 columnas (Principal ancha a la izquierda, Sidebar estrecho a la derecha) y un header sticky translúcido. Los iconos deben ser de línea fina (Lucide)."