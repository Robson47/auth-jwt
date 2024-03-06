// Importações
require('dotenv').config();
const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Método para validação de token
function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado!' });
    };

    try {
        const secret = process.env.SECRET;
        jwt.verify(token, secret);
        next();
    } catch (error) {
        res.status(400).json({ msg: 'Token inválido!' });
    };
};

// Rota Inicial
exports.publicRoute = (req, res) => {
    res.status(200).json({
        msg: 'API Inicializada com sucesso!'
    });
};

// Rota Privada
exports.privateRoute = checkToken, async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id, '-password');

    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado!' });
    };

    res.status(200).json({ user });
};

/* Rota de Registro */
exports.register = async (req, res) => {
    const { name, email, password, confirmPassword, technician } = req.body;

    /* Validação de Dados */

    if (!name || !email || !password) {
        return res.status(422).json({ msg: 'Por favor preencha todos os dados!' });

    } else if (!/^[a-zA-Z ]*$/.test(name)) {
        return res.status(422).json({ msg: 'Por favor digite um nome válido!' });

    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2, 4}$/.test(email)){
        return res.status(422).json({ msg: 'Por favor digite um e-mail válido!' });

    }else if (!/^(?=.*[A-Z])(?=.*[!#@$%&])(?=.*[0-9])(?=.*[a-z]).{6,15}$/.test(password)){
        return res.status(422).json({ msg: 'Por favor digite uma senha válida!' });
    }

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
    const user = new User({ name, email, password: passwordHash, verified: false, technician });

    try {
        await user.save();
        res.status(201).json({ msg: `O usuário ${user} foi cadastrado com sucesso` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error });
    };
};

/* Logar Usuário */
exports.login = async (req, res) => {
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
    const checkPassword = bcrypt.compare(password, user.password);

    if (!checkPassword) {
        return res.status(422).json({ msg: 'Senha inválida!' });
    };

    try {
        const secret = process.env.SECRET;
        const token = jwt.sign({ id: user._id }, secret);
        res.status(200).json({ msg: 'Autenticação realizada com sucesso!', token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error });
    };
};

// Modificar Dados do Usuário
exports.updateData = async (req, res) => {
    const id = req.params.id;
    const { name, email, technician } = req.body;
    const user = { name, email, technician };

    try {
        const updatedUser = await User.updateOne({ _id: id }, user);

        if (updatedUser.matchedCount === 0) {
            return res.status(404).json({ msg: 'Usuário não encontrado!' });
        } else {
            res.status(201).json({ msg: `O usuário ${updatedUser} foi alterado com sucesso!` });
        };
    } catch (error) {
        res.status(500).json({ msg: error });
    };
};

// Deletar usuário
exports.deleteUser = async (req, res) => {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });

    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado!' });
    };

    try {
        await User.deleteOne({ _id: id });
        res.status(200).json({ msg: 'O usuário foi deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ msg: error });
    };
};