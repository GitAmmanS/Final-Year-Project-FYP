const express=require("express");
const router=express.Router();

const OSC=require("../controller/OSC");

router.get("/",OSC.OSTableget);
router.post("/",OSC.OSpost);
router.delete("/:OS_name",OSC.OSdelete);
router.put("/:OS_name",OSC.OSupdate);

module.exports=router;