const TemaEnTendencia = require('../models/TemaEnTendencia');

const TemaEnTendenciaController = {
    getAll: async (req, res) => {
        try {
            const temas = await TemaEnTendencia.findAll();

            if (!temas || temas.length === 0) {
                return res.status(200).json([]);
            }
            
            const formattedTemas = temas.map(t => ({
                ...t.toJSON(),
                id: t.id_tema,
                topic: t.tema,
                count: t.miembros
            }));
            
            res.status(200).json(formattedTemas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const tema = await TemaEnTendencia.findByPk(id);

            if (!tema) {
                return res.status(404).json({ message: 'TemaEnTendencia no encontrado' });
            }

            res.status(200).json(tema);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: async (req, res) => {
        try {
            const { tema, miembros } = req.body;

            if (!tema) {
                return res.status(400).json({ error: 'El tema es requerido' });
            }

            const nuevo = await TemaEnTendencia.create({ tema, miembros });
            res.status(201).json(nuevo);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { tema, miembros } = req.body;
            const temaEnTendencia = await TemaEnTendencia.findByPk(id);

            if (!temaEnTendencia) {
                return res.status(404).json({ message: 'TemaEnTendencia no encontrado' });
            }

            if (!tema) {
                return res.status(400).json({ error: 'El tema es requerido' });
            }

            await temaEnTendencia.update({ tema, miembros });
            res.status(200).json(temaEnTendencia);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const tema = await TemaEnTendencia.findByPk(id);

            if (!tema) {
                return res.status(404).json({ message: 'TemaEnTendencia no encontrado' });
            }

            await tema.destroy();
            res.status(200).json({ message: 'TemaEnTendencia eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = TemaEnTendenciaController;
