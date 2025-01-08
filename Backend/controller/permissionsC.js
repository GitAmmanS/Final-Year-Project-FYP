const Permissions = require('../models/permissions')

exports.getPermissions=async (req, resp) => {
    try {
        const data = await Permissions.find();
        if (data.length != 0) {
            resp.send({
                success: true,
                message: data
            });
        } else {
            resp.send({
                success: false,
                message: "Permission not found"
            });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};

exports.postPermissions=async (req, resp) => {
    try{
    const data = new Permissions(req.body);
    const res = await data.save();
    resp.send("Inserted Successfully");
    }catch(err)
    {
        console.log(err.message);
    }
};