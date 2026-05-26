require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });
  
  const [rows] = await connection.query('SHOW DATABASES;');
  console.log(rows);
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
