const mongoose= require('mongoose')

const os = new mongoose.Schema({
    name:{type: String}
});

module.exports= mongoose.model("os",os);