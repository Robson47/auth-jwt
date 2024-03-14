// Importações
const express = require('express');
const router = express.Router();
const accountController = require('../controller/accountController');

// Rota de Alteração de Dados
router.patch('/account/update/:id', accountController.updateData);

// Rota de Exclusão de Usuário
router.delete('/account/delete/:id', accountController.deleteUser);

// Exportação do Router
module.exports = router;