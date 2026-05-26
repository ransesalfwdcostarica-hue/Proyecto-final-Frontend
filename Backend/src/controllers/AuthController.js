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

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userPassword, salt);

            const newUser = await Usuario.create({
                correo: userEmail,
                contrasenia: hashedPassword,
                nombre,
                edad: edad || 18,
                id_rol
            });

            await Perfil.create({
                id_usuario: newUser.id_usuario,
                biografia: 'Nuevo miembro de PowerFit',
                foto_perfil: '',
                foto_portada: ''
            });

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
                        include: [{
                            model: Rutina,
                            include: [{ model: Ejercicio }]
                        }]
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
                    const salt = await bcrypt.genSalt(10);
                    await usuario.update({ contrasenia: await bcrypt.hash(userPassword, salt) });
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
                        include: [{ model: Rutina, include: [{ model: Ejercicio }] }] 
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
