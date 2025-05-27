const express = require("express");
const router = express.Router();

const labC= require('../controller/labC')

router.post('/post', labC.postLab);
router.get('/', labC.getLab);
router.get('/byInchargeID/:id', labC.getLabByInchargeID);
router.put('/put', labC.putLab);
router.put('/UpdateLabIncharge', labC.UpdateLabIncharge);
router.put('/deleteLabIncharge', labC.DeleteLabIncharge);
router.get('/:name',labC.getLabByType)

module.exports = router;