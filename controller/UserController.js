require('dotenv').config();
const express = require('express');
const app = express();
const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* Rota Inicial/Pública */
app.get('/', (req, res) => {
    res.status(200).json({
        msg: 'API Inicializada com sucesso!'
    });
});

/* Rota Privada */
app.get('/user/:id', checkToken, async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id, '-password');

    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado!' });
    };

    res.status(200).json({ user });
});

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado!' })
    };

    try {
        const secret = process.env.SECRET;
        jwt.verify(token, secret);
        next();
    } catch (error) {
        res.status(400).json({ msg: 'Token inválido!' });
    };
};

/* Rota de Registro */
app.post('/auth/register', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    /* Validação de Dados */
    if (!name) {
        return res.status(422).json({ msg: 'O nome é obrigatório!' });
    };

    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatório!' });
    };

    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatória!' });
    };

    if (password !== confirmPassword) {
        return res.status(422).json({ msg: 'As senhas não são iguais!' });
    };

    /* Checar se o Usuário existe */
    const userExists = await User.findOne({ email: email });

    if (userExists) {
        return res.status(422).json({ msg: 'Uma conta com este e-mail já existe!' });
    };

    /* Criar a Senha */
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    /* Criar Usuário */
    const user = new User({ name, email, password: passwordHash });

    try {
        await user.save();
        res.status(201).json({ msg: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error });
    };
});

/* Logar Usuário */
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    /* Validação de Dados */
    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatório!' });
    };

    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatória!' });
    };

    /* Checar se Usuário existe */
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado!' });
    };

    /* Checar se as senhas combinam */
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
        return res.status(422).json({ msg: 'Senha inválida!' });
    };

    try {
        const secret = process.env.SECRET;
        const token = jwt.sign({ id: user._id }, secret);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error });
    };

    res.status(200).json({ msg: 'Autenticação realizada com sucesso!', token });
});