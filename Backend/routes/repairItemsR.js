const express=require("express");
const router=express.Router();

const repairItemsC=require("../controller/repairItemsC");

router.get("/",repairItemsC.repairItemsTableget);
router.post("/",repairItemsC.repairItemspost);
router.delete("/:repairItems_ID",repairItemsC.repairItemsdelete);

module.exports=router;