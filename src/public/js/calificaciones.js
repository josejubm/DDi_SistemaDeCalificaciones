$(document).ready(function () {
    $("#tfMateria").prop("disabled", true);
    $("#tfParcial").prop("disabled", true);
    $("#mostrarCalificaciones").prop("disabled", true);

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
            var selectMaterias = $("#tfMateria");

            // Verificar si es la primera vez que se agrega una opción
            var isFirstOption = selectMaterias.find("option").length === 1;

            // Limpiar y actualizar el select de materias
            selectMaterias.empty();
            selectMaterias.append('<option value="" disabled selected>Seleccione una materia</option>');

            // Agregar las opciones de materias obtenidas
            for (var i = 0; i < resultados.length; i++) {
                selectMaterias.append(`<option value="${resultados[i].ClaveMat}">${resultados[i].Nombre}</option>`);
            }

            // Habilitar el select de materias solo si no es la primera opción
            if (!isFirstOption) {
                selectMaterias.prop("disabled", false);
            }

            // Habilitar el select de parcial y el botón de mostrar calificaciones
            $("#tfMateria").prop("disabled", false);
            $("#tfParcial").prop("disabled", false);
            $("#mostrarCalificaciones").prop("disabled", false);

        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("Error en la solicitud AJAX:", textStatus, errorThrown);
        });
    });

    /*  // Evento al hacer clic en "Mostrar Calificaciones"
     $("#mostrarCalificaciones").on("click", function () {
         var materiaSeleccionada = $("#tfMateria").val();
         var cuatrimestreSeleccionado = $("#tfCuatrimestre").val();
         var parcialSeleccionado = $("#tfParcial").val();
 
         var datos = {
             cuatrimestre: cuatrimestreSeleccionado,
             materia: materiaSeleccionada,
             parcial: parcialSeleccionado
         };
         $.ajax({
             url: "/calificaciones/mostrarCal",
             data: datos,
             type: "POST",
             dataType: "json"
         }).done(function (resultados) {
             var tablaHtml = `
                 <table class="table table-bordered" id="TablaCalificaciones">
                     <thead>
                         <tr>
                             <th>Matricula</th>
                             <th>Nombre del Alumno</th>
                             ${parcialSeleccionado === "0" || parcialSeleccionado === "1" ? '<th>Primer Parcial</th>' : ''}
                             ${parcialSeleccionado === "0" || parcialSeleccionado === "2" ? '<th>Segundo Parcial</th>' : ''}
                             ${parcialSeleccionado === "0" || parcialSeleccionado === "3" ? '<th>Tercer Parcial</th>' : ''}
                             ${parcialSeleccionado === "0" || parcialSeleccionado === "4" ? '<th>Extraordinario</th>' : ''}
                             <th><button id="modificarTodo"class="btn btn-outline-warning" > Cambiar Todo </button> </th>
                         </tr>
                     </thead>
                     <tbody>
             `;
 
             for (var i = 0; i < resultados.length; i++) {
                 tablaHtml += `
                     <tr id="${resultados[i].Matricula}">
                         <td>${resultados[i].Matricula}</td>
                         <td>${resultados[i].Nombre} ${resultados[i].Paterno} ${resultados[i].Materno}</td>
                         ${parcialSeleccionado === "0" || parcialSeleccionado === "1" ? `<td>${resultados[i].Parcial1}</td>` : ''}
                         ${parcialSeleccionado === "0" || parcialSeleccionado === "2" ? `<td>${resultados[i].Parcial2}</td>` : ''}
                         ${parcialSeleccionado === "0" || parcialSeleccionado === "3" ? `<td>${resultados[i].Parcial3}</td>` : ''}
                         ${parcialSeleccionado === "0" || parcialSeleccionado === "4" ? `<td>${resultados[i].Extra}</td>` : ''}
                         <td><button class="btn btn-outline-warning modificarCal" data-id="${resultados[i].Matricula}">Cambiar</button></td>
                     </tr>
                 `;
             }
 
             tablaHtml += `
                     </tbody>
                 </table>
                 <br>
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
 
             // Habilitar eventos para editar calificaciones individuales
             $(".modificarCal").on("click", function () {
                 var matricula = $(this).data("id");
                 var fila = $("#" + matricula);
                 var celdas = fila.find("td");
 
                 celdas.each(function (index) {
                     if (index > 1) {
                         var valorAnterior = $(this).text();
                         $(this).html(`<input type="text" class="form-control" value="${valorAnterior}" />`);
                     }
                 });
             });
 
             // Evento para cambiar todos los valores de los parciales
             $("#modificarTodo").on("click", function () {
                 var filas = $("#TablaCalificaciones tbody tr");
 
                 filas.each(function () {
                     var fila = $(this);
                     var celdas = fila.find("td");
 
                     celdas.each(function (index) {
                         if (index > 1) {
                             var valorAnterior = $(this).text();
                             $(this).html(`<input type="text" class="form-control" value="${valorAnterior}" />`);
                         }
                     });
                 });
             });
 
             // ... (otros eventos y funciones si los necesitas)
         }).fail(function (jqXHR, textStatus, errorThrown) {
             console.log("Error en la solicitud AJAX:", textStatus, errorThrown);
         });
     }); */

    // Evento para mostrar calificaciones
    $("#mostrarCalificaciones").on("click", function () {
        var materiaSeleccionada = $("#tfMateria").val();
        var cuatrimestreSeleccionado = $("#tfCuatrimestre").val();
        var parcialSeleccionado = $("#tfParcial").val();

        var datos = {
            cuatrimestre: cuatrimestreSeleccionado,
            materia: materiaSeleccionada,
            parcial: parcialSeleccionado
        };
        $.ajax({
            url: "/calificaciones/mostrarCal",
            data: datos,
            type: "POST",
            dataType: "json"
        }).done(function (resultados) {
            // Construir la tabla HTML con los resultados de calificaciones
            var tablaHtml = `<table class="table table-bordered" id="TablaCalificaciones">
                        <thead>
                            <tr>
                                <th>Matricula</th>
                                <th>Nombre del Alumno</th>
                                ${parcialSeleccionado === "0" || parcialSeleccionado === "1" ? '<th>Primer Parcial</th>' : ''}
                                ${parcialSeleccionado === "0" || parcialSeleccionado === "2" ? '<th>Segundo Parcial</th>' : ''}
                                ${parcialSeleccionado === "0" || parcialSeleccionado === "3" ? '<th>Tercer Parcial</th>' : ''}
                                ${parcialSeleccionado === "0" || parcialSeleccionado === "4" ? '<th>Extraordinario</th>' : ''}
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

            for (var i = 0; i < resultados.length; i++) {
                tablaHtml += `
                        <tr id="${resultados[i].Matricula}">
                            <td>${resultados[i].Matricula}</td>
                            <td>${resultados[i].Nombre} ${resultados[i].Paterno} ${resultados[i].Materno}</td>
                            ${parcialSeleccionado === "0" || parcialSeleccionado === "1" ? `<td>${resultados[i].Parcial1}</td>` : ''}
                            ${parcialSeleccionado === "0" || parcialSeleccionado === "2" ? `<td>${resultados[i].Parcial2}</td>` : ''}
                            ${parcialSeleccionado === "0" || parcialSeleccionado === "3" ? `<td>${resultados[i].Parcial3}</td>` : ''}
                            ${parcialSeleccionado === "0" || parcialSeleccionado === "4" ? `<td>${resultados[i].Extra}</td>` : ''}
    
                            <td><button class="btn btn-outline-warning modificarCal" data-id="${resultados[i].Matricula}">Cambiar</button></td>
                        </tr>
                    `;
            }

            tablaHtml += `
                        </tbody>
                    </table>
                    <br>
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

            $("#tituloTabla").html(`Calificaciones de ${resultados[0].NombreMateria} del ${CuatrimestreText[cuatrimestreSeleccionado]}`);

        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("Error en la solicitud AJAX:", textStatus, errorThrown);
        });
    });

    $(document).on("click", ".modificarCal", function () {
        var matricula = $(this).data("id");
        var fila = $("#" + matricula);
        var celdas = fila.find("td");

        var parcialesVisible = []; // Array para almacenar índices de columnas de parciales visibles
        celdas.each(function (index) {
            if (index > 1 && index < 3) {
                parcialesVisible.push(index);
                var valorAnterior = $(this).text();
                $(this).data("valorAnterior", valorAnterior); // Guardar el valor actual en valorAnterior
                $(this).html(`<input type="text" class="form-control" value="${valorAnterior}" />`);
            } else if (index === 3) {
                $(this).html(`
                        <button class="btn btn-outline-secondary cancelarCambios">Cancelar</button>
                        <button class="btn btn-outline-success confirmarCambios">Confirmar</button>
                    `);
            }
        });

        // Agregar atributos de parciales visibles y matrícula al botón de Confirmar
        $(".confirmarCambios").data("parcialesVisible", parcialesVisible);
        $(".confirmarCambios").data("matricula", matricula);
    });


    $(document).on("click", ".cancelarCambios", function () {
        var celdas = $(this).closest("tr").find("td");

        celdas.each(function (index) {
            var input = $(this).find("input");  // Encuentra el input en la celda

            if (input.length > 0) {
                var valorAnterior = $(this).data("valorAnterior");
                $(input).remove();  // Elimina el input

                console.log(valorAnterior);
                $(this).html(valorAnterior);

            } else if (index === 3) {
                $(this).html(`
                        <button class="btn btn-outline-warning modificarCal" data-id="${$(this).closest("tr").attr("id")}">Cambiar</button>
                    `);
            }
        });
    });


   /*  $(document).on("click", ".confirmarCambios", function () {
        var celdas = $(this).closest("tr").find("td");
        var parcialesVisible = $(this).data("parcialesVisible");
        var matricula = $(this).data("matricula");
        var parcialActual = $("#tfParcial").val();

        celdas.each(function (index) {
            if ($(this).find("input").length > 0 && parcialesVisible.includes(index)) {
                var nuevoValor = $(this).find("input").val();

                let parcial = "";  // Utilizamos let en lugar de const para que pueda ser reasignada

                if (parcialActual === 1) {
                    parcial = "Parcial1";
                } else if (parcialActual === 2) {
                    parcial = "Parcial2";
                } else if (parcialActual === 3) {
                    parcial = "Parcial3";
                } else {
                    parcial = "Extra";
                }

                console.log("Matrícula:", matricula);
                console.log("Parcial numero:", parcialActual);
                console.log("Parcial:", parcial);
                console.log("Nuevo valor:", nuevoValor);

                const datos = {
                    Matricula: matricula,
                    Parcial: parcial,
                    NuevaCal: nuevoValor
                };

                $.ajax({
                    url: "/calificaciones/modificar",
                    data: datos,
                    type: "POST",
                    success: function (resultado) {
                        console.log(resultado);

                    },
                    error: function (error) {
                        console.log("Error:", error);
                    }
                });

                $(this).html(nuevoValor);
            } else if (index === 3) {
                $(this).html(`
                     <button class="btn btn-outline-warning modificarCal" data-id="${$(this).closest("tr").attr("id")}">Cambiar</button>
                 `);
            }
        });
    }); */


     $(document).on("click", ".confirmarCambios", function () {
         var celdas = $(this).closest("tr").find("td");
         var parcialesVisible = $(this).data("parcialesVisible");
         var matricula = $(this).data("matricula");
        /*  var parcialActual = $("#tfParcial").val(); */
        var parcialActual = parseInt($("#tfParcial").val());

        let parcial = ""; // Utilizamos let en lugar de const para que pueda ser reasignada

        if (parcialActual === 1) {
            parcial = "Parcial1";
        } else if (parcialActual === 2) {
            parcial = "Parcial2";
        } else if (parcialActual === 3) {
            parcial = "Parcial3";
        } else {
            parcial = "Extra";
        }

         celdas.each(function (index) {
             if ($(this).find("input").length > 0 && parcialesVisible.includes(index)) {
                 var nuevoValor = $(this).find("input").val();
 
                 console.log("Matrícula:", matricula);
                 console.log("Parcial NUmero:", parcialActual); 
                 console.log("Parcial text:", parcial);
                 console.log("Nuevo valor:", nuevoValor);
 
                 const datos = {
                     Matricula: matricula,
                     Parcial: parcial,
                     NuevaCal: nuevoValor
                 };
 
                 $.ajax({
                     url: "/calificaciones/modificar",
                     data: datos,
                     type: "POST",
                     success: function (resultado) {
                         console.log(resultado);
 
                         // Mostrar alerta de éxito
                         mostrarAlerta("La calificación ha sido modificada exitosamente.", "success");
                     },
                     error: function (error) {
                         console.log("Error:", error);
 
                         // Mostrar alerta de error
                         mostrarAlerta("Hubo un error al modificar la calificación. Por favor, intenta de nuevo.", "danger");
                     }
                 });
 
                 $(this).html(nuevoValor);
             } else if (index === 3) {
                 $(this).html(`
                     <button class="btn btn-outline-warning modificarCal" data-id="${$(this).closest("tr").attr("id")}">Cambiar</button>
                 `);
             }
         });
     });

    function mostrarAlerta(mensaje, tipo) {
        // Eliminar alertas previas
        $(".alert").remove();

        // Crear la alerta
        var alertHtml = `
            <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;

        // Agregar la alerta al contenedor adecuado (puede ser el body o un contenedor específico)
        $("#alertContainer").append(alertHtml); // Cambia "#alertContainer" por el selector adecuado
    }


    // Evento para cambiar todos los valores de los parciales
    $(document).on("click", "#modificarTodo", function () {
        var filas = $("#TablaCalificaciones tbody tr");

        filas.each(function () {
            var fila = $(this);
            var celdas = fila.find("td");

            if (celdas.length > 0) {
                celdas.each(function (index) {
                    if (index > 1) {
                        var valorAnterior = $(this).text();
                        $(this).html(`
                                        <input type="text" class="form-control" value="${valorAnterior}" />
                                        <button class="btn btn-outline-secondary cancelarCambios">Cancelar</button>
                                        <button class="btn btn-outline-success confirmarCambios">Confirmar</button>
                                    `);
                    }
                });
            }
        });
    });

});