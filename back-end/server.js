const express = require("express")
const app = express()
const cors = require('cors');
const bodyParser = require("body-parser");
const mysql = require("mysql2");

app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors()); // Parse JSON request bodies

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",  // Change to your database host
    user: "root",       // Change to your MySQL username
    password: "",       // Change to your MySQL password
    database: "paws_safe" // Change to your database name
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL database");
});

app.get("/", (request, response) => {
    response.send("hello world")
})

app.post("/addUser", (request, response) => {
    const user = request.body;

    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(sql, [user.name, user.email, user.password], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return response.status(500).json({ error: "Database error" });
        }
        response.status(201).json({ message: "User added successfully", userId: result.insertId });
        console.log({ message: "User added successfully", userId: result.insertId })
    });
})

app.listen(400, () => {
    console.log("server is listening")
})