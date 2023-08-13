$(document).ready(function () {

    // Función para actualizar la tabla de materias
    function actualizarTablaMaterias(cuatrimestre) {
        $.ajax({
            url: "/materias/mostrarC",
            data: { cuatrimestre: cuatrimestre },
            type: "GET"
        }).done(function (resultado) {
            $("#TablaMaterias").html(resultado);
        });
    }

    // Evento al hacer clic en el botón de editar materia
    $(document).on("click", ".editarMateria", function () {
        var ClaveMat = $(this).data("clave");
        var fila = $("#" + ClaveMat);
        var celdas = fila.find("td");

        // Actualizar botón para edición
        $("#form-btn-agregar")
            .removeClass("btn-success")
            .addClass("btn-warning")
            .text("Modificar")
            .attr("id", "form-edit-btn");

        var inputClaveMatOld = $("#ClaveMat_old");
        if (inputClaveMatOld.length > 0) {
            inputClaveMatOld.remove();
        }

        inputClaveMatOld = $("<input>")
            .attr("type", "hidden")
            .attr("name", "ClaveMat_old")
            .attr("id", "ClaveMat_old")
            .val(ClaveMat);

        $("#formularioMateria").append(inputClaveMatOld);

        $("#tfClave").val(celdas.eq(1).text().trim());
        $("#tfNombre").val(celdas.eq(2).text().trim());
        $("#tfCuatrimestre").val(celdas.eq(3).text().trim());

        $("#staticBackdrop").modal("show");
    });

    // Evento al hacer clic en el botón de agregar nueva materia o abrir el formulario de agregar materia
    $("#modalMaterias").on("click", function () {

        // Actualizar botón para adición
        $("#form-edit-btn")
            .removeClass("btn-warning")
            .addClass("btn-success")
            .text("Registrar")
            .attr("id", "form-btn-agregar");

        var inputClaveMatOld = $("#ClaveMat_old");
        if (inputClaveMatOld.length > 0) {
            inputClaveMatOld.remove();
        }

        var cuatrimestreDePagina = $("#filtroCuatrimestre").val();

        if (cuatrimestreDePagina !== "0") { // Cambiado de 0 a "0"
            $("#tfClave").val("");
            $("#tfNombre").val("");
            $("#tfCuatrimestre").val(cuatrimestreDePagina);
            $("#tfCuatrimestre").attr("selected", true);
            $("#tfCuatrimestre").attr("disabled", true); 
        } else {
            $("#tfCuatrimestre").val("");
            $("#tfClave").val("");
            $("#tfNombre").val("");
            $("#tfCuatrimestre").removeAttr("disabled"); 
        }

        $("#staticBackdrop").modal("show");
    });

    $(document).on("click", "#form-btn-agregar", function () {

        var Clave = $("#tfClave").val();
        var Nombre = $("#tfNombre").val();
        var Cuatrimestre = $("#tfCuatrimestre").val();
        var cuatrimestreDePagina = $("#filtroCuatrimestre").val();

        var datos = {
            tfClave: Clave,
            tfNombre: Nombre,
            tfCuatrimestre: Cuatrimestre,
        };



        $.ajax({
            url: "/materias/agregar",
            data: datos,
            type: "POST"
        }).done(function (resultado) {

            console.log(resultado);

            if (resultado !== cuatrimestreDePagina) {
                resultado = cuatrimestreDePagina;
            }
            actualizarTablaMaterias(resultado);
            $("#staticBackdrop").modal("hide");
        });
    });

    // Evento al hacer clic en el botón de editar materia (edición confirmada)
    $(document).on("click", "#form-edit-btn", function () {
        var nuevaClave = $("#tfClave").val();
        var nuevoNombre = $("#tfNombre").val();
        var nuevoCuatrimestre = $("#tfCuatrimestre").val();
        var claveMatOld = $("#ClaveMat_old").val();
        var cuatrimestreDePagina = $("#filtroCuatrimestre").val();

        var datos = {
            ClaveMat: nuevaClave,
            Nombre: nuevoNombre,
            Cuatrimestre: nuevoCuatrimestre,
            ClaveMat_old: claveMatOld
        };

        $.ajax({
            url: "/materias/editar/" + claveMatOld,
            data: datos,
            type: "POST"
        }).done(function (resultado) {
            if (resultado !== cuatrimestreDePagina) {
                resultado = cuatrimestreDePagina;
            }
            actualizarTablaMaterias(resultado);
            $("#staticBackdrop").modal("hide");
        });
    });

    // Evento al hacer clic en el botón de eliminar materia
    $(document).on("click", ".eliminarMateria", function () {
        var claveMat = $(this).data("clave");
        var fila = $("#" + claveMat);
        var celdas = fila.find("td");
        var cuatrimestre = celdas.eq(3).text().trim();
        var cuatrimestreDePagina = $("#filtroCuatrimestre").val();

        if (cuatrimestre !== cuatrimestreDePagina) {
            cuatrimestre = cuatrimestreDePagina;
        }

        $.ajax({
            url: "/materias/eliminar",
            data: { ClaveMat: claveMat, cuatrimestre: cuatrimestre },
            type: "GET"
        }).done(function (resultado) {
            actualizarTablaMaterias(resultado);
        });
    });

    // Evento al cambiar la selección del cuatrimestre
    $("#filtroCuatrimestre").change(function () {
        var cuatrimestreSeleccionado = $(this).val();
        const CuatrimestreText = [
            "Todas las Materias",
            "Materias del 1° Cuatrimestre",
            "Materias del 2° Cuatrimestre",
            "Materias del 3° Cuatrimestre",
            "Materias del 4° Cuatrimestre",
            "Materias del 5° Cuatrimestre",
            "Materias del 6° Cuatrimestre",
            "Materias del 7° Cuatrimestre",
            "Materias del 8° Cuatrimestre",
            "Materias del 9° Cuatrimestre",
            "Materias del 10° Cuatrimestre",
            "Materias del 11° Cuatrimestre",
            "Materias del 12° Cuatrimestre Final"
        ];

        actualizarTablaMaterias(cuatrimestreSeleccionado);
        $("#tituloPrincipal").text(CuatrimestreText[cuatrimestreSeleccionado]);
    });

    // Evento para buscar por nombre
    $("#buscador").keyup(function () {
        var texto = $(this).val().toLowerCase();

        $("#TablaMaterias tbody tr").hide();
        $("#TablaMaterias tbody tr").each(function () {
            if ($(this).text().toLowerCase().indexOf(texto) !== -1) {
                $(this).show();
            }
        });
    });
});
