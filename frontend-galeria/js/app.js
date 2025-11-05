const API_URL = "http://localhost:5000/api/images";

async function cargarGaleria(categoria = "") {
  try {
    const response = await fetch(API_URL); 
    const imagenes = await response.json();
    const contenedor = document.getElementById("galeria-container");
    contenedor.innerHTML = "";

    const filtradas = categoria ? imagenes.filter(img => img.categoria === categoria) : imagenes;
    //crear tarjetas y define el contenido
    filtradas.forEach(img => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";
      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="http://localhost:5000${img.url}" class="card-img-top" alt="${img.titulo}">
          <div class="card-body">
            <h5 class="card-title">${img.titulo}</h5>
            <p class="card-text"><strong>Categoría:</strong> ${img.categoria}</p>
            <p class="card-text text-muted">${img.autor}</p>
            <button class="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#detalleModal" onclick="mostrarDetalle('${img._id}')">Ver más</button>
          </div>
        </div>
      `;
      contenedor.appendChild(col);
    });
  } catch (error) {
    console.error("Error al cargar imágenes:", error);
  }
}

// Botones de filtro
function filtrarPorCategoria(categoria) {
  cargarGaleria(categoria);
}

document.addEventListener("DOMContentLoaded", () => cargarGaleria());


// Subir imagen
document.getElementById("formSubir").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      alert("✅ Imagen subida con éxito");
      e.target.reset();
      await cargarGaleria();
    } else {
      alert("❌ Error al subir imagen");
    }
  } catch (error) {
    console.error("Error al subir imagen:", error);
  }
});

// Mostrar detalle
async function mostrarDetalle(id) {
  const response = await fetch(`${API_URL}/${id}`);
  const img = await response.json();

  document.getElementById("detalleTitulo").innerText = img.titulo;
  document.getElementById("detalleDescripcion").innerText = img.descripcion;
  document.getElementById("detalleAutor").innerText = img.autor;
  document.getElementById("detalleImagen").src = `http://localhost:5000${img.url}`;
}

document.addEventListener("DOMContentLoaded", () => {
  filtrarPorCategoria("");

  const botones = document.querySelectorAll(".btn-outline-primary");
  botones.forEach(btn => btn.classList.remove("active"));
  botones[0].classList.add("active");
});
