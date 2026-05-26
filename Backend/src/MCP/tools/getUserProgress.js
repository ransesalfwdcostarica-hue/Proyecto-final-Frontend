const { QueryTypes } = require('sequelize');
const db = require('../../config/db');

const getUserProgress = async (userId) => {

    const rows = await db.query(`
        SELECT
            peso,
            peso_meta,
            plazo_semanas,
            semanas_progreso,
            deficit_estimado
        FROM datos_usuario
        WHERE id_usuario = :userId
    `, {
        replacements: { userId },
        type: QueryTypes.SELECT
    });

    if (!rows.length) {
        return null;
    }

    const data = rows[0];

    const pesoActual = Number(data.peso);
    const pesoMeta = Number(data.peso_meta);

    const diferencia = pesoActual - pesoMeta;

    const semanasRestantes =
        data.plazo_semanas - data.semanas_progreso;

    return {
        peso_actual: pesoActual,
        peso_meta: pesoMeta,
        diferencia_peso: diferencia,
        semanas_restantes: semanasRestantes,
        deficit_estimado: data.deficit_estimado
    };
};

module.exports = getUserProgress;