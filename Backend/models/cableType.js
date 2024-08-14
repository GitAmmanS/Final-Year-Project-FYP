const mongoose = require("mongoose");
const cableType = mongoose.Schema({
    name:{type:String ,required:true}
})

module.exports = mongoose.model("cableType", cableType);