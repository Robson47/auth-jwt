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
router.post('/auth/login', UserController.login);

// Rota de Alteração de Dados
router.patch('/account/update/:id', UserController.updateData);

// Rota de Exclusão de Usuário
router.delete('/account/delete/:id', UserController.deleteUser);

module.exports = router;