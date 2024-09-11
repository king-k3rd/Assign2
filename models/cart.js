const mongoose = require('mongoose');
const Product = require("./product");
const User = require('./users');

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    products:[
        {
            product: { type:mongoose.Schema.Types.ObjectId, ref: "Product", reqired: true},
            quantity: { type: Number, requred: true, min:1 , defaut: 1},
            amount: { type: Number, requred: true}
        }
    ]
}, { timestamps: true})


module.exports = mongoose.model("Cart", cartSchema)