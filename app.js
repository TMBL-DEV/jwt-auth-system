//packages
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { requireAuth } = require("./middleware/authMiddleware");
require("dotenv").config();
const app = express();
// import routes
const authRoutes = require("./routes/authRoutes");
// middleware
app.use(express.json());
app.use(cookieParser());
// the database connection
mongoose
    .connect(process.env.MONGO_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((res) => console.log("mongodb connected"))
    .catch((err) => console.log(err));
// the routing
app.use("/auth", authRoutes);
// set the app on a port
app.listen(5000, () => console.log("the pain has begun"));
