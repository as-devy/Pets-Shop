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



module.exports.getpets = (request, response) => {
    const sql = "SELECT * FROM pets ORDER BY emergency DESC, id DESC;";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return response.status(500).json({ error: "Database error" });
        }

        response.json(result)
    })
}

module.exports.getPetWithId = (request, response) => {
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
}

module.exports.addPet = (request, response) => {
    const pet = request.body;

    const sql = ` 
    INSERT INTO pets 
    (ownerId, category, img, name, age,gender, description,country, streetAddress, city, postCode, vaccines_prevention, health_history, diet, behavior, rehoming, foster,emergency, requests) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?,?);
`;

    const values = [
        pet.ownerId,
        pet.category,
        pet.img || null,
        pet.name || null,
        pet.age || null,
        pet.gender || null,
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
        pet.emergency || 0,
        JSON.stringify(pet.requests || [])
    ];
    console.log(values)

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return response.status(500).json({ error: "Database error" });
        }
        response.status(201).json({ message: "Pet added successfully", petId: result.insertId });
        console.log({ message: "Pet added successfully", petId: result.insertId });
    });
}

module.exports.DeletePetWithId = (request, response) => {
    const petId = request.params.id;

    const sql = "DELETE FROM pets WHERE id = ?";

    db.query(sql, [petId], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return response.status(500).json({ error: "Database error" });
        }

        response.status(200).send('Pet deleted');
    });
}

module.exports.addRequestOnPet = (request, response) => {
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
}

module.exports.updatePetRequest = (req, res) => {
    const petId = req.params.id;
    const updatedPetRequest = req.body.updatedRequest;

    const requestType = req.body.type;

    let updateSql = "UPDATE pets SET requests = ?";
    const updateValues = [JSON.stringify(updatedPetRequest), petId];

    // If type is 'approval', include requested = 1
    if (requestType == "approval") {
        updateSql += ", requested = 1";
    }

    updateSql += " WHERE id = ?";

    db.query(updateSql, updateValues, (err, result) => {
        if (err) {
            console.error("Error updating pet request:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No pet found with the provided ID" });
        }
        res.status(200).json({
            message: "Pet request and status updated successfully",
            updatedRequests: updatedPetRequest
        });
    });
};


module.exports.removePetRequest = (req, res) => {
    // Step 1: Extract input data from request
    const petId = req.params.id;
    const petOwnerId = req.body.petOwnerId;
    const requestAuthorId = req.body.requestAuthorId;
    const updatedPetRequests = req.body.updatedRequest;

    // Step 2: Update the pet's requests array in the "pets" table
    const updatePetSql = "UPDATE pets SET requests = ? WHERE id = ?";
    const petUpdateValues = [JSON.stringify(updatedPetRequests), petId];

    db.query(updatePetSql, petUpdateValues, (err, petUpdateResult) => {
        if (err) {
            console.error("Error updating pet requests:", err);
            return res.status(500).json({ error: "Failed to update pet data" });
        }

        if (petUpdateResult.affectedRows === 0) {
            return res.status(404).json({ error: "No pet found with the given ID" });
        }

        // Step 3: Retrieve the requesting user's current requestedPets list
        const getUserRequestsSql = "SELECT requestedPets FROM users WHERE id = ?";

        db.query(getUserRequestsSql, [requestAuthorId], (err, userResult) => {
            if (err) {
                console.error("Error retrieving user requests:", err);
                return res.status(500).json({ error: "Failed to retrieve user data" });
            }

            if (userResult.length === 0) {
                return res.status(404).json({ error: "Requesting user not found" });
            }

            let requestedPets;
            try {
                // Step 4: Parse the current requestedPets list
                requestedPets = JSON.parse(userResult[0].requestedPets || "[]");
            } catch (parseErr) {
                console.error("Invalid JSON in requestedPets:", parseErr);
                return res.status(500).json({ error: "Corrupt request data" });
            }

            // Step 5: Filter out the request made by the author
            const filteredRequests = requestedPets.filter(reqPetId => reqPetId !== petId);

            // Step 6: Update the requesting user's requestedPets list
            const updateUserSql = "UPDATE users SET requestedPets = ? WHERE id = ?";
            const userUpdateValues = [JSON.stringify(filteredRequests), requestAuthorId];

            db.query(updateUserSql, userUpdateValues, (err) => {
                if (err) {
                    console.error("Error updating user's requestedPets:", err);
                    return res.status(500).json({ error: "Failed to update user's request list" });
                }

                // Step 7: Retrieve notifications for the pet owner
                const getNotificationsSql = "SELECT notifications FROM users WHERE id = ?";
                db.query(getNotificationsSql, [petOwnerId], (err, notifyResult) => {
                    if (err) {
                        console.error("Error fetching notifications:", err);
                        return res.status(500).json({ error: "Failed to retrieve notifications" });
                    }

                    if (notifyResult.length === 0) {
                        return res.status(404).json({ error: "Pet owner not found" });
                    }

                    let notifications;
                    try {
                        // Step 8: Parse the current notifications list
                        notifications = JSON.parse(notifyResult[0].notifications || "[]");
                    } catch (parseErr) {
                        console.error("Invalid JSON in notifications:", parseErr);
                        return res.status(500).json({ error: "Corrupt notifications data" });
                    }
                    
                    // Step 9: Remove notifications related to the removed request
                    const updatedNotifications = notifications.filter(
                        note => !(note.requestedUserId === requestAuthorId && note.requestedPetId === petId)
                    );


                    // Step 10: Update pet owner's notifications in the database
                    const updateNotificationsSql = "UPDATE users SET notifications = ? WHERE id = ?";
                    const updateNotifyValues = [JSON.stringify(updatedNotifications), petOwnerId];

                    db.query(updateNotificationsSql, updateNotifyValues, (err) => {
                        if (err) {
                            console.error("Error updating notifications:", err);
                            return res.status(500).json({ error: "Failed to update notifications" });
                        }

                        // Step 11: All updates succeeded, send final response
                        return res.status(200).json({
                            message: "Request and notifications successfully removed",
                            updatedPetRequests,
                            updatedRequestedPets: filteredRequests,
                            updatedNotifications
                        });
                    });
                });
            });
        });
    });
};



module.exports.addRequestedPetToUserRequestedPetsList = (request, response) => {
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

        requestedPets.push(requestedPetId);

        const updateSql = `UPDATE users SET requestedPets = ? WHERE id = ?`;
        db.query(updateSql, [JSON.stringify(requestedPets), userId], (err, updateResult) => {
            if (err) {
                console.error("Error updating requests:", err);
                return response.status(500).json({ error: "Database error" });
            }
            response.status(200).json({ message: "Request added successfully", updatedRequestedPets: requestedPets });
        });
    });
}