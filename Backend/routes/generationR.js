const express=require("express");
const router=express.Router();

const generationC=require("../controller/generationC");

router.get("/",generationC.generationTableget);
router.post("/",generationC.generationpost);
router.delete("/:generation_name",generationC.generationdelete);
router.put("/:generation_name",generationC.generationupdate);

module.exports=router;