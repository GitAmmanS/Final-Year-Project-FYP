const express=require("express");
const router=express.Router();

const romC=require("../controller/romC");

router.get("/",romC.romTableget);
router.post("/",romC.rompost);
router.delete("/:rom_ID",romC.romdelete);
router.put("/:rom_ID",romC.romupdate);

module.exports=router;