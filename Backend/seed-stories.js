const fs = require('fs');
const path = require('path');
const { sequelize, Publicacion, CategoriaPublicacion, Comentario, Like, LikePublicacion, PublicacionComentario, Usuario } = require('./src/index');

async function seedStories() {
    try {
        console.log("Sincronizando modelos...");
        await sequelize.sync();
        
        const dataPath = path.join(__dirname, '../Front-End/db.json');
        const dbJson = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const stories = dbJson.stories || [];
        const comentarios = dbJson.comentarios || [];

        console.log(`Migrando ${stories.length} historias y ${comentarios.length} comentarios...`);

        // 1. Obtener al admin por si un usuario no existe
        const adminUser = await Usuario.findOne({ where: { id_rol: 1 } });
        const adminId = adminUser ? adminUser.id_usuario : 1; // Fallback a 1

        let pubCount = 0;
        let commentCount = 0;

        for (const story of stories) {
            // A. Buscar Categoría
            const catName = story.category || story.tag || 'General';
            const [cat] = await CategoriaPublicacion.findOrCreate({ where: { nombre: catName } });

            // B. Determinar Usuario (mock ID a MySQL ID)
            // Intentar matchear por userName (es ineficiente pero es lo que tenemos en db.json)
            // Si el nombre falla, le asignamos el adminId
            let userId = adminId;
            if (story.userName) {
                const dbUser = await Usuario.findOne({ where: { nombre: story.userName } });
                if (dbUser) userId = dbUser.id_usuario;
            }

            // C. Crear Publicación
            const [pub] = await Publicacion.findOrCreate({
                where: { titulo: story.title, texto: story.text },
                defaults: {
                    tiempo: story.time || new Date().toISOString(),
                    imagen: story.image || story.imageBefore || story.imageAfter || '',
                    id_categoria: cat.id_categoria,
                    id_usuario: userId
                }
            });
            pubCount++;

            // D. Migrar Likes
            if (story.likedBy && Array.isArray(story.likedBy)) {
                for (const likedUid of story.likedBy) {
                    // Si el likeUid es string mock (ej. "c695"), no va a existir en Usuario.
                    // Idealmente esto sería un mapeo, pero vamos a dejar que Like guarde `id_usuario` numérico.
                    // Como no tenemos el mapa de UUID -> INT, si likedUid es alfanumérico, lo ignoraremos o usaremos adminId.
                    // Para simplificar, si es string y no es un número, usamos el adminId pero no podemos repetir Likes con el mismo ID.
                    // Mejor intentar parsearlo si es número, si no usar un usuario aleatorio u omitirlo.
                    // Al ser un mock, lo más seguro es omitir los likes rotos si queremos mantener integridad.
                    // Vamos a asignarle likes de un usuario genérico si no lo encuentra.
                    let likeUserId = parseInt(likedUid);
                    if (isNaN(likeUserId)) {
                        likeUserId = adminId;
                    }

                    try {
                        const [likeRecord] = await Like.findOrCreate({ where: { id_usuario: likeUserId } });
                        await LikePublicacion.findOrCreate({
                            where: { id_like: likeRecord.id_like, id_publicacion: pub.id_publicacion }
                        });
                    } catch (e) {
                        // Ignorar fallos de llave foránea de likes
                    }
                }
            }

            // E. Migrar Comentarios de esta historia
            const storyComments = comentarios.filter(c => c.storyId === story.id);
            for (const comment of storyComments) {
                let commentUserId = adminId;
                if (comment.userName) {
                    const cUser = await Usuario.findOne({ where: { nombre: comment.userName } });
                    if (cUser) commentUserId = cUser.id_usuario;
                }

                const [com] = await Comentario.findOrCreate({
                    where: { texto: comment.text, id_usuario: commentUserId },
                    defaults: {
                        texto: comment.text,
                        id_usuario: commentUserId,
                        createdAt: comment.fecha ? new Date(comment.fecha) : new Date()
                    }
                });

                await PublicacionComentario.findOrCreate({
                    where: { id_publicacion: pub.id_publicacion, id_comentario: com.id_comentario }
                });
                commentCount++;
            }
        }

        console.log(`✅ Migración finalizada: ${pubCount} historias, ${commentCount} comentarios.`);
        process.exit(0);
    } catch (error) {
        console.error("Error migrando historias:", error);
        process.exit(1);
    }
}

seedStories();
