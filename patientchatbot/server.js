const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Assuming your HTML files are in a "public" folder

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "yourpassword", // Replace with your MySQL password
    database: "chatbot_db",
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to database");
});

// Register route
app.post("/register", (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    const sql = "INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)";
    db.query(sql, [firstname, lastname, email, password], (err, result) => {
        if (err) throw err;
        res.redirect("/chat.html"); // Redirect to chat page after successful registration
    });
});

// Login route
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.redirect("/chat.html"); // Redirect to chat page if login successful
        } else {
            res.send("Invalid credentials");
        }
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
