// authMiddleware.js

// Middleware para verificar sesión
const verificarSesion = (req, res, next) => {
    if (req.session.usuario && req.session.password) {
        next(); // Si está autenticado, permite continuar
    } else {
        res.redirect("/"); // Si no está autenticado, redirige al inicio de sesión
    }
};

module.exports = {
    verificarSesion
};
