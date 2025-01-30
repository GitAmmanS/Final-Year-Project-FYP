const mongoose = require('mongoose');

const Demand = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    number: { type : Number, unique:true },
    description: { type: String },
    items: [{
        product_Id: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        quantityDemanded: { type: Number, required: true },
        quantityReceived: { type: Number, default: 0 },
        status: { type: String,enum:["pending","rejected","resolved","partially resolved"] ,default:"pending"}
    }],
    demandStatus: {
        type: String,
        enum: ["pending","resolved", "partially resolved", "rejected"],
        default: "pending"
    },
    dateRequested: { type: Date, default: Date.now },
    dateProcessed: { type: Date },
    remarks: { type: String }
}, { timestamps: true })

module.exports = mongoose.model("demand", Demand);