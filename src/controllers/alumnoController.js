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
<table class="table table-bordered" id="TablaAlumnos">
    <thead>
        <tr>
            <th>Matricula</th>
            <th>Nombre</th>
            <th>Paterno</th>
            <th>Materno</th>
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
        <td>${resultados[i].Nombre}</td>
        <td>${resultados[i].Paterno}</td>
        <td>${resultados[i].Materno}</td>
        <td>${resultados[i].Genero}</td>
        <td>${new Date(resultados[i].FechaNac).toLocaleDateString()}</td>
        <td style="display: none;">${resultados[i].FechaNac}</td>
        <td>${resultados[i].Edad}</td>
        <td>Col: ${resultados[i].Colonia}, C: ${resultados[i].Calle}, N: ${resultados[i].Numero}</td>
        <td width="50"><button class="btn btn-sm btn-warning editarAlumno" data-matricula="${resultados[i].Matricula}">Editar</button></td>
        <td width="50"><button class="btn btn-sm btn-danger eliminarAlumno" data-matricula="${resultados[i].Matricula}">Eliminar</button></td>
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



/* controlador.editar = (req, res) => {
  const { OldMatricula } = req.params;
  const nuevaInfo = {
    Matricula: req.body.tfMatricula,
    Nombre: req.body.tfNombre,
    Paterno: req.body.tfPaterno,
    Materno: req.body.tfMaterno,
    Genero: req.body.tfSexo,
    FechaNac: req.body.tfFechaNac,
    Edad: req.body.tfEdad,
    Colonia: req.body.tfColonia,
    Calle: req.body.tfCalle,
    Numero: req.body.tfNumero
  };

  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error en la conexión:", err);
      return res.status(500).send("Error en la conexión");
    }
    conn.query("UPDATE alumnos SET Matricula = ?, Nombre = ?, Paterno = ?, Materno = ?, Genero = ?, FechaNac = ?, Edad = ?, IdDomicilio = ? WHERE Matricula = ?",
      [nuevaInfo.Matricula, nuevaInfo.Nombre, nuevaInfo.Paterno, nuevaInfo.Materno, nuevaInfo.Genero, nuevaInfo.FechaNac, nuevaInfo.Edad, nuevaInfo.IdDomicilio, OldMatricula],
      (error, resultados) => {
        if (error) {
          console.error("Error en la consulta:", error);
          return res.status(500).send("Error en la consulta");
        }
        // Obtener la fila actualizada desde la base de datos
        conn.query("SELECT * FROM alumnos WHERE Matricula = ?", [nuevaInfo.Matricula], (error, filaActualizada) => {
          if (error) {
            console.error("Error en la consulta:", error);
            return res.status(500).send("Error en la consulta");
          }
          res.json({ filaActualizada: filaActualizada[0] });
        });
      });
  });
}; */


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
