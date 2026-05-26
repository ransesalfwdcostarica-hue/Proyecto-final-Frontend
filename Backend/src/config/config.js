require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

module.exports = {
    development: {
<<<<<<< HEAD
        username: process.env.DB_USER || "parrillada",
=======
        username: process.env.DB_USER || "root",
>>>>>>> 2f9846f10d2606fce96d7154245e4461b48792cf
        password: process.env.DB_PASSWORD || "root",
        database: process.env.DB_NAME || "powerfit",
        host: process.env.DB_HOST || "localhost",
        dialect: process.env.DB_DIALECT || "mysql"
    },
<<<<<<< HEAD
=======
    db:{
        name: process.env.DB_NAME || "powerfit",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "root",
        host: process.env.DB_HOST || "localhost",
        dialect: process.env.DB_DIALECT || "mysql",
        storage: process.env.DB_STORAGE || "./database.sqlite"
    },
>>>>>>> 2f9846f10d2606fce96d7154245e4461b48792cf
    server: {
        port: process.env.PORT || 3000
    },
    // Groq API configuration
    groqApiKey: process.env.GROQ_API_KEY || '',
    jwtSecret: process.env.JWT_SECRET || 'powerfit_jwt_secret_key_2026_default_secure'
}
