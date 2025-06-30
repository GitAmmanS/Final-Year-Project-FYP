const Complain = require('../models/complaint');
const User = require('../models/users');
const moment = require('moment');


exports.getComplain = async (req, resp) => {
    try {
        const data = await Complain.find().populate('generated_by').populate('assigned_to')
            .populate({
                path: 'product.ItemStore_ID',
                model: 'products',
                populate: [
                    { path: 'category_ID', model: 'category' },
                    { path: 'company_ID', model: 'company' }
                ]
            })
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

        const data = await Complain.find({ generated_by: userId }).populate('generated_by').populate('assigned_to')
            .populate({
                path: 'product.ItemStore_ID',
                model: 'products',
                populate: [
                    { path: 'category_ID', model: 'category' },
                    { path: 'company_ID', model: 'company' }
                ]
            })
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
        const complainNumber = req.params.complainNumber;

        const data = await Complain.find({ number: complainNumber })
            .populate('generated_by')
            .populate('assigned_to');


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
        const { description, userName, quantities, Location } = req.body;

        const maxComplain = await Complain.findOne().sort({ number: -1 }).select('number');
        const maxNumber = maxComplain ? maxComplain.number : 999;
        const generatedNumber = maxNumber + 1;

        const findUser = await User.findOne({ name: userName });
        const ids = Object.keys(quantities);

        const currentDay = moment().format('L');
        let activeUsers = await User.find({
            role: 'technician',
            is_active: currentDay
        }).exec();

        if (activeUsers.length === 0) {
            activeUsers = await User.find({
                role: 'lab_Incharge',
                is_active: currentDay
            }).exec();
        }

        if (activeUsers.length === 0) {
            throw new Error('No active users available for assignment');
        }

        const randomIndex = Math.floor(Math.random() * activeUsers.length);
        const assignedTo = activeUsers[randomIndex]._id;

        const timePeriod = moment().format('LL');;

        const complaintData = {
            ...req.body,
            generated_by: findUser._id,
            assigned_to: assignedTo,
            number: generatedNumber,
            time_period: timePeriod,
            location: Location,
            product: ids.map((productId, index) => ({
                ItemStore_ID: productId,
            })),
            description: description,
            status: "pending"
        };

        const data = new Complain(complaintData);
        const res = await data.save();
        resp.status(201).send("Inserted Successfully");

    } catch (err) {
        console.error(err.message);
        resp.status(500).json({
            error: err.message || "Error creating complaint"
        });
    }
};

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
        const update = await Complain.findOneAndUpdate(
            { 
                number: req.params._id, 
                'product.ItemStore_ID': req.body.EditId 
            },
            { 
                $set: { 
                    'product.$.status_Product': req.body.status
                } 
            },
            { new: true }
        );

        if (!update) {
            return resp.status(404).send({
                success: false,
                message: "Complaint not found"
            });
        }
        const statuses = update.product.map(p => p.status_Product || 'pending');
        let ComplainStatus = 'pending';
        
        if (statuses.every(status => status === 'resolved')) {
            ComplainStatus = 'resolved';
        } else if (statuses.some(status => status === 'in-progress' || status === 'resolved')) {
            ComplainStatus = 'in-progress';
        }
        await Complain.findOneAndUpdate(
            { number: req.params._id },
            { $set: { status: ComplainStatus } }
        );

        resp.send({
            success: true,
            message: "Status updated successfully",
            data: {
                productStatus: req.body.status,
                complainStatus: ComplainStatus
            }
        });

    } catch (error) {
        console.log("ERROR---------->", error);
        resp.status(500).send({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};