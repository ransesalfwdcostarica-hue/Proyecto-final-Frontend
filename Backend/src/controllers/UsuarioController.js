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
            const { Rol, DatosUsuario, Perfil, Rutina, Ejercicio, Alergia } = require('../index');
            const usuario = await Usuario.findByPk(id, {
                attributes: { exclude: ['contrasenia'] },
                include: [
                    { model: Rol },
                    { 
                        model: DatosUsuario,
                        include: [
                            { model: Alergia },
                            {
                                model: Rutina,
                                include: [{ model: Ejercicio }]
                            }
                        ]
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
            const { correo, email, contrasenia, password, nombre, edad, id_rol } = req.body;

            const finalCorreo = correo || email;
            const finalContrasenia = contrasenia || password;

            if (!finalCorreo || !finalContrasenia || !nombre) {
                return res.status(400).json({ error: 'El correo, contrasenia, nombre es requerido' });
            }

            // Crear el usuario con id_rol por defecto a 2 (Cliente) si no se especifica
            const nuevo = await Usuario.create({
                correo,
                contrasenia,
                nombre,
                edad: edad ? Number(edad) : 18,
                id_rol: id_rol || 1
            });

            const { Perfil, DatosUsuario, Alergia } = require('../index');

            // Crear Perfil y DatosUsuario si hay campos de registro físico/completo
            const isFullRegistration = req.body.sexo !== undefined || req.body.peso !== undefined || req.body.altura !== undefined;
            
            if (isFullRegistration) {
                // Crear Perfil
                const foto_perfil = req.body.avatar || req.body.foto_perfil || 'avatar.png';
                const foto_portada = req.body.cover || req.body.foto_portada || 'banner.jpg';
                const biografia = req.body.biografia || 'Miembro de PowerFit';
                
                await Perfil.create({
                    foto_perfil,
                    foto_portada,
                    biografia,
                    id_usuario: nuevo.id_usuario
                });

                // Crear DatosUsuario
                const sexo = req.body.sexo || 'Masculino';
                const altura = req.body.altura !== undefined ? Number(req.body.altura) : 1.70;
                const peso = req.body.peso !== undefined ? Number(req.body.peso) : 70.0;
                const lugar_entrenamiento = req.body.lugarEntrenamiento || req.body.lugar_entrenamiento || 'Casa';
                const peso_meta = req.body.pesoMeta !== undefined ? Number(req.body.pesoMeta) : 70.0;
                const plazo_semanas = req.body.plazoSemanas !== undefined ? Number(req.body.plazoSemanas) : 8;
                const deficit_estimado = req.body.deficitEstimado !== undefined ? Number(req.body.deficitEstimado) : 450;
                const imagen = req.body.imagen || 'inicial.png';
                const semanas_progreso = req.body.semanasEnProgreso !== undefined ? Number(req.body.semanasEnProgreso) : 0;
                const feedback_dieta = req.body.ultimoFeedbackDieta || req.body.feedback_dieta || 'Ninguno';
                const feedback_ejercicio = req.body.ultimoFeedbackEjercicio || req.body.feedback_ejercicio || 'Ninguno';

                const datosUsuario = await DatosUsuario.create({
                    sexo,
                    altura,
                    peso,
                    lugar_entrenamiento,
                    peso_meta,
                    plazo_semanas,
                    deficit_estimado,
                    imagen,
                    id_usuario: nuevo.id_usuario,
                    semanas_progreso,
                    feedback_dieta,
                    feedback_ejercicio
                });

                // Procesar alergias si se enviaron
                if (req.body.alergias && typeof req.body.alergias === 'string' && req.body.alergias.trim() !== '') {
                    const cleanedAlergias = req.body.alergias.replace(/ Adicional:\s*/i, ', ');
                    const alergiasList = cleanedAlergias
                        .split(',')
                        .map(name => name.trim())
                        .filter(name => name.length > 0 && name.toLowerCase() !== 'ninguna' && name.toLowerCase() !== 'ninguno');

                    if (alergiasList.length > 0) {
                        const alergiaRecords = [];
                        for (const name of alergiasList) {
                            const [alergiaRecord] = await Alergia.findOrCreate({
                                where: { nombre: name }
                            });
                            alergiaRecords.push(alergiaRecord);
                        }
                        // Use correct singular setAlergia helper generated by Sequelize due to pluralization behavior
                        if (typeof datosUsuario.setAlergia === 'function') {
                            await datosUsuario.setAlergia(alergiaRecords);
                        } else if (typeof datosUsuario.setAlergias === 'function') {
                            await datosUsuario.setAlergias(alergiaRecords);
                        }
                    }
                }
            }

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

            const updateFields = {};
            if (correo !== undefined) updateFields.correo = correo;
            if (contrasenia !== undefined) updateFields.contrasenia = contrasenia;
            if (nombre !== undefined) updateFields.nombre = nombre;
            if (edad !== undefined) updateFields.edad = edad;
            if (id_rol !== undefined) updateFields.id_rol = id_rol;

            if (Object.keys(updateFields).length > 0) {
                await usuario.update(updateFields);
            }

            const { DatosUsuario, Perfil, Alergia, DatosUsuarioAlergia } = require('../index');

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
                    datosUsuario = await DatosUsuario.create({ 
                        ...updateData, 
                        id_usuario: id,
                        semanas_progreso: req.body.semanasEnProgreso || 1,
                        feedback_dieta: req.body.ultimoFeedbackDieta || 'Ninguno',
                        feedback_ejercicio: req.body.ultimoFeedbackEjercicio || 'Ninguno',
                        imagen: req.body.imagen || ''
                    });
                }
            }

            // Handle Alergias if present
            if (req.body.alergias !== undefined) {
                if (!datosUsuario) {
                    datosUsuario = await DatosUsuario.create({
                        id_usuario: id,
                        sexo: req.body.sexo || 'm',
                        altura: req.body.altura || 0,
                        peso: req.body.peso || 0,
                        lugar_entrenamiento: req.body.lugarEntrenamiento || 'gym',
                        peso_meta: req.body.pesoMeta || 0,
                        plazo_semanas: req.body.plazoSemanas || 8,
                        deficit_estimado: req.body.deficitEstimado || 450,
                        semanas_progreso: 1,
                        feedback_dieta: 'Ninguno',
                        feedback_ejercicio: 'Ninguno',
                        imagen: ''
                    });
                }

                // Clean up existing associations for this user
                await DatosUsuarioAlergia.destroy({ where: { id_datos_usuario: datosUsuario.id_datos_usuario } });

                const alergiasList = req.body.alergias
                    .split(',')
                    .map(name => name.replace('Adicional:', '').trim())
                    .filter(name => name && name.toLowerCase() !== 'ninguna');

                for (const nombreAlergia of alergiasList) {
                    const [alergia] = await Alergia.findOrCreate({ where: { nombre: nombreAlergia } });
                    await DatosUsuarioAlergia.create({
                        id_datos_usuario: datosUsuario.id_datos_usuario,
                        id_alergia: alergia.id_alergia
                    });
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
                        include: [
                            { model: Alergia },
                            {
                                model: Rutina,
                                include: [{ model: Ejercicio }]
                            }
                        ]
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

            const { Rol, DatosUsuario, Perfil, Rutina, Ejercicio, Alergia } = require('../index');
            const usuario = await Usuario.findOne({ 
                where: { correo },
                include: [
                    { model: Rol },
                    { 
                        model: DatosUsuario,
                        include: [
                            { model: Alergia },
                            {
                                model: Rutina,
                                include: [{ model: Ejercicio }]
                            }
                        ]
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

