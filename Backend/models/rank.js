const mongoose = require("mongoose");
const rank = mongoose.Schema({
    name:{type:String ,required:true}
})

module.exports = mongoose.model("rank", rank);