const rank= require("../models/rank");

exports.rankupdate=async (req, resp) => {

    const data = await rank.updateOne({ name: req.params.rank_name },{$set:req.body}); //i->ignore all cases{
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
exports.rankdelete=async (req, resp) => {

    const data = await rank.deleteOne({ name: req.params.rank_name }); //i->ignore all cases{
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
exports.rankTableget=async (req, resp) => {
    try {
        const data = await rank.find();
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

exports.rankpost=async (req, resp) => {
    const data = new rank(req.body);
    const res = await data.save();
    resp.send("Inserted Successfully");
};