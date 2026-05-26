const { Publicacion, Usuario, Perfil, CategoriaPublicacion, Like, LikePublicacion } = require('../index');

const formatPublicacion = (pub) => {
    return {
        ...pub.toJSON(),
        id: pub.id_publicacion,
        title: pub.titulo,
        text: pub.texto,
        image: pub.imagen,
        time: pub.tiempo,
        fecha: pub.tiempo,
        userId: pub.id_usuario,
        userName: pub.Usuario ? pub.Usuario.nombre : 'Usuario',
        userAvatar: pub.Usuario && pub.Usuario.Perfil ? pub.Usuario.Perfil.foto_perfil : '',
        category: pub.CategoriaPublicacion ? pub.CategoriaPublicacion.nombre : 'General',
        tag: pub.CategoriaPublicacion ? pub.CategoriaPublicacion.nombre : 'General',
        likes: pub.Likes ? pub.Likes.length : 0,
        likedBy: pub.Likes ? pub.Likes.map(l => l.id_usuario) : []
    };
};

const PublicacionController = {
    getAll: async (req, res) => {
        try {
            const userIdParam = req.query.userId;
            const whereClause = userIdParam ? { id_usuario: userIdParam } : {};

            const publicaciones = await Publicacion.findAll({
                where: whereClause,
                include: [
                    { model: Usuario, include: [Perfil] },
                    { model: CategoriaPublicacion },
                    { model: Like }
                ]
            });

            if (!publicaciones || publicaciones.length === 0) {
                return res.status(200).json([]);
            }
            
            res.status(200).json(publicaciones.map(formatPublicacion));
        } catch (error) {
            console.error("Error in getAll Publicacion:", error);
            res.status(500).json({ error: error.message });
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const publicacion = await Publicacion.findByPk(id, {
                include: [
                    { model: Usuario, include: [Perfil] },
                    { model: CategoriaPublicacion },
                    { model: Like }
                ]
            });

            if (!publicacion) {
                return res.status(404).json({ message: 'Publicacion no encontrada' });
            }

            res.status(200).json(formatPublicacion(publicacion));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: async (req, res) => {
        try {
            const { tiempo, fecha, title, titulo, text, texto, image, imagen, category, tag, categoria_nombre, userId, id_usuario } = req.body;

            const finalTitulo = title || titulo;
            const finalTexto = text || texto;
            const finalUsuario = userId || id_usuario;
            const finalImagen = image || imagen || '';
            const finalTiempo = tiempo || fecha || new Date().toISOString();
            const finalCategoria = category || tag || categoria_nombre;

            if (!finalTitulo || !finalTexto || !finalUsuario) {
                return res.status(400).json({ error: 'El titulo, texto, id_usuario es requerido' });
            }

            let catId = 1; // Fallback
            if (finalCategoria) {
                const [cat] = await CategoriaPublicacion.findOrCreate({ where: { nombre: finalCategoria } });
                catId = cat.id_categoria;
            }

            const nuevo = await Publicacion.create({ 
                tiempo: finalTiempo, 
                titulo: finalTitulo, 
                texto: finalTexto, 
                imagen: finalImagen, 
                id_categoria: catId, 
                id_usuario: finalUsuario 
            });

            // Reload to get relationships for immediate return
            const publicacionGuardada = await Publicacion.findByPk(nuevo.id_publicacion, {
                include: [
                    { model: Usuario, include: [Perfil] },
                    { model: CategoriaPublicacion },
                    { model: Like }
                ]
            });

            res.status(201).json(formatPublicacion(publicacionGuardada));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { tiempo, titulo, title, texto, text, imagen, image, id_categoria, id_usuario, likedBy, likes } = req.body;
            const publicacion = await Publicacion.findByPk(id);

            if (!publicacion) {
                return res.status(404).json({ message: 'Publicacion no encontrado' });
            }

            // Handle normal fields update
            const finalTitulo = title || titulo || publicacion.titulo;
            const finalTexto = text || texto || publicacion.texto;
            const finalImagen = image || imagen || publicacion.imagen;
            
            await publicacion.update({ 
                tiempo: tiempo || publicacion.tiempo, 
                titulo: finalTitulo, 
                texto: finalTexto, 
                imagen: finalImagen, 
                id_categoria: id_categoria || publicacion.id_categoria, 
                id_usuario: id_usuario || publicacion.id_usuario 
            });

            // Handle likes update from frontend likedBy array
            if (likedBy && Array.isArray(likedBy)) {
                // Remove all existing likes for this post
                await LikePublicacion.destroy({ where: { id_publicacion: id } });
                
                // Add new ones
                for (const uid of likedBy) {
                    const [like] = await Like.findOrCreate({ where: { id_usuario: uid } });
                    await LikePublicacion.findOrCreate({
                        where: { id_like: like.id_like, id_publicacion: id }
                    });
                }
            }

            const updatedPublicacion = await Publicacion.findByPk(id, {
                include: [
                    { model: Usuario, include: [Perfil] },
                    { model: CategoriaPublicacion },
                    { model: Like }
                ]
            });

            res.status(200).json(formatPublicacion(updatedPublicacion));
        } catch (error) {
            console.error("Update error:", error);
            res.status(500).json({ error: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const publicacion = await Publicacion.findByPk(id);

            if (!publicacion) {
                return res.status(404).json({ message: 'Publicacion no encontrado' });
            }

            await publicacion.destroy();
            res.status(200).json({ message: 'Publicacion eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = PublicacionController;
