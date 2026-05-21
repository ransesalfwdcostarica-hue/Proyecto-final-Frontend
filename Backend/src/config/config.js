require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

module.exports = {
    development: {
        username: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "powerfit",
        host: process.env.DB_HOST || "localhost",
        dialect: process.env.DB_DIALECT || "mysql"
    },
    db:{
        name: process.env.DB_NAME || "powerfit",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        host: process.env.DB_HOST || "localhost",
        dialect: process.env.DB_DIALECT || "mysql",
        storage: process.env.DB_STORAGE || "./database.sqlite"
    },
    server: {
        port: process.env.PORT || 3000
    },
    jwtSecret: process.env.JWT_SECRET || 'powerfit_jwt_secret_key_2026_default_secure'
}
