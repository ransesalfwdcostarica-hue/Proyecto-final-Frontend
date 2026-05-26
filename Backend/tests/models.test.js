/**
 * @file models.test.js
 * @description Suite de pruebas unitarias y de integración para todos los modelos de Sequelize del backend de PowerFit.
 * Garantiza que las tablas se creen correctamente en la base de datos de pruebas (SQLite en memoria),
 * que se respeten los tipos de datos, constraints y asociaciones relacionales.
 * 
 * Requisito: Al menos 3 pruebas por cada uno de los 23 modelos del sistema.
 */

const {
    sequelize,
    Usuario,
    Rol,
    Perfil,
    PerfilSeguidores,
    Publicacion,
    CategoriaPublicacion,
    Like,
    Comentario,
    PublicacionComentario,
    LikePublicacion,
    Contribuidor,
    RolContribuidor,
    TemaEnTendencia,
    Reporte,
    RazonReporte,
    DetalleRazonReporte,
    MensajeContacto,
    DatosUsuario,
    Alergia,
    DatosUsuarioAlergia,
    Rutina,
    Ejercicio,
    RutinaEjercicio
} = require('../src/index');

// Cambiamos el entorno a 'test' para asegurar el uso de SQLite en memoria
process.env.NODE_ENV = 'test';

describe('Suite de Pruebas para Modelos de Sequelize (PowerFit)', () => {
    
    // Sincronizar todos los modelos antes de comenzar la ejecución de las pruebas
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    // Cerrar la conexión de la base de datos al finalizar todas las pruebas para evitar hilos abiertos
    afterAll(async () => {
        await sequelize.close();
    });

    // Variables compartidas para mantener integridad relacional durante las pruebas
    let sharedRol;
    let sharedUsuario;
    let sharedUsuario2;
    let sharedPerfil;
    let sharedPerfil2;
    let sharedCategoria;
    let sharedPublicacion;
    let sharedLike;
    let sharedComentario;
    let sharedRolContribuidor;
    let sharedDetalleRazon;
    let sharedRazon;
    let sharedDatosUsuario;
    let sharedAlergia;
    let sharedRutina;
    let sharedEjercicio;

    /* ==========================================================================
       1. MODELO: Rol
       ========================================================================== */
    describe('1. Modelo: Rol', () => {
        test('Debería crear un Rol válido correctamente con sus propiedades', async () => {
            sharedRol = await Rol.create({
                nombre: 'Cliente',
                descripcion: 'Usuario regular del sistema'
            });
            expect(sharedRol.id_rol).toBeDefined();
            expect(sharedRol.nombre).toBe('Cliente');
            expect(sharedRol.descripcion).toBe('Usuario regular del sistema');
        });

        test('Debería lanzar un error de validación si falta un campo obligatorio (nombre)', async () => {
            await expect(Rol.create({
                descripcion: 'Sin nombre'
            })).rejects.toThrow();
        });

        test('Debería permitir buscar y actualizar las propiedades del Rol', async () => {
            const rol = await Rol.findByPk(sharedRol.id_rol);
            expect(rol).not.toBeNull();
            await rol.update({ nombre: 'Cliente Premium' });
            expect(rol.nombre).toBe('Cliente Premium');
        });
    });

    /* ==========================================================================
       2. MODELO: Usuario
       ========================================================================== */
    describe('2. Modelo: Usuario', () => {
        test('Debería crear un Usuario válido asociado al Rol', async () => {
            sharedUsuario = await Usuario.create({
                correo: 'juan.perez@powerfit.com',
                contrasenia: '123456',
                nombre: 'Juan Perez',
                edad: 28,
                id_rol: sharedRol.id_rol
            });
            expect(sharedUsuario.id_usuario).toBeDefined();
            expect(sharedUsuario.correo).toBe('juan.perez@powerfit.com');
            expect(sharedUsuario.id_rol).toBe(sharedRol.id_rol);

            // Usuario secundario para pruebas de seguidores
            sharedUsuario2 = await Usuario.create({
                correo: 'maria.gomez@powerfit.com',
                contrasenia: 'password',
                nombre: 'Maria Gomez',
                edad: 25,
                id_rol: sharedRol.id_rol
            });
        });

        test('Debería fallar al crear un usuario con un correo existente (Unique Constraint)', async () => {
            await expect(Usuario.create({
                correo: 'juan.perez@powerfit.com',
                contrasenia: 'password',
                nombre: 'Duplicado',
                edad: 30,
                id_rol: sharedRol.id_rol
            })).rejects.toThrow();
        });

        test('Debería poder buscar el usuario por PK e incluir su Rol', async () => {
            const user = await Usuario.findByPk(sharedUsuario.id_usuario, {
                include: [{ model: Rol }]
            });
            expect(user).not.toBeNull();
            expect(user.Rol).toBeDefined();
            expect(user.Rol.id_rol).toBe(sharedRol.id_rol);
        });
    });

    /* ==========================================================================
       3. MODELO: Perfil
       ========================================================================== */
    describe('3. Modelo: Perfil', () => {
        test('Debería crear un Perfil de usuario correctamente', async () => {
            sharedPerfil = await Perfil.create({
                foto_perfil: 'avatar.png',
                foto_portada: 'banner.jpg',
                biografia: 'Atleta y entusiasta del fitness',
                id_usuario: sharedUsuario.id_usuario
            });
            expect(sharedPerfil.id_perfil).toBeDefined();
            expect(sharedPerfil.id_usuario).toBe(sharedUsuario.id_usuario);

            // Perfil para usuario 2
            sharedPerfil2 = await Perfil.create({
                foto_perfil: 'avatar2.png',
                foto_portada: 'banner2.jpg',
                biografia: 'Entrenadora profesional',
                id_usuario: sharedUsuario2.id_usuario
            });
        });

        test('Debería fallar al crear un perfil sin el campo obligatorio (id_usuario)', async () => {
            await expect(Perfil.create({
                biografia: 'Sin usuario asociado'
            })).rejects.toThrow();
        });

        test('Debería poder actualizar la biografía del perfil', async () => {
            const perfil = await Perfil.findByPk(sharedPerfil.id_perfil);
            await perfil.update({ biografia: 'Cambiando mi biografia fitness' });
            expect(perfil.biografia).toBe('Cambiando mi biografia fitness');
        });
    });

    /* ==========================================================================
       4. MODELO: PerfilSeguidores
       ========================================================================== */
    describe('4. Modelo: PerfilSeguidores (Tabla Puente)', () => {
        test('Debería poder registrar una relación de seguimiento', async () => {
            const seguimiento = await PerfilSeguidores.create({
                id_perfil: sharedPerfil.id_perfil,
                id_seguidor: sharedPerfil2.id_perfil
            });
            expect(seguimiento.id_perfil).toBe(sharedPerfil.id_perfil);
            expect(seguimiento.id_seguidor).toBe(sharedPerfil2.id_perfil);
        });

        test('Debería fallar si los IDs de perfil o seguidor no son proporcionados', async () => {
            await expect(PerfilSeguidores.create({
                id_perfil: sharedPerfil.id_perfil
            })).rejects.toThrow();
        });

        test('Debería poder consultar los seguidores a través de la asociación en el modelo Perfil', async () => {
            const perfilConSeguidores = await Perfil.findByPk(sharedPerfil2.id_perfil, {
                include: [{ model: Perfil, as: 'Followers' }]
            });
            expect(perfilConSeguidores.Followers).toBeDefined();
            expect(perfilConSeguidores.Followers.length).toBeGreaterThan(0);
        });
    });

    /* ==========================================================================
       5. MODELO: CategoriaPublicacion
       ========================================================================== */
    describe('5. Modelo: CategoriaPublicacion', () => {
        test('Debería crear una Categoría de publicación válida', async () => {
            sharedCategoria = await CategoriaPublicacion.create({
                nombre: 'Nutrición'
            });
            expect(sharedCategoria.id_categoria).toBeDefined();
            expect(sharedCategoria.nombre).toBe('Nutrición');
        });

        test('Debería fallar al crear una categoría sin nombre', async () => {
            await expect(CategoriaPublicacion.create({})).rejects.toThrow();
        });

        test('Debería poder listar todas las categorías existentes', async () => {
            const list = await CategoriaPublicacion.findAll();
            expect(list.length).toBeGreaterThan(0);
        });
    });

    /* ==========================================================================
       6. MODELO: Publicacion
       ========================================================================== */
    describe('6. Modelo: Publicacion', () => {
        test('Debería crear una Publicacion asociada a un usuario y categoría', async () => {
            sharedPublicacion = await Publicacion.create({
                tiempo: 'Hace 5 minutos',
                titulo: 'Mi primera receta saludable',
                texto: 'Hoy preparé una deliciosa avena con chía...',
                imagen: 'receta.jpg',
                id_categoria: sharedCategoria.id_categoria,
                id_usuario: sharedUsuario.id_usuario
            });
            expect(sharedPublicacion.id_publicacion).toBeDefined();
            expect(sharedPublicacion.titulo).toBe('Mi primera receta saludable');
        });

        test('Debería lanzar error si falta el contenido textual (texto)', async () => {
            await expect(Publicacion.create({
                tiempo: 'Ahora',
                titulo: 'Sin contenido',
                imagen: 'sin_imagen.jpg',
                id_categoria: sharedCategoria.id_categoria,
                id_usuario: sharedUsuario.id_usuario
            })).rejects.toThrow();
        });

        test('Debería permitir buscar la publicación e incluir su Categoría y Usuario', async () => {
            const pub = await Publicacion.findByPk(sharedPublicacion.id_publicacion, {
                include: [
                    { model: CategoriaPublicacion },
                    { model: Usuario }
                ]
            });
            expect(pub).not.toBeNull();
            expect(pub.CategoriaPublicacion.nombre).toBe('Nutrición');
            expect(pub.Usuario.nombre).toBe('Juan Perez');
        });
    });

    /* ==========================================================================
       7. MODELO: Like
       ========================================================================== */
    describe('7. Modelo: Like', () => {
        test('Debería registrar un Like asociado a un usuario', async () => {
            sharedLike = await Like.create({
                id_usuario: sharedUsuario.id_usuario
            });
            expect(sharedLike.id_like).toBeDefined();
            expect(sharedLike.id_usuario).toBe(sharedUsuario.id_usuario);
        });

        test('Debería fallar al crear un like sin usuario asociado', async () => {
            await expect(Like.create({})).rejects.toThrow();
        });

        test('Debería poder ser eliminado (quitar like)', async () => {
            const temporalLike = await Like.create({ id_usuario: sharedUsuario2.id_usuario });
            const id = temporalLike.id_like;
            await temporalLike.destroy();
            const result = await Like.findByPk(id);
            expect(result).toBeNull();
        });
    });

    /* ==========================================================================
       8. MODELO: Comentario
       ========================================================================== */
    describe('8. Modelo: Comentario', () => {
        test('Debería crear un Comentario válido', async () => {
            sharedComentario = await Comentario.create({
                texto: '¡Excelente aporte! Lo intentaré en casa.',
                id_usuario: sharedUsuario.id_usuario
            });
            expect(sharedComentario.id_comentario).toBeDefined();
            expect(sharedComentario.texto).toBe('¡Excelente aporte! Lo intentaré en casa.');
        });

        test('Debería fallar si el texto está ausente', async () => {
            await expect(Comentario.create({
                id_usuario: sharedUsuario.id_usuario
            })).rejects.toThrow();
        });

        test('Debería permitir actualizar el texto del comentario', async () => {
            const com = await Comentario.findByPk(sharedComentario.id_comentario);
            await com.update({ texto: 'Edición: ¡Se ve realmente genial!' });
            expect(com.texto).toBe('Edición: ¡Se ve realmente genial!');
        });
    });

    /* ==========================================================================
       9. MODELO: PublicacionComentario
       ========================================================================== */
    describe('9. Modelo: PublicacionComentario (Tabla Puente)', () => {
        test('Debería asociar un Comentario a una Publicación', async () => {
            const pubCom = await PublicacionComentario.create({
                id_publicacion: sharedPublicacion.id_publicacion,
                id_comentario: sharedComentario.id_comentario
            });
            expect(pubCom.id_publicacion).toBe(sharedPublicacion.id_publicacion);
            expect(pubCom.id_comentario).toBe(sharedComentario.id_comentario);
        });

        test('Debería fallar al asociar sin proporcionar id_publicacion', async () => {
            await expect(PublicacionComentario.create({
                id_comentario: sharedComentario.id_comentario
            })).rejects.toThrow();
        });

        test('Debería permitir consultar los comentarios de una Publicacion', async () => {
            const pub = await Publicacion.findByPk(sharedPublicacion.id_publicacion, {
                include: [{ model: Comentario }]
            });
            expect(pub.Comentarios).toBeDefined();
            expect(pub.Comentarios.length).toBeGreaterThan(0);
        });
    });

    /* ==========================================================================
       10. MODELO: LikePublicacion
       ========================================================================== */
    describe('10. Modelo: LikePublicacion (Tabla Puente)', () => {
        test('Debería asociar un Like a una Publicación', async () => {
            const likePub = await LikePublicacion.create({
                id_publicacion: sharedPublicacion.id_publicacion,
                id_like: sharedLike.id_like
            });
            expect(likePub.id_publicacion).toBe(sharedPublicacion.id_publicacion);
            expect(likePub.id_like).toBe(sharedLike.id_like);
        });

        test('Debería fallar si faltan ambos campos', async () => {
            await expect(LikePublicacion.create({})).rejects.toThrow();
        });

        test('Debería permitir consultar los likes asociados a la publicación', async () => {
            const pub = await Publicacion.findByPk(sharedPublicacion.id_publicacion, {
                include: [{ model: Like }]
            });
            expect(pub.Likes).toBeDefined();
            expect(pub.Likes.length).toBeGreaterThan(0);
        });
    });

    /* ==========================================================================
       11. MODELO: RolContribuidor
       ========================================================================== */
    describe('11. Modelo: RolContribuidor', () => {
        test('Debería crear un Rol de Contribuidor correctamente', async () => {
            sharedRolContribuidor = await RolContribuidor.create({
                nombre: 'Redactor de Recetas',
                descripcion: 'Crea artículos de alimentación saludable'
            });
            expect(sharedRolContribuidor.id_rol_contribuidor).toBeDefined();
            expect(sharedRolContribuidor.nombre).toBe('Redactor de Recetas');
        });

        test('Debería fallar al crear sin descripción obligatoria', async () => {
            await expect(RolContribuidor.create({
                nombre: 'Incompleto'
            })).rejects.toThrow();
        });

        test('Debería permitir buscar el Rol de Contribuidor por ID', async () => {
            const rol = await RolContribuidor.findByPk(sharedRolContribuidor.id_rol_contribuidor);
            expect(rol).not.toBeNull();
            expect(rol.nombre).toBe('Redactor de Recetas');
        });
    });

    /* ==========================================================================
       12. MODELO: Contribuidor
       ========================================================================== */
    describe('12. Modelo: Contribuidor', () => {
        test('Debería registrar un Contribuidor asociado al usuario y rol de contribuidor', async () => {
            sharedContribuidor = await Contribuidor.create({
                puntos: '150',
                id_usuario: sharedUsuario.id_usuario,
                id_rol_contribuidor: sharedRolContribuidor.id_rol_contribuidor
            });
            expect(sharedContribuidor.id_contribuidor).toBeDefined();
            expect(sharedContribuidor.puntos).toBe('150');
        });

        test('Debería fallar al registrar sin puntos', async () => {
            await expect(Contribuidor.create({
                id_usuario: sharedUsuario.id_usuario,
                id_rol_contribuidor: sharedRolContribuidor.id_rol_contribuidor
            })).rejects.toThrow();
        });

        test('Debería consultar el Contribuidor e incluir su Usuario asociado', async () => {
            const contrib = await Contribuidor.findByPk(sharedContribuidor.id_contribuidor, {
                include: [{ model: Usuario }]
            });
            expect(contrib.Usuario).toBeDefined();
            expect(contrib.Usuario.id_usuario).toBe(sharedUsuario.id_usuario);
        });
    });

    /* ==========================================================================
       13. MODELO: TemaEnTendencia
       ========================================================================== */
    describe('13. Modelo: TemaEnTendencia', () => {
        test('Debería crear un Tema en Tendencia correctamente', async () => {
            const tema = await TemaEnTendencia.create({
                tema: '#CardioExtremo',
                miembros: '1,200 miembros activos'
            });
            expect(tema.id_tema).toBeDefined();
            expect(tema.tema).toBe('#CardioExtremo');
        });

        test('Debería fallar al crear un tema sin miembros obligatorios', async () => {
            await expect(TemaEnTendencia.create({
                tema: '#Vacio'
            })).rejects.toThrow();
        });

        test('Debería poder actualizar los miembros de la tendencia', async () => {
            const tema = await TemaEnTendencia.create({
                tema: '#AyunoIntermitente',
                miembros: '500'
            });
            await tema.update({ miembros: '650' });
            expect(tema.miembros).toBe('650');
        });
    });

    /* ==========================================================================
       14. MODELO: DetalleRazonReporte
       ========================================================================== */
    describe('14. Modelo: DetalleRazonReporte', () => {
        test('Debería crear un Detalle de Razón de Reporte correctamente', async () => {
            sharedDetalleRazon = await DetalleRazonReporte.create({
                nombre: 'Spam, anuncios falsos o contenido comercial repetitivo'
            });
            expect(sharedDetalleRazon.id_detalle_razon).toBeDefined();
            expect(sharedDetalleRazon.nombre).toContain('Spam');
        });

        test('Debería fallar si no se proporciona el nombre descriptivo', async () => {
            await expect(DetalleRazonReporte.create({})).rejects.toThrow();
        });

        test('Debería permitir buscar el Detalle de Razón', async () => {
            const det = await DetalleRazonReporte.findByPk(sharedDetalleRazon.id_detalle_razon);
            expect(det).not.toBeNull();
        });
    });

    /* ==========================================================================
       15. MODELO: RazonReporte
       ========================================================================== */
    describe('15. Modelo: RazonReporte', () => {
        test('Debería crear una Razón de Reporte asociada al Detalle', async () => {
            sharedRazon = await RazonReporte.create({
                nombre: 'Contenido No Deseado',
                id_detalle_razon: sharedDetalleRazon.id_detalle_razon
            });
            expect(sharedRazon.id_razon).toBeDefined();
            expect(sharedRazon.nombre).toBe('Contenido No Deseado');
        });

        test('Debería fallar al crear una razón sin asociarle el detalle correspondiente', async () => {
            await expect(RazonReporte.create({
                nombre: 'Sin detalle'
            })).rejects.toThrow();
        });

        test('Debería poder consultar la Razón de Reporte e incluir su Detalle', async () => {
            const razon = await RazonReporte.findByPk(sharedRazon.id_razon, {
                include: [{ model: DetalleRazonReporte }]
            });
            expect(razon.DetalleRazonReporte).toBeDefined();
            expect(razon.DetalleRazonReporte.id_detalle_razon).toBe(sharedDetalleRazon.id_detalle_razon);
        });
    });

    /* ==========================================================================
       16. MODELO: Reporte
       ========================================================================== */
    describe('16. Modelo: Reporte', () => {
        test('Debería crear un Reporte sobre una publicación', async () => {
            sharedReporte = await Reporte.create({
                id_usuario: sharedUsuario.id_usuario,
                id_publicacion: sharedPublicacion.id_publicacion,
                id_razon: sharedRazon.id_razon,
                descripcion: 'El usuario está promocionando productos milagro sin sustento.',
                estado: 'Pendiente',
                fecha_hora: new Date()
            });
            expect(sharedReporte.id_reporte).toBeDefined();
            expect(sharedReporte.estado).toBe('Pendiente');
        });

        test('Debería fallar si falta el estado del reporte', async () => {
            await expect(Reporte.create({
                id_usuario: sharedUsuario.id_usuario,
                id_publicacion: sharedPublicacion.id_publicacion,
                id_razon: sharedRazon.id_razon,
                descripcion: 'Falta estado',
                fecha_hora: new Date()
            })).rejects.toThrow();
        });

        test('Debería poder actualizar el estado a "Resuelto"', async () => {
            const rep = await Reporte.findByPk(sharedReporte.id_reporte);
            await rep.update({ estado: 'Resuelto' });
            expect(rep.estado).toBe('Resuelto');
        });
    });

    /* ==========================================================================
       17. MODELO: MensajeContacto
       ========================================================================== */
    describe('17. Modelo: MensajeContacto', () => {
        test('Debería crear un Mensaje de Contacto válido', async () => {
            const msg = await MensajeContacto.create({
                nombre: 'Carlos Mendoza',
                telefono: '555-12345',
                correo: 'carlos@contacto.com',
                mensaje: 'Solicito información sobre los planes corporativos de PowerFit.',
                pais: 'Costa Rica',
                fecha: new Date(),
                id_usuario: sharedUsuario.id_usuario
            });
            expect(msg.id_mensaje).toBeDefined();
            expect(msg.nombre).toBe('Carlos Mendoza');
        });

        test('Debería fallar al crear si el correo no es proporcionado', async () => {
            await expect(MensajeContacto.create({
                nombre: 'Incompleto',
                telefono: '555',
                mensaje: 'Sin correo',
                pais: 'CR',
                fecha: new Date(),
                id_usuario: sharedUsuario.id_usuario
            })).rejects.toThrow();
        });

        test('Debería poder actualizar y cambiar el país de origen', async () => {
            const msg = await MensajeContacto.create({
                nombre: 'Sofia',
                telefono: '111',
                correo: 'sofia@mail.com',
                mensaje: 'Hola',
                pais: 'Panamá',
                fecha: new Date(),
                id_usuario: sharedUsuario.id_usuario
            });
            await msg.update({ pais: 'Colombia' });
            expect(msg.pais).toBe('Colombia');
        });
    });

    /* ==========================================================================
       18. MODELO: DatosUsuario
       ========================================================================== */
    describe('18. Modelo: DatosUsuario', () => {
        test('Debería registrar los Datos Físicos de un Usuario correctamente', async () => {
            sharedDatosUsuario = await DatosUsuario.create({
                sexo: 'Masculino',
                altura: 1.78,
                peso: 82.50,
                lugar_entrenamiento: 'Gimnasio Comercial',
                peso_meta: 78.00,
                plazo_semanas: 8,
                deficit_estimado: 500,
                imagen: 'progreso.png',
                id_usuario: sharedUsuario.id_usuario,
                semanas_progreso: 2,
                feedback_dieta: 'Muy consistente',
                feedback_ejercicio: 'Progresando en cargas'
            });
            expect(sharedDatosUsuario.id_datos_usuario).toBeDefined();
            expect(Number(sharedDatosUsuario.altura)).toBe(1.78);
        });

        test('Debería fallar si falta el lugar de entrenamiento', async () => {
            await expect(DatosUsuario.create({
                sexo: 'Masculino',
                altura: 1.78,
                peso: 82.50,
                peso_meta: 78.00,
                plazo_semanas: 8,
                deficit_estimado: 500,
                imagen: 'progreso.png',
                id_usuario: sharedUsuario.id_usuario,
                semanas_progreso: 2,
                feedback_dieta: 'Dieta',
                feedback_ejercicio: 'Ejercicio'
            })).rejects.toThrow();
        });

        test('Debería permitir consultar los datos físicos y actualizar el peso actual', async () => {
            const datos = await DatosUsuario.findByPk(sharedDatosUsuario.id_datos_usuario);
            await datos.update({ peso: 81.20 });
            expect(Number(datos.peso)).toBe(81.20);
        });
    });

    /* ==========================================================================
       19. MODELO: Alergia
       ========================================================================== */
    describe('19. Modelo: Alergia', () => {
        test('Debería crear una Alergia alimentaria correctamente', async () => {
            sharedAlergia = await Alergia.create({
                nombre: 'Gluten'
            });
            expect(sharedAlergia.id_alergia).toBeDefined();
            expect(sharedAlergia.nombre).toBe('Gluten');
        });

        test('Debería fallar si falta el nombre de la alergia', async () => {
            await expect(Alergia.create({})).rejects.toThrow();
        });

        test('Debería permitir buscar e identificar la Alergia por su ID', async () => {
            const alergia = await Alergia.findByPk(sharedAlergia.id_alergia);
            expect(alergia).not.toBeNull();
            expect(alergia.nombre).toBe('Gluten');
        });
    });

    /* ==========================================================================
       20. MODELO: DatosUsuarioAlergia
       ========================================================================== */
    describe('20. Modelo: DatosUsuarioAlergia (Tabla Puente)', () => {
        test('Debería registrar la Alergia asociada a los Datos de un Usuario', async () => {
            const dua = await DatosUsuarioAlergia.create({
                id_datos_usuario: sharedDatosUsuario.id_datos_usuario,
                id_alergia: sharedAlergia.id_alergia
            });
            expect(dua.id_datos_usuario).toBe(sharedDatosUsuario.id_datos_usuario);
            expect(dua.id_alergia).toBe(sharedAlergia.id_alergia);
        });

        test('Debería lanzar error si falta el ID de la alergia', async () => {
            await expect(DatosUsuarioAlergia.create({
                id_datos_usuario: sharedDatosUsuario.id_datos_usuario
            })).rejects.toThrow();
        });

        test('Debería poder listar las alergias de un usuario mediante la asociación en DatosUsuario', async () => {
            const datos = await DatosUsuario.findByPk(sharedDatosUsuario.id_datos_usuario, {
                include: [{ model: Alergia }]
            });
            const plain = datos.get({ plain: true });
            const key = Object.keys(plain).find(k => k.toLowerCase().includes('alergia'));
            expect(key).toBeDefined();
            expect(plain[key].length).toBeGreaterThan(0);
        });
    });

    /* ==========================================================================
       21. MODELO: Rutina
       ========================================================================== */
    describe('21. Modelo: Rutina', () => {
        test('Debería crear una Rutina asociada a los Datos del Usuario', async () => {
            sharedRutina = await Rutina.create({
                id_datos_usuario: sharedDatosUsuario.id_datos_usuario
            });
            expect(sharedRutina.id_rutina).toBeDefined();
            expect(sharedRutina.id_datos_usuario).toBe(sharedDatosUsuario.id_datos_usuario);
        });

        test('Debería fallar al crear una rutina sin datos de usuario obligatorios', async () => {
            await expect(Rutina.create({})).rejects.toThrow();
        });

        test('Debería permitir consultar la Rutina por su ID primario', async () => {
            const rut = await Rutina.findByPk(sharedRutina.id_rutina);
            expect(rut).not.toBeNull();
        });
    });

    /* ==========================================================================
       22. MODELO: Ejercicio
       ========================================================================== */
    describe('22. Modelo: Ejercicio', () => {
        test('Debería registrar un Ejercicio con todas sus propiedades obligatorias', async () => {
            sharedEjercicio = await Ejercicio.create({
                nombre: 'Sentadilla Libre con Barra',
                nivel: 'Intermedio',
                musculo: 'Cuádriceps',
                video: 'http://youtube.com/squads_video',
                videoUrl: 'http://youtube.com/squads_video',
                imagen: 'sentadilla.png',
                tiempo: '10 minutos',
                repeticiones: 12,
                series: 4
            });
            expect(sharedEjercicio.id_ejercicio).toBeDefined();
            expect(sharedEjercicio.nombre).toBe('Sentadilla Libre con Barra');
            expect(sharedEjercicio.repeticiones).toBe(12);
        });

        test('Debería lanzar error si falta la imagen demostrativa obligatoria', async () => {
            await expect(Ejercicio.create({
                nombre: 'Sentadilla Incompleta',
                nivel: 'Intermedio',
                musculo: 'Piernas',
                video: 'video',
                videoUrl: 'video',
                tiempo: '10',
                repeticiones: 10,
                series: 3
            })).rejects.toThrow();
        });

        test('Debería permitir actualizar la duración del ejercicio', async () => {
            const ej = await Ejercicio.findByPk(sharedEjercicio.id_ejercicio);
            await ej.update({ tiempo: '15 minutos' });
            expect(ej.tiempo).toBe('15 minutos');
        });
    });

    /* ==========================================================================
       23. MODELO: RutinaEjercicio
       ========================================================================== */
    describe('23. Modelo: RutinaEjercicio (Tabla Puente)', () => {
        test('Debería asociar un Ejercicio a una Rutina en particular', async () => {
            const re = await RutinaEjercicio.create({
                id_rutina: sharedRutina.id_rutina,
                id_ejercicio: sharedEjercicio.id_ejercicio,
                repeticiones: 10,
                sets: '4',
                tiempo_entre_sets: '60s'
            });
            expect(re.id_rutina).toBe(sharedRutina.id_rutina);
            expect(re.id_ejercicio).toBe(sharedEjercicio.id_ejercicio);
        });

        test('Debería fallar al asociar si el ID de rutina no existe o falta', async () => {
            await expect(RutinaEjercicio.create({
                id_ejercicio: sharedEjercicio.id_ejercicio
            })).rejects.toThrow();
        });

        test('Debería permitir consultar los ejercicios de una rutina mediante la asociación', async () => {
            const rut = await Rutina.findByPk(sharedRutina.id_rutina, {
                include: [{ model: Ejercicio }]
            });
            expect(rut.Ejercicios).toBeDefined();
            expect(rut.Ejercicios.length).toBeGreaterThan(0);
            expect(rut.Ejercicios[0].nombre).toBe('Sentadilla Libre con Barra');
        });
    });

});
