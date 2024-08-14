const mongoose = require("mongoose");
const romType = mongoose.Schema({
    name:{type:String ,required:true}
})

module.exports = mongoose.model("romType", romType);