// Importações
const express = require('express');
const UserRoutes = require('../routes/userRoutes');
const OTPConfig = require('./OTPConfig')
const app = express();
const cors = require('cors');

// Dependências
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Controllers
app.use(UserRoutes);

module.exports = app;