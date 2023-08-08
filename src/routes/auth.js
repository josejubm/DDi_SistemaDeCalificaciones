const express = require("express");
const route = express.Router();
const controladorAuth = require("../controllers/authController.js");

route.post("/iniciar",controladorAuth.iniciar); 
route.post("/cerrar",controladorAuth.cerrar);

module.exports = route;