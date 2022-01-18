const Seq = require('sequelize');
const database = require('./db.js');

const Usuario = database.define('usuarios', {
    id: {
        type: Seq.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Seq.STRING(20),
        allowNull: false
    },
    email: {
        type: Seq.STRING(100),
        allowNull: false
    },
    nome: {
        type: Seq.STRING(100),
        allowNull: false
    },
    password: {
        type: Seq.STRING(30),
        allowNull: false
    }
});

Usuario.sync();
//Usuario.sync({force: true}); -> Força um cascade drop table