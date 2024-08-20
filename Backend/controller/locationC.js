const location= require("../models/location");

exports.locationupdate=async (req, resp) => {

    const data = await location.updateOne({ name: req.params.location_name },{$set:req.body}); //i->ignore all cases{
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
exports.locationdelete=async (req, resp) => {

    const data = await location.deleteOne({ name: req.params.location_name }); //i->ignore all cases{
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
exports.locationTableget=async (req, resp) => {
    try {
        const data = await location.find().populate('floor_ID');
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

exports.locationpost=async (req, resp) => {
    const data = new location(req.body);
    const res = await data.save();
    resp.send("Inserted Successfully");
};