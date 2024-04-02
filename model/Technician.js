const sequelize = require(sequelize);
const connection = require("..database/database");

const Technician = connection.define(
    "tecnicos",
    {
        cod_technician:{
            type: sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unsigned: true
        },
        username:{
            type: sequelize.STRING(255),
            allowNull: false
        },
        email:{
            type: sequelize.STRING(255),
            allowNull: false
        },
        password:{
            type: sequelize.STRING(255),
            allowNull: false
        },        
        contact:{
            type: sequelize.STRING(255),
            allowNull: false
        },
        birth_day:{
            type: sequelize.DATE(),
            allowNull: false
        },
        specialization:{
            type: sequelize.INTEGER,
            allowNull: false
        },
        technician_picture:{
            type: sequelize.STRING(255),
            allowNull: true
        },
        picture_url:{
            type: sequelize.STRING(255),
            allowNull: true
        },
        address:{
            type: sequelize.INTEGER
        },               
        verified:{
            type: sequelize.BOOLEAN,
            allowNull: false
        }        
    }
);

Technician.sync({force:false});

module.exports = Technician;