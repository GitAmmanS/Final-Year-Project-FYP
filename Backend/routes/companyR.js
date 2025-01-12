const express = require("express");
const router = express.Router();
const companyC = require("../controller/companyC");

router.get("/", companyC.getCompanies);

router.post("/post", companyC.createCompany);

router.delete("/:company_name", companyC.deleteCompany);

router.put("/:company_name", companyC.updateCompany);

router.get("/:company_name", companyC.getSingleCompany);

router.get("/items/:company_name", companyC.getCompanyItems);

module.exports = router;
