const { Rol } = require('./index');

async function main() {
    try {
        const roles = await Rol.findAll();
        console.log('Roles:');
        roles.forEach(r => {
            console.log(`- ID: ${r.id_rol}, Name: ${r.nombre}, Description: ${r.descripcion}`);
        });
    } catch (e) {
        console.error(e);
    }
}

main();
