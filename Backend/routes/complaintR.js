const express=require("express");
const router=express.Router();

const complainC=require("../controller/complaintC");

router.get("/",complainC.getComplain);
router.post("/post",complainC.postComplain);

module.exports=router;