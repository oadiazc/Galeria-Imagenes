// 1. Verificar que exista token
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}

const API_URL = "http://localhost:5000/api/images";

document.getElementById("formSubir").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token
      },
      body: formData
    });

    if (!response.ok) {
      alert("❌ Error: No tienes permiso o el token expiró");
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    alert("✅ Imagen subida con éxito");
    e.target.reset();

  } catch (error) {
    console.error("Error al subir imagen:", error);
  }
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}
