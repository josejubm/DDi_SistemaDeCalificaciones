const moment = require('moment');
const controlador = {};

controlador.mostrar = (req, res) => {
  req.getConnection((errorConexion, conn) => {
    if (errorConexion) throw errorConexion;
    conn.query(`SELECT alumnos.Matricula, alumnos.Nombre, alumnos.Paterno, alumnos.Materno, alumnos.Genero, alumnos.FechaNac, alumnos.Edad,
        domicilios.Colonia, domicilios.Calle, domicilios.Numero
    FROM alumnos, domicilios
    WHERE alumnos.IdDomicilio = domicilios.Id;`, (error, resultados) => {
      if (error) {
        res.json(error);
      }
      const usuario = req.session.usuario;
      if (usuario) res.render("alumnos.ejs", {
        data: resultados,
        usuario,
        datosUsuario: req.session.datos,
        titulo: "INICIO AlUMNOS"
      });
      else res.redirect("/");
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

controlador.mostrarPorGenero = (req, res) => {
  const genero = req.query.genero;
  req.getConnection((errorConexion, conn) => {
    if (errorConexion) throw errorConexion;
    let query = `
      SELECT alumnos.Matricula, alumnos.Nombre, alumnos.Paterno, alumnos.Materno, alumnos.Genero, alumnos.FechaNac, alumnos.Edad,
      domicilios.Colonia, domicilios.Calle, domicilios.Numero
      FROM alumnos
      INNER JOIN domicilios ON alumnos.IdDomicilio = domicilios.Id`;
    const queryParams = [];

    if (genero !== "0") {
      query += " WHERE Genero = ?";
      queryParams.push(genero);
    }
    conn.query(query, queryParams, (error, resultados) => {
      if (error) {
        res.json({ error: error.message });
      }

      // Construir la tabla HTML con los resultados
      let tablaHtml = `
<table class="table table-bordered tablas" id="TablaAlumnos">
    <thead>
        <tr>
            <th>Matricula</th>
            <th>Nombre Completo</th>
            <th style="display: none;">Nombre</th>
            <th style="display: none;">Paterno</th>
            <th style="display: none;">Materno</th>
            <th>Genero</th>
            <th>Fecha de Nacimiento</th>
            <th style="display: none;">Fecha de OCULTO</th>
            <th>Edad</th>
            <th>Domicilio</th>
            <th colspan="2">Opciones</th>
        </tr>
    </thead>
    <tbody>
`;

      for (let i = 0; i < resultados.length; i++) {
        tablaHtml += `
    <tr id="${resultados[i].Matricula}">
        <td>${resultados[i].Matricula}</td>
        <td>${resultados[i].Nombre + ' ' + resultados[i].Paterno + ' ' + resultados[i].Materno}</td>
        <td style="display: none;">${resultados[i].Nombre}</td>
        <td style="display: none;">${resultados[i].Paterno}</td>
        <td style="display: none;">${resultados[i].Materno}</td>
        <td>${resultados[i].Genero}</td>
        <td>${new Date(resultados[i].FechaNac).toLocaleDateString()}</td>
        <td style="display: none;">${resultados[i].FechaNac}</td>
        <td>${resultados[i].Edad}</td>
        <td>Col: ${resultados[i].Colonia}, C: ${resultados[i].Calle}, N: ${resultados[i].Numero}</td>
        <td width="50">
            <button class="btn btn-sm btn-warning editarAlumno"
                data-matricula="${resultados[i].Matricula}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                </svg>Editar</button>
        </td>
        <td width="50">
            <button class="btn btn-sm btn-danger mostrarMatriculaBtn"
                data-matricula="${resultados[i].Matricula}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
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

const puppeteer = require('puppeteer');
const PDFDocument = require('pdfkit');
const fs = require('fs');


/* controlador.generarBoletaPDF = async (req, res) => {
  const { matricula } = req.params;

  try {
    req.getConnection((errorConexion, conn) => {
      if (errorConexion) {
        console.error('Error de conexión:', errorConexion);
        res.status(500).send('Error al generar el PDF');
        return;
      }

      // Consulta para obtener los datos del alumno por matrícula
      conn.query('SELECT * FROM alumnos WHERE Matricula = ?', [matricula], async (errorConsulta, [alumnoData]) => {
        if (errorConsulta) {
          console.error('Error en la consulta:', errorConsulta);
          res.status(500).send('Error al generar el PDF');
          return;
        }

        if (!alumnoData) {
          return res.status(404).send('Alumno no encontrado');
        }

        // Consulta para obtener las calificaciones del alumno por matrícula
        conn.query('SELECT * FROM calificaciones WHERE Matricula = ?', [matricula], (errorCalificaciones, calificaciones) => {
          if (errorCalificaciones) {
            console.error('Error en la consulta de calificaciones:', errorCalificaciones);
            res.status(500).send('Error al generar el PDF');
            return;
          }

          // Crear el contenido del PDF utilizando PDFKit
          const pdfDoc = new PDFDocument();
          const pdfFilePath = `alumno_${matricula}.pdf`; // Nombre del archivo PDF

          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `inline; filename=${pdfFilePath}`);

          pdfDoc.pipe(res);

          // Encabezado
          pdfDoc.fontSize(18).text('Boleta de Calificaciones', { align: 'center' });

          // Datos del Alumno
          pdfDoc.fontSize(14).text('Alumno', { underline: true });
          pdfDoc.text(`Nombre: ${alumnoData.Nombre} ${alumnoData.Paterno} ${alumnoData.Materno}`);
          pdfDoc.text(`Matrícula: ${alumnoData.Matricula}`);
          pdfDoc.text(`Fecha de Nacimiento: ${alumnoData.FechaNac}`);
          pdfDoc.text(`Edad: ${alumnoData.Edad}`);

          // Tabla de Calificaciones
          pdfDoc.fontSize(14).text('Calificaciones', { underline: true });
          pdfDoc.text('Materia    Parcial 1    Parcial 2    Parcial 3    Promedio');
          pdfDoc.text('-------------------------------------------------------');
          calificaciones.forEach(calificacion => {
            pdfDoc.text(`${calificacion.Materia}    ${calificacion.Parcial1}            ${calificacion.Parcial2}            ${calificacion.Parcial3}            ${calificacion.Promedio}`);
          });

          pdfDoc.end();
        });
      });
    });
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    res.status(500).send('Error al generar el PDF');
  }
}; */

controlador.generarBoletaPDF = async (req, res) => {
  const { matricula } = req.params;

  try {
    req.getConnection(async (errorConexion, conn) => {
      if (errorConexion) {
        console.error('Error de conexión:', errorConexion);
        res.status(500).send('Error al generar el PDF');
        return;
      }

      // Consulta para obtener los datos del alumno por matrícula
      conn.query('SELECT * FROM alumnos WHERE Matricula = ?', [matricula], async (errorConsulta, [alumnoData]) => {
        if (errorConsulta) {
          console.error('Error en la consulta:', errorConsulta);
          res.status(500).send('Error al generar el PDF');
          return;
        }

        if (!alumnoData) {
          return res.status(404).send('Alumno no encontrado');
        }

        // Consulta para obtener las calificaciones con nombre de materia y cuatrimestre
        const query = `
          SELECT m.Nombre AS Materia, m.Cuatrimestre, c.Parcial1, c.Parcial2, c.Parcial3, c.Extra
          FROM calificaciones c
          INNER JOIN materias m ON c.ClaveMat = m.ClaveMat
          WHERE c.Matricula = ?
        `;
        conn.query(query, [matricula], async (errorCalificaciones, calificaciones) => {
          if (errorCalificaciones) {
            console.error('Error en la consulta de calificaciones:', errorCalificaciones);
            res.status(500).send('Error al generar el PDF');
            return;
          }

          // Organizar calificaciones por cuatrimestre
          const tablaPorCuatrimestre = {};
          calificaciones.forEach((calificacion) => {
            if (!tablaPorCuatrimestre[calificacion.Cuatrimestre]) {
              tablaPorCuatrimestre[calificacion.Cuatrimestre] = [];
            }
            tablaPorCuatrimestre[calificacion.Cuatrimestre].push(calificacion);
          });

          // Inicializar Puppeteer
          const browser = await puppeteer.launch();
          const page = await browser.newPage();

          // Crear contenido HTML con estilos Bootstrap
          const CuatrimestreText = [
            "Todos los cuatrimestres",
            "1° Cuatrimestre",
            "2° Cuatrimestre",
            "3° Cuatrimestre",
            "4° Cuatrimestre",
            "5° Cuatrimestre",
          ];

          const contenidoHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
              <title>Boleta de Calificaciones</title>
            </head>
            <body>
              <div class="container mt-5">
                <h2 class="text-center">Boleta de Calificaciones</h2>
                <h3 class="mt-4">Alumno</h3>
                <p>Nombre: ${alumnoData.Nombre} ${alumnoData.Paterno} ${alumnoData.Materno}</p>
                <p>Matrícula: ${alumnoData.Matricula}</p>
                <p>Fecha de Nacimiento: ${alumnoData.FechaNac}</p>
                <p>Edad: ${alumnoData.Edad}</p>
                <h3 class="mt-4">Calificaciones</h3>
                ${Object.entries(tablaPorCuatrimestre)
                  .map(([cuatrimestre, calificacionesPorCuatrimestre]) => `
                    <h4 class="mt-3">${CuatrimestreText[cuatrimestre]}</h4>
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Nombre materia</th>
                          <th>Parcial 1</th>
                          <th>Parcial 2</th>
                          <th>Parcial 3</th>
                          <th>Extra</th>
                          <th>Promedio</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${calificacionesPorCuatrimestre
                          .map((calificacion) => `
                            <tr>
                              <td>${calificacion.Materia}</td>
                              <td>${calificacion.Parcial1}</td>
                              <td>${calificacion.Parcial2}</td>
                              <td>${calificacion.Parcial3}</td>
                              <td>${calificacion.Extra}</td>
                              <td>${parseFloat(((calificacion.Parcial1 + calificacion.Parcial2 + calificacion.Parcial3) / 3).toFixed(1))}</td>
                            </tr>
                          `)
                          .join('')}
                          <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>PROMEDIO CUATRIMESTRAL</td>
                          <td>  ${
                            parseFloat(
                              (
                                calificacionesPorCuatrimestre.reduce(
                                  (sum, calificacion) =>
                                    sum + (calificacion.Parcial1 + calificacion.Parcial2 + calificacion.Parcial3) / 3,
                                  0
                                ) / calificacionesPorCuatrimestre.length
                              ).toFixed(1)
                            )
                          } </td>
                          </tr>
                      </tbody>
                    </table>
                  `)
                  .join('')}
              </div>
            </body>
            </html>
          `;

          // Generar el PDF con Puppeteer
          await page.setContent(contenidoHTML);
          const pdf = await page.pdf({
            format: 'Letter',
            printBackground: true,
            margin: {
              top: '20px',
              bottom: '20px',
              left: '20px',
              right: '20px'
            }
          });

          // Cerrar Puppeteer
          await browser.close();

          // Enviar el PDF como respuesta
          res.contentType('application/pdf');
          res.send(pdf);
        });
      });
    });
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    res.status(500).send('Error al generar el PDF');
  }
};

module.exports = controlador;
