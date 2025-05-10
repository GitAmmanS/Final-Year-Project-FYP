const express = require("express");
const router = express.Router();

const demandC= require('../controller/demandC')

router.post('/post', demandC.postDemand);
router.get('/', demandC.getDemand);
router.get('/getByStatus', demandC.getDemandByStatus);
router.get('/getById/:number', demandC.getDemandById);
router.get('/getByName/:name', demandC.getDemandByName);
router.get('/getByUserID/:id', demandC.getDemandByUserID);
router.put('/put', demandC.updateDemand);
module.exports = router;