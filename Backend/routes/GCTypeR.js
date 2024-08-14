const express=require("express");
const router=express.Router();

const GCTypeC=require("../controller/GCTypeC");

router.get("/",GCTypeC.GCTypeTableget);
router.post("/",GCTypeC.GCTypepost);
router.delete("/:GCType_name",GCTypeC.GCTypedelete);
router.put("/:GCType_name",GCTypeC.GCTypeupdate);

module.exports=router;