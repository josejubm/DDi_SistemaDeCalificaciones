
const controlador = {};

controlador.iniciar = (req, res) => {

    const datosUsuario = { usuario: req.body.tfUsuario, password: req.body.tfPassword };

    req.getConnection((err, conn) => {
        if (err) throw err;

        conn.query("SELECT * FROM docentes WHERE Usuario=? AND Contrasena=?", [datosUsuario.usuario, datosUsuario.password], (error, row) => {
            if (row.length == 1) {
                req.session.usuario = datosUsuario.usuario;
                req.session.password = datosUsuario.password;
                res.redirect("/home");
            }
            else {
                res.redirect("/");
            }
        })
    })
}

controlador.cerrar = (req, res) => {
    delete req.session.usuario;
    delete req.session.password;

    res.redirect("/");
};

module.exports = controlador;