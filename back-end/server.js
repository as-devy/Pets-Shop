const express = require("express")
const app = express()
const cors = require('cors');
const bodyParser = require("body-parser");

app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors()); // Parse JSON request bodies


app.get("/", (request, response) => {
    response.send("hello world")
})

app.post("/addUser", (request, response) => {
    const user = request.body;
    console.log(user)
})

app.listen(400, () => {
    console.log("server is listening")
})