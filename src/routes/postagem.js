const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/postagem")
const Postagem = mongoose.model("postagens")




router.get("/:_id", (req,res) => {
    Postagem.findOne({_id: req.params._id}).populate("categoria").populate("autor").then((post)=>{
        if (post){
            return res.render("postagem/indexPostagem", {post:post})
        }else{
            req.falsh("error_msg", "Erro ao carregar postagem :(")
            return res.redirect("/")
        }
    })
})

module.exports = router






