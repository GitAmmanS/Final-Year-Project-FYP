const mongoose = require("mongoose");
const spex = mongoose.Schema({
    OS_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"OS",required:true},
    softwares_ID:[{type:mongoose.Schema.Types.ObjectId ,ref :"softwares",required:true}],
    rom_ID:[{type:mongoose.Schema.Types.ObjectId ,ref :"rom",required:true}],
    ram_ID:[{type:mongoose.Schema.Types.ObjectId ,ref :"ram",required:true}],
    graphicCard_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"graphicCard",required:true},
    generation_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"generation",required:true},
    cableType_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"cableType",required:true},
    lcd_size: {type:String, required:true},
    furniture_Desc: {type:String, required:true}
})

module.exports = mongoose.model("spex", spex);