const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const maxAge = 3 * 24 * 60 * 60;

exports.register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.create({ email, password });
        res.cookie("jwt", createToken(user._id), {
            httpOnly: true,
            maxAge: maxAge * 1000,
        });
        res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ errors: handleErrors(error) });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        res.cookie("jwt", createToken(user._id), {
            httpOnly: true,
            maxAge: maxAge * 1000,
        });
        res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
            },
        });
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({ errors });
    }
};

exports.logout = (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/login");
};

const handleErrors = (err) => {
    let errors = { email: "", password: "" };

    if (err.code === 11000) {
        errors.email = "This email address is already registered";
    }

    if (err.message === "incorrect email, no user found") {
        errors.email = "Incorrect email, no user found";
    }

    if (err.message === "incorrect password") {
        errors.password = "incorrect password";
    }

    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach((prop) => {
            errors[prop.path] = properties.message;
        });
    }
    return errors;
};

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: maxAge,
    });
};
