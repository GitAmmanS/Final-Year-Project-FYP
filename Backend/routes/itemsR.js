const express=require("express");
const router=express.Router();

const itemsC=require("../controller/itemsC");
const itempic=require("../middleware/itempic");

router.get("/:items_number",itemsC.itemsget);
router.post("/",itempic.single("picture"),itemsC.itemspost);
router.delete("/:items_number",itemsC.itemsdelete);
router.put("/:items_id",itempic.single("picture"),itemsC.itemsupdate);

module.exports=router;