const Seq = require('sequelize');
const sequelize = require('./db.js');
const database = require('./db.js');

const Playlist = database.define('playlists', {
    id: {
        type: Seq.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    appid: {
        type: Seq.STRING,
        allowNull: true
    },
    totaltracks: {
        type: Seq.INTEGER,
        allowNull: false
    },
    collaborative: {
        type: Seq.BOOLEAN,
        allowNull: false
    },
    owner: {
        type: Seq.STRING,
        allowNull:false
    },
    insertedby: {
        type: Seq.STRING(20),
        allowNull: false
    },
    imageURL: {
        type: Seq.STRING(300),
        allowNull: true
    }
});

module.exports = Playlist;