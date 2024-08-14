const cableType= require("../models/cableType");

exports.cableTypeupdate=async (req, resp) => {

    const data = await cableType.updateOne({ name: req.params.cableType_name },{$set:req.body}); //i->ignore all cases{
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
exports.cableTypedelete=async (req, resp) => {

    const data = await cableType.deleteOne({ name: req.params.cableType_name }); //i->ignore all cases{
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
exports.cableTypeTableget=async (req, resp) => {
    try {
        const data = await cableType.find();
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

exports.cableTypepost=async (req, resp) => {
    const data = new cableType(req.body);
    const res = await data.save();
    resp.send("Inserted Successfully");
};