const Contribuidor = require('../models/Contribuidor');

const ContribuidorController = {
    getAll: async (req, res) => {
        try {
            const { Usuario, RolContribuidor, Perfil } = require('../index');
            const contribuidores = await Contribuidor.findAll({
                include: [
                    {
                        model: Usuario,
                        include: [{ model: Perfil }]
                    },
                    {
                        model: RolContribuidor
                    }
                ]
            });

            if (!contribuidores || contribuidores.length === 0) {
                return res.status(200).json([]);
            }

            const mapped = contribuidores.map(c => ({
                id: c.id_contribuidor,
                name: c.Usuario?.nombre || 'Colaborador',
                role: c.RolContribuidor?.nombre || 'Experto',
                points: c.puntos || '0 pts',
                avatar: c.Usuario?.Perfil?.foto_perfil || ''
            }));

            res.status(200).json(mapped);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const contribuidor = await Contribuidor.findByPk(id);

            if (!contribuidor) {
                return res.status(404).json({ message: 'Contribuidor no encontrado' });
            }

            res.status(200).json(contribuidor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: async (req, res) => {
        try {
            const { puntos, id_usuario, id_rol_contribuidor } = req.body;

            if (!id_usuario || !id_rol_contribuidor) {
                return res.status(400).json({ error: 'El id_usuario, id_rol_contribuidor es requerido' });
            }

            const nuevo = await Contribuidor.create({ puntos, id_usuario, id_rol_contribuidor });
            res.status(201).json(nuevo);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { puntos, id_usuario, id_rol_contribuidor } = req.body;
            const contribuidor = await Contribuidor.findByPk(id);

            if (!contribuidor) {
                return res.status(404).json({ message: 'Contribuidor no encontrado' });
            }

            if (!id_usuario || !id_rol_contribuidor) {
                return res.status(400).json({ error: 'El id_usuario, id_rol_contribuidor es requerido' });
            }

            await contribuidor.update({ puntos, id_usuario, id_rol_contribuidor });
            res.status(200).json(contribuidor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const contribuidor = await Contribuidor.findByPk(id);

            if (!contribuidor) {
                return res.status(404).json({ message: 'Contribuidor no encontrado' });
            }

            await contribuidor.destroy();
            res.status(200).json({ message: 'Contribuidor eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = ContribuidorController;
