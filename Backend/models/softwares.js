const mongoose = require("mongoose");
const softwares = mongoose.Schema({
    name:{type:String ,required:true},
    version:{type:String ,required:true}
})

module.exports = mongoose.model("softwares", softwares);