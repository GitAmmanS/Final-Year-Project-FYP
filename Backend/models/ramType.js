const mongoose = require("mongoose");
const ramType = mongoose.Schema({
    name:{type:String ,required:true}
})

module.exports = mongoose.model("ramType", ramType);