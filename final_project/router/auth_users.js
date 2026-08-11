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



// Add or modify a book review (Tarea 8)
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization ? req.session.authorization.username : null;
  
    if (!username) {
      return res.status(403).json({ message: "Usuario no autenticado" });
    }
  
    if (!review) {
      return res.status(400).json({ message: "Por favor proporciona una reseña" });
    }
  
    if (books[isbn]) {
      // Agrega o actualiza la reseña usando el 'username' como clave
      books[isbn].reviews[username] = review;
      return res.status(200).json({ 
        message: `La reseña para el libro con ISBN ${isbn} ha sido agregada/actualizada con éxito.` 
      });
    } else {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;