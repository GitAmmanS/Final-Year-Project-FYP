const mongoose = require("mongoose");
const users = mongoose.Schema({
    name:{type:String ,required:true},
    phone:{type:String , required :true},
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: {type:String, required:true},
    picture:{type:String },
    role:{type:String ,enum:["teacher","lab_Incharge","store_Incharge","admin","technician"],default:"teacher",required:true},
    is_active: { 
        type: String,
        default: null
    },
    is_verified: { type: Boolean, default: false, required: true }
});

module.exports = mongoose.model("users", users);