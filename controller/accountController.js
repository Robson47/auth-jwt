// Importações
const User = require('../model/User');
const transporter = require('../config/OTPConfig');
const EmailOTP = require('../model/EmailOTP');

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const { userId } = req.params.id;
    try {
        // Validar o email
        if (!email) {
            res.status(422).json({ msg: 'Email inválido' })
        };

        // Checar se o Usuário existe
        const userExists = await User.findOne({ email: email });

        if (!userExists) {
            return res.status(422).json({ msg: 'Não existe um usuário com este email!' });
        };

        // Checar se o usuário é verificado
        if (!user.verified) {
            return res.status(404).json({ msg: 'Usuário não verificado!' });
        };

        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        transporter.sendMail({
            from: {
                name: 'Technic Connect Team',
                address: 'TechnicConnectTeam@gmail.com'
            },
            to: email,
            subject: "Redefinição de Senha",
            text: "Mude sua senha para uma melhor",
            html: `<h1>Digite o código: ${otp} para alterar sua senha</h1>
                    <p><b>Este código expira em 1 hora</b></p>`,
            attachments: [
                {
                    filename: 'images.jpg',
                    path: './test/images.jpg',
                    contentType: 'image/jpg'
                }
            ]
        });

        if (!userId || !otp) {
            res.status(422).json({ msg: 'E-mail ou código de verificação inválidos.' })
        };

        const otpMatch = await EmailOTP.findOne({ userId });

        if (!otpMatch) {
            res.status(422).json({ msg: 'Nenhum código de verificação encontrado.' })
        };

        const { expiresAt, otp: OTPHash } = otpMatch;

        if (expiresAt < Date.now()) {
            await EmailOTP.deleteOne({ userId });
            res.status(500).json({ msg: 'Seu código de verificação expirou, solicite outro código.' })
        };

        const validOTP = await bcrypt.compare(otp, OTPHash);

        return res.status(200).json({ validOTP });

    } catch (error) {
        console.error('Erro ao enviar email:', error);
        res.status(500).json({ msg: 'Ocorreu um erro ao enviar o email.' });
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