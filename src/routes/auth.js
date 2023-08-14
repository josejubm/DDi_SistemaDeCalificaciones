const express = require("express");
const route = express.Router();
const controladorAuth = require("../controllers/authController.js");

route.post("/iniciarD",controladorAuth.iniciarD); 
route.post("/cerrar",controladorAuth.cerrar);

module.exports = route;