const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario, Rol, Perfil, DatosUsuario, Rutina, Ejercicio } = require('../index');
const config = require('../config/config');

const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id_usuario, 
            id_usuario: user.id_usuario,
            correo: user.correo, 
            id_rol: user.id_rol,
            rol: user.Rol?.nombre || 'client'
        },
        config.jwtSecret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

const AuthController = {

    register: async (req, res) => {
        try {
            const { correo, email, contrasenia, password, nombre, edad } = req.body;
            const userEmail = correo || email;
            const userPassword = contrasenia || password;

            if (!userEmail || !userPassword || !nombre) {
                return res.status(400).json({ error: 'Los campos correo, contraseña y nombre son obligatorios.' });
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
                return res.status(400).json({ error: 'El formato del correo no es válido.' });
            }
            if (userPassword.length < 6) {
                return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
            }

            const existingUser = await Usuario.findOne({ where: { correo: userEmail } });
            if (existingUser) {
                return res.status(409).json({ error: 'Ya existe una cuenta registrada con ese correo.' });
            }

            let clientRol = await Rol.findOne({ where: { nombre: 'client' } });
            if (!clientRol) {
                clientRol = await Rol.create({ nombre: 'client', descripcion: 'Usuario cliente' });
            }
            const id_rol = clientRol.id_rol;

            const newUser = await Usuario.create({
                correo: userEmail,
                contrasenia: userPassword,
                nombre,
                edad: edad || 18,
                id_rol
            });

            const isFullRegistration = req.body.sexo !== undefined || req.body.peso !== undefined || req.body.altura !== undefined;
            const { Alergia } = require('../index');
            
            if (isFullRegistration) {
                const foto_perfil = req.body.avatar || req.body.foto_perfil || '';
                const foto_portada = req.body.cover || req.body.foto_portada || '';
                const biografia = req.body.biografia || 'Nuevo miembro de PowerFit';
                
                await Perfil.create({
                    foto_perfil,
                    foto_portada,
                    biografia,
                    id_usuario: newUser.id_usuario
                });

                const sexo = req.body.sexo || 'Masculino';
                const altura = req.body.altura !== undefined ? Number(req.body.altura) : 1.70;
                const peso = req.body.peso !== undefined ? Number(req.body.peso) : 70.0;
                const lugar_entrenamiento = req.body.lugarEntrenamiento || req.body.lugar_entrenamiento || 'Casa';
                const peso_meta = req.body.pesoMeta !== undefined ? Number(req.body.pesoMeta) : 70.0;
                const plazo_semanas = req.body.plazoSemanas !== undefined ? Number(req.body.plazoSemanas) : 8;
                const deficit_estimado = req.body.deficitEstimado !== undefined ? Number(req.body.deficitEstimado) : 450;
                const imagen = req.body.imagen || '';
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
                    id_usuario: newUser.id_usuario,
                    semanas_progreso,
                    feedback_dieta,
                    feedback_ejercicio
                });

                if (req.body.alergias) {
                    let alergiasList = [];
                    const rawAlergias = req.body.alergias;

                    if (Array.isArray(rawAlergias)) {
                        // Frontend sent an array of allergy names
                        alergiasList = rawAlergias.map(name => String(name).trim()).filter(n => n.length > 0);
                    } else if (typeof rawAlergias === 'string' && rawAlergias.trim() !== '') {
                        // Use '||' pipe delimiter (new format) if present, otherwise fall back to comma
                        const delimiter = rawAlergias.includes('||') ? '||' : ',';
                        const cleaned = rawAlergias.replace(/ Adicional:\s*/i, delimiter === '||' ? '||' : ', ');
                        alergiasList = cleaned
                            .split(delimiter)
                            .map(name => name.trim())
                            .filter(name => name.length > 0);
                    }

                    // Remove "Ninguna" / "Ninguno" entries
                    alergiasList = alergiasList.filter(name => 
                        name.toLowerCase() !== 'ninguna' && name.toLowerCase() !== 'ninguno'
                    );

                    if (alergiasList.length > 0) {
                        const alergiaRecords = [];
                        for (const name of alergiasList) {
                            const [alergiaRecord] = await Alergia.findOrCreate({ where: { nombre: name } });
                            alergiaRecords.push(alergiaRecord);
                        }
                        if (typeof datosUsuario.setAlergia === 'function') {
                            await datosUsuario.setAlergia(alergiaRecords);
                        } else if (typeof datosUsuario.setAlergias === 'function') {
                            await datosUsuario.setAlergias(alergiaRecords);
                        }
                    }
                }
            } else {
                await Perfil.create({
                    id_usuario: newUser.id_usuario,
                    biografia: 'Nuevo miembro de PowerFit',
                    foto_perfil: '',
                    foto_portada: ''
                });
            }

            const token = generateToken(newUser);

            res.status(201).json({
                message: '¡Registro exitoso! Bienvenido a PowerFit.',
                token,
                usuario: {
                    id: newUser.id_usuario,
                    correo: newUser.correo,
                    nombre: newUser.nombre,
                    edad: newUser.edad,
                    rol: clientRol?.nombre || 'client'
                }
            });
        } catch (error) {
            console.error('Error en registro:', error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({ error: 'Ya existe una cuenta registrada con ese correo.' });
            }
            res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { correo, email, contrasenia, password } = req.body;
            const userEmail = correo || email;
            const userPassword = contrasenia || password;

            if (!userEmail || !userPassword) {
                return res.status(400).json({ error: 'El correo y la contraseña son obligatorios.' });
            }

            const { Rol, Perfil, DatosUsuario, Rutina, Ejercicio, Alergia } = require('../index');
            const usuario = await Usuario.findOne({
                where: { correo: userEmail },
                include: [
                    { model: Rol },
                    { 
                        model: Perfil,
                        include: [
                            { model: Perfil, as: 'Followers' },
                            { model: Perfil, as: 'Following' }
                        ]
                    },
                    { 
                        model: DatosUsuario,
                        include: [
                            { model: Alergia },
                            {
                                model: Rutina,
                                include: [{ model: Ejercicio }]
                            }
                        ]
                    }
                ]
            });

            if (!usuario) {
                return res.status(401).json({ error: 'Credenciales inválidas. Verifica tu correo y contraseña.' });
            }

            let isValid = false;
            if (usuario.contrasenia.startsWith('$2')) {
                isValid = await bcrypt.compare(userPassword, usuario.contrasenia);
            } else {
                isValid = (userPassword === usuario.contrasenia);
                if (isValid) {
                    await usuario.update({ contrasenia: userPassword });
                }
            }

            if (!isValid) {
                return res.status(401).json({ error: 'Credenciales inválidas. Verifica tu correo y contraseña.' });
            }

            const token = generateToken(usuario);

            const getEjerciciosElegidos = (userInst) => {
                const list = [];
                const du = userInst.DatosUsuario;
                if (!du) return list;
                const rutinas = du.Rutinas || (du.Rutina ? [du.Rutina] : []);
                for (const r of rutinas) {
                    const ejs = r.Ejercicios || (r.Ejercicio ? (Array.isArray(r.Ejercicio) ? r.Ejercicio : [r.Ejercicio]) : []);
                    for (const e of ejs) {
                        list.push(e.id_ejercicio);
                    }
                }
                return list;
            };

            // Duplicate token declaration removed; token already defined above
            // res.status(200).json({

            res.status(200).json({
                message: 'Inicio de sesión exitoso.',
                token,
                usuario: {
                    id: usuario.id_usuario,
                    correo: usuario.correo,
                    nombre: usuario.nombre,
                    edad: usuario.edad,
                    id_rol: usuario.id_rol,
                    rol: usuario.Rol?.nombre || 'client',
                    avatar: usuario.Perfil?.foto_perfil || '',
                    cover: usuario.Perfil?.foto_portada || '',
                    DatosUsuario: usuario.DatosUsuario || null,
                    following: (usuario.Perfil?.Following || []).map(p => p.id_usuario),
                    followers: (usuario.Perfil?.Followers || []).map(p => p.id_usuario),
                    ejerciciosElegidos: getEjerciciosElegidos(usuario)
                }
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
        }
    },

    me: async (req, res) => {
        try {
            const userId = req.user?.id || req.usuario?.id || req.user?.id_usuario || req.usuario?.id_usuario;
            const { Rol, Perfil, DatosUsuario, Rutina, Ejercicio, Alergia } = require('../index');
            const usuario = await Usuario.findByPk(userId, {
                include: [
                    { model: Rol },
                    { 
                        model: Perfil,
                        include: [
                            { model: Perfil, as: 'Followers' },
                            { model: Perfil, as: 'Following' }
                        ]
                    },
                    { 
                        model: DatosUsuario, 
                        include: [
                            { model: Alergia },
                            { model: Rutina, include: [{ model: Ejercicio }] }
                        ] 
                    }
                ]
            });

            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado.' });
            }

            const getEjerciciosElegidos = (userInst) => {
                const list = [];
                const du = userInst.DatosUsuario;
                if (!du) return list;
                const rutinas = du.Rutinas || (du.Rutina ? [du.Rutina] : []);
                for (const r of rutinas) {
                    const ejs = r.Ejercicios || (r.Ejercicio ? (Array.isArray(r.Ejercicio) ? r.Ejercicio : [r.Ejercicio]) : []);
                    for (const e of ejs) {
                        list.push(e.id_ejercicio);
                    }
                }
                return list;
            };

            res.status(200).json({
                id: usuario.id_usuario,
                correo: usuario.correo,
                nombre: usuario.nombre,
                edad: usuario.edad,
                id_rol: usuario.id_rol,
                rol: usuario.Rol?.nombre || 'client',
                avatar: usuario.Perfil?.foto_perfil || '',
                cover: usuario.Perfil?.foto_portada || '',
                DatosUsuario: usuario.DatosUsuario || null,
                following: (usuario.Perfil?.Following || []).map(p => p.id_usuario),
                followers: (usuario.Perfil?.Followers || []).map(p => p.id_usuario),
                ejerciciosElegidos: getEjerciciosElegidos(usuario)
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = AuthController;
