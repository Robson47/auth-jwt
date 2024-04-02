// Importações
const User = require('../../model/User');

// Modificar Dados do Usuário
exports.updateData = async (req, res) => {
    const id = req.params.id;
    const { name, email, contact, birth_day, main_device } = req.body;
    const user = { name, email, contact, birth_day, main_device  };

    try {
        const updatedUser = await User.updateOne({ cod_user: id }, user);

        if (updatedUser.matchedCount === 0) {
            return res.status(404).json({ msg: 'Usuário não encontrado!' });
        } else {
            res.status(201).json({ msg: `O usuário ${updatedUser} foi alterado com sucesso!` });
        };
    } catch (error) {
        res.status(500).json({ msg: error });
    };
};

// Deletar usuário
exports.deleteUser = async (req, res) => {
    const id = req.params.id;
    const user = await User.findOne({ cod_user: id });

    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado!' });
    };

    try {
        await User.deleteOne({ cod_user: id });
        res.status(200).json({ msg: 'O usuário foi deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ msg: error });
    };
};