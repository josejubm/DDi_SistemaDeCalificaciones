const express = require("express");
const ejs = require("ejs");
const path = require("path");
const mysql = require("mysql");
const myConnection = require("express-myconnection");
const session = require("express-session");

const dbOptions = {
  host: "localhost",
  user: "root", // Completa con tu nombre de usuario de MySQL
  password: "", // Completa con tu contraseña de MySQL
  port: 3306,
  database: "SistemaCalificacionesDB",
};

const servidor = express();

// Configuraciones (settings)
servidor.set("puerto", 3000);
servidor.set("view engine", "ejs");
servidor.set("views", path.join(__dirname, "views"));

// Middlewares
servidor.use(express.urlencoded({ extended: false }));
servidor.use(express.json());
servidor.use(myConnection(mysql, dbOptions, "single"));
servidor.use(
  session({
    secret: "miClaveSecreta_nodeJS",
    resave: false,
    saveUninitialized: false,
  })
);

// Rutas
servidor.use("/", require("./routes/index.js")); // Ruta principal (index)

servidor.use("/home", require("./routes/home.js")); // Rutas relacionadas con el home
servidor.use("/alumnos", require("./routes/alumnos.js"));
servidor.use("/materias", require("./routes/materias.js"));
servidor.use("/auth", require("./routes/auth.js")); // Rutas relacionadas con sesiones
servidor.use(express.static(path.join(__dirname, "public"))); // Archivos estáticos 


// Variable global para todas las páginas
servidor.use((req, res, next) => {
    servidor.locals.user = { user: "joseju" };
    next();
  });
  

// Iniciar servidor
servidor.listen(servidor.get("puerto"), () => {
  console.log("Servidor escuchando en el puerto:", servidor.get("puerto"));
});
