const mongoose=require('mongoose')

const rooms=mongoose.Schema({
    name:{type:String},
    location:{type:String},
    assigned_teacher:{type:String},
    items:[{
        item_id:{type:mongoose.Schema.Types.ObjectId}
    }],
    status:{type:String}

})
module.exports = mongoose.model('rooms', rooms);
