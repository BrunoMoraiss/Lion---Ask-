const Sequelize = require ("sequelize")

const connection = new Sequelize('guiaperguntas', 'root', '56157469', {
    host: "localhost",
    dialect: "mysql",
    logging: false
})

module.exports = connection