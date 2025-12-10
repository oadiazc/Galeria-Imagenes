document.getElementById("formLogin").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert("❌ Credenciales incorrectas");
      return;
    }

    localStorage.setItem("token", data.token);

    alert("✔ Inicio de sesión exitoso");

    window.location.href = "administrador.html";

  } catch (err) {
    console.error("Error en login:", err);
  }
});
