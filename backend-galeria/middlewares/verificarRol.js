export const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ mensaje: 'No autenticado' });
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({
                mensaje: 'Acceso denegado: no tienes permisos suficientes'
            });
        }

        next();
    };
};

export const esAdmin = verificarRol(['admin']);
export const esComprador = verificarRol(['comprador', 'admin']);
