const mongoose = require("mongoose");
const users = mongoose.Schema({
    name:{type:String ,required:true},
    phone:{type:String , required :true},
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: {type:String, required:true},
    role:{type:String ,enum:["teacher","lab_Incharge","store_Incharge","admin","technician"],default:"lab_Incharge",required:true},
    is_verified: { type: Boolean, default: false, required: true }
});

module.exports = mongoose.model("users", users);