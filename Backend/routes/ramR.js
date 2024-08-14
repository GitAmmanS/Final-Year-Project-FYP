const express=require("express");
const router=express.Router();

const ramC=require("../controller/ramC");

router.get("/",ramC.ramTableget);
router.post("/",ramC.rampost);
router.delete("/:ram_ID",ramC.ramdelete);
router.put("/:ram_ID",ramC.ramupdate);

module.exports=router;