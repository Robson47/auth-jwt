const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');

// Rota Pública
router.get('/', UserController.publicRoute);

// Rota Privada
router.get('/user/:id', UserController.privateRoute);

// Rota de Registro
router.post('/auth/register', UserController.register);

// Rota de Login
router.post('/auth/login', UserController.login)

module.exports = router;