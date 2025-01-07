const express = require("express");
const router = express.Router();

const demandC= require('../controller/demandC')

router.post('/post', demandC.postDemand);
router.get('/', demandC.getDemand);

module.exports = router;