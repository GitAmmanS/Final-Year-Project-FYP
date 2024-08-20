const spex= require("../models/spex");

exports.spexget=async (req, resp) => {

    const data = await spex.find({ name: req.params.spex_id}).populate("OS_ID")
    .populate('softwares_ID')
    .populate('rom_ID')
    .populate('ram_ID')
    .populate('graphicCard_ID')
    .populate('generation_ID')
    .populate('cableType_ID'); 
    if (data.length !== 0) {
        resp.send({
                success: true,
                message: data
        });
        
    } else {
        resp.send("spex not found");
    }
};
exports.spexupdate=async (req, resp) => {

    const data = await spex.updateOne({ name: req.params.spex_id },{$set:req.body}); //i->ignore all cases{
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
exports.spexdelete=async (req, resp) => {

    const data = await spex.deleteOne({ name: req.params.spex_id }); //i->ignore all cases{
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


exports.spexpost=async (req, resp) => {
    const data = new spex(req.body);
    const res = await data.save();
    resp.send("Inserted Successfully");
    
};