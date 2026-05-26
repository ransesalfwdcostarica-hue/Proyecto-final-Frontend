const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MensajeContacto = sequelize.define('MensajeContacto', {
    id_mensaje: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    pais: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'mensaje_contacto',
    timestamps: false
});

module.exports = MensajeContacto;
