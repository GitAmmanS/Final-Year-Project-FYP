const mongoose = require('mongoose')

const Stores = mongoose.Schema({
    product_ID: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
    record:[
        {
            addedtime:{type:Date,default:Date.now},
            addedQuantity:{type:Number,min:1},
            previousQuanitity:{type:Number,min:1}
        }
    ],
    quantity: { type: Number,default:0},
    status: { type:String,enum:["New","Old","Damaged"],default:"New" },
    location: { type: String,default:"Uiit Lab Inventory Store" }
}, { timestamps: true })

module.exports = mongoose.model("store", Stores);