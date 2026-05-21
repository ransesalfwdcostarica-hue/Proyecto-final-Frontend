const mysql = require('mysql2/promise');

async function testPasswords() {
    const passwords = ['', 'root', '1234', '123456', 'admin', 'password', 'mysql'];
    
    for (const pwd of passwords) {
        try {
            const connection = await mysql.createConnection({
                host: '127.0.0.1',
                user: 'root',
                password: pwd
            });
            console.log(`✅ Success with password: "${pwd}"`);
            await connection.end();
            return pwd;
        } catch (err) {
            console.log(`❌ Failed with password: "${pwd}" - ${err.message}`);
        }
    }
    console.log('No common password worked.');
}

testPasswords();
