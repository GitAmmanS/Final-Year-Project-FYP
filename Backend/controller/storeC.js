const Store = require('../models/store');
const Product = require('../models/product')
exports.getStore = async (req, res) => {
    try {
        const data = await Store.find()
            .populate({
                path: 'product_ID',
                populate: [
                    { path: 'category_ID', select: 'name' },
                    { path: 'company_ID', select: 'name' },
                ]
            })
        res.status(200).json({
            success: true,
            data: data
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.postStore = async (req, res) => {
    try {
        console.log(req.body);
        const {selectedProductId,quantity,status}=req.body;
        const existingProduct = await Store.findOne({ product_ID: selectedProductId });

        if (existingProduct) {
            return res.status(409).json({
                success: false,
                message: 'Product already exists in the store.'
            });
        }
        const storeData = new Store({
            product_ID: selectedProductId,
            quantity:quantity,
            status:status
        });
        console.log("Store data to be saved:", storeData);
        await storeData.save();
        res.status(200).json({success:true,message:"Inserted Successfully"});

    } catch (err) {
        console.error("Error in Store:", err);
        res.status(500).send("Internal Server Error: " + err.message);
    }
}
exports.deleteStore = async (req, res) => {

    const data = await Store.deleteOne({ _id: req.params.store_id });
    if (data.deletedCount === 0) {
        res.send({
            success: false,
            message: data.deletedCount
        });
    } else {
        res.send({
            success: true,
            message: `${data.deletedCount} store deleted Successfully`
        });
    }
};
exports.updateStore = async (req, res) => {
    try {
        const {quantity} = req.body;
        const store_id = req.params.store_id;
        const product = await Store.findOne({ _id:store_id});
        const newQuantity = product.quantity+parseInt(quantity);
        const data = await Store.updateOne(
            { _id: req.params.store_id },
            { $set: { quantity:newQuantity} }
        );
        if (data.matchedCount === 0) {
            res.status(404).send({
                success: false,
                message: "Store not found"
            });
        } else {
            res.send({
                success: true,
                message: "Store updated successfully"
            });
        }
    } catch (error) {
        console.error('Error updating store:', error);
        res.status(500).send("Internal Server Error");
    }
};