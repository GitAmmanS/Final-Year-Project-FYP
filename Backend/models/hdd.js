const mongoose= require('mongoose')

const HddSchema = new mongoose.Schema({
    capacity: { type:mongoose.Schema.Types.ObjectId ,ref :"capacities",required:true },
    type: { type:mongoose.Schema.Types.ObjectId ,ref :"type",required:true},
    status: { type:mongoose.Schema.Types.ObjectId ,ref :"status",required:true } 
});

module.exports= mongoose.model("hdd",HddSchema);