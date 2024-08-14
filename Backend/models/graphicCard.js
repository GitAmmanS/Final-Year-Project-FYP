const mongoose = require("mongoose");
const graphicCard = mongoose.Schema({
    size:{type:String ,required:true},
    GCType_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"GCType",required:true},
})

module.exports = mongoose.model("graphicCard", graphicCard);