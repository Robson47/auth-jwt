const nodemailer = require("nodemailer");
const { path } = require("./expressConfig");
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function main() {
    const info = await transporter.sendMail({
        from: {
            name: 'Technic Connect Team',
            address: '<TechnicConnectTeam@gmail.com>'
        },
        to: ["clonederobson@gmail.com"],
        subject: "Verificação de Email",
        text: "Seu email será verificado futuramente",
        html: "<h1>Teste Phoda</h1>",
        /*attachments: [
            {
                filename: 'images.jpg',
                path: path.call(__dirname, '../test/images.jpg'),
                contentType: 'image/jpg'
            }
        ]*/
    });

    console.log("Message sent: %s", info.messageId);
}

main().catch(console.error);

module.exports = main();