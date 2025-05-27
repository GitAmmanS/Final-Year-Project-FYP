const express=require("express");
const router=express.Router();

const autohrizedRoles = require('../middleware/roleBaseAuthorization');
const complainC=require("../controller/complaintC");
const verifyToken = require("../middleware/authorization"); 

router.get("/",verifyToken,autohrizedRoles("admin","lab_Incharge","technician"),complainC.getComplain);
router.post("/post",verifyToken,autohrizedRoles("teacher"),complainC.postComplain);
router.get("/ByStatus/",complainC.getComplainByStatus);
router.get("/post/:userId",complainC.getComplainByUserId);
router.get("/ByComplainNumber/:complainNumber",complainC.getComplainByComplainId);
router.put("/update/:_id",verifyToken,autohrizedRoles("lab_Incharge","technician"),complainC.update);
router.put("/put/:_id",verifyToken,autohrizedRoles("lab_Incharge","technician"),complainC.updateComplain);

module.exports=router;