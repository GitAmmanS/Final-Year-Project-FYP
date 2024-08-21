const items = require("../models/items");

exports.itemsget = async (req, resp) => {
    try {
        const data = await items.find()
            .populate({
                path: 'category_ID'
            })
            .populate({
                path: 'company_ID'
            })
            .populate({
                path: 'spex_ID',
                populate: [
                    { path: 'OS_ID' },
                    { path: 'softwares_ID' },
                    {
                        path: 'rom_ID',
                        populate: { path: 'romType_ID' }
                    },
                    {
                        path: 'ram_ID',
                        populate: { path: 'ramType_ID' }
                    },
                    {
                        path: 'graphicCard_ID',
                        populate: { path: 'GCType_ID' }
                    },
                    { path: 'generation_ID' },
                    { path: 'cableType_ID' }
                ]
            })
            .populate({
                path: 'status_ID'
            })
            .populate({
                path: 'users_ID'
            })
            .populate({
                path: 'location_ID'
            });

        if (data && data.length > 0) {
            resp.status(200).send({
                success: true,
                message: data
            });
        } else {
            resp.status(404).send({
                success: false,
                message: "Items not found"
            });
        }
    } catch (error) {
        console.error("Error fetching items:", error);
        resp.status(500).send({
            success: false,
            message: "Server error"
        });
    }
};

exports.itemsupdate = async (req, resp) => {
    try {
        const path = req.file ? `item_pic/${req.file.filename}` : null;

        const data = await items.updateOne(
            { _id: req.params.items_id },
            { $set: { picture: path, ...req.body } }
        );

        if (data.matchedCount === 0) {
            resp.status(404).send({
                success: false,
                message: "Item not found"
            });
        } else {
            resp.send({
                success: true,
                message: "Item updated successfully"
            });
        }
    } catch (error) {
        console.error('Error updating item:', error);
        resp.status(500).send("Internal Server Error");
    }
};

exports.itemsdelete = async (req, resp) => {

    const data = await items.deleteOne({ _id: req.params.items_id }); //i->ignore all cases{
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


exports.itemspost = async (req, resp) => {
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