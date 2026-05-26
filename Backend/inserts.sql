USE powerfit;

-- Decoracion Tematica
INSERT INTO decoracion_tematica (nombre_Deco, desc_Deco) VALUES ('Paquete Básico', 'Paquete Básico');
INSERT INTO decoracion_tematica (nombre_Deco, desc_Deco) VALUES ('Paquete Deluxe', 'Paquete Deluxe');
INSERT INTO decoracion_tematica (nombre_Deco, desc_Deco) VALUES ('Fiesta de fin de año', 'Fiesta de fin de año');
INSERT INTO decoracion_tematica (nombre_Deco, desc_Deco) VALUES ('Fiesta Vaquera', 'Fiesta Vaquera');

-- Servicio Adicional
-- Decoración (1)
INSERT INTO servicio_adicional (nombre, descripcion, categoriaId) VALUES ('Mantelería de lujo', 'Mantelería de lujo', 1);
INSERT INTO servicio_adicional (nombre, descripcion, categoriaId) VALUES ('Sillas Vestidas', 'Sillas Vestidas', 1);
INSERT INTO servicio_adicional (nombre, descripcion, categoriaId) VALUES ('Caminos de Mesa', 'Caminos de Mesa', 1);
INSERT INTO servicio_adicional (nombre, descripcion, categoriaId) VALUES ('Servilletas de Tela', 'Servilletas de Tela', 1);
INSERT INTO servicio_adicional (nombre, descripcion, categoriaId) VALUES ('Mesa Principal', 'Mesa Principal', 1);
INSERT INTO servicio_adicional (nombre, descripcion, categoriaId) VALUES ('Centros de mesa', 'Centros de mesa', 1);
INSERT INTO servicio_adicional (nombre, descripcion, categoriaId) VALUES ('Estación Fotográfica', 'Estación Fotográfica', 1);
INSERT INTO servicio_adicional (nombre, descripcion, categoriaId) VALUES ('Rotafolio', 'Rotafolio', 1);

-- Entretenimiento (2)
INSERT INTO servicio_adicional (nombre, descripcion, categoriaId) VALUES ('musica en vivo', 'musica en vivo', 2);
INSERT INTO servicio_adicional (nombre, descripcion, categoriaId) VALUES ('DJ', 'DJ', 2);
INSERT INTO servicio_adicional (nombre, descripcion, categoriaId) VALUES ('Show artistico', 'Show artistico', 2);
INSERT INTO servicio_adicional (nombre, descripcion, categoriaId) VALUES ('Payasito/a', 'Payasito/a', 2);
INSERT INTO servicio_adicional (nombre, descripcion, categoriaId) VALUES ('Inflables', 'Inflables', 2);

-- Aperitivos y Bebidas (3)
INSERT INTO servicio_adicional (nombre, descripcion, categoriaId) VALUES ('Postres', 'Postres', 3);
INSERT INTO servicio_adicional (nombre, descripcion, categoriaId) VALUES ('Cocteleria', 'Cocteleria', 3);
INSERT INTO servicio_adicional (nombre, descripcion, categoriaId) VALUES ('Mesa Dulce', 'Mesa Dulce', 3);
INSERT INTO servicio_adicional (nombre, descripcion, categoriaId) VALUES ('Charcuteria', 'Charcuteria', 3);

-- Tecnologia (4)
INSERT INTO servicio_adicional (nombre, descripcion, categoriaId) VALUES ('Proyector', 'Proyector', 4);
INSERT INTO servicio_adicional (nombre, descripcion, categoriaId) VALUES ('Sonido', 'Sonido', 4);
INSERT INTO servicio_adicional (nombre, descripcion, categoriaId) VALUES ('Iluminación', 'Iluminación', 4);
INSERT INTO servicio_adicional (nombre, descripcion, categoriaId) VALUES ('Karaoke', 'Karaoke', 4);

-- Documentación (5)
INSERT INTO servicio_adicional (nombre, descripcion, categoriaId) VALUES ('Fotógrafo', 'Fotógrafo', 5);
INSERT INTO servicio_adicional (nombre, descripcion, categoriaId) VALUES ('Videografo', 'Videografo', 5);
