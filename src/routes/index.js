const express = require("express");
const route = express.Router();

// Middleware para verificar sesión
const verificarSesion = (req, res, next) => {
    if (req.session.usuario && req.session.password) {
        if (req.originalUrl === "/" || req.originalUrl === "/auth/iniciar") {
            res.redirect("/home");
        } else {
            next();
        }
    } else {
        next();
    }
};


// Aplica el middleware de verificación de sesión a todas las rutas en este archivo
route.use(verificarSesion);

// Ruta principal (inicio de sesión)
route.get("/", function(req, res) {
    res.render("index.ejs", {
        titulo: "LOGIN"
    });
});

module.exports = route;


 