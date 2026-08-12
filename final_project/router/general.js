const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // 1. Validar que se enviaron ambos campos
    if (!username || !password) {
      return res.status(404).json({ message: "Se requiere nombre de usuario y contraseña." });
    }
  
    // 2. Verificar si el usuario ya existe
    if (isValid(username)) {
      return res.status(404).json({ message: "El usuario ya existe." });
    }
  
    // 3. Registrar el nuevo usuario en el arreglo global 'users'
    users.push({ "username": username, "password": password });
    return res.status(200).json({ message: "Usuario registrado con éxito. Ahora puedes iniciar sesión." });
  });



// Get the book list available in the shop using Promises (Tarea 10)
public_users.get('/', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
      resolve(books);
    });
  
    getBooks
      .then((bookList) => {
        return res.status(200).send(JSON.stringify(bookList, null, 4));
      })
      .catch((error) => {
        return res.status(500).json({ message: "Error al obtener la lista de libros" });
      });
  });


// Get book details based on ISBN using Promises (Tarea 11)
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    const getBookByISBN = new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Libro no encontrado");
      }
    });
  
    getBookByISBN
      .then((book) => {
        return res.status(200).send(JSON.stringify(book, null, 4));
      })
      .catch((error) => {
        return res.status(404).json({ message: error });
      });
  });

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const authorParam = req.params.author.toLowerCase();
    const keys = Object.keys(books);
    let matchingBooks = [];
  
    keys.forEach(key => {
      if (books[key].author.toLowerCase() === authorParam) {
        matchingBooks.push(books[key]);
      }
    });
  
    if (matchingBooks.length > 0) {
      return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
      return res.status(404).json({ message: "No se encontraron libros para este autor" });
    }
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const titleParam = req.params.title.toLowerCase();
    const keys = Object.keys(books);
    let matchingBooks = [];
  
    keys.forEach(key => {
      if (books[key].title.toLowerCase() === titleParam) {
        matchingBooks.push(books[key]);
      }
    });
  
    if (matchingBooks.length > 0) {
      return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
      return res.status(404).json({ message: "No se encontraron libros con este título" });
    }
  });


// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
  });

module.exports.general = public_users;
