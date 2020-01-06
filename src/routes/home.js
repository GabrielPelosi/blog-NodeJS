const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/postagem")
const Postagem = mongoose.model("postagens")



router.get("/", (req, res)=>{
    Postagem.find().populate("categoria").then((err, postagens)=>{
        if(err){
            req.flash("error_msg", "Algo deu errado, tente novamente mais tarde")
            res.redirect("/")
        }else{
            res.render("home/home", {postagens: postagens})
        }

    })
})

module.exports = router

