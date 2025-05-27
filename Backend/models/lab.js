const mongoose=require('mongoose')

const labs=mongoose.Schema({
    incharge:{type:mongoose.Schema.Types.ObjectId , ref:"users",required:true},
    type:{type:String,enum:["lab","class_room","Lecture_Theater","staff_room"],default:"lab"},
    status:{type:String,enum:["active","inactive"],default:"active"},
    number:{type:String,required:true ,unique:true}
},{timestamps:true});

module.exports = mongoose.model('lab', labs);
