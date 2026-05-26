require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkData() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'powerfit'
        });
        console.log("✅ Conexión exitosa a MySQL.");
        
        const [rows] = await connection.execute("SELECT * FROM usuario;");
        console.log(`📊 Usuarios encontrados: ${rows.length}`);
        console.table(rows);

        await connection.end();
    } catch (err) {
        console.error("❌ Error de diagnóstico:", err.code === 'ECONNREFUSED' ? "No se pudo conectar al servidor MySQL (¿Está encendido?)" : err.message);
    }
}

checkData();
