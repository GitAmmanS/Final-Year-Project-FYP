const express = require("express");
const router = express.Router();

const labC= require('../controller/labC')

router.post('/post', labC.postLab);
router.get('/', labC.getLab);
router.put('/put', labC.putLab);

module.exports = router;