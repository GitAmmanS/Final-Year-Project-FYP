const express = require("express");
const router = express.Router();

const otherSpecsC= require('../controller/otherSpecsC')

router.post('/post', otherSpecsC.postOtherSpecs);
router.get('/', otherSpecsC.getOtherSpecs);

module.exports = router;