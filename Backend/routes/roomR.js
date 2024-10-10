const express = require("express");
const router = express.Router();

const roomC= require('../controller/roomC')

router.post('/post', roomC.postRoom);
router.get('/', roomC.getRoom);

module.exports = router;