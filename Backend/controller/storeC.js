const Store = require('../models/store');
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
            .populate({
                path: 'status_ID',
                select: 'name'
            });;
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
        const data = new Store({
            ...req.body
        });

        console.log("Store data to be saved:", data);
        await data.save();
        res.status(200).send("Inserted Successfully");

    } catch (err) {
        console.error("Error in itemsPost:", err);
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

        const data = await Store.updateOne(
            { _id: req.params.store_id },
            { $set: { ...req.body } }
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