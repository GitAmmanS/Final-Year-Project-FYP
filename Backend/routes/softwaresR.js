const express=require("express");
const router=express.Router();

const softwaresC=require("../controller/softwaresC");

router.get("/",softwaresC.softwaresTableget);
router.post("/",softwaresC.softwarespost);
router.delete("/:softwares_name",softwaresC.softwaresdelete);
router.put("/:softwares_name",softwaresC.softwaresupdate);

module.exports=router;