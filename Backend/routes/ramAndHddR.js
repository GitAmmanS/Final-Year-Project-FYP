const express = require('express');
const router = express.Router();
const { getCapacity, postCapacity, getType, postType, getStatus, postStatus } = require('../controller/ramAndHddC');

router.get('/capacity', getCapacity);
router.post('/capacity', postCapacity);

router.get('/type', getType);
router.post('/type', postType);

// router.get('/', getStatus);
// router.post('/status', postStatus);

module.exports = router;
