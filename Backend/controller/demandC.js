const Demand = require('../models/demand')
const User = require('../models/users')
const Store = require('../models/store');
var generator = require('generate-serial-number');
const QRCode = require('qrcode');
const ProductStore = require('../models/productStore');
const lab = require('../models/lab');
exports.postDemand = async (req, res) => {

    try {
        const { description, userName, quantities } = req.body;
        const maxDemand = await Demand.findOne().sort({ number: -1 }).select('number');
        const maxNumber = maxDemand ? maxDemand.number : 3999;
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
        const storeItem = await Store.findOne({ product_ID: editId });
        if (!storeItem) {
            return res.status(404).json({ success: false, message: "Store item not found" });
        }

        const matchedItem = existingDemand.items.find(item => item.product_Id._id.toString() === editId._id);
        if (!matchedItem) {
            return res.status(404).json({ success: false, message: "Product not found in demand items" });
        }

        if (StoreQuantity < 1 || StoreQuantity > storeItem.quantity) {
            return res.status(400).json({ success: false, message: "Invalid Store Quantity" });
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

        const newQuantity = storeItem.quantity - StoreQuantity;
        const updateStoreQuantity = await Store.findOneAndUpdate(
            { product_ID: editId },
            { $set: { quantity: newQuantity } }
        );
        if(updateStoreQuantity){
            const user= existingDemand.requester;
            postToProductStore(storeItem,StoreQuantity,user);
        }
        if (!updateStoreQuantity) {
            return res.status(500).json({ success: false, message: "Failed to update store quantity" });
        }

        return res.status(200).json({
            success: true,
            message: "Demand updated successfully",
            updatedDemand: updateData,
        });
    } catch (err) {
        console.error("Error:", err.message);
        return res.status(500).json({ success: false, message: err.message });
    }
};
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
exports.getDemandByUserID = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findOne({ _id: id });
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
async function postToProductStore (storeItem,quantityReceived,user){
    try {
            //    console.log(user);
               const searchLabs = await lab.findOne({incharge:user});
               const getUser = searchLabs._id;
               const data = new ProductStore({
                store_ID:storeItem._id,
                lab_ID:getUser,
                quantity:quantityReceived,
                items:[]
            });
           for (let i=0;i<quantityReceived;i++){
            var generateSerialNumber = generator.generate(14);
            var qrCodeData = await QRCode.toDataURL(generateSerialNumber);

              data.items.push({
                product_ID:storeItem.product_ID,
                serialNumber: generateSerialNumber,
                qrCode:qrCodeData
              });
            generateSerialNumber=0;
            qrCodeData='';
           }
            await data.save();
        } catch (err) {
            console.error("Error :", err);  
        }
}