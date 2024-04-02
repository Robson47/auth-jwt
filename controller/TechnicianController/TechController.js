// Importações
require('dotenv').config();
const Technician = require('../../model/Technician');
const jwt = require('jsonwebtoken');

// Método para validação de token
function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: 'Token de acesso não fornecido.' });
    };

    try {
        const secret = process.env.SECRET;
        const decoded = jwt.verify(token, secret);
        req.technician = decoded.technician; // Adiciona o usuário decodificado ao objeto de solicitação para acesso nas rotas protegidas
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token inválido.' });
    };
}

// Rota Inicial
exports.publicRoute = (req, res) => {
    res.status(200).json({
        msg: 'API Inicializada com sucesso!'
    });
};

// Rota Privada
exports.privateRoute = async (req, res) => {
    try {
        const Id = req.params.id; // Obtém o ID do usuário do objeto de solicitação
        const technician = await Technician.findById(Id, '-password');

        if (!technician) {
            return res.status(404).json({ msg: 'Usuário não encontrado.' });
        };
        res.status(200).json({ technician });
    } catch (error) {
        res.status(500).json({ msg: 'Erro ao buscar o usuário.' });
        console.log(error);
    };
};

// Middleware para validar o token antes de acessar a rota privada
exports.validPrivateRoute = [checkToken, exports.privateRoute];
