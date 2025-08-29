const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { default: mongoose } = require("mongoose");
const app = new express();
require("dotenv").config();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl).then((res) => {
    console.log(`-----Database connect successfully-----`);
}).catch((e) => {
    console.log(`----Database connect fail-----`);
})


// router 

const router = require("./src/routes/router");

app.use("/api/v1",router)







module.exports = app;
