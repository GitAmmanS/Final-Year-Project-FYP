const express = require("express");
const router = express.Router();

const osC= require('../controller/OSC')

router.post('/post', osC.postOs);
router.get('/', osC.getOs);

module.exports = router;