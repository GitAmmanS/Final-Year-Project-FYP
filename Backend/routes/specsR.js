const express = require('express')
const specsC=require('../controller/specsC')

const router= express.Router();

router.post("/post",specsC.getSpecs);

module.exports = router;