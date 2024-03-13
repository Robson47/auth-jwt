// Importação do Mongoose
const mongoose = require('mongoose');

// Modelo de Usuário
const User = mongoose.model('User', {
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    technician: {
        type: Boolean,
        require: true
    },
    verified: {
        type: Boolean,
        default: false
    }
});

// Exportação do Modelo Usuário
module.exports = User;