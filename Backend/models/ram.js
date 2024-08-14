const mongoose = require("mongoose");
const ram = mongoose.Schema({
    size:{type:String ,required:true},
    ramType_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"ramType",required:true},
})

module.exports = mongoose.model("ram", ram);