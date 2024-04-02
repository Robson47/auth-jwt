// Importações
require('dotenv').config();
const app = require('./config/expressConfig');
const connection = require('./DB/database');

// Confirmação da conexão
console.log(connection);

app.listen(3000, () => {
    console.log(`*-------------------------------------*\n    API Inicializada com sucesso!\n           Database Online!    \n*-------------------------------------*`)
});