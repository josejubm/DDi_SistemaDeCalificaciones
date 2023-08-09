const controlador = {};

controlador.mostrar = (req, res) => {
    req.getConnection((errorConexion, conn) => {
        if (errorConexion) throw errorConexion;
        conn.query(`SELECT * FROM materias;`, (error, resultados) => {
            if (error) {
                res.json(error);
            }
            const usuario = req.session.usuario;
            if (usuario) res.render("materias.ejs", {
                data: resultados,
                usuario,
                titulo: "INICIO MATERIAS"
            });
            else res.redirect("/");
        });
    });
};

controlador.agregar = (req, res) => {
    const nuevaMateria = {
        ClaveMat: parseInt(req.body.tfClave, 10),
        Nombre: req.body.tfNombre,
        Cuatrimestre: req.body.tfCuatrimestre,
    };

    req.getConnection((errorConexion, conn) => {
        if (errorConexion) throw errorConexion;
        conn.query("INSERT INTO materias SET ?", [nuevaMateria], (errorInsercion, resultadoInsercion) => {
            if (errorInsercion) {
                res.json({ error: errorInsercion.message });
            } else {
                res.redirect("/materias");
            }
        });
    });
};


controlador.editar = (req, res) => {
    const NL = parseInt(req.body.tfNL, 10);

    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error en la conexión:", err);
            return res.status(500).send("Error en la conexión");
        }

        conn.query("SELECT * FROM alumnos", [], (error, resultados) => {
            if (error) {
                console.error("Error en la consulta:", error);
                return res.status(500).send("Error en la consulta");
            }

            conn.query("SELECT * FROM alumnos WHERE NL = ?", [NL], (error, row) => {
                if (error) {
                    console.error("Error en la consulta:", error);
                    return res.status(500).send("Error en la consulta");
                }

                const datos = resultados;
                const fila = row.length > 0 ? row[0] : {}; // Si row tiene resultados, usa el primer elemento, de lo contrario, crea un objeto vacío

                console.log("datos", datos);
                console.log("fila", fila);
                res.render("alumnos_editar.ejs", { data: datos, fila: fila });
            });
        });
    });
};

controlador.modificar = (req, res) => {
    const { NL } = req.params;
    const reg = {
        NL: parseInt(req.body.tfNL, 10),
        Nombre: req.body.tfNombre,
        Paterno: req.body.tfPaterno,
        Materno: req.body.tfMaterno,
    };

    req.getConnection((err, conn) => {
        conn.query("UPDATE alumnos SET NL = ?, Nombre = ?, Paterno = ?, Materno = ? WHERE NL = ?",
            [reg.NL, reg.Nombre, reg.Paterno, reg.Materno, NL],
            (error, resultados) => {
                if (error) {
                    console.error("Error en la consulta:", error);
                    return res.status(500).send("Error en la consulta");
                }
                res.redirect("/alumnos");
            });
    });
};

controlador.eliminar = (req, res) => {
    const { ClaveMat } = req.params;

    req.getConnection((errorConexion, conn) => {
        if (errorConexion) throw errorConexion;
        conn.query("DELETE FROM materias WHERE ClaveMat = ?", [ClaveMat], (error, resultados) => {
            if (error) {
                res.json({ error: error.message });
            }
            res.redirect("/materias");
        });
    });
};

module.exports = controlador;
