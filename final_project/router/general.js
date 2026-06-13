const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
//const axios = require('axios');

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
//public_users.get('/',function (req, res) {
    //res.send(JSON.stringify(books,null,4));
//});
public_users.get('/', async function (req, res) {
    const respuestaApiExterna = await JSON.stringify(books,null,4);
    res.send(respuestaApiExterna);
});


// Get book details based on ISBN
//public_users.get('/isbn/:isbn',function (req, res) {
    //res.send(books[req.params.isbn]);
//});
public_users.get('/isbn/:isbn', async function (req, res) {
    const respuestaApiExterna = await books[req.params.isbn];
    res.send(respuestaApiExterna);
});

// Get book details based on author
//public_users.get('/author/:author',function (req, res) {
  //const booksbyauthor = Object.values(books).find(item => item.author === req.params.author);
  //res.send(booksbyauthor);
//});
public_users.get('/author/:author', async function (req, res) {
  const booksbyauthor = await Object.values(books).find(item => item.author === req.params.author);
  res.send(booksbyauthor);
});

// Get all books based on title
//public_users.get('/title/:title',function (req, res) {
 // const booksbyauthor = Object.values(books).find(item => item.title === req.params.title);
  //res.send(booksbyauthor);
//});

public_users.get('/title/:title', async function (req, res) {
  const booksbyauthor = await Object.values(books).find(item => item.title === req.params.title);
  res.send(booksbyauthor);
});

//  Get book review
//public_users.get('/review/:isbn',function (req, res) {
  //res.send(books[req.params.isbn].reviews);
//});
public_users.get('/review/:isbn', async function (req, res) {
    const respuestaApiExterna = await books[req.params.isbn].reviews;
    res.send(respuestaApiExterna);
 });

module.exports.general = public_users;
