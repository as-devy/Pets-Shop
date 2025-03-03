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

    const sql = "INSERT INTO users (username, email, phone, country, city, password) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [user.name, user.email, user.phone, user.country, user.city, user.password], (err, result) => {
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

app.get("/users/:id", (request, response) => {
    const userId = request.params.id;

    const sql = "SELECT * FROM users WHERE id = ?";

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return response.status(500).json({ error: "Database error" });
        }

        const user = result[0];
        response.json(user)
    });
})

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
    (ownerId, category, img, name, age, description,country, streetAddress, city, postCode, vaccines_prevention, health_history, diet, behavior, rehoming, foster, requests) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );
`;

    const values = [
        pet.ownerId,
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

app.post("/addPetRequest/:id", (request, response) => {
    const petId = request.params.id;
    const petRequest = request.body;

    const sql = `SELECT requests FROM pets WHERE id = ?`;

    db.query(sql, [petId], (err, result) => {
        if (err) {
            console.error("Error fetching requests:", err);
            return response.status(500).json({ error: "Database error" });
        }

        if (result.length === 0) {
            return response.status(404).json({ error: "Pet not found" });
        }

        let requests = JSON.parse(result[0].requests || "[]");
        // let reqeusts = [{q: a, q: a, q: a}, {q: a, q: a, q: a}]

        requests.push(petRequest);
        // reqeusts.push({q: a, q: a, q: a})
        // reqeusts = [{q: a, q: a, q: a}, {q: a, q: a, q: a}, {q: a, q: a, q: a}] 

        const updateSql = `UPDATE pets SET requests = ? WHERE id = ?`;
        db.query(updateSql, [JSON.stringify(requests), petId], (err, updateResult) => {
            if (err) {
                console.error("Error updating requests:", err);
                return response.status(500).json({ error: "Database error" });
            }
            response.status(200).json({ message: "Request added successfully", updatedRequests: requests });
        });
    });
})

app.post("/users/addrequestedPet/:id", (request, response) => {
    const userId = request.params.id;
    const requestedPetId = request.body.id;

    const sql = `SELECT requestedPets FROM users WHERE id = ?`;

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("Error fetching requests:", err);
            return response.status(500).json({ error: "Database error" });
        }

        if (result.length === 0) {
            return response.status(404).json({ error: "User not found" });
        }

        let requestedPets = JSON.parse(result[0].requestedPets || "[]");
        // let reqeusts = [{q: a, q: a, q: a}, {q: a, q: a, q: a}]

        requestedPets.push(requestedPetId);
        // reqeusts.push({q: a, q: a, q: a})
        // reqeusts = [{q: a, q: a, q: a}, {q: a, q: a, q: a}, {q: a, q: a, q: a}] 

        const updateSql = `UPDATE users SET requestedPets = ? WHERE id = ?`;
        db.query(updateSql, [JSON.stringify(requestedPets), userId], (err, updateResult) => {
            if (err) {
                console.error("Error updating requests:", err);
                return response.status(500).json({ error: "Database error" });
            }
            response.status(200).json({ message: "Request added successfully", updatedRequestedPets: requestedPets });
        });
    });
})


app.post("/users/addNotification/:id", (request, response) => {
    const userId = request.params.id;
    const notify = request.body;

    const sql = `SELECT notifications FROM users WHERE id = ?`;

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("Error fetching notify:", err);
            return response.status(500).json({ error: "Database error" });
        }

        if (result.length === 0) {
            return response.status(404).json({ error: "User not found" });
        }

        let notifies= JSON.parse(result[0].notifications || "[]");
        // let reqeusts = [{q: a, q: a, q: a}, {q: a, q: a, q: a}]

        notifies.push(notify);
        // reqeusts.push({q: a, q: a, q: a})
        // reqeusts = [{q: a, q: a, q: a}, {q: a, q: a, q: a}, {q: a, q: a, q: a}] 

        const updateSql = `UPDATE users SET notifications = ? WHERE id = ?`;
        db.query(updateSql, [JSON.stringify(notifies), userId], (err, updateResult) => {
            if (err) {
                console.error("Error updating notifies:", err);
                return response.status(500).json({ error: "Database error" });
            }
            response.status(200).json({ message: " notify added successfully", updatedNotifications: notifies });
        });
    });
})


app.listen(400, () => {
    console.log("server is listening")
})


