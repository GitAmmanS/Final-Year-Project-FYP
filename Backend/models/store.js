const mongoose = require('mongoose')

const Stores = mongoose.Schema({
    product_ID: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
    quantity: { type: Number, required: true },
    status: { type:String,enum:["New","Old","Damaged"],default:"New" },
    location: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model("store", Stores);