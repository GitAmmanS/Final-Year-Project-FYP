const ram= require("../models/ram");

exports.ramupdate=async (req, resp) => {

    const data = await ram.updateOne({ _id: req.params.ram_ID },{$set:req.body}); //i->ignore all cases{
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
exports.ramdelete=async (req, resp) => {

    const data = await ram.deleteOne({ _id: req.params.ram_ID }); //i->ignore all cases{
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
exports.ramTableget=async (req, resp) => {
    try {
        const data = await ram.find().populate('ramType_ID');
        if (data.length != 0) {
            resp.send({
                success: true,
                message: data
            });
        } else {
            resp.send({
                success: false,
                message: "No menuitem found for this Category"
            });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};

exports.rampost=async (req, resp) => {
    const data = new ram(req.body);
    const res = await data.save();
    resp.send("Inserted Successfully");
};