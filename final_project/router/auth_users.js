const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented auth"});
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }     
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  // isbn parameter from request URL
    const isbn = req.params.isbn;
    let booktoupdate = books[isbn];   //Retrieve book object associated with isbn
    
    if (booktoupdate) {   //Check if books exists       
        const review = req.body.review;
       //Update review if provided in request body
        if (review) {
            const reviewuser = req.body.username;
            if(booktoupdate.reviews.length !== 0){
                let reviewbyuser = booktoupdate.reviews.find(item => item.user === reviewuser);
                if (reviewbyuser) {
                    reviewbyuser.review = review;  
                } else {
                    booktoupdate.reviews.push({"user":reviewuser , "review": review});                
                } 
            }else{
                booktoupdate.reviews.push({"user":reviewuser , "review": review});                  
            }
            
            books[isbn] = booktoupdate; //Update book details in 'books' object
            res.send(`Book with the isbn ${isbn} updated.`); 
        }else{
            res.send(`no reviews added`);     
        }      
    } else {
       //Respond if book with specified isbn is not found
        res.send(`Unable to find the book!`);
    }
});

//Delete a review by isbn id
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Extract isbn parameter from request URL
    const isbn = req.params.isbn;   
    if (isbn) {
        const reviewuser = req.body.username;
        let bookreviews = books[isbn];  //Retrieve book object associated with isbn
        if(bookreviews.reviews.length !== 0){
            let reviewbyuser = bookreviews.reviews.findIndex(item => item.user === reviewuser);
            if (reviewbyuser !== -1) {
                bookreviews.reviews.splice(reviewbyuser, 1);
                res.send(`review with the isbn: ${isbn} deleted.`);
            } else {
                res.send(`No reviews were found to remove.`);                 
            } 
        }else{
            return res.status(209).json({ message: "There are no reviews to remove." });
        }
    }else{
        return res.status(209).json({ message: "The review to be deleted was not entered." });
    }
});
   


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
