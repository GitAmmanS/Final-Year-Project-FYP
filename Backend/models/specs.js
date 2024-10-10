const { type } = require('express/lib/response');
const mongoose = require('mongoose')
const specs = new mongoose.Schema({
   
});
module.exports= mongoose.model("specs",specs);