const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")
const Pergunta = require("./database/models/pergunta")
const Resposta = require("./database/models/Respota")

//DataBase 
//Criando conexão ao banco de dados
connection.authenticate().then(()=> {
    console.log("Conectado ao servidor!")
}).catch((msgErro) => {
    console.log(msgErro)
})

//Estou dizendo para o Express usar o EJS como view engine
app.set("view engine", "ejs")

//Para fazer a utilização de arquivos estaticos, arquivos JS, CSS, IMG e tudo que é estatico
app.use(express.static('public'))

//Utilização body-parser, comando para que o body-parser traduza para uma estrutura javaScript
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//ROTAS
app.get("/", (req, res) => {
    //Recuperando as perguntas que estão no meu banco de dados, {raw: true} --> Significa que eu desejo pegar somente as perguntas e não diversas informações
    Pergunta.findAll({raw: true, order: [
        ['id', 'DESC'] // Para deixar na forma crescente seria utilizar o ASC = Crescente
    ]}).then((perguntas)=>{
        res.render('index', {
            perguntas: perguntas
        })
    })
    
})

app.get("/perguntar", (req, res) => {
    res.render('perguntar')
})

app.post("/savequestion", (req, res) => {
    //Recebendo o titulo e a descrição da pergunta
    const titulo = req.body.titulo
    const descricao = req.body.descricao

    //Salvando a pergunta no banco de dados
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{ res.redirect("/")})
})

app.get("/pergunta/:id", (req, res) => {
    const id = req.params.id
    Pergunta.findOne({
        raw: true,
        where: {id: id}
    }).then(pergunta => {
        if(pergunta !== null){
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render("pergunta", {
                pergunta: pergunta,
                respostas: respostas
                })
            })
        } else {
            res.redirect("/")
        }
    })
})

app.post("/responder", (req, res) => {
    const corpo = req.body.corpo
    const perguntaId = req.body.perguntaId

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId)
    })
})

app.listen(3000, ()=> {
    console.log("Servidor Iniciado")
})
