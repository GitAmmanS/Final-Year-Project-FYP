const mongoose = require("mongoose");
const rom = mongoose.Schema({
    size:{type:String ,required:true},
    romType_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"romType",required:true},
})

module.exports = mongoose.model("rom", rom);