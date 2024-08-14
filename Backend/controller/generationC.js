const generation= require("../models/generation");

exports.generationupdate=async (req, resp) => {

    const data = await generation.updateOne({ name: req.params.generation_name },{$set:req.body}); //i->ignore all cases{
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
exports.generationdelete=async (req, resp) => {

    const data = await generation.deleteOne({ name: req.params.generation_name }); //i->ignore all cases{
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
exports.generationTableget=async (req, resp) => {
    try {
        const data = await generation.find();
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

exports.generationpost=async (req, resp) => {
    const data = new generation(req.body);
    const res = await data.save();
    resp.send("Inserted Successfully");
};