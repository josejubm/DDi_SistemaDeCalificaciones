const express = require("express");
const route = express.Router();
const controladorCalificaciones = require("../controllers/calificacionesController");
const authMiddleware = require("../libraries/authMiddleware"); 

// Aplicar el middleware de verificación de sesión a todas las rutas de /calificaciones
route.use(authMiddleware.verificarSesion);

// Ruta para la página de calificaciones
route.get("/", controladorCalificaciones.mostrarMaterias);

module.exports = route;
