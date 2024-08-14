const mongoose = require("mongoose");
const generation = mongoose.Schema({
    name:{type:String ,required:true}
})

module.exports = mongoose.model("generation", generation);