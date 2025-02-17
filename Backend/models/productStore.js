const mongoose = require('mongoose');

const ProductStore = new mongoose.Schema({
    items:[{
    product_ID: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
    serialNumber: { type: String }, 
    qrCode: { type: String },
    installDate:{type:Date ,default:Date.now}
    }],
    store_ID: { type: mongoose.Schema.Types.ObjectId, ref: "store", required: true },
    lab_ID: { type: mongoose.Schema.Types.ObjectId, ref: "lab", required: true },
    remarks: { type: String },
    quantity: { type: Number, default: 0 }

},{timestamps:true});

module.exports = mongoose.model("productStore",ProductStore);