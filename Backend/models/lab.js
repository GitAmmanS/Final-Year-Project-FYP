const mongoose=require('mongoose')

const labs=mongoose.Schema({
    labIncarge:{type:mongoose.Schema.Types.ObjectId , ref:"users",required:true},
    type:{type:String,enum:["lab","room"],default:"lab"},
    status:{type:String,enum:["active","inactive"],default:"active"}
},{timestamps:true});
module.exports = mongoose.model('labs', labs);
