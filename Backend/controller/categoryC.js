const categories= require("../models/category");
const items= require("../models/items");

exports.categoriesget=async (req, resp) => {

    const data = await categories.find({ name: {$regex:new RegExp(req.params.category_name,"i")} }); //i->ignore all cases
    if (data.length !== 0) {
        const c_id = data[0]._id;
        const bdata = await items.find({ category_ID: c_id }).populate("category_ID");
        if (bdata.length !== 0) {
            resp.send({
                success: true,
                message: bdata
        });
        } else {
            resp.send({
                success:false,
                message:"No items found for this category"
            });
        }
    } else {
        resp.send("Category not found");
    }
};
exports.categoriesSingleget=async (req, resp) => {

    const data = await categories.find({ name:req.params.category_name}); //i->ignore all cases
    if (data.length !== 0) {
            resp.send({
                success: true,
                message: data
        });
    } else {
            resp.send({
                success:false,
                message:"No Category found for this category"
            });
        }
   
};
exports.categoriesupdate=async (req, resp) => {

    const data = await categories.updateOne({ name: req.params.category_name },{$set:req.body}); //i->ignore all cases{
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
exports.categoriesdelete=async (req, resp) => {

    const data = await categories.deleteOne({ name: req.params.category_name }); //i->ignore all cases{
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
exports.categoriesTableget=async (req, resp) => {
    try {
        const data = await categories.find();
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

exports.categoriespost=async (req, resp) => {
    const data = new categories(req.body);
    const res = await data.save();
    resp.send("Inserted Successfully");
};