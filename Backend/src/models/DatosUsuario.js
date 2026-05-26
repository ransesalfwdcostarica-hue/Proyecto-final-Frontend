const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DatosUsuario = sequelize.define('DatosUsuario', {
    id_datos_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    sexo: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    altura: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    peso: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    lugar_entrenamiento: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    peso_meta: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    plazo_semanas: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    deficit_estimado: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    imagen: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    semanas_progreso: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    feedback_dieta: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    feedback_ejercicio: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    rutina_ia: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'datos_usuario',
    timestamps: false
});

module.exports = DatosUsuario;
