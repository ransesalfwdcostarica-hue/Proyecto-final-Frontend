const fs = require('fs');
const path = require('path');
const { 
    sequelize, 
    Ejercicio, 
    TemaEnTendencia, 
    Usuario, 
    DatosUsuario, 
    Rutina, 
    RutinaEjercicio,
    Alergia,
    DatosUsuarioAlergia
} = require('./src/index');

async function seedData() {
    try {
        console.log("Asegurando columna categoria en tabla ejercicio...");
        try {
            await sequelize.query('ALTER TABLE ejercicio ADD COLUMN categoria VARCHAR(120) NULL;');
        } catch(e) {
            console.log("Nota: la columna categoria ya existe o no se pudo crear (probablemente ya existe).");
        }
        
        console.log("Sincronizando modelos...");
        await sequelize.sync();
        
        const dataPath = path.join(__dirname, '../Front-End/db.json');
        const dbJson = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        
        console.log("Migrando Ejercicios...");
        const jsonEjercicios = dbJson.ejercicios || [];
        const ejercicioMap = {}; // Map of db.json string ID to MySQL integer ID
        
        for (const ej of jsonEjercicios) {
            const [ejercicio] = await Ejercicio.findOrCreate({
                where: { nombre: ej.nombre },
                defaults: {
                    nivel: ej.nivel || 'PRINCIPIANTE',
                    musculo: ej.musculo || 'FULL BODY',
                    video: ej.videoUrl || '',
                    imagen: ej.imagen || '',
                    tiempo: ej.tiempo || '30 SEG',
                    categoria: ej.categoria || 'Otro',
                    repeticiones: ej.repeticiones || 0,
                    series: ej.series || 0
                }
            });
            ejercicioMap[ej.id] = ejercicio.id_ejercicio;
        }
        console.log(`✅ ${jsonEjercicios.length} ejercicios migrados.`);

        console.log("Migrando Temas en Tendencia...");
        const jsonTemas = dbJson.trendingTopics || [];
        for (const tema of jsonTemas) {
            await TemaEnTendencia.findOrCreate({
                where: { tema: tema.topic },
                defaults: {
                    miembros: tema.count || 0
                }
            });
        }
        console.log(`✅ ${jsonTemas.length} temas en tendencia migrados.`);

        console.log("Migrando DatosUsuario, Alergias y Rutinas...");
        const jsonUsuarios = dbJson.usuarios || [];
        for (const jsonU of jsonUsuarios) {
            const dbUser = await Usuario.findOne({ where: { correo: jsonU.email } });
            
            if (dbUser) {
                // DatosUsuario
                const [datosUsuario] = await DatosUsuario.findOrCreate({
                    where: { id_usuario: dbUser.id_usuario },
                    defaults: {
                        sexo: jsonU.sexo || 'm',
                        altura: parseFloat(jsonU.altura) || 170,
                        peso: parseFloat(jsonU.peso) || 70,
                        lugar_entrenamiento: jsonU.lugarEntrenamiento || 'gym',
                        peso_meta: parseFloat(jsonU.pesoMeta) || 70,
                        plazo_semanas: parseInt(jsonU.plazoSemanas) || 4,
                        deficit_estimado: parseInt(jsonU.deficitEstimado) || 0,
                        imagen: jsonU.avatar || '',
                        semanas_progreso: parseInt(jsonU.semanasEnProgreso) || 0,
                        feedback_dieta: jsonU.ultimoFeedbackDieta || 'Sin feedback',
                        feedback_ejercicio: jsonU.ultimoFeedbackEjercicio || 'Sin feedback'
                    }
                });

                // Alergias
                if (jsonU.alergias && !["nd", "no", "ninguna", "ninguno", "n/a", ""].includes(jsonU.alergias.toLowerCase().trim())) {
                    const alergiaStr = jsonU.alergias.substring(0, 45); // Max length in DB
                    const [alergia] = await Alergia.findOrCreate({
                        where: { nombre: alergiaStr },
                        defaults: { 
                            descripcion: `Alergia importada: ${jsonU.alergias}`.substring(0, 200) 
                        }
                    });
                    
                    await DatosUsuarioAlergia.findOrCreate({
                        where: {
                            id_datos_usuario: datosUsuario.id_datos_usuario,
                            id_alergia: alergia.id_alergia
                        }
                    });
                }

                // Rutina
                const [rutina] = await Rutina.findOrCreate({
                    where: { id_datos_usuario: datosUsuario.id_datos_usuario },
                    defaults: {
                        nombre: `Rutina de ${jsonU.nombre}`,
                        descripcion: 'Rutina importada',
                        dificultad: 'Media'
                    }
                });

                // RutinaEjercicios
                if (jsonU.ejerciciosElegidos && jsonU.ejerciciosElegidos.length > 0) {
                    for (const ejStrId of jsonU.ejerciciosElegidos) {
                        const ejDbId = ejercicioMap[ejStrId];
                        if (ejDbId) {
                            await RutinaEjercicio.findOrCreate({
                                where: {
                                    id_rutina: rutina.id_rutina,
                                    id_ejercicio: ejDbId
                                }
                            });
                        }
                    }
                }
            }
        }
        console.log(`✅ DatosUsuario, Alergias y Rutinas migrados.`);
        
        console.log("¡Migración total completada con éxito!");
        process.exit(0);
    } catch (error) {
        console.error("Error en el seed-data:", error);
        process.exit(1);
    }
}

seedData();
