const controlador = {};

controlador.mostrarCalificacionesPromedios = (req, res) => {
    const cuatrimestre = req.query.cuatrimestre;

    req.getConnection((errorConexion, conn) => {
        if (errorConexion) throw errorConexion;

        const query = `
            SELECT alumnos.Matricula, alumnos.Nombre, alumnos.Paterno, alumnos.Materno,
                   calificaciones.Parcial1, calificaciones.Parcial2, calificaciones.Parcial3, calificaciones.Extra,
                   materias.Nombre AS NombreMateria FROM calificaciones
            INNER JOIN alumnos ON calificaciones.Matricula = alumnos.Matricula
            INNER JOIN materias ON calificaciones.ClaveMat = materias.ClaveMat
            WHERE materias.Cuatrimestre = ?`;

        const queryParams = [cuatrimestre];

        conn.query(query, queryParams, (error, resultados) => {
            if (error) {
                res.json({ error: error.message });
            }

            // Calcular promedios individuales y promedio grupal
            const promediosIndividuales = {};
            let promedioGrupalSuma = 0;
            let contadorAlumnos = 0;

            resultados.forEach(resultado => {
                const parciales = [resultado.Parcial1, resultado.Parcial2, resultado.Parcial3];
                const sumaParciales = parciales.reduce((sum, parcial) => sum + (parcial || 0), 0);
                const cantidadParciales = parciales.filter(parcial => parcial !== null).length;
                const promedioParciales = cantidadParciales > 0 ? sumaParciales / cantidadParciales : 0;
                resultado.PromedioParciales = promedioParciales.toFixed(2);

                if (!promediosIndividuales[resultado.Matricula]) {
                    promediosIndividuales[resultado.Matricula] = [];
                }
                promediosIndividuales[resultado.Matricula].push(promedioParciales);

                promedioGrupalSuma += promedioParciales;
                contadorAlumnos++;
            });

            const promedioGrupal = contadorAlumnos > 0 ? promedioGrupalSuma / contadorAlumnos : 0;

            res.render('promediosGenerales.ejs', {
                data: resultados,
                promediosIndividuales,
                promedioGrupal
            });
        });
    });
};

module.exports = controlador;
