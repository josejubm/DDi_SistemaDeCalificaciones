const express = require("express");
const route = express.Router();
const authMiddleware = require("../libraries/authMiddleware");
const controladorMateria = require("../controllers/materiaController");

// Aplicar el middleware de verificación de sesión a todas las rutas de /home
route.use(authMiddleware.verificarSesion);

route.get("/", controladorMateria.mostrar);
route.post("/agregar", controladorMateria.agregar); 
route.get("/eliminar", controladorMateria.eliminar);
route.get("/mostrarC", controladorMateria.mostrarPorCuatrimestre);
route.post("/editar/:OldClaveMat", controladorMateria.editar);

module.exports = route;
