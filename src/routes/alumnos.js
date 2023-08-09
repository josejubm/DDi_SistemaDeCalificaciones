const express = require("express");
const route = express.Router();
const authMiddleware = require("../libraries/authMiddleware");
const controladorAlumno = require("../controllers/alumnoController");

// Aplicar el middleware de verificación de sesión a todas las rutas de /home
route.use(authMiddleware.verificarSesion);

route.get("/", controladorAlumno.mostrar);

module.exports = route;
