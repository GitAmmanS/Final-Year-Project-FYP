const express=require("express");
const router=express.Router();

const floorC=require("../controller/floorC");

router.get("/",floorC.floorTableget);
router.post("/",floorC.floorpost);
router.delete("/:floor_name",floorC.floordelete);
router.put("/:floor_name",floorC.floorupdate);

module.exports=router;