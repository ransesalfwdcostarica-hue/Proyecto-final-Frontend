const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const UsuarioController = {
    getAll: async (req, res) => {
        try {
            const { page, limit } = req.query;
            if (page && limit) {
                const limitNum = parseInt(limit, 10) || 10;
                const offsetNum = (parseInt(page, 10) - 1) * limitNum;
                const { count, rows } = await Usuario.findAndCountAll({
                    limit: limitNum,
                    offset: offsetNum,
                    attributes: { exclude: ['contrasenia'] }
                });
                return res.status(200).json({
                    data: rows,
                    total: count,
                    totalPages: Math.ceil(count / limitNum),
                    currentPage: parseInt(page, 10) || 1
                });
            }

            const usuarios = await Usuario.findAll({
                attributes: { exclude: ['contrasenia'] }
            });

            if (!usuarios || usuarios.length === 0) {
                return res.status(404).json({ message: "No se encontraron usuarios" });
            }
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const { Rol, DatosUsuario, Perfil, Rutina, Ejercicio } = require('../index');
            const usuario = await Usuario.findByPk(id, {
                attributes: { exclude: ['contrasenia'] },
                include: [
                    { model: Rol },
                    { 
                        model: DatosUsuario,
                        include: [{
                            model: Rutina,
                            include: [{ model: Ejercicio }]
                        }]
                    },
                    { 
                        model: Perfil,
                        include: [
                            { model: Perfil, as: 'Followers' },
                            { model: Perfil, as: 'Following' }
                        ]
                    }
                ]
            });

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            res.status(200).json(usuario);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: async (req, res) => {
        try {
            const { correo, contrasenia, nombre, edad, id_rol } = req.body;

            if (!correo || !contrasenia || !nombre) {
                return res.status(400).json({ error: 'El correo, contrasenia, nombre es requerido' });
            }

            const nuevo = await Usuario.create({ correo, contrasenia, nombre, edad, id_rol });
            const nuevoJson = nuevo.toJSON();
            delete nuevoJson.contrasenia;
            res.status(201).json(nuevoJson);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { correo, contrasenia, nombre, edad, id_rol } = req.body;
            const usuario = await Usuario.findByPk(id);

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            if (!correo || !contrasenia || !nombre) {
                return res.status(400).json({ error: 'El correo, contrasenia, nombre es requerido' });
            }

            await usuario.update({ correo, contrasenia, nombre, edad, id_rol });

            const { DatosUsuario, Perfil } = require('../index');

            // Update or Create DatosUsuario if fields are present
            let datosUsuario = await DatosUsuario.findOne({ where: { id_usuario: id } });
            
            const updateData = {};
            if (req.body.peso !== undefined) updateData.peso = req.body.peso;
            if (req.body.pesoActual !== undefined) updateData.peso = req.body.pesoActual; 
            if (req.body.pesoMeta !== undefined) updateData.peso_meta = req.body.pesoMeta;
            if (req.body.altura !== undefined) updateData.altura = req.body.altura;
            if (req.body.plazoSemanas !== undefined) updateData.plazo_semanas = req.body.plazoSemanas;
            if (req.body.deficitEstimado !== undefined) updateData.deficit_estimado = req.body.deficitEstimado;
            if (req.body.semanasEnProgreso !== undefined) updateData.semanas_progreso = req.body.semanasEnProgreso;
            if (req.body.ultimoFeedbackDieta !== undefined) updateData.feedback_dieta = req.body.ultimoFeedbackDieta;
            if (req.body.ultimoFeedbackEjercicio !== undefined) updateData.feedback_ejercicio = req.body.ultimoFeedbackEjercicio;
            if (req.body.sexo !== undefined) updateData.sexo = req.body.sexo;
            if (req.body.lugarEntrenamiento !== undefined) updateData.lugar_entrenamiento = req.body.lugarEntrenamiento;

            if (Object.keys(updateData).length > 0) {
                if (datosUsuario) {
                    await datosUsuario.update(updateData);
                } else {
                    await DatosUsuario.create({ ...updateData, id_usuario: id });
                }
            }

            // Update or Create Perfil if fields are present
            let perfil = await Perfil.findOne({ where: { id_usuario: id } });
            
            const perfilUpdate = {};
            if (req.body.avatar !== undefined) perfilUpdate.foto_perfil = req.body.avatar;
            if (req.body.cover !== undefined) perfilUpdate.foto_portada = req.body.cover;
            
            if (Object.keys(perfilUpdate).length > 0) {
                if (perfil) {
                    await perfil.update(perfilUpdate);
                } else {
                    perfil = await Perfil.create({ ...perfilUpdate, id_usuario: id, biografia: 'Miembro de PowerFit' });
                }
            }

            // Update followers/following if provided
            if (req.body.following && Array.isArray(req.body.following)) {
                const followingPerfiles = await Perfil.findAll({
                    where: { id_usuario: req.body.following }
                });
                if (perfil) await perfil.setFollowing(followingPerfiles);
            }

            if (req.body.followers && Array.isArray(req.body.followers)) {
                const followerPerfiles = await Perfil.findAll({
                    where: { id_usuario: req.body.followers }
                });
                if (perfil) await perfil.setFollowers(followerPerfiles);
            }

            // Update ejercicios elegidos (Rutina)
            if (req.body.ejerciciosElegidos && Array.isArray(req.body.ejerciciosElegidos)) {
                const { Rutina } = require('../index');
                if (!datosUsuario) {
                    datosUsuario = await DatosUsuario.create({ id_usuario: id });
                }
                
                let rutina = await Rutina.findOne({ where: { id_datos_usuario: datosUsuario.id_datos_usuario } });
                if (!rutina) {
                    rutina = await Rutina.create({ id_datos_usuario: datosUsuario.id_datos_usuario });
                }

                await rutina.setEjercicios(req.body.ejerciciosElegidos);
            }

            // Re-fetch the updated user with associations
            const { Rutina, Ejercicio } = require('../index');
            const updatedUser = await Usuario.findByPk(id, {
                attributes: { exclude: ['contrasenia'] },
                include: [
                    { model: require('../index').Rol },
                    { 
                        model: DatosUsuario,
                        include: [{
                            model: Rutina,
                            include: [{ model: Ejercicio }]
                        }]
                    },
                    { 
                        model: Perfil,
                        include: [
                            { model: Perfil, as: 'Followers' },
                            { model: Perfil, as: 'Following' }
                        ]
                    }
                ]
            });

            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    login: async (req, res) => {
        try {
            const { correo, contrasenia } = req.body;
            if (!correo || !contrasenia) {
                return res.status(400).json({ error: 'Correo y contrasenia son requeridos' });
            }

            const { Rol, DatosUsuario, Perfil, Rutina, Ejercicio } = require('../index');
            const usuario = await Usuario.findOne({ 
                where: { correo },
                include: [
                    { model: Rol },
                    { 
                        model: DatosUsuario,
                        include: [{
                            model: Rutina,
                            include: [{ model: Ejercicio }]
                        }]
                    },
                    { 
                        model: Perfil,
                        include: [
                            { model: Perfil, as: 'Followers' },
                            { model: Perfil, as: 'Following' }
                        ]
                    }
                ]
            });

            if (!usuario) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const contraseniaValida = await usuario.validarContrasenia(contrasenia);
            if (!contraseniaValida) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            // Firmar el token JWT
            const token = jwt.sign(
                { 
                    id: usuario.id_usuario,
                    id_usuario: usuario.id_usuario, 
                    correo: usuario.correo, 
                    id_rol: usuario.id_rol,
                    rol: usuario.Rol?.nombre || 'client'
                },
                config.jwtSecret,
                { expiresIn: '24h' }
            );

            const usuarioJson = usuario.toJSON();
            delete usuarioJson.contrasenia;

            res.status(200).json({
                message: 'Login exitoso',
                token,
                usuario: usuarioJson
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findByPk(id);

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            await usuario.destroy();
            res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = UsuarioController;
