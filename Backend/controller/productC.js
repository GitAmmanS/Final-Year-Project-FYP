const Ram = require('../models/ram')
const Hdd = require('../models/hdd')
const Products = require('../models/product');
exports.getProducts = async (req, res) => {
    try {
        const data = await Products.find({}).populate('category_ID').populate('company_ID').populate('specs')
        .populate({ path:'specs.ram',
            populate:[
            {path:'capacity'},
            {path:'type'}, 
        ] }).populate({path:'specs.hdd',
            populate:[
                {path:'capacity'},
                {path:'type'}
            ]
        })
        .populate('specs.cpu')
        .populate('specs.os');
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
exports.getProductsByName = async (req, res) => {
    try {
        const data = await Products.find({ name: { $regex: req.params.name, $options: 'i' } }).populate('category_ID').populate('company_ID').populate('specs');
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
exports.getProductsById = async (req, res) => {
    try {
        console.log('running')
        const data = await Products.findById(req.params._id).populate('category_ID').populate('company_ID').populate('specs');
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
exports.postProduct = async (req, res) => {
    try {
        let specs = null;
        console.log("Request body:", req.body);
        const { model } = req.body;
        const {otherspecs} = req.body;
        const findProduct = await Products.findOne({ model });
        if (findProduct) {
            return res.status(400).send("Product already Exists");
        }
        const { ram_capacity, ram_type, hdd_capacity, hdd_type, cpu, os } = req.body;
        if (ram_capacity && ram_type && hdd_capacity && hdd_type && cpu && os) {
            const ram = await Ram.findOne({ capacity: ram_capacity, type: ram_type, });
            const hdd = await Hdd.findOne({ capacity: hdd_capacity, type: hdd_type });
            specs = {
                cpu,
                os,
                ram,
                hdd,
                otherspecs
            };
        }
        else {
            specs = {
                cpu: null,
                os: null,
                ram: null,
                hdd: null,
                otherspecs: otherspecs || null 
            };
        }
        const path = req.file ? `${req.file.filename}` : null;
        if (!path) {
            return res.status(400).send('Picture is required');
        }
        const data = new Products({
            picture: path,
            specs,
            ...req.body
        });

        console.log("Item data to be saved:", data);
        await data.save();
        res.status(200).send("Inserted Successfully");

    }catch (err) {
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
        let specs = null;
        console.log("Request body:", req.body);
        const {otherspecs} = req.body;
        const { ram_capacity, ram_type, hdd_capacity, hdd_type, cpu, os } = req.body;
        if (ram_capacity && ram_type && hdd_capacity && hdd_type && cpu && os) {
            const ram = await Ram.findOne({ capacity: ram_capacity, type: ram_type, });
            const hdd = await Hdd.findOne({ capacity: hdd_capacity, type: hdd_type });
            specs = {
                cpu,
                os,
                ram,
                hdd,
                otherspecs
            };
        }
        else {
            specs = {
                cpu: null,
                os: null,
                ram: null,
                hdd: null,
                otherspecs: otherspecs || null 
            };
        }
        const path = req.file ? `${req.file.filename}` : null;
        // if (!path) {
        //     return res.status(400).send('Picture is required');
        // }
        const data = await Products.findOneAndUpdate(
            { _id: req.params.product_id },
            {
                $set: {
                    picture: path, 
                    specs,
                    ...req.body
                }
            }
        );
            if (!data) {
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
        console.log("Product  to be Update:", data);
        await data.save();
    }catch (err) {
        console.error("Error in Updatiung Item:", err);
    }
   
};