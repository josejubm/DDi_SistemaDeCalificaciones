const express = require("express");
const route = express.Router();
const authMiddleware = require("../libraries/authMiddleware");
const controladorAlumno = require("../controllers/alumnoController");

// Aplicar el middleware de verificación de sesión a todas las rutas de
route.use(authMiddleware.verificarSesion);

route.get("/", controladorAlumno.mostrar);
route.post("/agregar", controladorAlumno.agregar);
route.get("/eliminar", controladorAlumno.eliminar);
route.get("/mostrarGenero", controladorAlumno.mostrarPorGenero);
route.post("/editar/:Matricula_old", controladorAlumno.editar);

module.exports = route;
