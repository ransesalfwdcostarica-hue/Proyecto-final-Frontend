const { QueryTypes } = require('sequelize');
const db = require('../../config/db');

const getUserRoutine = async (userId) => {

    const rows = await db.query(`
        SELECT
            re.id_rutina,
            re.id_ejercicio,
            e.nombre AS nombre_ejercicio,
            e.musculo,
            e.nivel,
            re.repeticiones,
            re.sets,
            re.tiempo_entre_sets
        FROM rutina r
        INNER JOIN rutina_ejercicio re
            ON re.id_rutina = r.id_rutina
        INNER JOIN ejercicio e
            ON e.id_ejercicio = re.id_ejercicio
        INNER JOIN datos_usuario du
            ON du.id_datos_usuario = r.id_datos_usuario
        WHERE du.id_usuario = :userId
    `, {
        replacements: { userId },
        type: QueryTypes.SELECT
    });

    return rows;
};

module.exports = getUserRoutine;