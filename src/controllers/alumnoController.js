const controlador = {};

controlador.mostrar = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) throw err;
    conn.query(`SELECT alumnos.Matricula, alumnos.Nombre, alumnos.Paterno, alumnos.Materno, alumnos.Genero, alumnos.FechaNac, alumnos.Edad,
                    domicilios.Colonia, domicilios.Calle, domicilios.Numero
                FROM alumnos, domicilios
                WHERE alumnos.IdDomicilio = domicilios.Id;`, (error, resultados) => {
      if (error) {
        res.json(error);
      }
      const usuario = req.session.usuario;
      if (usuario) res.render("alumnos.ejs", { data: resultados, 
                                                usuario,
                                                titulo: "INICIO ALUMNOS" });
      else res.redirect("/");
    });
  });
};

controlador.agregar = (req, res) => {
  const reg = {
    NL: parseInt(req.body.tfNL, 10),
    Nombre: req.body.tfNombre,
    Paterno: req.body.tfPaterno, 
    Materno: req.body.tfMaterno, 
  };

  req.getConnection((err, conn) => {
    if (err) throw err;

    console.log(reg);
    conn.query("INSERT INTO alumnos SET ?", [reg], (error, resultado) => {
      if (error) {
        res.json(error);
      }
      res.redirect("/alumnos");
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
  const { NL } = req.params;

  req.getConnection((err, conn) => {
    if (err) throw err;

    conn.query("DELETE FROM alumnos WHERE NL = ?", [NL], (error, resultados) => {
      if (error) {
        res.json(error);
      }
      res.redirect("/alumnos");
    });
  });
};

module.exports = controlador;
