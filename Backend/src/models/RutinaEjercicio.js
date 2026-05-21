const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RutinaEjercicio = sequelize.define('RutinaEjercicio', {
    id_rutina: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_ejercicio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    repeticiones: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 12
    },
    sets: {
        type: DataTypes.STRING(45),
        allowNull: false,
        defaultValue: '4'
    },
    tiempo_entre_sets: {
        type: DataTypes.STRING(45),
        allowNull: false,
        defaultValue: '60'
    }
}, {
    tableName: 'rutina_ejercicio',
    timestamps: false
});

module.exports = RutinaEjercicio;
