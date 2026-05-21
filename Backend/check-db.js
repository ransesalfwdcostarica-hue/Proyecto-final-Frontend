const mysql = require('mysql2/promise');

async function checkData() {
    try {
        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'root123',
            database: 'powerfit'
        });
        const [rows] = await connection.execute("SELECT * FROM usuario;");
        console.log("Usuarios en BD:", rows);
        await connection.end();
    } catch (err) {
        console.log("Error: ", err.message);
    }
}

checkData();
