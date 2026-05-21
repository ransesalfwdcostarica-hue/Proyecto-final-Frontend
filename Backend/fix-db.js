const mysql = require('mysql2/promise');

async function fixTable() {
    try {
        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'root123',
            database: 'powerfit'
        });
        await connection.execute("ALTER TABLE usuario MODIFY contrasenia VARCHAR(255) NOT NULL;");
        console.log("Columna contrasenia actualizada a VARCHAR(255)");
        
        await connection.end();
    } catch (err) {
        console.log("Error manual: ", err.message);
    }
}

fixTable();
