const { Comentario, Usuario, Perfil, PublicacionComentario, Publicacion } = require('../index');

const formatComentario = (c, storyId) => {
    return {
        ...c.toJSON(),
        id: c.id_comentario,
        storyId: storyId || (c.Publicacions && c.Publicacions.length > 0 ? c.Publicacions[0].id_publicacion : null),
        userId: c.id_usuario,
        userName: c.Usuario ? c.Usuario.nombre : 'Usuario',
        userAvatar: c.Usuario && c.Usuario.Perfil ? c.Usuario.Perfil.foto_perfil : '',
        text: c.texto,
        fecha: c.createdAt || new Date().toISOString() // Assuming timestamps are on, else fallback to new Date()
    };
};

const ComentarioController = {
    getAll: async (req, res) => {
        try {
            const { storyId } = req.query;
            let includeOptions = [
                { model: Usuario, include: [Perfil] }
            ];
            
            if (storyId) {
                includeOptions.push({
                    model: Publicacion,
                    where: { id_publicacion: storyId },
                    attributes: ['id_publicacion']
                });
            } else {
                includeOptions.push({
                    model: Publicacion,
                    attributes: ['id_publicacion']
                });
            }

            const comentarios = await Comentario.findAll({
                include: includeOptions
            });

            if (!comentarios || comentarios.length === 0) {
                return res.status(200).json([]);
            }
            
            res.status(200).json(comentarios.map(c => formatComentario(c, storyId)));
        } catch (error) {
            console.error("Error in getAll Comentario:", error);
            res.status(500).json({ error: error.message });
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const comentario = await Comentario.findByPk(id, {
                include: [
                    { model: Usuario, include: [Perfil] },
                    { model: Publicacion, attributes: ['id_publicacion'] }
                ]
            });

            if (!comentario) {
                return res.status(404).json({ message: 'Comentario no encontrado' });
            }

            res.status(200).json(formatComentario(comentario));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: async (req, res) => {
        try {
            const { text, texto, userId, id_usuario, storyId, id_publicacion } = req.body;

            const finalText = text || texto;
            const finalUserId = userId || id_usuario;
            const finalStoryId = storyId || id_publicacion;

            if (!finalText || !finalUserId || !finalStoryId) {
                return res.status(400).json({ error: 'El texto, id_usuario y storyId son requeridos' });
            }

            const nuevo = await Comentario.create({ 
                texto: finalText, 
                id_usuario: finalUserId 
            });

            await PublicacionComentario.create({
                id_publicacion: finalStoryId,
                id_comentario: nuevo.id_comentario
            });

            const savedComentario = await Comentario.findByPk(nuevo.id_comentario, {
                include: [
                    { model: Usuario, include: [Perfil] }
                ]
            });

            res.status(201).json(formatComentario(savedComentario, finalStoryId));
        } catch (error) {
            console.error("Error creating comment:", error);
            res.status(500).json({ error: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { text, texto, id_usuario } = req.body;
            const comentario = await Comentario.findByPk(id);

            if (!comentario) {
                return res.status(404).json({ message: 'Comentario no encontrado' });
            }

            const finalText = text || texto || comentario.texto;

            await comentario.update({ 
                texto: finalText, 
                id_usuario: id_usuario || comentario.id_usuario 
            });

            const updatedComentario = await Comentario.findByPk(id, {
                include: [
                    { model: Usuario, include: [Perfil] },
                    { model: Publicacion, attributes: ['id_publicacion'] }
                ]
            });

            res.status(200).json(formatComentario(updatedComentario));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const comentario = await Comentario.findByPk(id);

            if (!comentario) {
                return res.status(404).json({ message: 'Comentario no encontrado' });
            }

            await PublicacionComentario.destroy({ where: { id_comentario: id } });
            await comentario.destroy();
            res.status(200).json({ message: 'Comentario eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = ComentarioController;
