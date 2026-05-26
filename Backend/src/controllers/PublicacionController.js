const Publicacion = require('../models/Publicacion');

const PublicacionController = {
    getAll: async (req, res) => {
        try {
            const publicaciones = await Publicacion.findAll();

            if (!publicaciones || publicaciones.length === 0) {
                return res.status(404).json({ message: "No se encontraron publicaciones" });
            }
            res.status(200).json(publicaciones);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const publicacion = await Publicacion.findByPk(id);

            if (!publicacion) {
                return res.status(404).json({ message: 'Publicacion no encontrado' });
            }

            res.status(200).json(publicacion);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: async (req, res) => {
        try {
            const { tiempo, titulo, texto, imagen, categoria_nombre, id_usuario } = req.body;

            if (!titulo || !texto || !id_usuario) {
                return res.status(400).json({ error: 'El titulo, texto, id_usuario es requerido' });
            }

            let catId = 1; // Fallback
            if (categoria_nombre) {
                const { CategoriaPublicacion } = require('../index');
                const cat = await CategoriaPublicacion.findOne({ where: { nombre: categoria_nombre } });
                if (cat) {
                    catId = cat.id_categoria;
                }
            }

            const nuevo = await Publicacion.create({
                tiempo,
                titulo,
                texto,
                imagen,
                id_categoria: catId,
                id_usuario
            });
            res.status(201).json(nuevo);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { tiempo, titulo, texto, imagen, id_categoria, id_usuario } = req.body;
            const publicacion = await Publicacion.findByPk(id);

            if (!publicacion) {
                return res.status(404).json({ message: 'Publicacion no encontrado' });
            }

            if (!titulo || !texto || !id_usuario) {
                return res.status(400).json({ error: 'El titulo, texto, id_usuario es requerido' });
            }

            await publicacion.update({ tiempo, titulo, texto, imagen, id_categoria, id_usuario });
            res.status(200).json(publicacion);
        } catch (error) {
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
    },
    fetchComentarios: async (req, res) => {
        try {
            const { id } = req.params;
            const comentarios = await Comentario.findAll({ where: { id_publicacion: id } });
            res.status(200).json(comentarios);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = PublicacionController;
