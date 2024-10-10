const express = require("express");
const router = express.Router();

const cpuC= require('../controller/cpuC')

router.post('/post', cpuC.postCpu);
router.get('/', cpuC.getCpu);

module.exports = router;