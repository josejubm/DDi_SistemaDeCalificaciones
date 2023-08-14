const controlador = {};

controlador.mostrarMaterias = (req, res) => {
    req.getConnection((errorConexion, conn) => {
        if (errorConexion) throw errorConexion;
        const cuatrimestre = req.query.cuatrimestre;
        const query = `SELECT * FROM materias WHERE Cuatrimestre = ?`;
        const queryParams = [cuatrimestre];

        conn.query(query, queryParams, (error, resultados) => {
            if (error) {
                res.json(error);
            }
            res.json(resultados);
        });
    });
};

controlador.mostrarCalificacionesMateria = (req, res) => {
    const cuatrimestre = req.body.cuatrimestre;
    const materia = req.body.materia;

    req.getConnection((errorConexion, conn) => {
        if (errorConexion) throw errorConexion;

        const query = `
    SELECT calificaciones.Matricula, alumnos.Nombre, alumnos.Paterno, alumnos.Materno,
           calificaciones.Parcial1, calificaciones.Parcial2, calificaciones.Parcial3, calificaciones.Extra,
           materias.Nombre AS NombreMateria
    FROM calificaciones
    INNER JOIN alumnos ON calificaciones.Matricula = alumnos.Matricula
    INNER JOIN materias ON calificaciones.ClaveMat = materias.ClaveMat
    WHERE materias.Cuatrimestre = ?
    AND materias.ClaveMat = ?`;


        const queryParams = [cuatrimestre, materia];

        conn.query(query, queryParams, (error, resultados) => {
            if (error) {
                res.json({ error: error.message });
            }

            res.json(resultados);
        });
    });
};

controlador.agregar = (req, res) => {
    const nuevoAlumno = {
        Matricula: req.body.tfMatricula,
        Nombre: req.body.tfNombre,
        Paterno: req.body.tfPaterno, // Cambio realizado aquí
        Materno: req.body.tfMaterno,
        Genero: req.body.tfSexo, // Cambio realizado aquí
        FechaNac: req.body.tfFechaNac, // Cambio realizado aquí
        Edad: parseInt(req.body.tfEdad, 10),
        IdDomicilio: null // Dejamos esto como null por ahora, lo actualizaremos después de insertar el domicilio
    };

    const nuevoDomicilio = {
        Colonia: req.body.tfColonia,
        Calle: req.body.tfCalle,
        Numero: req.body.tfNumero
    };

    req.getConnection((errorConexion, conn) => {
        if (errorConexion) throw errorConexion;

        conn.beginTransaction((errorTransaccion) => {
            if (errorTransaccion) throw errorTransaccion;

            conn.query("INSERT INTO domicilios SET ?", [nuevoDomicilio], (errorInsercionDomicilio, resultadoInsercionDomicilio) => {
                if (errorInsercionDomicilio) {
                    conn.rollback(() => {
                        res.json({ error: errorInsercionDomicilio.message });
                    });
                } else {
                    const idDomicilio = resultadoInsercionDomicilio.insertId;
                    nuevoAlumno.IdDomicilio = idDomicilio;

                    conn.query("INSERT INTO alumnos SET ?", [nuevoAlumno], (errorInsercionAlumno, resultadoInsercionAlumno) => {
                        if (errorInsercionAlumno) {
                            conn.rollback(() => {
                                res.json({ error: errorInsercionAlumno.message });
                            });
                        } else {
                            conn.commit((errorCommit) => {
                                if (errorCommit) {
                                    conn.rollback(() => {
                                        throw errorCommit;
                                    });
                                }
                                res.redirect("/alumnos");
                            });
                        }
                    });
                }
            });
        });
    });
};





controlador.editar = (req, res) => {
    const { Matricula_old } = req.params;
    const nuevaInfo = {
        Matricula: req.body.Matricula,
        Nombre: req.body.Nombre,
        Paterno: req.body.Paterno,
        Materno: req.body.Materno,
        Genero: req.body.Genero,
        FechaNac: req.body.FechaNac,
        Edad: req.body.Edad,
        Colonia: req.body.Colonia,
        Calle: req.body.Calle,
        Numero: req.body.Numero
    };
    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error en la conexión:", err);
            return res.status(500).send("Error en la conexión");
        }
        conn.query(
            "UPDATE alumnos INNER JOIN domicilios ON alumnos.IdDomicilio = domicilios.Id SET ? WHERE alumnos.Matricula = ?",
            [nuevaInfo, Matricula_old],
            (error, resultados) => {
                if (error) {
                    console.error("Error en la consulta:", error);
                    return res.status(500).send("Error en la consulta");
                }

                // Obtén la matrícula nueva y el género para retornar
                conn.query(
                    "SELECT Matricula, Genero FROM alumnos WHERE Matricula = ?",
                    [nuevaInfo.Matricula],
                    (error, nuevaFila) => {
                        if (error) {
                            console.error("Error en la consulta:", error);
                            return res.status(500).send("Error en la consulta");
                        }

                        // Retorna la matrícula nueva y el género
                        const resultado = {
                            MatriculaNueva: nuevaFila[0].Matricula,
                            Genero: nuevaFila[0].Genero
                        };
                        res.json(resultado);
                    }
                );
            }

        );
    });
};


controlador.eliminar = (req, res) => {
    const { Matricula, Genero } = req.query;

    req.getConnection((errorConexion, conn) => {
        if (errorConexion) throw errorConexion;

        conn.query("DELETE alumnos, domicilios FROM alumnos JOIN domicilios ON alumnos.IdDomicilio = domicilios.Id WHERE alumnos.Matricula = ?", [Matricula], (errorEliminacion, resultados) => {
            if (errorEliminacion) {
                res.json({ error: errorEliminacion.message });
            }
            res.send(Genero);
        });
    });
};



module.exports = controlador;
