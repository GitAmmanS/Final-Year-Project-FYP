const express=require("express");
const router=express.Router();

const graphicCardC=require("../controller/graphicCardC");

router.get("/",graphicCardC.graphicCardTableget);
router.post("/",graphicCardC.graphicCardpost);
router.delete("/:graphicCard_ID",graphicCardC.graphicCarddelete);
router.put("/:graphicCard_ID",graphicCardC.graphicCardupdate);

module.exports=router;