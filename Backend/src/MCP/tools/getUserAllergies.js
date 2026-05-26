const { QueryTypes } = require('sequelize');
const db = require('../../config/db');

const getUserAllergies = async (userId) => {

    const rows = await db.query(`
        SELECT a.nombre
        FROM datos_usuario du
        INNER JOIN datos_usuario_alergia dua
            ON dua.id_datos_usuario = du.id_datos_usuario
        INNER JOIN alergia a
            ON a.id_alergia = dua.id_alergia
        WHERE du.id_usuario = :userId
    `, {
        replacements: { userId },
        type: QueryTypes.SELECT
    });

    return rows.map(a => a.nombre);
};

module.exports = getUserAllergies;