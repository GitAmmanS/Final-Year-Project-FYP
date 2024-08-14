const mongoose = require("mongoose");
const OS = mongoose.Schema({
    name:{type:String ,required:true}
})

module.exports = mongoose.model("OS", OS);