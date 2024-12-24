const express = require('express')
const mainRouter = require("../routes/index")
const cors = require('cors');
const bodyParser = require('body-parser')

const app = express();

app.use(cors({
    path : "http://localhost:5173/",
    Credentials : true
}));

app.use(bodyParser.json());

app.use("/api/v1", mainRouter);


app.listen(3000)