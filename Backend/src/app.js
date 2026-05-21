require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./index');
const config = require('./config/config');

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
        'http://127.0.0.1:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── RUTAS DE AUTENTICACIÓN (públicas) ────────────────────────────────────────
const AuthRoutes = require('./routes/AuthRoutes');
app.use('/api/auth', AuthRoutes);

// ─── RUTAS DE RECURSOS ────────────────────────────────────────────────────────
const UsuarioRoutes = require('./routes/UsuarioRoutes');
const RolRoutes = require('./routes/RolRoutes');
const PerfilRoutes = require('./routes/PerfilRoutes');
const PublicacionRoutes = require('./routes/PublicacionRoutes');
const CategoriaPublicacionRoutes = require('./routes/CategoriaPublicacionRoutes');
const LikeRoutes = require('./routes/LikeRoutes');
const ComentarioRoutes = require('./routes/ComentarioRoutes');
const ContribuidorRoutes = require('./routes/ContribuidorRoutes');
const RolContribuidorRoutes = require('./routes/RolContribuidorRoutes');
const TemaEnTendenciaRoutes = require('./routes/TemaEnTendenciaRoutes');
const ReporteRoutes = require('./routes/ReporteRoutes');
const RazonReporteRoutes = require('./routes/RazonReporteRoutes');
const DetalleRazonReporteRoutes = require('./routes/DetalleRazonReporteRoutes');
const MensajeContactoRoutes = require('./routes/MensajeContactoRoutes');
const DatosUsuarioRoutes = require('./routes/DatosUsuarioRoutes');
const AlergiaRoutes = require('./routes/AlergiaRoutes');
const RutinaRoutes = require('./routes/RutinaRoutes');
const EjercicioRoutes = require('./routes/EjercicioRoutes');

// Use Routes
app.use('/api/usuarios', UsuarioRoutes);
app.use('/api/roles', RolRoutes);
app.use('/api/perfiles', PerfilRoutes);
app.use('/api/publicaciones', PublicacionRoutes);
app.use('/api/categorias', CategoriaPublicacionRoutes);
app.use('/api/likes', LikeRoutes);
app.use('/api/comentarios', ComentarioRoutes);
app.use('/api/contribuidores', ContribuidorRoutes);
app.use('/api/roles-contribuidor', RolContribuidorRoutes);
app.use('/api/temas', TemaEnTendenciaRoutes);
app.use('/api/reportes', ReporteRoutes);
app.use('/api/razones-reporte', RazonReporteRoutes);
app.use('/api/detalles-reporte', DetalleRazonReporteRoutes);
app.use('/api/mensajes', MensajeContactoRoutes);
app.use('/api/datos-usuario', DatosUsuarioRoutes);
app.use('/api/alergias', AlergiaRoutes);
app.use('/api/rutinas', RutinaRoutes);
app.use('/api/ejercicios', EjercicioRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'PowerFit Backend corriendo correctamente.' });
});

app.use((req, res) => {
    res.status(404).json({ error: `Ruta ${req.method} ${req.path} no encontrada.` });
});

const PORT = config.server.port || 3000;

if (process.env.NODE_ENV !== 'test') {
    // alter:true permite alterar columnas existentes como contrasenia(255)
    sequelize.sync({ alter: false })
        .then(() => {
            console.log('✅ Base de datos conectada y sincronizada.');
            app.listen(PORT, () => {
                console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            });
        })
        .catch(err => {
            console.error('❌ Error al conectar con la base de datos:', err.message);
        });
}

module.exports = app;
