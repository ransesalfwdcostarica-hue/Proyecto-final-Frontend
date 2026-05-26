const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Ejercicio = sequelize.define('Ejercicio', {
    id_ejercicio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    nivel: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    musculo: {
        type: DataTypes.STRING(120),
        allowNull: false
    },
    video: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    imagen: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tiempo: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    categoria: {
        type: DataTypes.STRING(120),
        allowNull: true
    },
    repeticiones: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    series: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    }
}, {
    tableName: 'ejercicio',
    timestamps: false
});

module.exports = Ejercicio;
