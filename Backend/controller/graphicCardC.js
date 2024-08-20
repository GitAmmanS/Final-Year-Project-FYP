const graphicCard= require("../models/graphicCard");

exports.graphicCardupdate=async (req, resp) => {

    const data = await graphicCard.updateOne({ _id: req.params.graphicCard_ID },{$set:req.body}); //i->ignore all cases{
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
exports.graphicCarddelete=async (req, resp) => {

    const data = await graphicCard.deleteOne({ _id: req.params.graphicCard_ID }); //i->ignore all cases{
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
exports.graphicCardTableget=async (req, resp) => {
    try {
        const data = await graphicCard.find().populate("GCType_ID");
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

exports.graphicCardpost=async (req, resp) => {
    const data = new graphicCard(req.body);
    const res = await data.save();
    resp.send("Inserted Successfully");
};