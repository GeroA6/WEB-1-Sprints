const express = require('express');
const router = express.Router();

const statsApiController = require('../../controllers/api/statsApiController');

router.get('/', statsApiController.getStats);

module.exports = router;