const Complain = require('../models/complaint')

exports.getComplain=async (req, resp) => {
    try {
        const data = await Complain.find();
        if (data.length != 0) {
            resp.send({
                success: true,
                message: data
            });
        } else {
            resp.send({
                success: false,
                message: "Complain not found"
            });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};
exports.getComplainByUserId=async (req, resp) => {
    try {
        const _id = req.params;
        const data = await Complain.findOne({_id:_id});
        if (data.length != 0) {
            resp.send({
                success: true,
                message: data
            });
        } else {
            resp.send({
                success: false,
                message: "Complain not found"
            });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};

exports.postComplain=async (req, resp) => {
    try{
    const data = new Complain(req.body);
    const res = await data.save();
    resp.send("Inserted Successfully");
    }catch(err)
    {
        console.log(err.message);
    }
};
exports.updateComplain=async (req, resp) => {
    try{
    
    const update = await findOneAndUpdate({_id:req.params._id},{$set:req.body});
    if (update.matchedCount === 0) {
        resp.send({
            success: false,
            message: update.matchedCount
        });
    } else {
        resp.send({
            success: true,
            message: data.matchedCount
        });
    }
}catch(error){
    console.log(error);
}
};