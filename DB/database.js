const sequelize = require("sequelize");

const connection = new sequelize(
    "technic_db",
    "root",
    "",
    {
        host: "127.0.0.1",
        port: "3306",
        dialect: "mysql",
        timezone:"-03:00"
    }
);

module.exports = connection;