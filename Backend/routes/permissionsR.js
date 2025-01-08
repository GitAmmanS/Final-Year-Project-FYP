const express=require("express");
const router=express.Router();

const permissionC=require("../controller/permissionsC");

router.get("/",permissionC.getPermissions);
router.post("/post",permissionC.postPermissions);

module.exports=router;