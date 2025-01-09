const Ram=require('../models/ram')
const Hdd=require('../models/hdd')
const Products = require('../models/product');
exports.getProducts = async (req,res)=>{
    try{
    const data =await Products.find({}).populate('category_ID').populate('company_ID').populate('specs');
        res.status(200).json({
            success:true,
            data:data
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
}
exports.getProductsByName = async (req,res)=>{
    try{
    const data =await Products.find({name:{$regex:req.params.name,$options:'i'}}).populate('category_ID').populate('company_ID').populate('specs');
        res.status(200).json({
            success:true,
            data:data
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
}
exports.getProductsById = async (req,res)=>{
    try{
        console.log('running')
    const data =await Products.findById(req.params._id).populate('category_ID').populate('company_ID').populate('specs');
        res.status(200).json({
            success:true,
            data:data
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
}
exports.postProduct = async (req,res)=>{
    try {
        let specs = null;
        console.log("Request body:", req.body);
        const { cpu, otherspecs, os, ram, hdd } = req.body;
        const path = req.file ? `${req.file.filename}` : null;
        if (!path) {
            return res.status(400).send('Picture is required');
        }
        if (cpu || otherspecs || os || ram || hdd) {
            specs = {
                cpu,
                otherspecs,
                os,
                ram,
                hdd
            };
        }
        const data = new Products({
            picture: path,
            specs,
            ...req.body
        });

        console.log("Item data to be saved:", data);
        await data.save();
        res.status(200).send("Inserted Successfully");

    } catch (err) {
        console.error("Error in itemsPost:", err);  
        res.status(500).send("Internal Server Error: " + err.message);
    }
}
exports.deleteProduct = async (req, res) => {

    const data = await Products.deleteOne({ _id: req.params.product_id }); 
    if (data.deletedCount === 0) {
        res.send({
            success: false,
            message: data.deletedCount
        });
    } else {
        res.send({
            success: true,
            message: `${data.deletedCount} product deleted Successfully`
        });
    }
};
exports.productUpdate = async (req, res) => {
    try {
        const path = req.file ? `${req.file.filename}` : null;
        let specs = null;
        console.log("Request body:", req.body);
        const { cpu, otherspecs, os, ram, hdd } = req.body;
         if (!path) {
            return res.status(400).send('Picture is required');
        }
        if (cpu || otherspecs || os || ram || hdd) {
            specs = {
                cpu,
                otherspecs,
                os,
                ram,
                hdd
            };
        }
        const data = await Products.updateOne(
            { _id: req.params.product_id },
            { $set: { picture: path,
                specs,
                ...req.body } }
        );

        if (data.matchedCount === 0) {
            res.status(404).send({
                success: false,
                message: "Item not found"
            });
        } else {
            res.send({
                success: true,
                message: "Item updated successfully"
            });
        }
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).send("Internal Server Error");
    }
};