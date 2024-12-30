const mongoose=require('mongoose')

const labs=mongoose.Schema({
    name:{type:String},
    location:{type:String},
    lab_incharge:{type:String},
    /*
    items:[{
        item_id:{type:mongoose.Schema.Types.ObjectId}
    }],
    status:{type:String},
    assigned_tech:{type:mongoose.Schema.Types.ObjectId , ref:'technicians'}
*/
})
module.exports = mongoose.model('labs', labs);
