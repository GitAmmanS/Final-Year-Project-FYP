const mongoose = require("mongoose");
const role = mongoose.Schema({
    name:{type:String ,required:true},
    description:{type:String},
    permissions:[{
        Permission_ID:{type:mongoose.Schema.Types.ObjectId,ref:'permission',required:true}
    }]
})

module.exports = mongoose.model("role", role);