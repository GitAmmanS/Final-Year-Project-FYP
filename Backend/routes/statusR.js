const express=require("express");
const router=express.Router();

const statusC=require("../controller/statusC");

router.get("/",statusC.statusTableget);
router.post("/",statusC.statuspost);
router.delete("/:status_name",statusC.statusdelete);
router.put("/:status_name",statusC.statusupdate);
router.get("/:status_name",statusC.statusget);
router.get("/single/:status_name",statusC.statusSingleget);

module.exports=router;