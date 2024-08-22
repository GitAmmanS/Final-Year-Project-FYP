const express=require("express");
const router=express.Router();

const usersC=require("../controller/usersC");

router.get("/",usersC.usersTableget);
router.post("/",usersC.userspost);
router.delete("/:email",usersC.usersdelete);
router.put("/:users_name",usersC.usersupdate);
router.get("/:email",usersC.usersUserget);
router.get("/datasingle/:email",usersC.usersSingleget);
module.exports=router;