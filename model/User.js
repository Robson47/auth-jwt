// Importação do Mongoose
const mongoose = require('mongoose');

// Modelo de Usuário
const User = mongoose.model('User', {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    technician: {
        type: Boolean,
        required: true
    },
    verified: {
        type: Boolean,
        defaultd: false
    }
});

// Exportação do Modelo Usuário
module.exports = User;