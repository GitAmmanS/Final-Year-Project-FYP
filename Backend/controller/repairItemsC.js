const repairItems= require("../models/repairItems");

exports.repairItemsupdate=async (req, resp) => {

    const data = await repairItems.updateOne({ _id: req.params.repairItems_ID },{$set:req.body}); //i->ignore all cases{
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
exports.repairItemsdelete=async (req, resp) => {

    const data = await repairItems.deleteOne({ _id: req.params.repairItems_ID }); //i->ignore all cases{
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
exports.repairItemsTableget=async (req, resp) => {
    try {
        const data = await repairItems.find();
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

exports.repairItemspost=async (req, resp) => {
    const data = new repairItems(req.body);
    const res = await data.save();
    resp.send("Inserted Successfully");
};