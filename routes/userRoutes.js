// Importações
const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');

// Rota Pública
router.get('/', UserController.publicRoute);

// Rota Privada
router.get('/user/:id', UserController.validPrivateRoute);

// Exportação do Router
module.exports = router;