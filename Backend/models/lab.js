const mongoose=require('mongoose')

const labs=mongoose.Schema({
    incharge:{type:mongoose.Schema.Types.ObjectId , ref:"users",required:true},
    type:{type:String,enum:["lab","room","store"],default:"lab"},
    status:{type:String,enum:["active","inactive"],default:"active"},
    number:{type:Number,required:true}
},{timestamps:true});
module.exports = mongoose.model('lab', labs);
