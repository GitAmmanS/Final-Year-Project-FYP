const express=require("express");
const router=express.Router();

const autohrizedRoles = require('../middleware/roleBaseAuthorization');
const complainC=require("../controller/complaintC");
const verifyToken = require("../middleware/authorization"); 

router.get("/",verifyToken,autohrizedRoles("admin","lab_Incharge"),complainC.getComplain);
router.post("/post",verifyToken,autohrizedRoles("teacher"),complainC.postComplain);
router.get("/post/:_id",verifyToken,autohrizedRoles("teacher"),complainC.getComplainByUserId);
router.put("/put/:_id",verifyToken,autohrizedRoles("lab_Incharge","technician"),complainC.updateComplain);

module.exports=router;