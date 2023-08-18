

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
                datosUsuario: req.session.datos,
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
            let tablaHtml = `
<table class="table table-bordered tablas" id="TablaMaterias">
    <thead>
        <tr>
            <th>N</th>
            <th>Clave Mat</th>
            <th>Nombre</th>
            <th>Cuatrimestre</th>
            <th colspan="2">Opciones</th>
        </tr>
    </thead>
    <tbody>
`;

            for (let i = 0; i < resultados.length; i++) {
                tablaHtml += `
    <tr id="${resultados[i].ClaveMat}">
        <td>${i + 1}</td>
        <td>${resultados[i].ClaveMat}</td>
        <td>${resultados[i].Nombre}</td>
        <td>${resultados[i].Cuatrimestre}</td>
        <td width="50">
            <button class="btn btn-sm btn-warning editarMateria"
                data-clave="${resultados[i].ClaveMat}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    fill="currentColor" class="bi bi-pencil-square"
                    viewBox="0 0 16 16">
                    <path
                        d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path fill-rule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                </svg>Editar</button>
        </td>
        <td width="50">
            <button class="btn btn-sm btn-danger mostrarModalClaveMat"
                data-clave="${resultados[i].ClaveMat}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                    <path
                        d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                </svg>Eliminar</button>
        </td>
    </tr>
`;
            }

            tablaHtml += `
    </tbody>
</table>
`;
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
                // Obtener los datos actualizados de la base de datos
                conn.query(
                    "SELECT Cuatrimestre, ClaveMat FROM materias WHERE ClaveMat = ?",
                    [nuevaInfo.ClaveMat],
                    (error, datosActualizados) => {
                        if (error) {
                            console.error("Error en la consulta:", error);
                            return res.status(500).send("Error en la consulta");
                        }

                        // Retorna los datos actualizados
                        const datos = {
                            Cuatrimestre: nuevaInfo.Cuatrimestre,
                            ClaveMat: datosActualizados[0].ClaveMat
                        };
                        res.json(datos);
                    }
                );
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
