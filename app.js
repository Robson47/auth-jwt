require('dotenv').config();
const app = require('./config/expressConfig');
const mongoose = require('mongoose');
const UserRoutes = require('./routes/userRoutes');

app.use(UserRoutes);

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