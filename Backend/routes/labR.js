const express = require("express");
const router = express.Router();

const labC= require('../controller/labC')

router.post('/post', labC.postLab);
router.get('/', labC.getLab);

module.exports = router;