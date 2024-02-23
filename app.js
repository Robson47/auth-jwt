require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const UserController = require('./controller/UserController');

const app = express();

app.use(express.json())
app.use(UserController);

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.gpcdo6p.mongodb.net/`)
    .then(
        app.listen(3000, () => {
            console.log(`*-------------------------------------*\n    API Inicializada com sucesso!\n           Database Online!    \n*-------------------------------------*`)
        }))
    .catch((error) => {
        console.log(error)
    });
