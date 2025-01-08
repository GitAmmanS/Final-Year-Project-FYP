const mongoose = require("mongoose");
const users = mongoose.Schema({
    name:{type:String ,required:true},
    phone:{type:String , required :true},
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: {type:String, required:true},
    role_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"role",required:true},
    is_verified: { type: Boolean, default: false, required: true }
})

module.exports = mongoose.model("users", users);