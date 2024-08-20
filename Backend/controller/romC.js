const rom= require("../models/rom");

exports.romupdate=async (req, resp) => {

    const data = await rom.updateOne({ _id: req.params.rom_ID },{$set:req.body}); //i->ignore all cases{
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
exports.romdelete=async (req, resp) => {

    const data = await rom.deleteOne({ _id: req.params.rom_ID }); //i->ignore all cases{
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
exports.romTableget=async (req, resp) => {
    try {
        const data = await rom.find().populate('romType_ID');
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

exports.rompost=async (req, resp) => {
    const data = new rom(req.body);
    const res = await data.save();
    resp.send("Inserted Successfully");
};