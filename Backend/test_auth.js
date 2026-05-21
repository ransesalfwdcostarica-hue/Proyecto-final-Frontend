const axios = require('axios');
const { sequelize } = require('./src/index');
const Usuario = require('./src/models/Usuario');
const Rol = require('./src/models/Rol');

async function runTest() {
    console.log("=== INICIANDO PRUEBA DE AUTENTICACION JWT ===");
    
    try {
        // 1. Asegurar que existe al menos un Rol con id 1
        await sequelize.authenticate();
        console.log("✔ Conectado a la base de datos para preparar el entorno.");
        
        let rol = await Rol.findByPk(1);
        if (!rol) {
            rol = await Rol.create({
                id_rol: 1,
                nombre: 'Cliente',
                descripcion: 'Rol de prueba'
            });
            console.log("✔ Rol creado exitosamente.");
        } else {
            console.log("✔ Rol con ID 1 ya existe.");
        }

        // 2. Limpiar usuario de prueba anterior si existe
        await Usuario.destroy({ where: { correo: 'test_jwt@powerfit.com' } });
        
        // 3. Registrar un usuario de prueba (petición POST a /api/usuarios)
        console.log("\n--- Probando Registro de Usuario ---");
        const registerResponse = await axios.post('http://localhost:3000/api/usuarios', {
            correo: 'test_jwt@powerfit.com',
            contrasenia: 'segura123',
            nombre: 'Prueba JWT',
            edad: 28,
            id_rol: 1
        });
        
        console.log("✔ Registro exitoso. Respuesta del servidor:", JSON.stringify(registerResponse.data, null, 2));
        if (registerResponse.data.contrasenia) {
            throw new Error("❌ ERROR: El hash de la contraseña fue expuesto en la respuesta del registro!");
        } else {
            console.log("✔ Excelente: La contraseña no fue expuesta en el registro.");
        }

        // 4. Intentar iniciar sesión con contraseña incorrecta
        console.log("\n--- Probando Login con Contraseña Incorrecta ---");
        try {
            await axios.post('http://localhost:3000/api/usuarios/login', {
                correo: 'test_jwt@powerfit.com',
                contrasenia: 'incorrecta123'
            });
            throw new Error("❌ ERROR: ¡El login con contraseña incorrecta fue permitido!");
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log("✔ Éxito: Login denegado correctamente con estado 401:", error.response.data);
            } else {
                throw error;
            }
        }

        // 5. Iniciar sesión con contraseña correcta (petición POST a /api/usuarios/login)
        console.log("\n--- Probando Login con Contraseña Correcta ---");
        const loginResponse = await axios.post('http://localhost:3000/api/usuarios/login', {
            correo: 'test_jwt@powerfit.com',
            contrasenia: 'segura123'
        });

        console.log("✔ Login exitoso. Respuesta del servidor:", JSON.stringify(loginResponse.data, null, 2));
        const token = loginResponse.data.token;
        if (!token) {
            throw new Error("❌ ERROR: ¡No se recibió ningún token JWT en la respuesta!");
        }
        console.log("✔ Token JWT Recibido con éxito.");

        // 6. Probar acceso a ruta protegida (GET /api/usuarios sin token)
        console.log("\n--- Probando Acceso a Ruta Protegida SIN Token ---");
        try {
            await axios.get('http://localhost:3000/api/usuarios');
            throw new Error("❌ ERROR: ¡Se permitió el acceso a ruta protegida sin token!");
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log("✔ Éxito: Acceso denegado con código 401 sin token:", error.response.data);
            } else {
                throw error;
            }
        }

        // 7. Probar acceso a ruta protegida CON token (GET /api/usuarios con cabecera Authorization)
        console.log("\n--- Probando Acceso a Ruta Protegida CON Token ---");
        const getResponse = await axios.get('http://localhost:3000/api/usuarios', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(`✔ Acceso concedido con éxito. Registros devueltos: ${getResponse.data.length || getResponse.data.data.length}`);
        
        // 8. Limpiar base de datos
        await Usuario.destroy({ where: { correo: 'test_jwt@powerfit.com' } });
        console.log("\n✔ Base de datos limpiada. ¡Prueba finalizada exitosamente sin fallos!");

    } catch (error) {
        console.error("❌ LA PRUEBA FALLÓ:", error.message);
        if (error.response) {
            console.error("Respuesta de error del servidor:", error.response.data);
        }
    } finally {
        await sequelize.close();
    }
}

runTest();
