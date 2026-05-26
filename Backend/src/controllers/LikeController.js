const Like = require('../models/Like');

const LikeController = {
    getAll: async (req, res) => {
        try {
            const likes = await Like.findAll();

            if (!likes || likes.length === 0) {
                return res.status(404).json({ message: "No se encontraron likes" });
            }
            res.status(200).json(likes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const like = await Like.findByPk(id);

            if (!like) {
                return res.status(404).json({ message: 'Like no encontrado' });
            }

            res.status(200).json(like);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: async (req, res) => {
        try {
            const { id_usuario, id_publicacion } = req.body;

            if (!id_usuario || !id_publicacion) {
                return res.status(400).json({ error: 'id_usuario y id_publicacion son requeridos' });
            }

            // Create a Like entry
            const nuevoLike = await Like.create({ id_usuario });

            // Associate with the publication via LikePublicacion
            const LikePublicacion = require('../models/LikePublicacion');
            await LikePublicacion.create({
                id_like: nuevoLike.id_like,
                id_publicacion
            });

            res.status(201).json({ like: nuevoLike });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { id_usuario } = req.body;
            const like = await Like.findByPk(id);

            if (!like) {
                return res.status(404).json({ message: 'Like no encontrado' });
            }

            if (!id_usuario) {
                return res.status(400).json({ error: 'El id_usuario es requerido' });
            }

            await like.update({ id_usuario });
            res.status(200).json(like);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const like = await Like.findByPk(id);

            if (!like) {
                return res.status(404).json({ message: 'Like no encontrado' });
            }

            await like.destroy();
            res.status(200).json({ message: 'Like eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = LikeController;
