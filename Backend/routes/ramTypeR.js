const express=require("express");
const router=express.Router();

const ramTypeC=require("../controller/ramTypeC");

router.get("/",ramTypeC.ramTypeTableget);
router.post("/",ramTypeC.ramTypepost);
router.delete("/:ramType_name",ramTypeC.ramTypedelete);
router.put("/:ramType_name",ramTypeC.ramTypeupdate);

module.exports=router;