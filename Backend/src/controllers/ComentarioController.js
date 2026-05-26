const Comentario = require('../models/Comentario');
const PublicacionComentario = require('../models/PublicacionComentario');

const ComentarioController = {
    getAll: async (req, res) => {
        try {
            const { storyId } = req.query;
            const whereClause = storyId ? { id_publicacion: storyId } : undefined;
            const comentarios = await Comentario.findAll({ where: whereClause });
            if (!comentarios || comentarios.length === 0) {
                return res.status(404).json({ message: "No se encontraron comentarios" });
            }
            res.status(200).json(comentarios);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const comentario = await Comentario.findByPk(id);

            if (!comentario) {
                return res.status(404).json({ message: 'Comentario no encontrado' });
            }

            res.status(200).json(comentario);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: async (req, res) => {
        try {
            const { texto, id_usuario, id_publicacion } = req.body;

            if (!texto || !id_usuario || !id_publicacion) {
                return res.status(400).json({ error: 'El texto, id_usuario y id_publicacion son requeridos' });
            }

            const nuevo = await Comentario.create({ texto, id_usuario, id_publicacion });
            await PublicacionComentario.create({ id_publicacion, id_comentario: nuevo.id_comentario });
        res.status(201).json(nuevo);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { texto, id_usuario } = req.body;
            const comentario = await Comentario.findByPk(id);

            if (!comentario) {
                return res.status(404).json({ message: 'Comentario no encontrado' });
            }

            if (!texto || !id_usuario) {
                return res.status(400).json({ error: 'El texto, id_usuario es requerido' });
            }

            await comentario.update({ texto, id_usuario });
            res.status(200).json(comentario);
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

            await comentario.destroy();
            res.status(200).json({ message: 'Comentario eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = ComentarioController;
