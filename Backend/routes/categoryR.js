const express=require("express");
const router=express.Router();

const categoryC=require("../controller/categoryC");

router.get("/",categoryC.categoriesTableget);
router.post("/",categoryC.categoriespost);
router.delete("/:category_name",categoryC.categoriesdelete);
router.put("/:category_name",categoryC.categoriesupdate);
router.get("/:category_name",categoryC.categoriesget);
router.get("/single/:category_name",categoryC.categoriesSingleget);

module.exports=router;