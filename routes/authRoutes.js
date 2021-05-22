// default express stuff
const express = require("express");
const router = express.Router();

// controllers
const authController = require("../controllers/authController");

//routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
// export the routes
module.exports = router;
