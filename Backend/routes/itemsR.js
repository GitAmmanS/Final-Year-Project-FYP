const express=require('express')
const router=express.Router();

const itemsC=require("../controller/itemsC");
const itempic=require("../middleware/itempic");

router.get("/",itemsC.getItems);
router.get("/item/:_id",itemsC.getItemById);
router.post("/post",itempic.single("picture"),itemsC.itemsPost);
router.post("/postBulk",itempic.single("picture"),itemsC.itemsPostBulk);
router.delete("/:items_id",itemsC.itemsDelete);
router.put("/:items_id",itempic.single("picture"),itemsC.itemsUpdate);

module.exports=router;