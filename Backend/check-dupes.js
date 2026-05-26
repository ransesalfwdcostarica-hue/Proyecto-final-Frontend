const mysql = require('mysql2/promise');

async function checkDupes() {
    try {
        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'root123',
            database: 'powerfit'
        });

        const [rows] = await connection.execute("SELECT id_usuario, correo, nombre FROM usuario;");
        console.log("Usuarios actuales:");
        console.table(rows);
        await connection.end();
    } catch (error) {
        console.error("Error:", error.message);
    }
}

checkDupes();
