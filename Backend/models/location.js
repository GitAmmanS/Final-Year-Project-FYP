const mongoose = require("mongoose");
const location = mongoose.Schema({
    name:{type:String ,required:true},
    floor_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"floor",required:true},
})

module.exports = mongoose.model("location", location);