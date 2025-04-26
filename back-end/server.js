const express = require("express")
const app = express()
const cors = require('cors');
const bodyParser = require("body-parser");

require('dotenv').config();
const routes = require("./routes/routes")

app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors()); // Parse JSON request bodies

app.get("/", (request, response) => {
    response.send("hello world")
})

app.use(routes)





app.listen(400, () => {
    console.log("server is listening")
})


