const mongoose = require('mongoose')

const Permissions = mongoose.Schema({
    actions :[{
        type:String,enum:['create','read','update','delete'],default:'read',required:true
    }],
    resources:{type:String,required:true}
})

module.exports = mongoose.model('permission',Permissions);