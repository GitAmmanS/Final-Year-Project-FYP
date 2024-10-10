const mongoose= require('mongoose')

const cpu = new mongoose.Schema({
    name:{type: String}
});

module.exports= mongoose.model("cpu",cpu);