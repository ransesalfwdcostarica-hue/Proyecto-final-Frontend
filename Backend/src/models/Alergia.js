const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Alergia = sequelize.define('Alergia', {
    id_alergia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'alergia',
    timestamps: false
});

module.exports = Alergia;