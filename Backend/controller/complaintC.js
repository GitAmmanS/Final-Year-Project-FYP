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