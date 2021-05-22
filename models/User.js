const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

//the base model
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter an email address"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Please enter an password"],
        minLength: [8, "The minimum password length is 8 characters long"],
    },
});
//model functions
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) {
        throw Error("incorrect email, no user found");
    }

    if (bcrypt.compare(password, user.password)) {
        return user;
    }

    throw Error("incorrect password");
};

//database events functions
userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, await bcrypt.genSalt());
    next();
});

const User = mongoose.model("user", userSchema);
module.exports = User;
