const express = require('express')
const ramC=require('../controller/ramC')

const router= express.Router();

router.post("/post",ramC.postRam);
router.get("/",ramC.getRam);

module.exports = router;