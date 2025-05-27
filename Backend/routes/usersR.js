const express=require("express");
const router=express.Router();
const usersC=require("../controller/usersC");
const verifyToken = require("../middleware/authorization");
const authorizedRoles = require('../middleware/roleBaseAuthorization');
const UserPic=require("../middleware/userPic");

router.get('/verify',usersC.verifyMail);
router.post("/authenticate",usersC.userspostAuthentication);
router.post("/logout",usersC.userLogout);


router.get("/",verifyToken,authorizedRoles("admin","lab-Incharge"),usersC.usersTableget);
router.post("/",UserPic.single("picture"),usersC.userspost);
router.delete("/:email",verifyToken,authorizedRoles("admin"),usersC.usersdelete);
router.put("/:id", verifyToken, authorizedRoles("admin", "lab_Incharge","store_Incharge"),usersC.usersRoleupdate);
router.put("/updateProfile/:id", verifyToken, authorizedRoles("admin", "lab_Incharge","store_Incharge","teacher","technician"),UserPic.single("picture"),usersC.usersupdate);
router.put("/",usersC.userStatesupdate);
router.get("/:email",verifyToken, authorizedRoles("admin"),usersC.usersUserget);
router.get("/datasingle/:email",verifyToken, authorizedRoles("admin", "lab_Incharge"),usersC.usersSingleget);

module.exports=router;