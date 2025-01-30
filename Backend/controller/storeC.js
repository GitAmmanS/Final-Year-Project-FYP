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
        const newProductIds=[];
        const newProducts=[];
        for(let i=0;i<req.body.length;i++){
            const {id} = req.body[i]
            const findById = await Store.findOne({product_ID:id});
            if(!findById){
                newProductIds.push(id);
            }
        }
        for(let i=0;i<newProductIds.length;i++){
             newData = new Store({
                product_ID:newProductIds[i]
            })
        const savedProduct=   await newData.save();
        newProducts.push(savedProduct)
        }
        if(newProducts.length>0){
            res.status(200).json({
                message:"Products Added Successfully in Store",
                data:newData,
                count:newProducts.length
            })
        }
        else{
            res.status(200).json({
                message:"No New Product to Add",
                count:0
            })
        }
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
        const { quantity } = req.body;
        let newQuantity;
        const store_id = req.params.store_id;
        const product = await Store.findOne({ _id: store_id });
        if(!product.quantity){
             newQuantity = parseInt(quantity);
        }
        else{
            newQuantity=product.quantity+parseInt(quantity);
        }
      
        
       
        const updatedData = await Store.findOneAndUpdate(
            { _id: store_id },
            {
                $set: { quantity: newQuantity },
                $push: {
                    record: {
                        addedQuantity: Number(quantity),
                        addedtime: new Date(),
                        previousQuanitity:product.quantity
                    },
                },
            },
            { new: true } 
        ).populate({
            path: 'product_ID',
            populate: [
                { path: 'category_ID', select: 'name' },
                { path: 'company_ID', select: 'name' },
            ],
        });
        if (!updatedData) {
            return res.status(500).json({ message: "not found store data" })
        }
        if (updatedData.matchedCount === 0) {
            res.status(404).send({
                success: false,
                message: "Store not found"
            });

        } else {
            res.send({
                success: true,
                message: "Store updated successfully",
                data: updatedData
            });
        }
    } catch (error) {
        console.error('Error updating store:', error);
        res.status(500).send("Internal Server Error");
    }
};