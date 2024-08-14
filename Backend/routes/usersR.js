const express=require("express");
const router=express.Router();

const usersC=require("../controller/usersC");

router.get("/",usersC.usersTableget);
router.post("/",usersC.userspost);
router.delete("/:email",usersC.usersdelete);
router.put("/:users_name",usersC.usersupdate);
router.get("/user",usersC.usersUserget);
router.get("/datasingle/:name1",usersC.usersSingleget);
module.exports=router;