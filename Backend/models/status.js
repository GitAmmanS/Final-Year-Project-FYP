const mongoose = require("mongoose");
const status = mongoose.Schema({
    name:{type:String ,required:true}
})

module.exports = mongoose.model("status", status);