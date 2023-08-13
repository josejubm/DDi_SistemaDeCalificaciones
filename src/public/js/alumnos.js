$(document).ready(function () {

    // Función para actualizar la tabla de alumnos y resaltar una fila específica
    function actualizarTablaAlumnos(genero, matriculaResaltar) {
        $.ajax({
            url: "/alumnos/mostrarGenero",
            data: { genero: genero },
            type: "GET"
        }).done(function (resultado) {
            $("#TablaAlumnos").html(resultado);

            if (matriculaResaltar) {
                const filaResaltar = $("#" + matriculaResaltar);

                if (filaResaltar.length > 0) {
                    // Agrega el resaltado a la fila específica
                    filaResaltar.css("background-color", "#a0d995"); // Cambia el color según tus preferencias

                    // Espera un tiempo (por ejemplo, 3000 ms) y elimina el color amarillo
                    setTimeout(function () {
                        filaResaltar.css("background-color", "");
                    }, 2000); // Cambia el valor según la duración que desees
                }
            }
        });
    }

    // Evento al hacer clic en el botón de editar Alumno
    $(document).on("click", ".editarAlumno", function () {
        var Matricula = $(this).data("matricula");
        var fila = $("#" + Matricula);
        var celdas = fila.find("td");

        // Actualizar botón para edición
        $("#form-btn-agregar")
            .removeClass("btn-success")
            .addClass("btn-warning")
            .text("Modificar")
            .attr("id", "form-edit-btn")
            .attr("type", "button"); // Cambia el atributo type a "button"


        var inputMatriculaOld = $("#Matricula_old");
        if (inputMatriculaOld.length > 0) {
            inputMatriculaOld.remove();
        }

        inputMatriculaOld = $("<input>")
            .attr("type", "hidden")
            .attr("name", "Matricula_old")
            .attr("id", "Matricula_old")
            .val(Matricula);

        $("#formularioAlumno").append(inputMatriculaOld);
        $("#formularioAlumno").attr("action", "");

        $("#tfMatricula").val(celdas.eq(0).text().trim());
        $("#tfNombre").val(celdas.eq(1).text().trim());
        $("#tfPaterno").val(celdas.eq(2).text().trim());
        $("#tfMaterno").val(celdas.eq(3).text().trim());
        $("#tfSexo").val(celdas.eq(4).text().trim());
        $("#tfFechaNac").val(new Date(celdas.eq(6).text().trim()).toLocaleDateString('en-CA'));
        $("#tfEdad").val(celdas.eq(7).text().trim());



        var domicilioText = celdas.eq(8).text().trim();
        var domicilioParts = domicilioText.split(",");
        $("#tfColonia").val(domicilioParts[0].split(":")[1].trim());
        $("#tfCalle").val(domicilioParts[1].split(":")[1].trim());
        $("#tfNumero").val(domicilioParts[2].split(":")[1].trim());

        $("#staticBackdrop").modal("show");
    });


    // Evento al hacer clic en el botón de agregar nuevo alumno o abrir el formulario de agregar alumno
    $("#modalAlumnos").on("click", function () {

        // Actualizar botón para adición
        $("#form-edit-btn")
            .removeClass("btn-warning")
            .addClass("btn-success")
            .text("Registrar")
            .attr("id", "form-btn-agregar")
            .attr("type", "submit");

        var inputMatriculaOld = $("#Matricula_old");
        if (inputMatriculaOld.length > 0) {
            inputMatriculaOld.remove();
        }

        $("#formularioAlumno").attr("action", "/alumnos/agregar");

        // Aquí puedes establecer los valores por defecto o limpiar los campos del formulario según tus necesidades
        $("#tfMatricula").val("");
        $("#tfNombre").val("");
        $("#tfPaterno").val("");
        $("#tfMaterno").val("");
        $("#tfSexo").val("");
        $("#tfFechaNac").val("");
        $("#tfEdad").val("");
        $("#tfColonia").val("");
        $("#tfCalle").val("");
        $("#tfNumero").val("");

        $("#staticBackdrop").modal("show");
    });

    $(document).on("click", "#form-edit-btn", function () {
        var nuevaMatricula = $("#tfMatricula").val();
        var nuevoNombre = $("#tfNombre").val();
        var nuevoPaterno = $("#tfPaterno").val();
        var nuevoMaterno = $("#tfMaterno").val();
        var nuevoGenero = $("#tfSexo").val();
        var nuevaFechaNac = $("#tfFechaNac").val();
        var nuevaEdad = $("#tfEdad").val();
        var nuevoColonia = $("#tfColonia").val();
        var nuevoCalle = $("#tfCalle").val();
        var nuevoNumero = $("#tfNumero").val();
        var matriculaOld = $("#Matricula_old").val();
        var generoDePagina = $("#filtroSexo").val();

        var datos = {
            Matricula: nuevaMatricula,
            Nombre: nuevoNombre,
            Paterno: nuevoPaterno,
            Materno: nuevoMaterno,
            Genero: nuevoGenero,
            FechaNac: nuevaFechaNac,
            Edad: nuevaEdad,
            Colonia: nuevoColonia,
            Calle: nuevoCalle,
            Numero: nuevoNumero,
            Matricula_old: matriculaOld
        };

        $.ajax({
            url: "/alumnos/editar/" + matriculaOld,
            data: datos,
            type: "POST"
        }).done(function (resultado) {
            // Obtén la matrícula nueva y el género desde el resultado
            const matriculaNueva = resultado.MatriculaNueva;
            let generoNuevo = resultado.Genero;
            console.log(generoNuevo);

            if (generoNuevo !== generoDePagina) {
                 generoNuevo = generoDePagina;
            }

            console.log(generoNuevo + " el local es:"+generoDePagina);

            // Llama a la función de actualización de la tabla con la matrícula nueva
            actualizarTablaAlumnos(generoNuevo, matriculaNueva);
            $("#staticBackdrop").modal("hide");
        });
        
    });


    // Evento al hacer clic en el botón de eliminar Alumno
    $(document).on("click", ".eliminarAlumno", function () {
        var matricula = $(this).data("matricula");
        var fila = $("#" + matricula);
        var celdas = fila.find("td");
        var genero = celdas.eq(4).text().trim();
        var generoDePagina = $("#filtroSexo").val();
        console.log(genero);

        if (genero !== generoDePagina) {
            genero = generoDePagina;
        }

        $.ajax({
            url: "/alumnos/eliminar",
            data: { Matricula: matricula, Genero: genero },
            type: "GET"
        }).done(function (resultado) {
            console.log(resultado);
            actualizarTablaAlumnos(resultado);
        });
    });


    // Evento al cambiar la selección del Sexo
    $("#filtroSexo").change(function () {
        var sexoSeleccionado = $(this).val();
        const SexoText = {
            "0": "Todos",
            "M": "Todos Los Alumnos",
            "F": "Todas Las Alumnas"
        };

        actualizarTablaAlumnos(sexoSeleccionado);
        $("#tituloPrincipal").text(SexoText[sexoSeleccionado]);
    });

    // Evento para buscar por nombre
    $("#buscador").keyup(function () {
        var texto = $(this).val().toLowerCase();

        $("#TablaAlumnos tbody tr").hide();
        $("#TablaAlumnos tbody tr").each(function () {
            if ($(this).text().toLowerCase().indexOf(texto) !== -1) {
                $(this).show();
            }
        });
    });
});
