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

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


