const role= require("../models/role");

exports.roleupdate=async (req, resp) => {

    const data = await role.updateOne({ name: req.params.role_name },{$set:req.body}); //i->ignore all cases{
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
exports.roledelete=async (req, resp) => {

    const data = await role.deleteOne({ name: req.params.role_name }); //i->ignore all cases{
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
exports.roleTableget=async (req, resp) => {
    try {
        const data = await role.find().populate('permissions.Permission_ID');
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

exports.rolepost=async (req, resp) => {
    const data = new role(req.body);
    const res = await data.save();
    resp.send("Inserted Successfully");
};