const mongoose = require('mongoose')

const Complaint = mongoose.Schema({
    generated_by:{type:mongoose.Schema.Types.ObjectId,ref:'users'},
    product:[{
        ItemStore_ID : {type:mongoose.Schema.Types.ObjectId,ref:'productStore'}
    }],
    description:{type:String},
    status:{type:String,enum:["Submitted","Rejected","Approved"]},
    severty_level:{type:String,enum:["Low","Medium","High","Critical"],required:true}
})
module.exports= mongoose.model('complain',Complaint);