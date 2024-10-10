const { Capacity, Type, Status } = require('../models/ramAndHdd');

exports.getCapacity = async (req, res) => {
    try {
        const data = await Capacity.find();
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching capacities', error: err.message });
    }
};

exports.postCapacity = async (req, res) => {
    try {
        const capacity = new Capacity({ size: req.body.size });
         await capacity.save();
        res.status(201).send({ success: true, data: capacity });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error saving capacity', error: err.message });
    }
};

exports.getType = async (req, res) => {
    try {
        const data = await Type.find();
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching types', error: err.message });
    }
};

exports.postType = async (req, res) => {
    try {
        const type = new Type({ name: req.body.name });
        const savedType = await type.save();
        res.status(201).send({ success: true, data: savedType });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error saving type', error: err.message });
    }
};

// exports.getStatus = async (req, res) => {
//     try {
//         const data = await Status.find();
//         res.status(200).json({ success: true, data });
//     } catch (err) {
//         res.status(500).json({ success: false, message: 'Error fetching statuses', error: err.message });
//     }
// };

// exports.postStatus = async (req, res) => {
//     try {
//         const status = new Status({ status: req.body.status });
//         const savedStatus = await status.save();
//         res.status(201).json({ success: true, data: savedStatus });
//     } catch (err) {
//         res.status(500).json({ success: false, message: 'Error saving status', error: err.message });
//     }
// };
