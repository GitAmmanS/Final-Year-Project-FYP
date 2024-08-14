const mongoose = require("mongoose");
const items = mongoose.Schema({
    number:{type:String ,required:true},
    name:{type:String ,required:true},
    picture:{type:String ,required:true},
    category_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"category",required:true},
    company_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"company",required:true},
    spex_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"spex",required:true},
    status_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"status",required:true},
    location_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"location",required:true},
    purchase_date: {type:String, required:true},
    users_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"users",required:true}
})

module.exports = mongoose.model("items", items);