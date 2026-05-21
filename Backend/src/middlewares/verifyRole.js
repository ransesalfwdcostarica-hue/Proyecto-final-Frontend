const verifyRole = (rolesPermitidos) => {
    return (req, res, next) => {
        // req.usuario fue inyectado por el authMiddleware
        if (!req.usuario) {
            return res.status(401).json({ error: 'Usuario no autenticado. Token no válido o ausente.' });
        }

        const allowed = rolesPermitidos.map(r => r.toLowerCase());
        let userRole = req.usuario.rol;
        if (!userRole) {
            if (req.usuario.id_rol === 1) userRole = 'admin';
            else if (req.usuario.id_rol === 2) userRole = 'client';
        }

        if (!userRole || !allowed.includes(userRole.toLowerCase())) {
            return res.status(403).json({ 
                error: `Acceso denegado. Se requiere uno de los siguientes roles: ${rolesPermitidos.join(', ')}` 
            });
        }

        next();
    };
};

// Middlewares específicos preconfigurados para mayor comodidad
const isAdmin = verifyRole(['admin', 'administrador']);
const isClient = verifyRole(['client', 'cliente', 'user']);

module.exports = {
    verifyRole,
    isAdmin,
    isClient
};
