const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.status(200).json({
        msg: 'API Inicializada com sucesso!'
    });
});