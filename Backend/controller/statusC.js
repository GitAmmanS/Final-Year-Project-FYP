const status= require("../models/status");
const items= require("../models/items");

exports.statusget=async (req, resp) => {

    const data = await status.find({ name: {$regex:new RegExp(req.params.status_name,"i")} }); //i->ignore all cases
    if (data.length !== 0) {
        const c_id = data[0]._id;
        const bdata = await items.find({ status_ID: c_id }).populate("status_ID");
        if (bdata.length !== 0) {
            resp.send({
                success: true,
                message: bdata
        });
        } else {
            resp.send({
                success:false,
                message:"No items found for this status"
            });
        }
    } else {
        resp.send("status not found");
    }
};
exports.statusSingleget=async (req, resp) => {

    const data = await status.find({ name:req.params.status_name}); //i->ignore all cases
    if (data.length !== 0) {
            resp.send({
                success: true,
                message: data
        });
    } else {
            resp.send({
                success:false,
                message:"No status found for this status"
            });
        }
   
};
exports.statusupdate=async (req, resp) => {

    const data = await status.updateOne({ name: req.params.status_name },{$set:req.body}); //i->ignore all cases{
        if (data.matchedCount === 0) {
            resp.send({
                success: false,
                message: data.matchedCount
            });
        } else {
            resp.send({
                success: true,
                message: data.matchedCount
            });
        }
};
exports.statusdelete=async (req, resp) => {

    const data = await status.deleteOne({ name: req.params.status_name }); //i->ignore all cases{
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
exports.statusTableget=async (req, resp) => {
    try {
        const data = await status.find();
        if (data.length != 0) {
            resp.send({
                success: true,
                message: data
            });
        } else {
            resp.send({
                success: false,
                message: "No menuitem found for this status"
            });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};

exports.statuspost=async (req, resp) => {
    const data = new status(req.body);
    const res = await data.save();
    resp.send("Inserted Successfully");
};