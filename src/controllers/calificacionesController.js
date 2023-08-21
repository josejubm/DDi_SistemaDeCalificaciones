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


/* const calcularPromediosGenrales = async (conn, matricula) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT ClaveMat, Parcial1, Parcial2, Parcial3, Extra
            FROM calificaciones
            WHERE Matricula = ?;
        `;
        conn.query(query, [matricula], async (error, resultados) => {
            if (error) {
                reject(error);
            } else {
                const promediosMaterias = [];
                let promedioIndividual = 0;

                for (const row of resultados) {
                    const { ClaveMat, Materia, Parcial1, Parcial2, Parcial3, Extra } = row;
                    const promedioMateria = (Parcial1 + Parcial2 + Parcial3 + Extra) / 4;
                    promediosMaterias.push({ ClaveMat, promedioMateria });
                    promedioIndividual += promedioMateria;
                }

                promedioIndividual /= resultados.length;

                // Obtener la lista de materias y sus promedios para el alumno
                const queryMaterias = `
                                        SELECT m.Nombre AS Materia, c.ClaveMat, c.Parcial1, c.Parcial2, c.Parcial3, c.Extra
                                        FROM calificaciones c
                                        INNER JOIN materias m ON c.ClaveMat = m.ClaveMat
                                        WHERE c.Matricula = ?;
                                    `;

                const resultadosMaterias = await conn.query(queryMaterias, [matricula]);

                resolve({ promediosMaterias, promedioIndividual, materias: resultadosMaterias });
            }
        });
    });
}; */

const calcularPromediosGenrales = async (conn, matricula) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT m.ClaveMat, m.Nombre AS Materia, c.Parcial1, c.Parcial2, c.Parcial3, c.Extra
            FROM calificaciones c
            INNER JOIN materias m ON c.ClaveMat = m.ClaveMat
            WHERE c.Matricula = ?;
        `;
        conn.query(query, [matricula], async (error, resultados) => {
            if (error) {
                reject(error);
            } else {
                const promediosMaterias = [];
                let promedioIndividual = 0;

                for (const row of resultados) {
                    const { ClaveMat, Materia, Parcial1, Parcial2, Parcial3, Extra } = row;
                    const promedioMateria = (Parcial1 + Parcial2 + Parcial3 + Extra) / 4;
                    promediosMaterias.push({ ClaveMat, Materia, promedioMateria });
                    promedioIndividual += promedioMateria;
                }

                promedioIndividual /= resultados.length;
                resolve({ promediosMaterias, promedioIndividual });
            }
        });
    });
};


function calcularPromedioGrupal(resultados) {
    let totalPromediosIndividuales = 0;

    // Suma todos los promedios individuales
    for (const row of resultados) {
        totalPromediosIndividuales += row.PromedioIndividual;
    }

    // Calcula el promedio grupal dividiendo entre la cantidad de estudiantes
    const promedioGrupal = totalPromediosIndividuales / resultados.length;

    return promedioGrupal;
}

controlador.mostrarPromediosGenerales = (req, res) => {
    req.getConnection(async (errorConexion, conn) => {
        if (errorConexion) throw errorConexion;
        const query = `
            SELECT alumnos.Matricula, alumnos.Nombre, alumnos.Paterno, alumnos.Materno,
            AVG((c.Parcial1 + c.Parcial2 + c.Parcial3 + c.Extra) / 4) AS PromedioIndividual
            FROM alumnos
            INNER JOIN calificaciones c ON alumnos.Matricula = c.Matricula
            GROUP BY alumnos.Matricula;
        `;

        conn.query(query, async (error, resultados) => {
            if (error) {
                res.json(error);
            }

            const usuario = req.session.usuario;
            if (usuario) {
                const datosPromedios = [];

                for (const row of resultados) {
                    const { Matricula, Nombre, Paterno, Materno, PromedioIndividual } = row;
                    const { promediosMaterias, promedioIndividual, materias } = await calcularPromediosGenrales(conn, Matricula);
                    datosPromedios.push({
                        Matricula,
                        Nombre,
                        Paterno,
                        Materno,
                        promediosMaterias,
                        promedioIndividual,
                        materias: Array.isArray(materias) ? materias.map(materia => ({
                            ClaveMat: materia.ClaveMat,
                            Materia: materia.Materia,
                            Parcial1: materia.Parcial1,
                            Parcial2: materia.Parcial2,
                            Parcial3: materia.Parcial3,
                            Extra: materia.Extra
                        })) : []

                    });
                }

                const promedioGrupal = calcularPromedioGrupal(resultados);
                res.render("promediosGenerales.ejs", {
                    data: datosPromedios,
                    usuario,
                    datosUsuario: req.session.datos,
                    titulo: "Promedios Generales",
                    promedioGrupal: promedioGrupal
                });
            } else {
                res.redirect("/");
            }
        });
    });
};


/* res.render("promediosGenerales.ejs", {
    data: datosPromedios,
    usuario,
    datosUsuario: req.session.datos,
    titulo: "Promedios Generales",
    promedioGrupal: promedioGrupal
}); */

module.exports = controlador;
