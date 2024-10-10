const mongoose= require('mongoose')

const ramSchema = mongoose.Schema({
    capacity: { type: mongoose.Schema.Types.ObjectId, ref: "capacities" },
    type: { type: mongoose.Schema.Types.ObjectId, ref: "type" },
    status: { type: mongoose.Schema.Types.ObjectId, ref: "status" }
});
module.exports= mongoose.model("ram",ramSchema);