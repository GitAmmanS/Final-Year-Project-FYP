const express=require("express");
const router=express.Router();

const spexC=require("../controller/spexC");

router.get("/:spex_id",spexC.spexget);
router.post("/",spexC.spexpost);
router.delete("/:spex_id",spexC.spexdelete);
router.put("/:spex_id",spexC.spexupdate);

module.exports=router;