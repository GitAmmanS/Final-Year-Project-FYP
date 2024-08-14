const express=require("express");
const router=express.Router();

const cableTypeC=require("../controller/cableTypeC");

router.get("/",cableTypeC.cableTypeTableget);
router.post("/",cableTypeC.cableTypepost);
router.delete("/:cableType_name",cableTypeC.cableTypedelete);
router.put("/:cableType_name",cableTypeC.cableTypeupdate);

module.exports=router;