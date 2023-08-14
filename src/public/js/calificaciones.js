$(document).ready(function () {

    // Evento para buscar por nombre
    $("#buscador").keyup(function () {
        var texto = $(this).val().toLowerCase();

        $("#TablaCalificaciones tbody tr").hide();
        $("#TablaCalificaciones tbody tr").each(function () {
            if ($(this).text().toLowerCase().indexOf(texto) !== -1) {
                $(this).show();
            }
        });
    });

    $("#tfCuatrimestre").on("change", function () {
        var cuatrimestreSeleccionado = $(this).val();

        var datos = {
            cuatrimestre: cuatrimestreSeleccionado,
        };

        $.ajax({
            url: "/calificaciones/materias",
            data: datos,
            type: "GET"
        }).done(function (resultados) {

            // Limpiar y actualizar el select de materias
            var selectMaterias = $("#tfMateria");
            selectMaterias.empty();
            selectMaterias.append('<option value="" disabled selected>Seleccione una materia</option>');

            // Agregar las opciones de materias obtenidas
            for (var i = 0; i < resultados.length; i++) {
                selectMaterias.append(`<option value="${resultados[i].ClaveMat}">${resultados[i].Nombre}</option>`);
            }
            // Habilitar el select de materias
            selectMaterias.prop("disabled", false);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("Error en la solicitud AJAX:", textStatus, errorThrown);
        });
    });

    $("#mostrarCalificaciones").on("click", function () {
        var materiaSeleccionada = $("#tfMateria").val();
        var cuatrimestreSeleccionado = $("#tfCuatrimestre").val();

        var datos = {
            cuatrimestre: cuatrimestreSeleccionado,
            materia: materiaSeleccionada
        };

        $.ajax({
            url: "/calificaciones/mostrarCal",
            data: datos,
            type: "POST",
            dataType: "json" // Especificar que se espera una respuesta en formato JSON
        }).done(function (resultados) {
            // Construir la tabla HTML con los resultados de calificaciones
            var tablaHtml = `<table class="table table-bordered" id="TablaCalificaciones">
                    <thead>
                        <tr>
                            <th>Matricula</th>
                            <th>Nombre</th>
                            <th>Paterno</th>
                            <th>Materno</th>
                            <th>Parcial 1</th>
                            <th>Parcial 2</th>
                            <th>Parcial 3</th>
                            <th>Extra</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            for (var i = 0; i < resultados.length; i++) {
                tablaHtml += `
                    <tr>
                        <td>${resultados[i].Matricula}</td>
                        <td>${resultados[i].Nombre}</td>
                        <td>${resultados[i].Paterno}</td>
                        <td>${resultados[i].Materno}</td>
                        <td>${resultados[i].Parcial1}</td>
                        <td>${resultados[i].Parcial2}</td>
                        <td>${resultados[i].Parcial3}</td>
                        <td>${resultados[i].Extra}</td>
                    </tr>
                `;
            }

            tablaHtml += `
                    </tbody>
                </table>
            `;

            $("#MostrarTablaCalificaciones").html(tablaHtml);

            const CuatrimestreText = [
                "Todos los cuatrimestres",
                "1° Cuatrimestre",
                "2° Cuatrimestre",
                "3° Cuatrimestre",
                "4° Cuatrimestre",
                "5° Cuatrimestre",
            ];

            $("#tituloTabla").html(`Calificaciones de ${resultados[1].NombreMateria} del ${CuatrimestreText[cuatrimestreSeleccionado]}`);

        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("Error en la solicitud AJAX:", textStatus, errorThrown);
        });
    });

    
});