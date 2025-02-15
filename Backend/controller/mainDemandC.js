const Demand = require('../models/mainDemand')
const User = require('../models/users')
const Store = require('../models/store');
exports.postDemand = async (req, res) => {

    try {
        const { description, userName, quantities } = req.body;
        const maxDemand = await Demand.findOne().sort({ number: -1 }).select('number');
        const maxNumber = maxDemand ? maxDemand.number : 999;
        const generatedNumber = maxNumber + 1;


        const findUser = await User.findOne({ name: userName });

        const ids = Object.keys(quantities);
        const quantity = Object.values(quantities);
        const data = new Demand({
            requester: findUser._id,
            number: generatedNumber,
            description: description,
            items: ids.map((productId, index) => ({
                product_Id: productId,
                quantityDemanded: quantity[index],
            })),
        });
        await data.save();
        res.status(200).send({
            success: true,
            data: data,
            message: "Demand Inserted Sucessfully"
        });
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
        const data = await Demand.findOne(number).populate('requester')
            .populate({
                path: 'items.product_Id',
                populate: [
                    { path: 'category_ID' },
                    { path: 'company_ID' },
                    {
                        path: 'specs',
                        populate: [
                            { path: 'cpu' },
                            { path: 'os' },
                            {
                                path: 'ram',
                                populate: [
                                    { path: 'capacity' },
                                    { path: 'type' },
                                ]
                            },
                            {
                                path: 'hdd',
                                populate: [
                                    { path: 'capacity' },
                                    { path: 'type' }]
                            },
                        ],
                    },
                ],
            });
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
exports.getDemandByName = async (req, res) => {
    try {
        const userName = req.params.name;
        const user = await User.findOne({ name: userName });
        if (!user) {
            return res.status(500).json({ message: "User not found" })
        }
        const requester_ID = user._id;
        const data = await Demand.find({ requester: requester_ID }).populate('requester')
            .populate({
                path: 'items.product_Id',
                populate: [
                    { path: 'category_ID' },
                    { path: 'company_ID' },
                    {
                        path: 'specs',
                        populate: [
                            { path: 'cpu' },
                            { path: 'os' },
                            {
                                path: 'ram',
                                populate: [
                                    { path: 'capacity' },
                                    { path: 'type' },
                                ]
                            },
                            {
                                path: 'hdd',
                                populate: [
                                    { path: 'capacity' },
                                    { path: 'type' }]
                            },
                        ],
                    },
                ],
            });
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

exports.updateDemand = async (req, res) => {
    try {
        const { StoreQuantity, editId, demandId } = req.body;
        const existingDemand = await Demand.findOne({
            _id: demandId,
            "items.product_Id": editId
        });
        if (!existingDemand) {
            return res.status(404).json({ success: false, message: "Demand or item not found" });
        }
        const storeItemFind = await Store.findOne({ product_ID: editId });
        if (!storeItemFind) {
            const storeData = new Store({ product_ID: editId })
            await storeData.save();
        }
        const storeItem = await Store.findOne({ product_ID: editId });
        const matchedItem = existingDemand.items.find(item => item.product_Id._id.toString() === editId._id);
        if (!matchedItem) {
            return res.status(404).json({ success: false, message: "Product not found in demand items" });
        }
        let totalRecievedQuantity = parseInt(StoreQuantity);
        if (matchedItem.status === "partially resolved") {
            totalRecievedQuantity += matchedItem.quantityReceived;
        }

        let itemStatus;
        if (matchedItem.quantityDemanded === totalRecievedQuantity) {
            itemStatus = "resolved";
        } else if (totalRecievedQuantity > 0 && totalRecievedQuantity < matchedItem.quantityDemanded.toString()) {
            itemStatus = "partially resolved";
        } else {
            return res.status(400).json({ success: false, message: "Quantity exceeds demand or is invalid" });
        }
        const updatedDemand = await Demand.findOneAndUpdate(
            { _id: demandId, "items.product_Id": editId },
            {
                $set: {
                    "items.$.quantityReceived": totalRecievedQuantity,
                    "items.$.status": itemStatus
                }
            },
            { new: true }
        );

        const partiallyResolvedItems = updatedDemand.items.filter(item => item.status === "partially resolved" || item.status === "pending");
        const demandStatus = partiallyResolvedItems.length > 0 ? "partially resolved" : "resolved";

        const updateData = await Demand.findOneAndUpdate(
            { _id: demandId },
            { $set: { demandStatus: demandStatus } }
        );
        const quantity1 = storeItem.quantity;
        const quantity2 = Number(StoreQuantity);
        if (isNaN(quantity1) || isNaN(quantity2)) {
            throw new Error("Invalid quantity values. Both values must be valid numbers.");
        }
        const newQuantity = quantity1 + quantity2;
        const storeUpdate = await Store.findOneAndUpdate(
            {product_ID: editId},
        {
            $set:{ quantity: newQuantity },
            $push: {
                record: {
                    addedQuantity: Number(StoreQuantity),
                    addedtime: new Date(),
                    previousQuanitity:storeItem.quantity
                },
            },
        },{new:true});
        return res.status(200).json({
            success: true,
            message: "Demand updated successfully",
            updatedDemand: updateData,
        });
    }
    catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: "error in updating" });
    }
}