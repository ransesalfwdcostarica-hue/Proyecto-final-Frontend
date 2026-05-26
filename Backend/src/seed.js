const fs = require('fs');
const path = require('path');
const {
    sequelize,
    Usuario,
    Rol,
    Perfil,
    DatosUsuario,
    CategoriaPublicacion,
    Publicacion,
    Comentario,
    PublicacionComentario,
    Like,
    LikePublicacion,
    Ejercicio,
    MensajeContacto,
    Reporte,
    RazonReporte,
    DetalleRazonReporte,
    TemaEnTendencia,
    Contribuidor,
    RolContribuidor
} = require('./index');

async function run() {
    try {
        console.log('Starting DB seed...');
        
        // Read db.json
        const dbPath = path.resolve(__dirname, '../../Front-End/db.json');
        if (!fs.existsSync(dbPath)) {
            console.error(`db.json not found at ${dbPath}`);
            process.exit(1);
        }
        const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

        // Clear existing tables in safe order
        console.log('Cleaning old records...');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await Reporte.destroy({ truncate: { cascade: true } });
        await MensajeContacto.destroy({ truncate: { cascade: true } });
        await PublicacionComentario.destroy({ truncate: { cascade: true } });
        await LikePublicacion.destroy({ truncate: { cascade: true } });
        await Comentario.destroy({ truncate: { cascade: true } });
        await Like.destroy({ truncate: { cascade: true } });
        await Publicacion.destroy({ truncate: { cascade: true } });
        await Perfil.destroy({ truncate: { cascade: true } });
        await DatosUsuario.destroy({ truncate: { cascade: true } });
        await Usuario.destroy({ truncate: { cascade: true } });
        await Rol.destroy({ truncate: { cascade: true } });
        await Ejercicio.destroy({ truncate: { cascade: true } });
        await CategoriaPublicacion.destroy({ truncate: { cascade: true } });
        await TemaEnTendencia.destroy({ truncate: { cascade: true } });
        await Contribuidor.destroy({ truncate: { cascade: true } });
        await RolContribuidor.destroy({ truncate: { cascade: true } });
        await RazonReporte.destroy({ truncate: { cascade: true } });
        await DetalleRazonReporte.destroy({ truncate: { cascade: true } });
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('Tables cleared.');

        // 1. Roles
        const adminRol = await Rol.create({ nombre: 'admin', descripcion: 'Administrador del sistema' });
        const clientRol = await Rol.create({ nombre: 'client', descripcion: 'Usuario cliente' });

        const rolMap = {
            'admin': adminRol.id_rol,
            'client': clientRol.id_rol
        };

        // 2. Users and Perfiles and DatosUsuario
        const userIdMap = {}; // oldStringId -> newIntegerId
        
        console.log(`Seeding ${dbData.usuarios.length} users...`);
        for (const u of dbData.usuarios) {
            const roleName = u.rol === 'admin' ? 'admin' : 'client';
            const newUser = await Usuario.create({
                correo: u.email,
                contrasenia: u.password || 'password123',
                nombre: u.nombre,
                edad: u.edad ? parseInt(u.edad, 10) : 18,
                id_rol: rolMap[roleName]
            });

            userIdMap[u.id] = newUser.id_usuario;

            // Create Perfil
            await Perfil.create({
                biografia: u.biografia || 'Miembro de PowerFit',
                foto_perfil: u.avatar || '',
                foto_portada: u.cover || '',
                id_usuario: newUser.id_usuario
            });

            // Create DatosUsuario if physical fields are present
            if (u.sexo || u.peso || u.altura) {
                const sexo = u.sexo === 'm' ? 'Masculino' : (u.sexo === 'f' ? 'Femenino' : 'Masculino');
                await DatosUsuario.create({
                    sexo: sexo,
                    altura: parseFloat(u.altura || 1.70),
                    peso: parseFloat(u.peso || u.pesoActual || 70),
                    lugar_entrenamiento: u.lugarEntrenamiento || 'Gym',
                    peso_meta: parseFloat(u.pesoMeta || 70),
                    plazo_semanas: parseInt(u.plazoSemanas || 8, 10),
                    deficit_estimado: parseInt(u.deficitEstimado || 450, 10),
                    imagen: u.avatar || '',
                    id_usuario: newUser.id_usuario,
                    semanas_progreso: parseInt(u.semanasEnProgreso || 0, 10),
                    feedback_dieta: u.ultimoFeedbackDieta || 'Ninguno',
                    feedback_ejercicio: u.ultimoFeedbackEjercicio || 'Ninguno'
                });
            }
        }

        // 3. Ejercicios
        console.log(`Seeding ${dbData.ejercicios.length} exercises...`);
        const exerciseIdMap = {}; // oldStringId -> newIntegerId
        for (const ex of dbData.ejercicios) {
            const newEx = await Ejercicio.create({
                nombre: ex.nombre,
                nivel: ex.nivel,
                musculo: ex.musculo,
                video: ex.videoUrl || '',
                imagen: ex.imagen || '',
                tiempo: ex.tiempo || '45 SEG',
                categoria: ex.categoria || 'General',
                repeticiones: 12,
                series: 4
            });
            exerciseIdMap[ex.id] = newEx.id_ejercicio;
        }

        // 4. Categories (from stories/publicaciones)
        console.log('Seeding categories...');
        const catMap = {}; // name -> id_categoria
        const defaultCategories = ['Pérdida de Peso', 'Ganancia de Músculo', 'Consejos de Expertos', 'General'];
        for (const catName of defaultCategories) {
            const cat = await CategoriaPublicacion.create({ nombre: catName });
            catMap[catName] = cat.id_categoria;
        }

        // 5. Publicaciones (stories)
        console.log(`Seeding ${dbData.stories.length} publications/stories...`);
        const storyIdMap = {}; // oldStringId -> newIntegerId
        for (const s of dbData.stories) {
            // Find or create category
            let catId = catMap[s.category || s.tag];
            if (!catId) {
                const cat = await CategoriaPublicacion.create({ nombre: s.category || s.tag || 'General' });
                catMap[s.category || s.tag] = cat.id_categoria;
                catId = cat.id_categoria;
            }

            const authorId = userIdMap[s.userId] || userIdMap['eb3d'] || Object.values(userIdMap)[0] || 1;

            const newStory = await Publicacion.create({
                tiempo: s.time || 'Hace 1 día',
                titulo: s.title || 'Publicación',
                texto: s.text || '',
                imagen: s.image || s.imageAfter || '',
                id_categoria: catId,
                id_usuario: authorId
            });

            storyIdMap[s.id] = newStory.id_publicacion;

            // Seed likes if any
            if (s.likedBy && Array.isArray(s.likedBy)) {
                for (const oldLikerId of s.likedBy) {
                    const likerId = userIdMap[oldLikerId];
                    if (likerId) {
                        const l = await Like.create({ id_usuario: likerId });
                        await LikePublicacion.create({
                            id_like: l.id_like,
                            id_publicacion: newStory.id_publicacion
                        });
                    }
                }
            }
        }

        // 6. Comentarios
        console.log('Seeding comments...');
        if (dbData.comentarios && Array.isArray(dbData.comentarios)) {
            for (const c of dbData.comentarios) {
                const cUser = userIdMap[c.userId] || Object.values(userIdMap)[0] || 1;
                const cStory = storyIdMap[c.storyId];
                if (cStory) {
                    const newComment = await Comentario.create({
                        texto: c.text,
                        id_usuario: cUser
                    });
                    await PublicacionComentario.create({
                        id_publicacion: cStory,
                        id_comentario: newComment.id_comentario
                    });
                }
            }
        }

        // 7. Mensajes
        console.log('Seeding contact messages...');
        if (dbData.mensajes && Array.isArray(dbData.mensajes)) {
            for (const msg of dbData.mensajes) {
                await MensajeContacto.create({
                    nombre: msg.nombre,
                    telefono: msg.contacto || 'Sin teléfono',
                    correo: msg.email || 'correo@ejemplo.com',
                    mensaje: msg.mensaje,
                    pais: msg.pais || 'Costa Rica',
                    fecha: msg.fecha || new Date(),
                    id_usuario: userIdMap[msg.userId] || null
                });
            }
        }

        // 8. Reportes (needs razon_reporte and detalle_razon)
        console.log('Seeding report metadata and reports...');
        const defaultDetalle = await DetalleRazonReporte.create({ nombre: 'Contenido inapropiado o dañino' });
        
        const reportReasons = [
            'Spam o publicidad no deseada',
            'Acoso o bullying',
            'Discurso de odio',
            'Contenido inapropiado',
            'Otro'
        ];

        const reasonMap = {}; // name -> id_razon
        for (const reasonName of reportReasons) {
            const r = await RazonReporte.create({
                nombre: reasonName,
                id_detalle_razon: defaultDetalle.id_detalle_razon
            });
            reasonMap[reasonName] = r.id_razon;
        }

        if (dbData.reportes && Array.isArray(dbData.reportes)) {
            for (const rep of dbData.reportes) {
                const repUser = userIdMap[rep.reporterId] || Object.values(userIdMap)[0] || 1;
                const repStory = storyIdMap[rep.storyId];
                const finalRazonId = reasonMap[rep.reason] || reasonMap['Otro'];

                if (repStory) {
                    await Reporte.create({
                        id_usuario: repUser,
                        id_publicacion: repStory,
                        id_razon: finalRazonId,
                        descripcion: rep.otherText || rep.subReason || 'Reportado por un usuario',
                        estado: rep.status || 'pending',
                        fecha_hora: rep.fecha || new Date()
                    });
                }
            }
        }

        // 9. Trending Topics
        console.log('Seeding trending topics...');
        if (dbData.trendingTopics && Array.isArray(dbData.trendingTopics)) {
            for (const t of dbData.trendingTopics) {
                await TemaEnTendencia.create({
                    tema: t.topic,
                    miembros: t.count || '0 miembros'
                });
            }
        }

        // 10. Top Contributors
        console.log('Seeding top contributors...');
        const defaultRolContribuidor = await RolContribuidor.create({
            nombre: 'Colaborador Destacado',
            descripcion: 'Usuario con alta participación'
        });

        if (dbData.topContributors && Array.isArray(dbData.topContributors)) {
            for (const tc of dbData.topContributors) {
                // Find or create a user for this contributor
                const user = await Usuario.create({
                    correo: `${tc.name.toLowerCase().replace(/[^a-z]/g, '')}@powerfit.com`,
                    contrasenia: 'contrib123',
                    nombre: tc.name,
                    edad: 25,
                    id_rol: rolMap['client']
                });
                
                await Perfil.create({
                    biografia: tc.role,
                    foto_perfil: tc.avatar || '',
                    foto_portada: '',
                    id_usuario: user.id_usuario
                });

                await Contribuidor.create({
                    puntos: tc.points,
                    id_usuario: user.id_usuario,
                    id_rol_contribuidor: defaultRolContribuidor.id_rol_contribuidor
                });
            }
        }

        console.log('Database seeded successfully!');
    } catch (e) {
        console.error('Error during seeding:', e);
    } finally {
        process.exit(0);
    }
}

run();
