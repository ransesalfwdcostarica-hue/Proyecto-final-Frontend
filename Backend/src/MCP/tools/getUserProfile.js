const { QueryTypes } = require('sequelize');
const db = require('../../config/db');

const getUserProfile = async (userId) => {

    const rows = await db.query(`
        SELECT 
            u.id_usuario,
            u.nombre,
            u.correo,
            u.edad,
            p.biografia,
            p.foto_perfil,
            p.foto_portada
        FROM usuario u
        LEFT JOIN perfil p 
            ON p.id_usuario = u.id_usuario
        WHERE u.id_usuario = :userId
    `, {
        replacements: { userId },
        type: QueryTypes.SELECT
    });

    return rows[0] || null;
};

module.exports = getUserProfile;