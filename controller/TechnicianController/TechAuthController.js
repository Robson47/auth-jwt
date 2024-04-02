// Importações
require('dotenv').config();
const Technician = require('../../model/Technician');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* Rota de Registro */
exports.register = async (req, res) => {
    const { name, email, password, confirmPassword, verified, contact, birth_day, specialization  } = req.body;
    const file = req.file;

    // Validação de Dados
    if (!name || !email || !password) {
        return res.status(422).json({ msg: 'Por favor, preencha todos os campos obrigatórios!' });
    };

    if (!/^[a-zA-Z ]*$/.test(name)) {
        return res.status(422).json({ msg: 'Por favor, digite um nome válido!' });
    };

    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(422).json({ msg: 'Por favor, digite um email válido!' });
    };

    if (!/^(?=.*[A-Z])(?=.*[!#@$%&])(?=.*[0-9])(?=.*[a-z]).{6,15}$/.test(password)) {
        return res.status(422).json({ msg: 'A senha deve conter entre 6 e 15 caracteres e incluir pelo menos uma letra maiúscula, um número e um caractere especial.' });
    };

    if (password !== confirmPassword) {
        return res.status(422).json({ msg: 'As senhas não coincidem!' });
    };

    if (!file) {
        return res.status(422).json({ msg: 'Não há imagem!' });
    };

    // Checar se o Usuário existe
    const TechnicianExists = await Technician.findOne({ email: email });

    if (TechnicianExists) {
        return res.status(422).json({ msg: 'Um usuário com este email já existe!' });
    };

    // Criar a Hash da Senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Criar Usuário
    const fileName = Date.now().toString() + "-" + file.originalname;

    const fileRef = ref(storage, fileName);

    uploadBytes(fileRef, file.buffer);

    const imageRef = ref(storage, snapshot.metadata.name);

    const urlFinal = getDownloadURL(imageRef);

    const technician = new Technician({ name, email, password: passwordHash, verified, contact, specialization, birth_day, technician_picture: fileName, picture_url: urlFinal });

    try {
        await technician.save();
        res.status(201).json({ msg: `O usuário ${technician.name} foi cadastrado com sucesso!` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ocorreu um erro ao cadastrar o usuário.' });
    };
};

/* Logar Usuário */
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Validação de Dados
    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatório!' });
    };

    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatória!' });
    };

    // Checar se Usuário existe
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado!' });
    };

    // Checar se as senhas combinam
    try {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(422).json({ msg: 'Senha inválida!' });
        };

        // Checar se o usuário é verificado
        if (!user.verified) {
            return res.status(404).json({ msg: 'Usuário não verificado!' });
        };

        // Gerar token JWT
        const secret = process.env.SECRET;
        const token = jwt.sign({ id: user._id }, secret);

        res.status(200).json({ msg: 'Autenticação realizada com sucesso!', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ocorreu um erro ao tentar fazer login.' });
    };
};