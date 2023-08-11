

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
                res.send(nuevaMateria.Cuatrimestre);
            }
        });
    });
};

controlador.mostrarPorCuatrimestre = (req, res) => {
    const cuatrimestre = req.query.cuatrimestre;
    req.getConnection((errorConexion, conn) => {
        if (errorConexion) throw errorConexion;
        let query = "SELECT * FROM materias";
        const queryParams = [];

        if (cuatrimestre !== "0") {
            query += " WHERE Cuatrimestre = ?";
            queryParams.push(cuatrimestre);
        }
        conn.query(query, queryParams, (error, resultados) => {
            if (error) {
                res.json({ error: error.message });
            }

            // Construir la tabla HTML con los resultados
            let tablaHtml = "<table class='table table-bordered' id='TablaMaterias'>";
            tablaHtml += "<thead><tr><th>N</th><th>Clave Mat</th><th>Nombre</th><th>Cuatrimestre</th><th colspan='2'>Opciones</th></tr></thead>";
            tablaHtml += "<tbody>";

            for (let i = 0; i < resultados.length; i++) {
                tablaHtml += "<tr id='" + resultados[i].ClaveMat + "' >";
                tablaHtml += "<td>" + (i + 1) + "</td>";
                tablaHtml += "<td>" + resultados[i].ClaveMat + "</td>";
                tablaHtml += "<td>" + resultados[i].Nombre + "</td>";
                tablaHtml += "<td>" + resultados[i].Cuatrimestre + "</td>";
                tablaHtml += "<td width='50'><button class='btn btn-sm btn-warning editarMateria' data-clave='" + resultados[i].ClaveMat + "'>Editar</button></td>";
                tablaHtml += "<td width='50'><button class='btn btn-sm btn-danger eliminarMateria' data-clave=" + resultados[i].ClaveMat + ">Eliminar</button></td>";
                tablaHtml += "</tr>";
            }

            tablaHtml += "</tbody></table>";

            res.send(tablaHtml);
        });
    });
};

controlador.editar = (req, res) => {
    const { OldClaveMat } = req.params;
    const nuevaInfo = {
        ClaveMat: req.body.ClaveMat,
        Nombre: req.body.Nombre,
        Cuatrimestre: req.body.Cuatrimestre,
    };
    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error en la conexión:", err);
            return res.status(500).send("Error en la conexión");
        }
        conn.query("UPDATE materias SET ClaveMat = ?, Nombre = ?, Cuatrimestre = ? WHERE ClaveMat = ?",
            [nuevaInfo.ClaveMat, nuevaInfo.Nombre, nuevaInfo.Cuatrimestre, OldClaveMat],
            (error, resultados) => {
                if (error) {
                    console.error("Error en la consulta:", error);
                    return res.status(500).send("Error en la consulta");
                }
                res.send(nuevaInfo.Cuatrimestre);
            });
    });
};

controlador.eliminar = (req, res) => {
    const { ClaveMat } = req.query;

    req.getConnection((errorConexion, conn) => {
        if (errorConexion) throw errorConexion;
        conn.query("DELETE FROM materias WHERE ClaveMat = ?", [ClaveMat], (error, resultados) => {
            if (error) {
                res.json({ error: error.message });
            }
            res.send(req.query.cuatrimestre);
        });
    });
};


module.exports = controlador;
