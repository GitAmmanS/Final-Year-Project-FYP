const softwares= require("../models/softwares");

exports.softwaresupdate=async (req, resp) => {

    const data = await softwares.updateOne({ name: req.params.softwares_name },{$set:req.body}); //i->ignore all cases{
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
exports.softwaresdelete=async (req, resp) => {

    const data = await softwares.deleteOne({ name: req.params.softwares_name }); //i->ignore all cases{
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
exports.softwaresTableget=async (req, resp) => {
    try {
        const data = await softwares.find();
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

exports.softwarespost=async (req, resp) => {
    const data = new softwares(req.body);
    const res = await data.save();
    resp.send("Inserted Successfully");
};