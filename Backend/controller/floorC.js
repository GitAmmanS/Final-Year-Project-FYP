const floor= require("../models/floor");

exports.floorupdate=async (req, resp) => {

    const data = await floor.updateOne({ name: req.params.floor_name },{$set:req.body}); //i->ignore all cases{
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
exports.floordelete=async (req, resp) => {

    const data = await floor.deleteOne({ name: req.params.floor_name }); //i->ignore all cases{
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
exports.floorTableget=async (req, resp) => {
    try {
        const data = await floor.find();
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

exports.floorpost=async (req, resp) => {
    const data = new floor(req.body);
    const res = await data.save();
    resp.send("Inserted Successfully");
};