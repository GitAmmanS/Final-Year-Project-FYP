const ProductStore = require('../models/productStore');
var generator = require('generate-serial-number');
const QRCode = require('qrcode');
const lab = require('../models/lab')
exports.getProductStoreByLabId = async (req,res)=>{
    try{
    const data = await ProductStore.find({lab_ID:req.params.id}).populate({
        path: 'items.product_ID',
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
    if(data){
        res.status(200).json({
            success:true,
            data:data
        })
    }
    }
    
        catch(error){
            res.status(500).json({
                success:false,
                message:error.message
            })
        }
    }
exports.postProductStore = async (req,res)=>{
    try {
        var generateSerialNumber = generator.generate(14);
        const { store_ID, lab_ID, remarks } = req.body;
        const qrCodeData = await QRCode.toDataURL(generateSerialNumber);
        const data = new ProductStore({
            store_ID,
            lab_ID,
            remarks
        });
        if (!data.items) {
            data.items = [];
          }
          data.items.push({
            ...req.body.items[0],
            serialNumber: generateSerialNumber,
            qrCode:qrCodeData
          });
        console.log(" data to be saved:", data);
        await data.save();
        res.status(200).send("Inserted Successfully");

    } catch (err) {
        console.error("Error :", err);  
        res.status(500).send("Internal Server Error: " + err.message);
    }
}
exports.updateProductStore = async (req, res) => {

    const data = await ProductStore.deleteOne({ _id: req.params.productstore_id }); 
    if (data.deletedCount === 0) {
        res.send({
            success: false,
            message: data.deletedCount
        });
    } else {
        res.send({
            success: true,
            message: `${data.deletedCount} productstore deleted Successfully`
        });
    }
};
exports.deleteProductStore = async (req, res) => {
    try {
        
        const data = await ProductStore.updateOne(
            { _id: req.params.productstore_id },
            { $set: { ...req.body } }
        );

        if (data.matchedCount === 0) {
            res.status(404).send({
                success: false,
                message: "productstore not found"
            });
        } else {
            res.send({
                success: true,
                message: "productstore updated successfully"
            });
        }
    } catch (error) {
        console.error('Error updating productstore_id:', error);
        res.status(500).send("Internal Server Error");
    }
};
exports.getProductStoreByUserId = async (req,res)=>{
    try{
        const getLab = await lab.findOne({incharge:req.params.id});
        if(!getLab){
            return res.status(500).json({
                success:false,
                message:"user not found"
            })
        }
        console.log(getLab);
    const data = await ProductStore.find({lab_ID:getLab._id}).populate({
        path: 'items.product_ID',
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
    if(data){
        res.status(200).json({
            success:true,
            data:data
        })
    }
    }
    
        catch(error){
            res.status(500).json({
                success:false,
                message:error.message
            })
        }
    }