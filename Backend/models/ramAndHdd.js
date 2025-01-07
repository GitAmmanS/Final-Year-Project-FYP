const mongoose = require('mongoose')

const capacitySchema =new mongoose.Schema({
    size: { type: String, required: true }
});
const Capacity = mongoose.model('capacities', capacitySchema);

const typeSchema =new mongoose.Schema({
    name: { type: String, required: true }
});
const Type = mongoose.model('type', typeSchema);
module.exports = { Capacity, Type };
