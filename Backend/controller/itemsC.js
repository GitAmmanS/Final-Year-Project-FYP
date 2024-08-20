const items= require("../models/items");

exports.itemsget=async (req, resp) => {

    const data = await items.find().populate('category_ID').populate('company_ID').populate('spex_ID')
    .populate('status_ID').populate('users_ID').populate('location_ID'); 
    if (data.length !== 0) {
        resp.send({
                success: true,
                message: data
        });
        
    } else {
        resp.send("items not found");
    }
};
exports.itemsupdate=async (req, resp) => {

    try {
        const path = req.file ? `item_pic/${req.file.filename}` : null;

        const data = await items.updateOne({ _id: req.params.items_id },{$set:{
            ...req.body
        }});
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
    } catch (error) {
        console.error('Error fetching author data:', error);
        resp.status(500).send("Internal Server Error");
    }
};
exports.itemsdelete=async (req, resp) => {

    const data = await items.deleteOne({  _id: req.params.items_id }); //i->ignore all cases{
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


exports.itemspost=async (req, resp) => {
    try {
        const path = req.file ? `item_pic/${req.file.filename}` : null;
        if (!path) {
            return resp.status(400).send("Picture is required");
        }

        const data = new items({ picture: path, ...req.body });
        
        await data.save();
        resp.send("Inserted Successfully");
    } catch (error) {
        console.error('Error adding author:', error);
        resp.status(500).send("Internal Server Error: " + error.message);
    }
};