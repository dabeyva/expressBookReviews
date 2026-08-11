const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Comprueba si el usuario existe en el arreglo
const isValid = (username) => {
  let userswithsameName = users.filter((user) => {
    return user.username === username;
  });
  return userswithsameName.length > 0;
}

// Comprueba si el usuario y la contraseña coinciden
const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  return validusers.length > 0;
}

// Tarea 7: Iniciar sesión como usuario registrado
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error al cargar los datos de inicio de sesión" });
  }

  if (authenticatedUser(username, password)) {
    // Generar Token JWT
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Guardar token y usuario en la sesión
    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).send("Usuario autenticado con éxito");
  } else {
    return res.status(208).json({ message: "Credenciales de inicio de sesión no válidas" });
  }
});

// Add a book review (Tarea 8 - la haremos a continuación)
regd_users.put("/auth/review/:isbn", (req, res) => {
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;