// Importações
const Technician = require('../../model/Technician');

// Modificar Dados do Usuário
exports.updateData = async (req, res) => {
    const id = req.params.id;
    const { name, email } = req.body;
    const technician = { name, email };

    try {
        const updatedTechnician = await Technician.updateOne({ cod_technician: id }, technician);

        if (updatedTechnician.matchedCount === 0) {
            return res.status(404).json({ msg: 'Usuário não encontrado!' });
        } else {
            res.status(201).json({ msg: `O usuário ${updatedTechnician} foi alterado com sucesso!` });
        };
    } catch (error) {
        res.status(500).json({ msg: error });
    };
};

// Deletar usuário
exports.deleteTechnician = async (req, res) => {
    const id = req.params.id;
    const Technician = await Technician.findOne({ cod_technician: id });

    if (!Technician) {
        return res.status(404).json({ msg: 'Usuário não encontrado!' });
    };

    try {
        await Technician.deleteOne({ cod_technician: id });
        res.status(200).json({ msg: 'O usuário foi deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ msg: error });
    };
};