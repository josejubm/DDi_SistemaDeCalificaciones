document.addEventListener("DOMContentLoaded", function () {
    const table = document.getElementById("TablaMaterias");
    const tableRows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    const itemsPerPage = 5; // Cambia a 5 para mostrar 5 elementos por página
    const totalPages = Math.ceil(tableRows.length / itemsPerPage);
    let showAll = false; // Bandera para indicar si se están mostrando todos los datos
  
    function showTablePage(page) {
      if (!showAll) {
        for (let i = 0; i < tableRows.length; i++) {
          if (i >= (page - 1) * itemsPerPage && i < page * itemsPerPage) {
            tableRows[i].style.display = "table-row";
          } else {
            tableRows[i].style.display = "none";
          }
        }
      } else {
        for (let i = 0; i < tableRows.length; i++) {
          tableRows[i].style.display = "table-row";
        }
      }
    }
  
    function createPagination() {
      const paginationContainer = document.querySelector(".pagination-container"); // Cambia a tu selector correcto
      const pagination = document.createElement("ul");
      pagination.classList.add("pagination", "justify-content-center"); // Añade las clases de estilo de Bootstrap para centrar
      paginationContainer.appendChild(pagination);
      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("li");
        pageButton.classList.add("page-item"); // Añade la clase de estilo de Bootstrap
        const pageLink = document.createElement("a");
        pageLink.href = "#";
        pageLink.classList.add("page-link", "bg-primary", "text-white"); // Añade la clase de estilo de color de Bootstrap
        pageLink.innerText = i;
        pageButton.appendChild(pageLink);
        pageButton.addEventListener("click", () => showTablePage(i));
        pagination.appendChild(pageButton);
      }
  
      // Crear botón "Mostrar Todo"
      const btnMostrarTodo = document.createElement("li");
      btnMostrarTodo.classList.add("page-item"); // Añade la clase de estilo de Bootstrap
      const btnLink = document.createElement("a");
      btnLink.href = "#";
      btnLink.classList.add("page-link", "bg-secondary", "text-white"); // Añade la clase de estilo de color de Bootstrap
      btnLink.innerText = "Mostrar Todo";
      btnMostrarTodo.appendChild(btnLink);
      btnMostrarTodo.addEventListener("click", () => {
        showAll = !showAll;
        if (showAll) {
          btnLink.innerText = "Volver a Paginación";
          showTablePage(1);
        } else {
          btnLink.innerText = "Mostrar Todo";
          showTablePage(1);
        }
      });
      pagination.appendChild(btnMostrarTodo);
    }
  
    showTablePage(1);
    createPagination();
  });
  
  
//   TABLA ALUMNOS
document.addEventListener("DOMContentLoaded", function () {
    const table = document.getElementById("TablaAlumnos");
    const tableRows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    const itemsPerPage = 5; // Cambia a 5 para mostrar 5 elementos por página
    const totalPages = Math.ceil(tableRows.length / itemsPerPage);
    let showAll = false; // Bandera para indicar si se están mostrando todos los datos
  
    function showTablePage(page) {
      if (!showAll) {
        for (let i = 0; i < tableRows.length; i++) {
          if (i >= (page - 1) * itemsPerPage && i < page * itemsPerPage) {
            tableRows[i].style.display = "table-row";
          } else {
            tableRows[i].style.display = "none";
          }
        }
      } else {
        for (let i = 0; i < tableRows.length; i++) {
          tableRows[i].style.display = "table-row";
        }
      }
    }
  
    function createPagination() {
      const paginationContainer = document.querySelector(".pagination-container"); // Cambia a tu selector correcto
      const pagination = document.createElement("ul");
      pagination.classList.add("pagination", "justify-content-center"); // Añade las clases de estilo de Bootstrap para centrar
      paginationContainer.appendChild(pagination);
      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("li");
        pageButton.classList.add("page-item"); // Añade la clase de estilo de Bootstrap
        const pageLink = document.createElement("a");
        pageLink.href = "#";
        pageLink.classList.add("page-link", "bg-primary", "text-white"); // Añade la clase de estilo de color de Bootstrap
        pageLink.innerText = i;
        pageButton.appendChild(pageLink);
        pageButton.addEventListener("click", () => showTablePage(i));
        pagination.appendChild(pageButton);
      }
  
      // Crear botón "Mostrar Todo"
      const btnMostrarTodo = document.createElement("li");
      btnMostrarTodo.classList.add("page-item"); // Añade la clase de estilo de Bootstrap
      const btnLink = document.createElement("a");
      btnLink.href = "#";
      btnLink.classList.add("page-link", "bg-secondary", "text-white"); // Añade la clase de estilo de color de Bootstrap
      btnLink.innerText = "Mostrar Todo";
      btnMostrarTodo.appendChild(btnLink);
      btnMostrarTodo.addEventListener("click", () => {
        showAll = !showAll;
        if (showAll) {
          btnLink.innerText = "Volver a Paginación";
          showTablePage(1);
        } else {
          btnLink.innerText = "Mostrar Todo";
          showTablePage(1);
        }
      });
      pagination.appendChild(btnMostrarTodo);
    }
  
    showTablePage(1);
    createPagination();
  });
  