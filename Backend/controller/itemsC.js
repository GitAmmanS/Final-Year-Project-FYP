const { status } = require('express/lib/response');
const items = require('../models/items')
const generator = require('generate-serial-number');
const QRCode = require('qrcode')
const Ram=require('../models/ram')
const Hdd=require('../models/hdd')
const mongoose = require('mongoose');

exports.getItems = async (req, res) => {
    try {
        const data = await items.find()
        .populate('category_ID').populate('company_ID').populate('specs').populate('labId').populate('roomId').populate('status_ID');
        res.status(200).json({
            success: true,
            data: data
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message
        });
    }
}
exports.getItemById = async (req, res) => {
    try {
        const data = await items.findOne({_id: req.params._id})
        .populate('category_ID')
        .populate('company_ID')
        .populate('specs.cpu')
        .populate('specs.os')
        .populate('specs.otherspecs')
        .populate('labId')
        .populate('roomId')
        .populate('status_ID')
        .populate({
          path: 'specs.ram',
          populate: [
            { path: 'capacity', model: 'capacities' },  // Populate capacity from capacities schema
            { path: 'type', model: 'type' } ,
            { path: 'status', model: 'status' }               // Populate type from type schema
          ]
        })
        .populate({
          path: 'specs.hdd',
          populate: [
            { path: 'capacity', model: 'capacities' },  // Populate capacity from capacities schema
            { path: 'type', model: 'type' },
            { path: 'status', model: 'status' }                 // Populate type from type schema
          ]
        });
   res.status(200).json({
            success: true,
            data: data
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message
        });
    }
}

exports.itemsPost = async (req, res) => {
    try {
        let specs = null;
        console.log("Request body:", req.body);
        const { cpu, otherspecs, os, ram, hdd } = req.body;
        const ram_id = await Promise.all(
            (ram || []).map(async (ramSpec) => {
                if (mongoose.Types.ObjectId.isValid(ramSpec.capacity) &&
                    mongoose.Types.ObjectId.isValid(ramSpec.type) &&
                    mongoose.Types.ObjectId.isValid(ramSpec.status)) {
                    const newRam = new Ram(ramSpec);
                    const savedRam = await newRam.save();
                    return savedRam._id;
                }
                return null;
            })
        ).then(ids => ids.filter(id => id !== null));  
        const hdd_id = await Promise.all(
            (hdd || []).map(async (hddSpec) => {
                if (mongoose.Types.ObjectId.isValid(hddSpec.capacity) &&
                    mongoose.Types.ObjectId.isValid(hddSpec.type) &&
                    mongoose.Types.ObjectId.isValid(hddSpec.status)) {
                    const newHdd = new Hdd(hddSpec);
                    const savedHdd = await newHdd.save();
                    return savedHdd._id;
                }
                return null;
            })
        ).then(ids => ids.filter(id => id !== null));  

        const path = req.file ? `${req.file.filename}` : null;
        if (!path) {
            return res.status(400).send('Picture is required');
        }

        const serialNumber = generator.generate(14);
        const qrCode = await QRCode.toDataURL(serialNumber);

        if (cpu || otherspecs || os || ram_id.length || hdd_id.length) {
            specs = {
                cpu,
                otherspecs,
                os,
                ram: ram_id,
                hdd: hdd_id
            };
        }

        const data = new items({
            picture: path,
            serialNumber,
            qrCode,
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
};


exports.itemsPostBulk = async (req, res) => {
    try {
        let specs = null;
        console.log("Request body:", req.body);
        const { cpu, otherspecs, os, ram, hdd } = req.body;
        const ram_id = await Promise.all(
            (ram || []).map(async (ramSpec) => {
                if (mongoose.Types.ObjectId.isValid(ramSpec.capacity) &&
                    mongoose.Types.ObjectId.isValid(ramSpec.type) &&
                    mongoose.Types.ObjectId.isValid(ramSpec.status)) {
                    const newRam = new Ram(ramSpec);
                    const savedRam = await newRam.save();
                    return savedRam._id;
                }
                return null;
            })
        ).then(ids => ids.filter(id => id !== null));  
        const hdd_id = await Promise.all(
            (hdd || []).map(async (hddSpec) => {
                if (mongoose.Types.ObjectId.isValid(hddSpec.capacity) &&
                    mongoose.Types.ObjectId.isValid(hddSpec.type) &&
                    mongoose.Types.ObjectId.isValid(hddSpec.status)) {
                    const newHdd = new Hdd(hddSpec);
                    const savedHdd = await newHdd.save();
                    return savedHdd._id;
                }
                return null;
            })
        ).then(ids => ids.filter(id => id !== null));  
        const path = req.file ? `${req.file.filename}` : null;
        if (!path) {
            return res.status(400).send('Picture is required');
        }

        let {quantity}=req.body; 
        if (!quantity || quantity <= 0) {
            return res.status(400).send('Invalid quantity');
        }
        const itemsToSave = [];
        if (cpu || otherspecs || os || ram_id.length || hdd_id.length) {
            specs = {
                cpu,
                otherspecs,
                os,
                ram: ram_id,
                hdd: hdd_id
            };
        }
        const newquantity = 1;
        for (let i = 0; i < quantity; i++) {
            const serialNumber = generator.generate(14);
            const qrCode = await QRCode.toDataURL(serialNumber);
            const data = new items({
                picture: path,
                serialNumber: serialNumber,
                qrCode: qrCode,
                specs: specs,
                quantity:newquantity,
                ...req.body
            });

            itemsToSave.push(data);
        }
        console.log("data ready for push"+itemsToSave)
        await items.insertMany(itemsToSave);

        res.status(200).send(`${quantity} Items Inserted Successfully`);
    } catch (err) {
        console.error("Error in itemsPostBulk:", err);
        res.status(500).send("Internal Server Error: " + err.message);
    }
};

exports.itemsDelete = async (req, resp) => {

    const data = await items.deleteOne({ _id: req.params.items_id }); 
    if (data.deletedCount === 0) {
        resp.send({
            success: false,
            message: data.deletedCount
        });
    } else {
        resp.send({
            success: true,
            message: data.deletedCount
        });
    }
};
exports.itemsUpdate = async (req, resp) => {
    try {
        const path = req.file ? `item_pic/${req.file.filename}` : null;
        // const specs = {
        //     cpu: req.body.cpu, 
        //     ram: req.body.ram.map(r => ({
        //         ram_id: r.ram_id,
        //         capacity: r.capacity,
        //         type: r.type,
        //         status: r.status || 'new'
        //     })),
        //     hdd: req.body.hdd.map(h => ({
        //         hdd_id: h.hdd_id,
        //         capacity: h.capacity,
        //         type: h.type,
        //         status: h.status || 'new'
        //     })),
        //     os: req.body.os, 
        //     otherspecs: req.body.otherspecs 
        // };
        const data = await items.updateOne(
            { _id: req.params.items_id },
            { $set: { picture: path, 
                // specs:specs,
                ...req.body } }
        );

        if (data.matchedCount === 0) {
            resp.status(404).send({
                success: false,
                message: "Item not found"
            });
        } else {
            resp.send({
                success: true,
                message: "Item updated successfully"
            });
        }
    } catch (error) {
        console.error('Error updating item:', error);
        resp.status(500).send("Internal Server Error");
    }
};