//Importações
const transporter = require('../../config/OTPConfig');
const EmailOTP = require('../../model/EmailOTP');
const bcrypt = require('bcrypt');
const User = require('../../model/User');

/* Rota para envio de Email */
exports.emailOTP = async (req, res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const salt = await bcrypt.genSalt(12);
        const OTPHash = await bcrypt.hash(otp, salt);
        const Id = req.params.id;
        const user = await User.findById(userId);
        const email = user.email;
        transporter.sendMail({
            from: {
                name: 'Technic Connect Team',
                address: 'TechnicConnectTeam@gmail.com'
            },
            to: email,
            subject: "Verificação de Email",
            text: "Seu email será verificado futuramente",
            html: `<h1>Digite o código: ${otp} para concluir a verificação do seu E-mail</h1>
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

/* Rota para confirmação de OTP */
exports.confirmOTP = async (req, res) => {
    const { otp } = req.body;
    const userId = req.params.id;
    try {
        if (!userId || !otp) {
            res.status(422).json({ msg: 'E-mail ou código de verificação inválidos.' })
            return;
        };

        const otpMatch = await EmailOTP.findOne({ userId: userId });

        if (otpMatch === null) {
            res.status(422).json({ msg: 'Nenhum código de verificação encontrado.' });
            return;
        };

        const { expiresAt, uniqueString: OTPHash } = otpMatch;

        if (expiresAt < Date.now()) {
            await EmailOTP.deleteOne({ userId: Id });
            res.status(500).json({ msg: 'Seu código de verificação expirou, solicite outro código.' })
            return;
        };

        const validOTP = await bcrypt.compare(otp, OTPHash);

        await User.updateOne({ cod_user: userId }, { verified: true });

        await EmailOTP.deleteOne({ userId: userId });

        return res.status(200).json({ validOTP });
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: error });
    };
};