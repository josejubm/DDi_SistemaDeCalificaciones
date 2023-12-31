const controlador = {};

controlador.iniciarD = (req, res) => {
    const datosUsuario = {
        usuario: req.body.tfUsuario,
        password: req.body.tfPassword
    };
    req.getConnection((err, conn) => {
        if (err) throw err;
        conn.query("SELECT * FROM docentes WHERE Usuario=? AND Contrasena=?", [datosUsuario.usuario, datosUsuario.password], (error, rows) => {
            if (error) {
                res.json({ error: error.message });
                return;
            }
            if (rows.length == 1) {
                const docente = rows[0]; // Obtiene el primer docente de la lista
                req.session.usuario = datosUsuario.usuario;
                req.session.password = datosUsuario.password;
                req.session.datos = docente;

                res.redirect("/home"); // Cambia la ruta de redirección según tu aplicación
            } else {
                res.redirect("/");
            }
        });
    });
};

controlador.cerrar = (req, res) => {
    delete req.session.usuario;
    delete req.session.password;
    delete req.session.nombreCompleto;
    delete req.session.cedula;

    res.redirect("/");
};

module.exports = controlador;
