// Importação do Mongoose
const mongoose = require('mongoose');

// Modelo de Usuário
const User = mongoose.model('User', {
    name: String,
    email: String,
    password: String,
    technician: Boolean,
    verified: Boolean
});

// Exportação do Modelo Usuário
module.exports = User;