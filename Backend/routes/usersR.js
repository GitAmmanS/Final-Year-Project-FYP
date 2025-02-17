const express=require("express");
const router=express.Router();
const usersC=require("../controller/usersC");
const verifyToken = require("../middleware/authorization");
const authorizedRoles = require('../middleware/roleBaseAuthorization');
router.get('/verify',usersC.verifyMail);
router.post("/authenticate",usersC.userspostAuthentication);
router.post("/logout",usersC.userLogout);


router.get("/",verifyToken,authorizedRoles("admin","lab-Incharge"),usersC.usersTableget);
router.post("/",usersC.userspost);
router.delete("/:email",verifyToken,authorizedRoles("admin"),usersC.usersdelete);
router.put("/:id", verifyToken, authorizedRoles("admin", "lab_Incharge"),usersC.usersupdate);
router.get("/:email",verifyToken, authorizedRoles("admin"),usersC.usersUserget);
router.get("/datasingle/:email",verifyToken, authorizedRoles("admin", "lab_Incharge"),usersC.usersSingleget);

module.exports=router;