const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

dotenv.config()

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    phone: {type: String, required: true},
    password:{ type: String, required:true},
    role: { type: String, enum: ["admin", "client"], default: "client" }
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { id: this._id, role:this.role},
        process.env.JWT_SECRET_KEY
    )
    return token;
}
module.exports = mongoose.model("User", userSchema)