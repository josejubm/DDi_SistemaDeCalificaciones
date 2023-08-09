const express = require("express");
const route = express.Router();
const authMiddleware = require("../libraries/authMiddleware");
const controladorMateria = require("../controllers/materiaController");

// Aplicar el middleware de verificación de sesión a todas las rutas de /home
route.use(authMiddleware.verificarSesion);

route.get("/", controladorMateria.mostrar);
route.post("/agregar", controladorMateria.agregar); 
route.get("/eliminar/:ClaveMat", controladorMateria.eliminar);

/* route.post("/editar", controladorAlumno.editar);
 route.post("/modificar/:NL", controladorAlumno.modificar); */

module.exports = route;
