const express=require("express");
const router=express.Router();
const usersC=require("../controller/usersC");
const verifyToken = require("../middleware/authorization");
const autohrizedRoles = require('../middleware/roleBaseAuthorization');
router.get('/verify',usersC.verifyMail)
router.get("/",usersC.usersTableget);
router.post("/",usersC.userspost);
router.post("/logout",usersC.userLogout);
router.post("/authenticate",usersC.userspostAuthentication);
router.delete("/:email",usersC.usersdelete);
router.put("/:users_name",usersC.usersupdate);
router.get("/:email",usersC.usersUserget);
router.get("/datasingle/:email",usersC.usersSingleget);

//just for testing
router.get("/login/admin",verifyToken,autohrizedRoles("admin"),(req,res)=>{
    res.status(200).json({message:"Logged In as an admin"})
})
router.get("/login/lab_Incharge",verifyToken,autohrizedRoles("admin","labIncharge","user"),(req,res)=>{
    res.status(200).json({message:"Logged In as an labIncharge"});
})
module.exports=router;