const express=require("express");
const router=express.Router();

const companyC=require("../controller/companyC");

router.get("/",companyC.companiesTableget);
router.post("/",companyC.companiespost);
router.delete("/:company_name",companyC.companiesdelete);
router.put("/:company_name",companyC.companiesupdate);
router.get("/:company_name",companyC.companiesget);
router.get("/single/:company_name",companyC.companiesSingleget);

module.exports=router;