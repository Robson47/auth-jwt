// Importação do Mongoose
const mongoose = require('mongoose');

// Modelo de Verificação de Usuário
const EmailOTP = mongoose.model('UserOTP', {
    userId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    uniqueString: {
        type: String,
        required: true
    },
    createdAt: Date,
    expiresAt: Date
});

// Exportação do Modelo de Verificação de Usuário
module.exports = EmailOTP;