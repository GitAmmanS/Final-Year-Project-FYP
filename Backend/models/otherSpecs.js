const mongoose= require('mongoose')

const otherSpecs = new mongoose.Schema({
    name:{type: String}
});

module.exports= mongoose.model("otherSpecs",otherSpecs);