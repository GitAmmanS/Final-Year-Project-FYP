const romType= require("../models/romType");

exports.romTypeupdate=async (req, resp) => {

    const data = await romType.updateOne({ name: req.params.romType_name },{$set:req.body}); //i->ignore all cases{
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
exports.romTypedelete=async (req, resp) => {

    const data = await romType.deleteOne({ name: req.params.romType_name }); //i->ignore all cases{
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
exports.romTypeTableget=async (req, resp) => {
    try {
        const data = await romType.find();
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

exports.romTypepost=async (req, resp) => {
    const data = new romType(req.body);
    const res = await data.save();
    resp.send("Inserted Successfully");
};