const fs = require('fs');
const path = require('path');
const { sequelize, MensajeContacto, Usuario } = require('./src/index');

async function seedMensajes() {
    try {
        console.log("Asegurando que la tabla mensaje_contacto tenga id_usuario opcional...");
        try {
            await sequelize.query('ALTER TABLE mensaje_contacto MODIFY id_usuario INT NULL;');
        } catch (e) {
            console.log("Nota: El ALTER TABLE falló o no fue necesario.", e.message);
        }

        console.log("Sincronizando modelos...");
        await sequelize.sync();
        
        const dataPath = path.join(__dirname, '../Front-End/db.json');
        const dbJson = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const mensajes = dbJson.mensajes || [];

        console.log(`Migrando ${mensajes.length} mensajes...`);

        let count = 0;
        for (const msg of mensajes) {
            // Intentamos buscar un id_usuario basado en el email
            const dbUser = await Usuario.findOne({ where: { correo: msg.email } });
            const id_usuario = dbUser ? dbUser.id_usuario : null;

            await MensajeContacto.findOrCreate({
                where: { correo: msg.email, mensaje: msg.mensaje },
                defaults: {
                    nombre: msg.nombre || 'Desconocido',
                    telefono: msg.contacto || '0000',
                    pais: msg.pais || 'No especificado',
                    fecha: msg.fecha ? new Date(msg.fecha) : new Date(),
                    id_usuario: id_usuario
                }
            });
            count++;
        }

        console.log(`✅ ${count} mensajes migrados con éxito.`);
        process.exit(0);
    } catch (error) {
        console.error("Error migrando mensajes:", error);
        process.exit(1);
    }
}

seedMensajes();
