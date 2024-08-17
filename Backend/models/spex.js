const mongoose = require("mongoose");
const spex = mongoose.Schema({
    OS_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"OS"},
    softwares_ID:[{type:mongoose.Schema.Types.ObjectId ,ref :"softwares"}],
    rom_ID:[{type:mongoose.Schema.Types.ObjectId ,ref :"rom"}],
    ram_ID:[{type:mongoose.Schema.Types.ObjectId ,ref :"ram"}],
    graphicCard_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"graphicCard"},
    generation_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"generation"},
    cableType_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"cableType"},
    lcd_size: {type:String},
    furniture_Desc: {type:String}
})

module.exports = mongoose.model("spex", spex);