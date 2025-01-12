const express = require("express");
const router = express.Router();
const categoryC = require("../controller/categoryC");

router.get("/", categoryC.getCategories);

router.post("/post", categoryC.createCategory);

router.delete("/:category_name", categoryC.deleteCategory);

router.put("/:category_name", categoryC.updateCategory);

router.get("/:category_name", categoryC.getSingleCategory);

router.get("/single/:category_name", categoryC.getSingleCategory);

module.exports = router;
