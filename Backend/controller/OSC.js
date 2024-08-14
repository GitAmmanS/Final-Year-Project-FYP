const OS= require("../models/OS");

exports.OSupdate=async (req, resp) => {

    const data = await OS.updateOne({ name: req.params.OS_name },{$set:req.body}); //i->ignore all cases{
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
exports.OSdelete=async (req, resp) => {

    const data = await OS.deleteOne({ name: req.params.OS_name }); //i->ignore all cases{
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
exports.OSTableget=async (req, resp) => {
    try {
        const data = await OS.find();
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

exports.OSpost=async (req, resp) => {
    const data = new OS(req.body);
    const res = await data.save();
    resp.send("Inserted Successfully");
};