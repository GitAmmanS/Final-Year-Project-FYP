const companies= require("../models/company");
const items= require("../models/items");

exports.companiesget=async (req, resp) => {

    const data = await companies.find({ name: {$regex:new RegExp(req.params.company_name,"i")} }); //i->ignore all cases
    if (data.length !== 0) {
        const c_id = data[0]._id;
        const bdata = await items.find({ company_ID: c_id }).populate("company_ID");
        if (bdata.length !== 0) {
            resp.send({
                success: true,
                message: bdata
        });
        } else {
            resp.send({
                success:false,
                message:"No items found for this company"
            });
        }
    } else {
        resp.send("company not found");
    }
};
exports.companiesSingleget=async (req, resp) => {

    const data = await companies.find({ name:req.params.company_name}); //i->ignore all cases
    if (data.length !== 0) {
            resp.send({
                success: true,
                message: data
        });
    } else {
            resp.send({
                success:false,
                message:"No company found for this company"
            });
        }
   
};
exports.companiesupdate=async (req, resp) => {

    const data = await companies.updateOne({ name: req.params.company_name },{$set:req.body}); //i->ignore all cases{
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
exports.companiesdelete=async (req, resp) => {

    const data = await companies.deleteOne({ name: req.params.company_name }); //i->ignore all cases{
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
exports.companiesTableget=async (req, resp) => {
    try {
        const data = await companies.find();
        if (data.length != 0) {
            resp.send({
                success: true,
                message: data
            });
        } else {
            resp.send({
                success: false,
                message: "No menuitem found for this company"
            });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};

exports.companiespost=async (req, resp) => {
    const data = new companies(req.body);
    const res = await data.save();
    resp.send("Inserted Successfully");
};