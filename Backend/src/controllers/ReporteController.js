const Reporte = require('../models/Reporte');

const ReporteController = {
    getAll: async (req, res) => {
        try {
            const { Usuario, RazonReporte, DetalleRazonReporte } = require('../index');
            const reportes = await Reporte.findAll({
                include: [
                    { model: Usuario },
                    {
                        model: RazonReporte,
                        include: [{ model: DetalleRazonReporte }]
                    }
                ]
            });

            if (!reportes) {
                return res.status(200).json([]);
            }

            const mapped = reportes.map(r => ({
                id: r.id_reporte,
                storyId: r.id_publicacion,
                reporterId: r.id_usuario,
                reporterName: r.Usuario?.nombre || 'Usuario',
                reason: r.RazonReporte?.nombre || 'Reporte',
                subReason: r.RazonReporte?.DetalleRazonReporte?.nombre || 'Contenido reportado',
                otherText: r.descripcion,
                status: r.estado || 'pending',
                fecha: r.fecha_hora || new Date()
            }));

            res.status(200).json(mapped);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const reporte = await Reporte.findByPk(id);

            if (!reporte) {
                return res.status(404).json({ message: 'Reporte no encontrado' });
            }

            res.status(200).json(reporte);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: async (req, res) => {
        try {
            let { id_usuario, reporterId, id_publicacion, storyId, id_razon, reason, descripcion, subReason, otherText, estado, status, fecha_hora, fecha } = req.body;
            
            const finalUserId = id_usuario || reporterId;
            const finalPublicacionId = id_publicacion || storyId;
            let finalRazonId = id_razon;
            
            if (!finalRazonId && reason) {
                const { RazonReporte } = require('../index');
                const r = await RazonReporte.findOne({ where: { nombre: reason } });
                if (r) finalRazonId = r.id_razon;
            }
            if (!finalRazonId) finalRazonId = 1; // Fallback to 1

            if (!finalUserId || !finalPublicacionId) {
                return res.status(400).json({ error: 'El id_usuario/reporterId y el id_publicacion/storyId son requeridos' });
            }

            const nuevo = await Reporte.create({
                id_usuario: finalUserId,
                id_publicacion: finalPublicacionId,
                id_razon: finalRazonId,
                descripcion: descripcion || otherText || subReason || 'Reporte de contenido',
                estado: estado || status || 'pending',
                fecha_hora: fecha_hora || fecha || new Date()
            });

            res.status(201).json(nuevo);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { id_usuario, id_publicacion, id_razon, descripcion, estado, fecha_hora } = req.body;
            const reporte = await Reporte.findByPk(id);

            if (!reporte) {
                return res.status(404).json({ message: 'Reporte no encontrado' });
            }

            if (!id_usuario || !id_publicacion || !id_razon) {
                return res.status(400).json({ error: 'El id_usuario, id_publicacion, id_razon es requerido' });
            }

            await reporte.update({ id_usuario, id_publicacion, id_razon, descripcion, estado, fecha_hora });
            res.status(200).json(reporte);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const reporte = await Reporte.findByPk(id);

            if (!reporte) {
                return res.status(404).json({ message: 'Reporte no encontrado' });
            }

            await reporte.destroy();
            res.status(200).json({ message: 'Reporte eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = ReporteController;
