const express = require("express");
const router = express.Router();
const statusC = require("../controller/statusC");

router.get("/", statusC.statusTableGet); 
router.post("/", statusC.statusPost); 
router.delete("/:status_name", statusC.statusDelete); 
router.put("/:status_name", statusC.statusUpdate); 
router.get("/:status_name", statusC.statusGet); 

module.exports = router;
