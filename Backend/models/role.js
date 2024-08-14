const mongoose = require("mongoose");
const role = mongoose.Schema({
    name:{type:String ,required:true}
})

module.exports = mongoose.model("role", role);