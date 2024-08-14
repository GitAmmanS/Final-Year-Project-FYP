const ramType= require("../models/ramType");

exports.ramTypeupdate=async (req, resp) => {

    const data = await ramType.updateOne({ name: req.params.ramType_name },{$set:req.body}); //i->ignore all cases{
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
exports.ramTypedelete=async (req, resp) => {

    const data = await ramType.deleteOne({ name: req.params.ramType_name }); //i->ignore all cases{
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
exports.ramTypeTableget=async (req, resp) => {
    try {
        const data = await ramType.find();
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

exports.ramTypepost=async (req, resp) => {
    const data = new ramType(req.body);
    const res = await data.save();
    resp.send("Inserted Successfully");
};