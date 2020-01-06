//Carregando modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const path = require("path")
const adminRota = require("./src/routes/admin")
const homeWebRota = require("./src/routes/home")
const postsRota = require("./src/routes/postagem")
const categoriaRota = require("./src/routes/categoria")
const usuarioRota = require("./src/routes/usuario")
const urlErro = require("./src/routes/urlError")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
require("./src/config/auth")(passport)
const {isAdm} = require("./src/helper/isAdm")
//Configs
//Session
app.use(session({
    secret: "12GHR123456789GHR",
    resave: true,
    saveUninitialized: true
}))

//passport
app.use(passport.initialize())
app.use(passport.session())

//Flash(deve ficar embaixo da session)
app.use(flash())
//Middleware
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash("success_msg") //variaveis globais
    res.locals.error_msg = req.flash("error_msg")   //variaveis globais
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    next()

})
//BodyParser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
//Handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
//Mongoose
mongoose.connect("mongodb://localhost/newDataBase").then(() => {
    console.log("Conectado")
}).catch((er)=>{
    console.log("Erro" + er)
})
//Public(Bootstrap)
app.use(express.static(path.join(__dirname, "/public")))

//Rotas
app.use("/admin",isAdm, adminRota)

app.use("/", homeWebRota)

app.use("/postagem", postsRota)

app.use("/categoria", categoriaRota)

app.use("/usuario", usuarioRota)

app.use("/*", urlErro)

//Outros
const PORT = process.env.port || 8089
app.listen(PORT, () =>{
    console.log("Servidor rodando na porta " + PORT)
})
