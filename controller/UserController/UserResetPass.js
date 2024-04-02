const User = require('../../model/User');
const transporter = require('../../config/OTPConfig');
const EmailOTP = require('../../model/EmailOTP');
const bcrypt = require('bcrypt');

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const userId = req.params.id;
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const salt = await bcrypt.genSalt(12);
        const OTPHash = await bcrypt.hash(otp, salt);

        // Validar o email
        if (!email) {
            res.status(422).json({ msg: 'Email inválido' })
        };

        const isUser = await User.findById(userId);

        if (isUser.email !== email) {
            res.status(422).json({ msg: 'Email inválido' })
        }

        // Checar se o Usuário existe
        const userExists = await User.findOne({ email: email });

        if (!userExists) {
            return res.status(422).json({ msg: 'Não existe um usuário com este email!' });
        };

        // Checar se o usuário é verificado
        if (!userExists.verified) {
            return res.status(404).json({ msg: 'Usuário não verificado!' });
        };

        transporter.sendMail({
            from: {
                name: 'Technic Connect Team',
                address: 'TechnicConnectTeam@gmail.com'
            },
            to: email,
            subject: "Redefinição de Senha",
            text: "Mude sua senha para uma melhor",
            html: `<h1>Digite o código: ${otp} para alterar sua senha</h1>
                    <p><b>Este código expira em 1 hora</b></p>`
        });

        const newOTPVerification = await new EmailOTP({
            userId: userId,
            uniqueString: OTPHash,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });

        await newOTPVerification.save();

        res.status(200).json({
            msg: 'E-mail enviado no seu Inbox.',
            data: {
                userId: userId,
                email: email
            }
        });
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        res.status(500).json({ msg: 'Ocorreu um erro ao enviar o email.' });
    };
};

exports.changePassword = async (req, res) => {
    const { userId, otp, newPassword } = req.body;
    try {
        if (!userId || !otp || !newPassword) {
            res.status(422).json({ msg: 'Código de verificação ou Senha inválidos.' });
            return;
        };

        const otpMatch = await EmailOTP.findOne({ userId: userId });

        if (!otpMatch) {
            res.status(422).json({ msg: 'Nenhum código de verificação encontrado.' });
            return;
        };

        const { expiresAt, uniqueString: OTPHash } = otpMatch;

        if (expiresAt < Date.now()) {
            await EmailOTP.deleteOne({ userId });
            res.status(500).json({ msg: 'Seu código de verificação expirou, solicite outro código.' })
            return;
        };

        const validOTP = await bcrypt.compare(otp, OTPHash);

        if (!/^(?=.*[A-Z])(?=.*[!#@$%&])(?=.*[0-9])(?=.*[a-z]).{6,15}$/.test(newPassword)) {
            res.status(422).json({ msg: 'A nova senha deve conter entre 6 e 15 caracteres e incluir pelo menos uma letra maiúscula, um número e um caractere especial.' });
            return;
        };

        const salt = await bcrypt.genSalt(12);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        await User.updateOne({ cod_user: userId }, { password: newPasswordHash });

        await EmailOTP.deleteOne({ userId: userId });

        return res.status(200).json({ validOTP });
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: error });
    };
};