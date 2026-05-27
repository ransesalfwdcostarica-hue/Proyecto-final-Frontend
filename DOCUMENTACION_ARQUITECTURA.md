# Arquitectura y Modelo de Datos

## Estructura del Proyecto (Carpetas y Archivos)
text
Proyecto-final-Frontend/
├── Backend/                    # Servidor de API (Node.js & Express)
│   ├── src/                    # Código fuente del Backend
│   │   ├── config/             # Configuración de base de datos y Sequelize
│   │   ├── controllers/        # Controladores que manejan la lógica de negocio de los endpoints
│   │   ├── middlewares/        # Middlewares de Express (Autenticación, Validación, etc.)
│   │   ├── migrations/         # Migraciones de la base de datos con Sequelize
│   │   ├── models/             # Modelos relacionales de Sequelize (Usuario, Perfil, Rutina, etc.)
│   │   ├── routes/             # Definición de rutas y endpoints de la API
│   │   ├── app.js              # Inicialización y configuración de Express
│   │   └── index.js            # Punto de entrada principal para levantar el servidor
│   ├── tests/                  # Pruebas automatizadas del backend
│   └── package.json            # Dependencias y scripts del Backend
├── Front-End/                  # Aplicación de Cliente (React & Vite)
│   ├── public/                 # Recursos públicos estáticos (imágenes, iconos, etc.)
│   ├── src/                    # Código fuente de React
│   │   ├── components/         # Componentes reutilizables de la interfaz de usuario
│   │   ├── context/            # Contextos globales de React (Autenticación, estado global, etc.)
│   │   ├── Pages/              # Vistas principales de la aplicación (Home, Login, Dashboard, etc.)
│   │   ├── Routes/             # Configuración de enrutamiento del lado del cliente
│   │   ├── Services/           # Servicios de cliente API (Peticiones con axios o fetch al backend)
│   │   ├── Styles/             # Hojas de estilo y diseño visual (Vanilla CSS)
│   │   ├── App.jsx             # Componente raíz de React
│   │   └── main.jsx            # Punto de entrada del cliente (montaje de la aplicación)
│   ├── index.html              # Archivo HTML plantilla principal de Vite
│   ├── vite.config.js          # Configuración del empaquetador Vite
│   └── package.json            # Dependencias y scripts del Frontend
├── README.md                   # Documentación principal del proyecto
└── Skill.md                    # Archivo de habilidades o especificaciones
```