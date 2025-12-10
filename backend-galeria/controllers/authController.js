import jwt from "jsonwebtoken";

const usuario = {
  email: "andres@mail.com",
  password: "Lauren98*"
};

export const login = (req, res) => {
  const { email, password } = req.body;

  if (email !== usuario.email || password !== usuario.password) {
    return res.status(401).json({ mensaje: "Credenciales incorrectas" });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "2h"
  });

  res.json({ mensaje: "Login exitoso", token });
};

export const perfil = (req, res) => {
  res.json({
    mensaje: "Token válido",
    usuario: req.user
  });
};
