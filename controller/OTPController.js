const transporter = require('../config/OTPConfig');
const EmailOTP = require('../model/EmailOTP');
const bcrypt = require('bcrypt');

exports.emailOTP = async (req, res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const salt = await bcrypt.genSalt(12);
        const OTPHash = await bcrypt.hash(otp, salt);

        await transporter.sendMail({
            from: {
                name: 'Technic Connect Team',
                address: 'TechnicConnectTeam@gmail.com'
            },
            to: req.body.email,
            subject: "Verificação de Email",
            text: "Seu email será verificado futuramente",
            html: `<h1>Digite o código: ${otp} para concluir a verificação do seu E-mail</h1>
                    <p><b>Este código expira em 1 hora</b></p>`,
            attachments: [
                {
                    filename: 'images.jpg',
                    path: './test/images.jpg',
                    contentType: 'image/jpg'
                }
            ]
        });

        const newOTPVerification = await new EmailOTP({
            userId: req.params._id,
            uniqueString: OTPHash,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });

        await newOTPVerification.save();

        res.status(200).json({
            msg: 'E-mail enviado no seu Inbox',
            data: {
                userId: req.params._id,
                email: req.body.email,
            }
        });
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        res.status(500).json({ msg: 'Ocorreu um erro ao enviar o email.' });

    }
};