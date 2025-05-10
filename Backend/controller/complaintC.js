const Complain = require('../models/complaint')

exports.getComplain = async (req, resp) => {
    try {
        const data = await Complain.find().populate('generated_by')
            .populate({
                path: 'product.ItemStore_ID',
                populate: [
                    { path: 'category_ID', model: 'category' },
                    { path: 'company_ID', model: 'company' }
                ]
            });;
        if (data.length != 0) {
            resp.send({
                success: true,
                message: data
            });
        } else {
            resp.send({
                success: false,
                message: "Complain not found"
            });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};
exports.getComplainByUserId = async (req, resp) => {
    try {
        const userId = req.params.userId;
        console.log('Received user ID:', userId);

        const data = await Complain.find({ generated_by: userId }).populate('generated_by')
            .populate({
                path: 'product.ItemStore_ID',
                populate: [
                    { path: 'category_ID', model: 'category' },
                    { path: 'company_ID', model: 'company' }
                ]
            });
        if (data.length != 0) {
            resp.send({
                success: true,
                data: data
            });
        } else {
            resp.send({
                success: false,
                message: "Complain not found"
            });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};
exports.getComplainByStatus = async (req, resp) => {
    try {
        const data = await Complain.find({ status: "pending" })
        if (data.length != 0) {
            resp.send({
                success: true,
                data: data.length
            });
        } else {
            resp.send({
                success: false,
                message: "Complain not found"
            });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};
exports.getComplainByComplainId = async (req, resp) => {
    try {
        const Id = req.params.id;

        const data = await Complain.find({ _id: Id })
            .populate('generated_by')
            .populate({
                path: 'product.ItemStore_ID',
                populate: [
                    { path: 'category_ID', model: 'category' },
                    { path: 'company_ID', model: 'company' }
                ]
            });

        if (data.length !== 0) {
            resp.send({
                success: true,
                data: data
            });
        } else {
            resp.send({
                success: false,
                message: "Complain not found"
            });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};


exports.postComplain = async (req, resp) => {
    try {
        const data = new Complain(req.body);
        const res = await data.save();
        resp.send("Inserted Successfully");
    } catch (err) {
        console.log(err.message);
    }
};
//below this route is created by me
exports.update = async (req, resp) => {
    try {

        const update = await Complain.findOneAndUpdate({ _id: req.params._id }, { $set: req.body });
        if (!update) {
            return resp.status(404).send({
                success: false,
                message: 'No document found with the given ID'
            });
        }

        resp.send({
            success: true,
            message: 'Document updated successfully',
            data: update
        });
    } catch (error) {
        console.log(error);
        resp.status(500).send({
            success: false,
            message: 'An error occurred during the update',
            error: error.message
        });
    }
};

exports.updateComplain = async (req, resp) => {
    try {

        const update = await Complain.findOneAndUpdate({ _id: req.params._id }, { $set: {status:req.body.status} });
        if (update.matchedCount === 0) {
            resp.send({
                success: false,
                message: update.matchedCount
            });
        } else {
            resp.send({
                success: true,
                message: update.matchedCount
            });
        }
    } catch (error) {
        console.log(error);
    }
};