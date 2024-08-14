const mongoose = require("mongoose");
const GCType = mongoose.Schema({
    name:{type:String ,required:true}
})

module.exports = mongoose.model("GCType", GCType);