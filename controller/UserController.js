const express = require('express');
const app = express();
const User = require('../model/User');

/* Inicial/Public Route */
app.get('/', (req, res) => {
    res.status(200).json({
        msg: 'API Inicializada com sucesso!'
    });
});

/* Register Route */
app.post('/auth/register', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    /* Data Validation */
    if (!name){
        return res.status(422).json({msg: 'O nome é obrigatório!'})
    };

    if (!email){
        return res.status(422).json({msg: 'O email é obrigatório!'})
    };

    if (!password){
        return res.status(422).json({msg: 'A senha é obrigatório!'})
    };

    if (password !== confirmPassword){
        return res.status(422).json({msg: 'As senhas não são iguais!'})
    };
});