const express = require('express')
const hddC=require('../controller/hddC')

const router= express.Router();

router.post("/post",hddC.postHdd);
router.get("/",hddC.getHdd);


module.exports = router;