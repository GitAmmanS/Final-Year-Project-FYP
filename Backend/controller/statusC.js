const Status = require("../models/status");

exports.statusTableGet = async (req, resp) => {
    try {
        const data = await Status.find();
        resp.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};

exports.statusGet = async (req, resp) => {
    try {
        const data = await Status.findOne({ name: req.params.status_name }); 
        if (data) {
            resp.status(200).send({
                success: true,
                message: data
            });
        } else {
            resp.status(404).send({
                success: false,
                message: "Status not found"
            });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};

exports.statusPost = async (req, resp) => {
    try {
        const newStatus = new Status(req.body);
        await newStatus.save();
        resp.status(201).send({ success: true, message: "Inserted Successfully" });
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};

exports.statusUpdate = async (req, resp) => {
    try {
        const data = await Status.updateOne({ name: req.params.status_name }, { $set: req.body }); 
        if (data.matchedCount === 0) {
            resp.status(404).send({
                success: false,
                message: "No status found to update"
            });
        } else {
            resp.status(200).send({
                success: true,
                message: "Status updated successfully"
            });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};

exports.statusDelete = async (req, resp) => {
    try {
        const data = await Status.deleteOne({ name: req.params.status_name }); 
        if (data.deletedCount === 0) {
            resp.status(404).send({
                success: false,
                message: "No status found to delete"
            });
        } else {
            resp.status(200).send({
                success: true,
                message: "Status deleted successfully"
            });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};
