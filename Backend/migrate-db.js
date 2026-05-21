const fs = require('fs');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function migrate() {
    try {
        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'root123',
            database: 'powerfit'
        });

        const data = JSON.parse(fs.readFileSync('../FrontEnd/db.json', 'utf8'));
        const usuarios = data.usuarios || [];

        // Asegurar que existan los roles
        await connection.execute("INSERT IGNORE INTO rol (id_rol, nombre, descripcion) VALUES (1, 'admin', 'Administrador'), (2, 'client', 'Cliente')");

        for (const u of usuarios) {
            const id_rol = u.rol === 'admin' ? 1 : 2;
            const salt = await bcrypt.genSalt(10);
            const hashedPwd = await bcrypt.hash(u.password, salt);

            // Insertar usuario
            const [result] = await connection.execute(
                `INSERT INTO usuario (correo, contrasenia, nombre, edad, id_rol) VALUES (?, ?, ?, ?, ?)`,
                [u.email, hashedPwd, u.nombre, parseInt(u.edad) || 18, id_rol]
            );
            
            const userId = result.insertId;

            // Insertar perfil asociado
            await connection.execute(
                `INSERT INTO perfil (id_usuario, biografia, foto_perfil, foto_portada) VALUES (?, ?, ?, ?)`,
                [userId, 'Perfil migrado', u.avatar || '', u.cover || '']
            );
        }

        console.log(`✅ ¡Migración completada! ${usuarios.length} usuarios han sido movidos de db.json a MySQL.`);
        await connection.end();
    } catch (error) {
        console.error("Error en la migración:", error.message);
    }
}

migrate();
