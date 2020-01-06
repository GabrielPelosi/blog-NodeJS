const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/usuario")
const Usuario = mongoose.model("usuario")
const bcrypt = require("bcryptjs")
const passport = require("passport")
require("../config/auth")(passport)
const {isNotAuth} = require("../helper/isNotAuth")
const {isAuth} = require("../helper/isAuth")
const authConfig = require("../config/authConfig")



require("../models/postagem")
const Postagem = mongoose.model("postagens")

require("../models/categoria.js")
const Categoria = mongoose.model("categorias")


router.get("/registro", isNotAuth,(req,res)=>{
    res.render("usuario/registroUsuario")
})

router.post("/registro/novo",  (req, res, next) => {
    try{
        if (req.body.senha !== req.body.senha2) throw new Error("As senhas devem ser iguais para confirmar o cadstro!")
        if((req.body.senha.length < 5)) throw new Error("A senha deve conter no minimo 5 digitos!")
        Usuario.findOne({email: req.body.email}).then((usuario)=>{
            if (usuario) {
                req.flash("error_msg", "Email ja registrado")
                res.redirect("/usuario/registro")
            }else{
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10,(erro, salt)=>{
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash)=>{
                        if(erro){
                            req.flash("error_msg", "Houve um erro inesperado, por favor tente novamente em breve")
                            res.redirect("/")
                        }
                        novoUsuario.senha=hash
                        novoUsuario.save().then(()=>{
                            req.flash("success_msg", "Usuario registrado com sucesso!")
                            //antes de usar validacao popr email, o user é logado direto
                            passport.authenticate("local", {
                                successRedirect: "/",
                                failureRedirect: "/usuario/login",
                                failureFlash: true
                            })(req,res,next)
                        })
                    })
                })
            }
        })
    }catch(Error){
        req.flash("error_msg", Error.message)
        res.redirect("/usuario/registro")
    }
})


router.get("/login", isNotAuth,(req,res)=>{
    res.render("usuario/login")
})
router.post("/login", (req,res,next)=>{
   passport.authenticate("local", {
       successRedirect: "/",
       failureRedirect: "/usuario/login",
       failureFlash: true
    })(req,res,next)
})

router.get("/logout", (req,res)=>{
    req.logout()
    req.flash("success_msg", "Deslogado com sucesso!")
    res.redirect("/")
})

router.get("/perfil",isAuth, (req,res)=>{
    Postagem.find({autor: {$in: req.user._id}} ).populate("categoria").then((posts) => {
        res.render("usuario/perfil", {posts: posts})
    }).catch((err) => {
        req.flash("error_msg", "Erro inesperado, por favor tente novamente mais tarde ;(")
        res.redirect("/")
    })

})

router.get("/postagem", isAuth,(req,res) => {
    Categoria.find().populate("categoria").sort({date: "desc"}).then((categorias)=>{
        res.render("usuario/novaPostagem", {categorias: categorias})
    }).catch(()=>{
        req.flash("error_msg", "Erros inesperados")
        res.redirect("/admin")
    })
})

router.post("/postagem/nova", (req, res) => {
    const newPostagem = {
        autor: req.body.id,
        titulo: req.body.titulo,
        slug: req.body.slug,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        categoria: req.body.categoria
    }

    new Postagem(newPostagem).save().then(()=>{
        req.flash("success_msg", "Postagem criada com sucesso")
        res.redirect("/")
    }).catch((err)=>{
        req.flash("error_msg", "Erro ao criar postagem")
        res.redirect("/")
    })
})

module.exports = router

