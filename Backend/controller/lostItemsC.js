const lostItems= require("../models/lostItems");

exports.lostItemsupdate=async (req, resp) => {

    const data = await lostItems.updateOne({ _id: req.params.lostItems_ID },{$set:req.body}); //i->ignore all cases{
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
exports.lostItemsdelete=async (req, resp) => {

    const data = await lostItems.deleteOne({ _id: req.params.lostItems_ID }); //i->ignore all cases{
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
exports.lostItemsTableget=async (req, resp) => {
    try {
        const data = await lostItems.find();
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

exports.lostItemspost=async (req, resp) => {
    const data = new lostItems(req.body);
    const res = await data.save();
    resp.send("Inserted Successfully");
};