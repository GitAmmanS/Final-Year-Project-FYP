const express=require("express");
const router=express.Router();

const roleC=require("../controller/roleC");

router.get("/",roleC.roleTableget);
router.post("/post",roleC.rolepost);
router.delete("/:role_name",roleC.roledelete);
router.put("/:role_name",roleC.roleupdate);

module.exports=router;