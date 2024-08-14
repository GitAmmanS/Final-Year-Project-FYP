const mongoose = require("mongoose");
const company = mongoose.Schema({
    name:{type:String ,required:true}
})

module.exports = mongoose.model("company", company);