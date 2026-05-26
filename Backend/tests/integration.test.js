/**
 * @file integration.test.js
 * @description Suite de pruebas de integración utilizando Supertest para verificar el comportamiento
 * de los endpoints de la API de Express de PowerFit.
 * Valida los códigos de respuesta HTTP, las respuestas en formato JSON, el manejo de errores y escenarios fallidos.
 */

const request = require('supertest');
const app = require('../src/app');
const { sequelize, Rol, Usuario, Alergia, DatosUsuario, Perfil } = require('../src/index');

// Establecemos el entorno a 'test'
process.env.NODE_ENV = 'test';

describe('Suite de Pruebas de Integración de Endpoints API (PowerFit)', () => {
    let testRol;
    let createdUser;
    let userToken; // Para compatibilidad con JWT
    let testAlergia;

    // Inicializar y sincronizar base de datos limpia en memoria antes de comenzar
    beforeAll(async () => {
        await sequelize.sync({ force: true });

        // Crear rol admin para poder probar todas las rutas incluyendo las restringidas
        testRol = await Rol.create({
            nombre: 'admin',
            descripcion: 'Usuario administrador del sistema de pruebas'
        });
    });

    // Cerrar base de datos tras las pruebas
    afterAll(async () => {
        await sequelize.close();
    });

    /* ==========================================================================
       SECCIÓN 1: PRUEBAS PARA /api/usuarios
       ========================================================================== */
    describe('1. Endpoints: /api/usuarios', () => {

        // Escenario Exitoso: Registro de usuario
        test('POST /api/usuarios - Debería registrar un nuevo usuario exitosamente (Código 201)', async () => {
            const res = await request(app)
                .post('/api/usuarios')
                .send({
                    correo: 'test.user@powerfit.com',
                    contrasenia: 'password123',
                    nombre: 'Test User',
                    edad: 25,
                    id_rol: testRol.id_rol
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('id_usuario');
            expect(res.body.correo).toBe('test.user@powerfit.com');
            expect(res.body.nombre).toBe('Test User');
            createdUser = res.body; // Guardamos el usuario creado para pruebas posteriores
        });

        // Escenario de Fallo: Datos faltantes
        test('POST /api/usuarios - Debería fallar si faltan campos obligatorios (Código 400)', async () => {
            const res = await request(app)
                .post('/api/usuarios')
                .send({
                    correo: 'incomplete@powerfit.com'
                    // Falta contrasenia y nombre
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toContain('requerido');
        });

        // Escenario Exitoso: Iniciar Sesión (Login)
        test('POST /api/usuarios/login - Debería iniciar sesión correctamente con credenciales válidas (Código 200)', async () => {
            const res = await request(app)
                .post('/api/usuarios/login')
                .send({
                    correo: 'test.user@powerfit.com',
                    contrasenia: 'password123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.usuario).toHaveProperty('id_usuario');
            expect(res.body.usuario.correo).toBe('test.user@powerfit.com');
            expect(res.body.usuario).toHaveProperty('Rol');
            expect(res.body.usuario.Rol.nombre).toBe('admin');
            
            userToken = res.body.token; // Guardamos el token para peticiones protegidas
        });

        // Escenario de Fallo: Login con contraseña incorrecta
        test('POST /api/usuarios/login - Debería denegar el acceso si la contraseña es incorrecta (Código 401)', async () => {
            const res = await request(app)
                .post('/api/usuarios/login')
                .send({
                    correo: 'test.user@powerfit.com',
                    contrasenia: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toBe('Credenciales inválidas');
        });

        // Escenario Exitoso: Obtener todos los usuarios
        test('GET /api/usuarios - Debería listar todos los usuarios registrados (Código 200)', async () => {
            const res = await request(app)
                .get('/api/usuarios')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });

        // Escenario Exitoso: Obtener usuario por ID
        test('GET /api/usuarios/:id - Debería retornar los detalles del usuario existente (Código 200)', async () => {
            const res = await request(app)
                .get(`/api/usuarios/${createdUser.id_usuario}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.id_usuario).toBe(createdUser.id_usuario);
            expect(res.body.nombre).toBe(createdUser.nombre);
        });

        // Escenario de Fallo: Obtener usuario inexistente
        test('GET /api/usuarios/:id - Debería responder 404 para un usuario inexistente', async () => {
            const res = await request(app)
                .get('/api/usuarios/99999')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Usuario no encontrado');
        });

        // Escenario Exitoso: Actualizar usuario
        test('PUT /api/usuarios/:id - Debería actualizar los datos del usuario correctamente (Código 200)', async () => {
            // Inicializar DatosUsuario y Perfil para evitar errores de validación de campos obligatorios en SQLite
            await DatosUsuario.create({
                sexo: 'Masculino',
                altura: 1.75,
                peso: 80.0,
                lugar_entrenamiento: 'Casa',
                peso_meta: 75.0,
                plazo_semanas: 12,
                deficit_estimado: 400,
                imagen: 'inicial.png',
                id_usuario: createdUser.id_usuario,
                semanas_progreso: 0,
                feedback_dieta: 'Ninguno',
                feedback_ejercicio: 'Ninguno'
            });

            await Perfil.create({
                foto_perfil: 'avatar.png',
                foto_portada: 'banner.jpg',
                biografia: 'Miembro de PowerFit',
                id_usuario: createdUser.id_usuario
            });

            const res = await request(app)
                .put(`/api/usuarios/${createdUser.id_usuario}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    correo: 'test.updated@powerfit.com',
                    contrasenia: 'newpassword123',
                    nombre: 'Updated Name',
                    edad: 26,
                    id_rol: testRol.id_rol,
                    peso: 85.0,
                    altura: 1.80,
                    avatar: 'updated_avatar.png'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.nombre).toBe('Updated Name');
            expect(res.body.correo).toBe('test.updated@powerfit.com');
            expect(res.body.DatosUsuario).toBeDefined();
            expect(res.body.Perfil).toBeDefined();
            expect(res.body.Perfil.foto_perfil).toBe('updated_avatar.png');
        });

        // Escenario de Fallo: Actualización con datos faltantes
        test('PUT /api/usuarios/:id - Debería fallar la actualización si faltan campos requeridos (Código 400)', async () => {
            const res = await request(app)
                .put(`/api/usuarios/${createdUser.id_usuario}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    nombre: 'Update Incompleto'
                    // Falta correo y contrasenia
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toContain('requerido');
        });
    });

    /* ==========================================================================
       SECCIÓN 2: PRUEBAS PARA /api/alergias
       ========================================================================== */
    describe('2. Endpoints: /api/alergias', () => {

        // Escenario Exitoso: Crear alergia
        test('POST /api/alergias - Debería registrar una nueva alergia (Código 201)', async () => {
            const res = await request(app)
                .post('/api/alergias')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    nombre: 'Lactosa'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('id_alergia');
            expect(res.body.nombre).toBe('Lactosa');
            testAlergia = res.body;
        });

        // Escenario de Fallo: Intentar crear sin nombre
        test('POST /api/alergias - Debería denegar la creación si falta el nombre (Código 400)', async () => {
            const res = await request(app)
                .post('/api/alergias')
                .set('Authorization', `Bearer ${userToken}`)
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toBe('El nombre es requerido');
        });

        // Escenario Exitoso: Obtener alergias
        test('GET /api/alergias - Debería listar todas las alergias (Código 200)', async () => {
            const res = await request(app)
                .get('/api/alergias');

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });

        // Escenario Exitoso: Actualizar alergia
        test('PUT /api/alergias/:id - Debería editar la alergia de forma exitosa (Código 200)', async () => {
            const res = await request(app)
                .put(`/api/alergias/${testAlergia.id_alergia}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    nombre: 'Lácteos e Intolerancia'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.nombre).toBe('Lácteos e Intolerancia');
        });

        // Escenario de Fallo: Borrar alergia no existente
        test('DELETE /api/alergias/:id - Debería retornar 404 para una alergia inexistente', async () => {
            const res = await request(app)
                .delete('/api/alergias/99999')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Alergia no encontrado');
        });

        // Escenario Exitoso: Eliminar alergia
        test('DELETE /api/alergias/:id - Debería borrar la alergia correctamente (Código 200)', async () => {
            const res = await request(app)
                .delete(`/api/alergias/${testAlergia.id_alergia}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Alergia eliminado correctamente');
        });
    });

    /* ==========================================================================
       SECCIÓN 3: TEARDOWN Y LIMPIEZA DE USUARIOS
       ========================================================================== */
    describe('3. Teardown: Eliminación del usuario de pruebas', () => {
        test('DELETE /api/usuarios/:id - Debería eliminar el usuario de pruebas al final (Código 200)', async () => {
            const res = await request(app)
                .delete(`/api/usuarios/${createdUser.id_usuario}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Usuario eliminado correctamente');
        });

        test('GET /api/usuarios/:id - Debería responder 404 después de ser eliminado', async () => {
            const res = await request(app)
                .get(`/api/usuarios/${createdUser.id_usuario}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(404);
        });
    });
});
