const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        res.redirect("/auth/login")
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY,(err) => {
        if(!err){
            next();
        }
        res.redirect('/auth/login')
    });
};

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if(!token){
        res.locals.user = null;
    }
    
    jwt.verify(token, process.env.JWT_SECRET_KEY,async(err, decodedToken) => {
        if(err){
            res.locals.user = null;
            next();
        }
        const user = await User.findById(decodedToken.id);
        res.locals.user = {
            id: user._id,
            email: user.email,
        }
        next()
    });
}

module.exports = { requireAuth, checkUser };