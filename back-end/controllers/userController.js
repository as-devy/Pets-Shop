const mysql = require("mysql2");

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
    // console.log("Connected to MySQL database");
});

module.exports.signup = (request, response) => {
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
}

module.exports.login = (request, response) => {
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
}

module.exports.getuser = (request, response) => {
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
}

module.exports.addNotificationToUser = (request, response) => {
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

        let notifies = JSON.parse(result[0].notifications || "[]");

        notifies.push(notify);

        const updateSql = `UPDATE users SET notifications = ? WHERE id = ?`;
        db.query(updateSql, [JSON.stringify(notifies), userId], (err, updateResult) => {
            if (err) {
                console.error("Error updating notifies:", err);
                return response.status(500).json({ error: "Database error" });
            }
            response.status(200).json({ message: " notify added successfully", updatedNotifications: notifies });
        });
    });
}

module.exports.deleteNotifications = (request, response) => {
    const userId = request.params.id;

    const updateSql = `UPDATE users SET notifications = '[]' WHERE id = ?`;
    db.query(updateSql, [userId], (err, updateResult) => {
        if (err) {
            console.error("Error updating notifies:", err);
            return response.status(500).json({ error: "Database error" });
        }
        response.status(200).json({ message: " Notifis Deleted successfully" });
    });
}