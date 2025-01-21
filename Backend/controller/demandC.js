const Demand = require('../models/demand')
const User = require('../models/users')
const Store = require('../models/store');
const generateRandomNumber = async () => {
    let randomNumber = Math.floor(Math.random() * 100000);
    let existingDemand = await Demand.findOne({ number: randomNumber });
    while (existingDemand) {
        randomNumber = Math.floor(Math.random() * 10000);
        existingDemand = await Demand.findOne({ number: randomNumber });
    }

    return randomNumber;
};
exports.postDemand = async (req, res) => {

    try {
        console.log(req.body);
        const { description, userName, quantities } = req.body;
        const generatedNumber = await generateRandomNumber();

        const findUser = await User.findOne({ name: userName });
        console.log(findUser._id);
        const ids = Object.keys(quantities);
        const quantity = Object.values(quantities);
        console.log("number", generatedNumber)
        const data = new Demand({
            requester: findUser._id,
            number: generatedNumber,
            description: description,
            items: ids.map((productId, index) => ({
                product_Id: productId,
                quantityDemanded: quantity[index],
            })),
        });
        console.log(data)
        await data.save();
        res.status(200).send({
            success: true,
            data: data,
            message:"Demand Inserted Sucessfully"
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
exports.updateDemand = async (req, res) => {

    try {
        const { StoreQuantity, editId, demandId } = req.body;
        const _id = demandId;
        const product_Id = editId;
        const existingDemand = await Demand.findOne({
            _id: _id,
            "items.product_Id": product_Id
        });
        if (!existingDemand) {
            return res.status(404).json({ success: false, message: "Demand or item not found" });
        }
        const storeItem = await Store.findOne({ product_ID: product_Id });

        if (!storeItem) {
            return res.status(404).json({ success: false, message: "Store item not found" });
        }
        if(StoreQuantity>=1 && storeItem.quantity>=StoreQuantity ){
        const updateData = await Demand.findOneAndUpdate(
            { _id: _id, "items.product_Id": product_Id },
            {
                $set: { "items.$.quantityReceived": StoreQuantity },
                "items.$.status": "resolved",
                "demandStatus" : "resolved"
            });
        res.status(200).json({
            success: true,
            message: "Demand updated successfully"
        })
        const newQuantity = storeItem.quantity - StoreQuantity;
        console.log(newQuantity)
        const updateStoreQuantity = await Store.findOneAndUpdate({ product_ID: product_Id },
            { $set: { quantity: newQuantity } }
        )
        if (!updateStoreQuantity) {
            return res.status(500).json({ success: false, message: "Failed to update store quantity" });
        }
        
    }
    else{
        res.status(500).json({success:false,message:"Error in Quanitity"})
    }
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
exports.getDemand = async (req, res) => {
    try {
        const data = await Demand.find().populate('requester').populate('items.product_Id');
        if (data) {
            res.status(200).send({
                success: true,
                data: data
            });
        } else {
            res.status(404).send({
                success: false,
                data: "demand not found"
            });
        }
    }
    catch (err) {
        res.status(500).send('Not found demand ' + err.message);
    }
}
exports.getDemandByStatus = async (req, res) => {
    try {

        const data = await Demand.find({ demandStatus: "pending" }).populate('requester').populate('items.product_Id');
        if (data) {
            res.status(200).send({
                success: true,
                data: data.length
            });
        } else {
            res.status(404).send({
                success: false,
                data: "demand not found"
            });
        }
    }
    catch (err) {
        res.status(500).send('Not found demand ' + err.message);
    }
}
exports.getDemandById = async (req, res) => {
    try {
        const number = req.params;
        const data = await Demand.findOne(number).populate('requester').populate({ path: 'items.product_Id' }).populate({ path: 'items.product_Id', populate: { path: 'category_ID' } })
            .populate({ path: 'items.product_Id', populate: { path: 'company_ID' } });
        if (data) {
            res.status(200).send({
                success: true,
                data: data
            });
        } else {
            res.status(404).send({
                success: false,
                data: "demand not found"
            });
        }
    }
    catch (err) {
        res.status(500).send('Not found demand ' + err.message);
    }
}