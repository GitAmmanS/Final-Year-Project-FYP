const users=require("../models/users");

exports.userspost=async (req, resp) => {
    const data = new users(req.body);
    const res = await data.save();
    resp.send("Inserted Successfully");
}

exports.usersupdate=async (req, resp) => {

    const data = await users.updateOne({ name: req.params.users_name },{$set:req.body}); //i->ignore all cases{
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

exports.usersdelete=async (req, resp) => {
    try {
        const data = await users.deleteMany({email:req.params.email});
        console.log("data",data.deletedCount);
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
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
}
exports.usersTableget=async (req, resp) => {
    try {
        const data = await users.find({});
        console.log(data);
        if (data.length != 0) {
            resp.send({
                success: true,
                message: data
            });
        } else {
            resp.send({
                success: false,
                message: "No User Found"
            });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};
exports.usersUserget=async (req, resp) => {
    try {
        const data = await users.find({role:"user"});
        console.log(data);
        if (data.length != 0) {
            resp.send({
                success: true,
                message: data
            });
        } else {
            resp.send({
                success: false,
                message: "No User Found"
            });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};
exports.usersSingleget=async (req, resp) => {
    try {
        const data = await users.find({name: req.params.name1});
        console.log(data);
        if (data.length != 0) {
            resp.send({
                success: true,
                message: data
            });
        } else {
            resp.send({
                success: false,
                message: "No User Found"
            });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};