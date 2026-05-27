# Documentación del Front-End — PowerFit

Esta documentación detalla la arquitectura, tecnologías, estructura de archivos, vistas, componentes y funcionalidades principales del proyecto Front-End de la aplicación **PowerFit**.

---

## 🛠️ Tecnologías y Librerías Utilizadas

El desarrollo del Front-End se basa en una SPA (Single Page Application) moderna construida sobre las siguientes tecnologías:

1. **Núcleo**:
   - **React (v18+)**: Librería principal para la creación de interfaces de usuario interactivas basadas en componentes.
   - **Vite**: Herramienta de compilación rápida para desarrollo y empaquetado.
   - **React Router Dom (v6)**: Manejador de rutas para la navegación dinámica sin recarga de página.
   - **React Context API**: Gestión del estado de autenticación y de la sesión global del usuario (`UserContext`).

2. **Diseño y Estética**:
   - **Vanilla CSS (Variables y Grillas Flexibles)**: Estilos a medida que aplican estética premium de "modo oscuro", efectos de cristal (glassmorphism), bordes translúcidos y gradientes vivos (tonos rojos y oscuros).
   - **Lucide React**: Biblioteca de iconos vectoriales modernos y estilizados.
   - **SweetAlert2 (Swal)**: Modales de alerta enriquecidos con animaciones para interacciones rápidas y seguras (confirmaciones, notificaciones flotantes, etc.).

3. **Integración con Servicios Externos**:
   - **Fetch API**: Cliente nativo para realizar solicitudes HTTP/HTTPS al servidor backend (Restful API).

---

## 📁 Estructura del Código Fuente (`/src`)

El código sigue una organización limpia por responsabilidades:

- `/context`: Gestión del estado global, incluyendo el inicio de sesión, cierre de sesión y la actualización en tiempo real de los datos del usuario logueado (`UserContext.jsx`).
- `/Routes`: Definición y protección de rutas (`Routing.jsx`).
- `/Services`: Módulos encargados de interactuar con los endpoints del backend (`apiConfig`, `userService`, `exerciseService`, `routineService`, `testimonioService`, `Chatbot`).
- `/Pages`: Vistas principales montadas por el enrutador.
- `/components`: Componentes reutilizables de UI y paneles específicos del Dashboard de Cliente y Administrador.
- `/Styles`: Hojas de estilo CSS que definen la identidad premium del sitio.
- `/utils`: Funciones utilitarias como el parseador y renderizador personalizado de Markdown (`markdownParser.jsx`).

---

## 🛣️ Enrutamiento y Seguridad de Rutas

El enrutamiento (`Routing.jsx`) define las siguientes rutas públicas y privadas:

### Rutas Públicas
- **`/` (Inicio)**: Landing page promocional con estadísticas de la app y beneficios.
- **`/contacto` (Contacto)**: Formulario de contacto para enviar sugerencias o consultas al equipo técnico.
- **`/login` (Iniciar Sesión)**: Autenticación del usuario mediante correo y contraseña.
- **`/registro` (Registro)**: Registro de nuevos usuarios que incluye un flujo integrado de onboarding para recabar metas físicas iniciales (altura, peso, objetivo, alergias, etc.).
- **`/comunidad` (Comunidad)**: Red social interna donde los usuarios comparten testimonios, progresos y posts motivacionales.

### Rutas Privadas (Protegidas mediante `ProtectedRoute`)
- **`/chatbot` (VitalBot Assist)**: Acceso al chat de inteligencia artificial.
- **`/perfil/:id` (Perfil Público)**: Vista del perfil de otros usuarios de la comunidad, permitiendo seguirlos, ver sus estadísticas o reportar su contenido.
- **`/dashboard` (Dashboard de Cliente)**: Panel personal para usuarios con rol `client`.
- **`/admin` (Dashboard del Administrador)**: Panel de control exclusivo para usuarios con rol `admin`.

---

## 🎯 Funcionalidades Principales

### 1. Panel de Control de Clientes (`/dashboard`)
Un panel premium de salud y fitness personalizado con cuatro secciones clave:
- **Resumen de Progreso**: Gráficas, registro del peso en una línea de tiempo dinámica, cálculo automático de semanas de progreso e indicador de metas cumplidas.
- **Mis Entrenamientos**:
  - **Rutinas de Ejercicios**: Agrupación automatizada por músculo/categoría de los ejercicios elegidos por el usuario de la biblioteca global.
  - **Interactividad**: Cada ejercicio cuenta con un botón para reproducir un video guía de la técnica y un botón para **eliminar el ejercicio** de su lista con actualización inmediata y almacenamiento en base de datos.
  - **Rutina Generada por IA**: Muestra la rutina sugerida por el asistente virtual con formato Markdown nativo y opción de borrado.
- **Plan Nutricional**: Calcula y muestra los requerimientos calóricos ideales en base a la meta de peso del usuario, recomendando un déficit y proporcionando tips diarios (hidratación, metas proteicas y hábitos saludables).
- **Ajustes de Perfil**: Formulario interactivo que permite al usuario actualizar sus medidas (peso, altura, plazo en semanas, lugar de entrenamiento) y cambiar su imagen de avatar/portada.

### 2. VitalBot — Chat de IA Avanzado (`/chatbot`)
- **Asistencia Inteligente**: Conexión con un modelo de IA entrenado para responder preguntas sobre rutinas de ejercicio, nutrición y estilo de vida saludable.
- **Contexto Personalizado**: El chat envía automáticamente el perfil del usuario (edad, nivel físico, alergias, peso y metas) a la IA para recibir planes adaptados.
- **Guardado de Rutinas**: Cada vez que la IA sugiere una rutina detallada (series, repeticiones, etc.), el sistema despliega un botón **"Guardar esta Rutina"**. Al hacer clic, almacena todo el texto de manera permanente en el perfil del usuario para visualizarlo en la sección de entrenamientos de su dashboard.
- **Historial Reciente**: Sidebar que almacena localmente los últimos 20 chats del usuario para abrirlos en cualquier momento o iniciar conversaciones nuevas.

### 3. Red Social y Comunidad (`/comunidad`)
- **Publicaciones y Progresos**: Feed de publicaciones tipo blog donde se comparten testimonios, imágenes y logros.
- **Interacción Social**: Posibilidad de dar "Me gusta" a publicaciones, comentar ideas y seguir/dejar de seguir a otros perfiles.
- **Seguimiento Atomizado**: Sistema dinámico para seguir a otros deportistas desde sus perfiles o desde las publicaciones, actualizando sus contadores en tiempo real.
- **Reportes de Contenido**: Un formulario de reportes que permite denunciar publicaciones inapropiadas, vinculándose a una razón predefinida y un motivo detallado que será evaluado por un administrador.

### 4. Biblioteca Global de Ejercicios (`/ejercicios`)
- Buscador predictivo por nombre del ejercicio.
- Filtros interactivos por grupo muscular (Pecho, Espalda, Piernas, etc.) y nivel de dificultad (Principiante, Intermedio, Avanzado).
- Fichas interactivas con detalles de nivel, duración estimada y un botón dinámico para añadir o retirar el ejercicio directamente de tu rutina personalizada.

### 5. Panel de Control de Administradores (`/admin`)
Permite gestionar la plataforma de forma integral con diversas herramientas:
- **Usuarios (`AdminUsers`)**: Búsqueda global, edición de perfiles, asignación de roles (Cliente/Admin), visualización a fondo del progreso de salud de cada usuario y eliminación de cuentas.
- **Ejercicios (`AdminExercises`)**: Panel CRUD para dar de alta, editar, listar y eliminar los ejercicios de la biblioteca global de la aplicación (nombre, categoría, nivel de dificultad, duración, técnica y URL de imagen/video).
- **Reportes (`AdminReports`)**: Bandeja de entrada que centraliza los reportes realizados por la comunidad sobre publicaciones inapropiadas, detallando el usuario emisor, el reportado y el motivo (vinculado en base de datos), con opciones de desestimar el reporte o eliminar la publicación infractora.
- **Mensajes de Contacto (`AdminMessages`)**: Visualizador de los correos de soporte o contacto que dejan los visitantes del sitio, con opción de borrarlos una vez gestionados.
