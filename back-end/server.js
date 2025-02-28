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

app.post("/loginUser", (request, response) => {
    const { email, password } = request.body;
    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return response.status(500).json({ error: "Database error" });
        }

        if (result.length === 0) {
            return response.status(401).json({ error: "Invalid email or password" });
        }

        const dbUser = result[0]; // Get the first matched user
        if (password === dbUser.password) {
            return response.status(200).json({ message: "Login successful", userId: dbUser.id });
        } else {
            return response.status(401).json({ error: "Invalid email or password" });
        }
    });
});

app.get("/allPets", (request, response) => {
    const sql = "SELECT * FROM pets ORDER BY id DESC";
      db.query(sql, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return response.status(500).json({ error: "Database error" });
        }

        response.json(result)
    })
})

app.get("/pet/:id", (request, response) => {
    const petId = request.params.id;

    const sql = "SELECT * FROM pets WHERE id = ?";

    db.query(sql, [petId], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return response.status(500).json({ error: "Database error" });
        }

        const pet = result[0];
        response.json(pet)
    });
})

app.post("/addPet", (request, response) => {
    const pet = request.body;

    const sql = ` 
    INSERT INTO pets 
    (category, img, name, age, description,country, streetAddress, city, postCode, vaccines_prevention, health_history, diet, behavior, rehoming, foster, requests) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

    const values = [
        pet.category,
        pet.img || null,
        pet.name || null,
        pet.age || null,
        pet.description || null,
        pet.country || null,
        pet.streetAddress || null,
        pet.city || null,
        pet.postCode || null,
        pet.vaccines_prevention || null,
        pet.health_history || null,
        pet.diet || null,
        pet.behavior || null,
        pet.rehoming || 0,
        pet.foster || 0,
        JSON.stringify(pet.requests || [])
    ];

    // Execute query
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return response.status(500).json({ error: "Database error" });
        }
        response.status(201).json({ message: "Pet added successfully", petId: result.insertId });
        console.log({ message: "Pet added successfully", petId: result.insertId });
    });

})

app.listen(400, () => {
    console.log("server is listening")
})