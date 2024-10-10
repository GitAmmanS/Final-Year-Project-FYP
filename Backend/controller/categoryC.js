const categories = require("../models/category");

exports.getCategories = async (req, resp) => {
    try {
        const data = await categories.find();
        if (data.length > 0) {
            resp.status(200).json({ success: true, data: data });
        } else {
            resp.status(404).json({ success: false, message: "No categories found" });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};

exports.getSingleCategory = async (req, resp) => {
    try {
        const data = await categories.findOne({ name: req.params.category_name });
        if (data) {
            resp.status(200).send({ success: true, data: data });
        } else {
            resp.status(404).send({ success: false, message: "Category not found" });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};

exports.createCategory = async (req, resp) => {
    try {
        const newCategory = new categories(req.body);
        await newCategory.save();
        resp.status(201).send("Category added successfully");
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};

exports.updateCategory = async (req, resp) => {
    try {
        const data = await categories.updateOne({ name: req.params.category_name }, { $set: req.body });
        if (data.matchedCount === 0) {
            resp.status(404).send({ success: false, message: "Category not found" });
        } else {
            resp.status(200).send({ success: true, message: "Category updated successfully" });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};

exports.deleteCategory = async (req, resp) => {
    try {
        const data = await categories.deleteOne({ name: req.params.category_name });
        if (data.deletedCount === 0) {
            resp.status(404).send({ success: false, message: "Category not found" });
        } else {
            resp.status(200).send({ success: true, message: "Category deleted successfully" });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};
