const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Reporte = sequelize.define('Reporte', {
    id_reporte: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_publicacion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_razon: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    fecha_hora: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'reporte',
    timestamps: false
});

module.exports = Reporte;
