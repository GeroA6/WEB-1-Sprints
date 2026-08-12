const express = require('express');
const router = express.Router();
const authApiController = require('../../controllers/api/authApiController');
const jwtAuthMiddleware = require('../../middlewares/jwtAuthMiddleware');

// Endpoint de login público para la API
router.post('/login', authApiController.login);

// Endpoint protegido para verificar validez del token
router.get('/verify', jwtAuthMiddleware, authApiController.verify);

module.exports = router;
