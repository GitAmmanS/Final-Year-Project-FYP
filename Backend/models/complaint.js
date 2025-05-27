const mongoose = require('mongoose')

const Complaint = mongoose.Schema({
    generated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    number: { type : Number, unique:true },
    time_period: { type:String, },
    location: { type:String, },
    product: [{
        ItemStore_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'productStore' },
        status_Product: { type: String,enum:["pending","in-progress","resolved"] ,default:"pending"}
    }],
    description: { type: String },
    status: { type: String, enum: ["pending", "in-progress", "resolved"], default: "pending" },
    created_At: { type: Date, default: Date.now },
})
module.exports = mongoose.model('complain', Complaint);