const API_URL = "http://localhost:5000/api/images";

async function cargarGaleria(categoria = "") {
  try {
    const response = await fetch(API_URL);
    const imagenes = await response.json();

    const contenedor = document.getElementById("galeria-container");
    contenedor.innerHTML = "";

    const filtradas = categoria
      ? imagenes.filter(img => img.categoria === categoria)
      : imagenes;

    filtradas.forEach(img => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";
      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="http://localhost:5000${img.url}" class="card-img-top">
          <div class="card-body">
            <h5>${img.titulo}</h5>
            <p><strong>Categoría:</strong> ${img.categoria}</p>
            <p class="text-muted">${img.autor}</p>
            <button class="btn btn-primary w-100"
                    data-bs-toggle="modal"
                    data-bs-target="#detalleModal"
                    onclick="mostrarDetalle('${img._id}')">
              Ver más
            </button>
          </div>
        </div>`;
      contenedor.appendChild(col);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

function filtrarPorCategoria(cat) {
  cargarGaleria(cat);
}

async function mostrarDetalle(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const img = await res.json();

  document.getElementById("detalleTitulo").innerText = img.titulo;
  document.getElementById("detalleDescripcion").innerText = img.descripcion;
  document.getElementById("detalleAutor").innerText = img.autor;
  document.getElementById("detalleImagen").src = `http://localhost:5000${img.url}`;
}

document.addEventListener("DOMContentLoaded", () => cargarGaleria());
