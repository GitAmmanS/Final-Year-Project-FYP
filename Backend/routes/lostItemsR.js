const express=require("express");
const router=express.Router();

const lostItemsC=require("../controller/lostItemsC");

router.get("/",lostItemsC.lostItemsTableget);
router.post("/",lostItemsC.lostItemspost);
router.delete("/:lostItems_ID",lostItemsC.lostItemsdelete);

module.exports=router;