const express = require('express');
const app = express();
const connectDB = require("./db/db");
const userRoutes = require("./routes/user_routes");
const prodRoutes = require("./routes/prod_routes");
const orderRoutes = require("./routes/order_routes");
const bodyParser = require("body-parser");

connectDB();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use("/auth", userRoutes);
app.use("/products", prodRoutes);
app.use("/orders", orderRoutes);

module.exports = app;