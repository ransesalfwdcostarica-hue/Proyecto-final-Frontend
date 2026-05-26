const Ejercicio = require('../models/Ejercicio');

const EjercicioController = {
    getAll: async (req, res) => {
        try {
            const { page, limit, categoria } = req.query;
            let whereClause = {};
            if (categoria) {
                whereClause.categoria = categoria;
            }

            if (page && limit) {
                const limitNum = parseInt(limit, 10) || 10;
                const offsetNum = (parseInt(page, 10) - 1) * limitNum;
                const { count, rows } = await Ejercicio.findAndCountAll({
                    where: whereClause,
                    limit: limitNum,
                    offset: offsetNum
                });
                
                const formattedRows = rows.map(ej => ({
                    ...ej.toJSON(),
                    id: ej.id_ejercicio,
                    videoUrl: ej.video
                }));

                return res.status(200).json({
                    data: formattedRows,
                    total: count,
                    totalPages: Math.ceil(count / limitNum),
                    currentPage: parseInt(page, 10) || 1
                });
            }

            const ejercicios = await Ejercicio.findAll({ where: whereClause });

            if (!ejercicios || ejercicios.length === 0) {
                return res.status(200).json([]); // Return empty array instead of 404 to avoid frontend errors
            }
            
            const formattedEjercicios = ejercicios.map(ej => ({
                ...ej.toJSON(),
                id: ej.id_ejercicio,
                videoUrl: ej.video
            }));
            
            res.status(200).json(formattedEjercicios);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const ejercicio = await Ejercicio.findByPk(id);

            if (!ejercicio) {
                return res.status(404).json({ message: 'Ejercicio no encontrado' });
            }

            res.status(200).json(ejercicio);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: async (req, res) => {
        try {
            // Extract all fields from request body
            const { nombre, nivel, musculo, video, imagen, tiempo, repeticiones, series, categoria } = req.body;

            if (!nombre) {
                return res.status(400).json({ error: 'El nombre es requerido' });
            }

            // Provide default values to satisfy DB NOT NULL constraints
            const videoVal = video || '';
            const imagenVal = imagen || '';
            const tiempoVal = tiempo || '';
            const repeticionesVal = (repeticiones !== undefined && repeticiones !== null) ? parseInt(repeticiones, 10) : 0;
            const seriesVal = (series !== undefined && series !== null) ? parseInt(series, 10) : 0;
            const categoriaVal = categoria || '';

            const nuevo = await Ejercicio.create({
                nombre,
                nivel,
                musculo,
                video: videoVal,
                imagen: imagenVal,
                tiempo: tiempoVal,
                repeticiones: isNaN(repeticionesVal) ? 0 : repeticionesVal,
                series: isNaN(seriesVal) ? 0 : seriesVal,
                categoria: categoriaVal
            });
            res.status(201).json(nuevo);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, nivel, musculo, video, imagen, tiempo, repeticiones, series, categoria } = req.body;
            const ejercicio = await Ejercicio.findByPk(id);

            if (!ejercicio) {
                return res.status(404).json({ message: 'Ejercicio no encontrado' });
            }

            if (!nombre) {
                return res.status(400).json({ error: 'El nombre es requerido' });
            }

            // Provide default values to satisfy DB NOT NULL constraints
            const videoVal = video !== undefined ? video : (ejercicio.video || '');
            const imagenVal = imagen !== undefined ? imagen : (ejercicio.imagen || '');
            const tiempoVal = tiempo !== undefined ? tiempo : (ejercicio.tiempo || '');
            const repeticionesVal = repeticiones !== undefined ? parseInt(repeticiones, 10) : ejercicio.repeticiones;
            const seriesVal = series !== undefined ? parseInt(series, 10) : ejercicio.series;
            const categoriaVal = categoria !== undefined ? categoria : ejercicio.categoria;

            await ejercicio.update({
                nombre,
                nivel,
                musculo,
                video: videoVal,
                imagen: imagenVal,
                tiempo: tiempoVal,
                repeticiones: isNaN(repeticionesVal) ? 0 : repeticionesVal,
                series: isNaN(seriesVal) ? 0 : seriesVal,
                categoria: categoriaVal
            });
            res.status(200).json(ejercicio);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const ejercicio = await Ejercicio.findByPk(id);

            if (!ejercicio) {
                return res.status(404).json({ message: 'Ejercicio no encontrado' });
            }

            await ejercicio.destroy();
            res.status(200).json({ message: 'Ejercicio eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = EjercicioController;
