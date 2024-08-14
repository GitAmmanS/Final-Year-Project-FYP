const mongoose = require("mongoose");
const floor = mongoose.Schema({
    name:{type:String ,required:true}
})

module.exports = mongoose.model("floor", floor);