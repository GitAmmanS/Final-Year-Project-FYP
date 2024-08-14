const GCType= require("../models/GCType");

exports.GCTypeupdate=async (req, resp) => {

    const data = await GCType.updateOne({ name: req.params.GCType_name },{$set:req.body}); //i->ignore all cases{
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
exports.GCTypedelete=async (req, resp) => {

    const data = await GCType.deleteOne({ name: req.params.GCType_name }); //i->ignore all cases{
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
exports.GCTypeTableget=async (req, resp) => {
    try {
        const data = await GCType.find();
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

exports.GCTypepost=async (req, resp) => {
    const data = new GCType(req.body);
    const res = await data.save();
    resp.send("Inserted Successfully");
};