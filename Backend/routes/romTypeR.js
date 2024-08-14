const express=require("express");
const router=express.Router();

const romTypeC=require("../controller/romTypeC");

router.get("/",romTypeC.romTypeTableget);
router.post("/",romTypeC.romTypepost);
router.delete("/:romType_name",romTypeC.romTypedelete);
router.put("/:romType_name",romTypeC.romTypeupdate);

module.exports=router;