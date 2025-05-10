const mongoose = require('mongoose')

const Complaint = mongoose.Schema({
    generated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    product: [{
        ItemStore_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    }],
    description: { type: String },
    status: { type: String, enum: ["pending", "in-progress", "resolved"], default: "pending" },
    severty_level: { type: String, enum: ["Low", "Medium", "High", "Critical"] , default: "Medium"},
    created_At: { type: Date, default: Date.now },
})
module.exports = mongoose.model('complain', Complaint);