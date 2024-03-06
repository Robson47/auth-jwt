const transporter = require('../config/OTPConfig');
const EmailOTP = require('../model/EmailOTP');
const User = require('../model/User');
const UserController = require('../controller/UserController');
const bcrypt = require('bcrypt');

exports.emailOTP = async ({ _id, email }, res, req) => {
    const id = req.params.id;
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const salt = await bcrypt.genSalt(12);
        const OTPHash = await bcrypt.hash(otp, salt);

        const newOTPVerification = await new EmailOTP({
            userId: _id,
            uniqueString: OTPHash,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });

        await newOTPVerification.save();

        await transporter.sendMail({
            from: {
                name: 'Technic Connect Team',
                address: '<TechnicConnectTeam@gmail.com>'
            },
            to: ["clonederobson@gmail.com"],
            subject: "Verificação de Email",
            text: "Seu email será verificado futuramente",
            html: `<h1>Digite o código: ${otp} para concluir a verificação do seu E-mail</h1>
                    <p><b>Este código expira em 1 hora</b></p>`
            /*attachments: [
                {
                    filename: 'images.jpg',
                    path: path.call(__dirname, '../test/images.jpg'),
                    contentType: 'image/jpg'
                }
            ]*/
        });
        res.status(200).json({ 
            msg: 'E-mail enviado no seu Inbox', 
            data: {
                userId: _id,
                email,
            }
        })
    } catch (error) {

    }
};