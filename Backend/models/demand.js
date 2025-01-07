const mongoose = require('mongoose');

const Demand = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    Number: { type: Number, unique: true, required: true },
    description: { type: String },
    items: [{
        product_Id: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
        quantityDemanded: { type: Number, required: true },
        quantityReceived: { type: Number, default: 0 },
        status: { type: String }
    }],
    demandStatus: {
        type: String,
        enum: ["pending", "approved", "fulfilled", "rejected"],
        default: "pending"
    },
    dateRequested: { type: Date, default: Date.now },
    dateProcessed: { type: Date },
    remarks: { type: String }
}, { timestamps: true })

module.exports = mongoose.model("demand", Demand);