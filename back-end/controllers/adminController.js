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
    console.log("Connected to MySQL database");
});

module.exports.sendVerification = (request, response) => {
    const userVerificationDetails = request.body;

    const sql = ` 
        INSERT INTO verification_requests 
        (userId, user_card_img, user_age, user_job) 
        VALUES (?, ?, ?, ?);
    `;

    const values = [
        userVerificationDetails.user_id,
        userVerificationDetails.user_card_img,
        userVerificationDetails.user_age,
        userVerificationDetails.user_job,
    ];

    console.log("Inserting verification with values:", values);

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return response.status(500).json({ error: "Database error" });
        }

        const updateUserSql = `UPDATE users SET verification_status = 'pending' WHERE id = ?`;
        db.query(updateUserSql, [userVerificationDetails.user_id], (err, userUpdateResult) => {
            if (err) {
                console.error("Error updating user verified status:", err);
                return response.status(500).json({ error: "Database error while updating user" });
            }

            console.log("Verification added successfully, ID:", result.insertId);
            return response.status(200).json({ 
                message: "Request pended", 
                verificationId: result.insertId 
            });
        });
    });
};

module.exports.getVerifications = (request, response) => {
    const sql = "SELECT * FROM verification_requests ORDER BY id DESC";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return response.status(500).json({ error: "Database error" });
        }
        response.json(result)
    })
}

module.exports.updateVerificationStatus = (request, response) => {
    const requestId = request.query.requestId;
    const userId = request.query.userId;
    const status = request.body.status;

    const updateRequestSql = `UPDATE verification_requests SET status = ? WHERE id = ?`;

    db.query(updateRequestSql, [status, requestId], (err, updateResult) => {
        if (err) {
            console.error("Error updating verification request:", err);
            return response.status(500).json({ error: "Database error while updating request" });
        }

        if (status == "approved") {
            const updateUserSql = `UPDATE users SET verification_status = 'approved' WHERE id = ?`;
            db.query(updateUserSql, [userId], (err, userUpdateResult) => {
                if (err) {
                    console.error("Error updating user verified status:", err);
                    return response.status(500).json({ error: "Database error while updating user" });
                }

                return response.status(200).json({ message: "Request approved and user verified", updatedRequest: `UPDATED TO ${status}` });
            });
        } else if (status == "rejected") {
            const updateUserSql = `UPDATE users SET verification_status = 'rejected' WHERE id = ?`;
            db.query(updateUserSql, [userId], (err, userUpdateResult) => {
                if (err) {
                    console.error("Error updating user verified status:", err);
                    return response.status(500).json({ error: "Database error while updating user" });
                }

                return response.status(200).json({ message: "Request rejected and user rejected", updatedRequest: `UPDATED TO ${status}` });
            });
        }
        else {
            return response.status(200).json({ message: "Request updated successfully", updatedRequest: `UPDATED TO ${status}` });
        }
    });
};
