const express=require("express");
const router=express.Router();

const locationC=require("../controller/locationC");

router.get("/",locationC.locationTableget);
router.post("/",locationC.locationpost);
router.delete("/:location_name",locationC.locationdelete);
router.put("/:location_name",locationC.locationupdate);

module.exports=router;