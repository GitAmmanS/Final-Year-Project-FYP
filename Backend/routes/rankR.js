const express=require("express");
const router=express.Router();

const rankC=require("../controller/rankC");

router.get("/",rankC.rankTableget);
router.post("/",rankC.rankpost);
router.delete("/:rank_name",rankC.rankdelete);
router.put("/:rank_name",rankC.rankupdate);

module.exports=router;