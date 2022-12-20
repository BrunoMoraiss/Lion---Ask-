const Sequelize = require("sequelize")
const connection = require("../database")

const Respota = connection.define("respostas", {
    corpo: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    perguntaId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

Respota.sync({force: false})

module.exports = Respota