// Importação do Mongoose
const mongoose = require('mongoose');

// Modelo de Verificação de Usuário
const EmailVerification = mongoose.model('UserOTP', {
    userId: String,
    uniqueString: String,
    createdAt: Date,
    expiresAt: Date
});

// Exportação do Modelo de Verificação de Usuário
module.exports = EmailVerification;