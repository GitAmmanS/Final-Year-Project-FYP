const companies = require("../models/company");

exports.getCompanies = async (req, resp) => {
    try {
        const data = await companies.find();
        if (data.length > 0) {
            resp.status(200).send({ success: true, data: data });
        } else {
            resp.status(404).send({ success: false, message: "No companies found" });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};

exports.getCompanyItems = async (req, resp) => {
    try {
        const data = await companies.findOne({ name: { $regex: new RegExp(req.params.company_name, "i") } });
        if (data) {
            const companyId = data._id;
            const itemsData = await items.find({ company_ID: companyId }).populate("company_ID");
            if (itemsData.length > 0) {
                resp.status(200).send({ success: true, message: itemsData });
            } else {
                resp.status(404).send({ success: false, message: "No items found for this company" });
            }
        } else {
            resp.status(404).send({ success: false, message: "Company not found" });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};
exports.getSingleCompany = async (req, resp) => {
    try {
        const data = await companies.findOne({ name: req.params.company_name });
        if (data) {
            resp.status(200).send({ success: true, data: data });
        } else {
            resp.status(404).send({ success: false, message: "Company not found" });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};

exports.createCompany = async (req, resp) => {
    try {
        const newCompany = new companies(req.body);
        await newCompany.save();
        resp.status(201).send("Company added successfully");
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};

exports.updateCompany = async (req, resp) => {
    try {
        const data = await companies.updateOne({ name: req.params.company_name }, { $set: req.body });
        if (data.matchedCount === 0) {
            resp.status(404).send({ success: false, message: "Company not found" });
        } else {
            resp.status(200).send({ success: true, message: "Company updated successfully" });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};

exports.deleteCompany = async (req, resp) => {
    try {
        const data = await companies.deleteOne({ name: req.params.company_name });
        if (data.deletedCount === 0) {
            resp.status(404).send({ success: false, message: "Company not found" });
        } else {
            resp.status(200).send({ success: true, message: "Company deleted successfully" });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};
