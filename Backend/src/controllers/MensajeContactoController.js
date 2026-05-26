const MensajeContacto = require('../models/MensajeContacto');

const MensajeContactoController = {
    getAll: async (req, res) => {
        try {
            const mensajes = await MensajeContacto.findAll();

            if (!mensajes || mensajes.length === 0) {
                return res.status(404).json({ message: "No se encontraron mensajes" });
            }
            res.status(200).json(mensajes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const mensaje = await MensajeContacto.findByPk(id);

            if (!mensaje) {
                return res.status(404).json({ message: 'MensajeContacto no encontrado' });
            }

            res.status(200).json(mensaje);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: async (req, res) => {
        try {
            const { nombre, telefono, contacto, correo, email, mensaje, pais, fecha, id_usuario } = req.body;
            
            const telFinal = telefono || contacto;
            const correoFinal = correo || email;

            if (!nombre || !mensaje || !correoFinal) {
                return res.status(400).json({ error: 'El nombre, mensaje y correo son requeridos' });
            }

            const nuevo = await MensajeContacto.create({ 
                nombre, 
                telefono: telFinal, 
                correo: correoFinal, 
                mensaje, 
                pais: pais || 'No especificado', 
                fecha: fecha || new Date(), 
                id_usuario: id_usuario || null 
            });
            res.status(201).json(nuevo);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, telefono, contacto, correo, email, mensaje, pais, fecha, id_usuario } = req.body;
            const mensajeEncontrado = await MensajeContacto.findByPk(id);

            if (!mensajeEncontrado) {
                return res.status(404).json({ message: 'MensajeContacto no encontrado' });
            }
            
            const telFinal = telefono || contacto || mensajeEncontrado.telefono;
            const correoFinal = correo || email || mensajeEncontrado.correo;

            await mensajeEncontrado.update({ 
                nombre: nombre || mensajeEncontrado.nombre, 
                telefono: telFinal, 
                correo: correoFinal, 
                mensaje: mensaje || mensajeEncontrado.mensaje, 
                pais: pais || mensajeEncontrado.pais, 
                fecha: fecha || mensajeEncontrado.fecha, 
                id_usuario: id_usuario !== undefined ? id_usuario : mensajeEncontrado.id_usuario 
            });
            res.status(200).json(mensajeEncontrado);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const mensaje = await MensajeContacto.findByPk(id);

            if (!mensaje) {
                return res.status(404).json({ message: 'MensajeContacto no encontrado' });
            }

            await mensaje.destroy();
            res.status(200).json({ message: 'MensajeContacto eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = MensajeContactoController;
