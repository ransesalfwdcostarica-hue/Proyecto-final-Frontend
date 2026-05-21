const mysql = require('mysql2/promise');

async function resetDB() {
    try {
        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'root123'
        });
        await connection.execute("DROP DATABASE IF EXISTS powerfit;");
        await connection.execute("CREATE DATABASE powerfit;");
        console.log("Base de datos 'powerfit' reiniciada desde cero para evitar conflictos de Foreign Keys corruptas.");
        await connection.end();
    } catch (err) {
        console.log("Error: ", err.message);
    }
}

resetDB();
