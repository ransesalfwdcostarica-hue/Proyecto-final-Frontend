const mysql = require('mysql2/promise');

async function checkPublicaciones() {
    try {
        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'root123',
            database: 'powerfit'
        });
        const [rows] = await connection.execute("SELECT * FROM publicacion;");
        console.log("Publicaciones en MySQL:", rows);
        await connection.end();
    } catch (err) {
        console.log("Error: ", err.message);
    }
}

checkPublicaciones();
