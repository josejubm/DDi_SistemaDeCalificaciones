const express = require("express");
const route = express.Router();
const authMiddleware = require("../libraries/authMiddleware"); 

// Aplicar el middleware de verificación de sesión a todas las rutas de /home
route.use(authMiddleware.verificarSesion);

// Ruta para la página de inicio después de iniciar sesión
route.get("/", function(req, res) {
    res.render("home.ejs", {
        titulo: "HOME",
        usuario: req.session.usuario,
        datosUsuario: req.session.datos
    });
});


module.exports = route;
