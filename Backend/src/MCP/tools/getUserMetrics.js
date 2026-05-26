const { QueryTypes } = require('sequelize');
const db = require('../../config/db');

const getUserMetrics = async (userId) => {

    const rows = await db.query(`
        SELECT
            du.altura,
            du.peso,
            du.peso_meta,
            du.plazo_semanas,
            du.semanas_progreso,
            du.deficit_estimado,
            du.feedback_dieta,
            du.feedback_ejercicio,
            du.lugar_entrenamiento,
            du.sexo
        FROM datos_usuario du
        WHERE du.id_usuario = :userId
    `, {
        replacements: { userId },
        type: QueryTypes.SELECT
    });

    return rows[0] || null;
};

module.exports = getUserMetrics;