const { Sequelize } = require('sequelize');
const config = require('./config');

let sequelize;

if (process.env.NODE_ENV === 'test') {
    // Usar SQLite en memoria para pruebas automatizadas (aisladas y rápidas)
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false
    });
} else {
    sequelize = new Sequelize(
        config.db.name,
        config.db.user,
        config.db.password, 
        {
            host: config.db.host,
            dialect: config.db.dialect,
            storage: config.db.storage,
            logging: console.log
        }
    );
}

module.exports = sequelize;
