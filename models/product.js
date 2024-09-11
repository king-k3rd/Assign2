const { string } = require('joi')
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    category: {type: mongoose.Types.ObjectId, ref: "Category", required: true},
    name: { type: String, required:true},
    price: { type: Number, required: true},
    images: [{img:{ type: String, required: true}}],
    description: { type: String, required:true},
    topSelling: {type : Boolean, default:false},
    featured: {type : Boolean, default:false},
},{ timestamps:true })

module.exports = mongoose.model("Product", productSchema)