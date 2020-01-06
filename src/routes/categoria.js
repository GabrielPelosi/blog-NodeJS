const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/categoria.js")
const Categoria = mongoose.model("categorias")
require("../models/postagem")
const Postagem = mongoose.model("postagens")

router.get("/", (req, res)=>{
    Categoria.find().then((cat)=>{
        res.render("categoria/indexCategoria", {cat: cat})
    })
})

router.get("/:_id", (req, res)=>{
    Categoria.findOne({_id: req.params._id}).then((cat)=>{
        if(cat){
            Postagem.find({categoria :cat._id}).then((post) => {
                res.render("categoria/postagensDeCategoria", {post: post})
            })
        }
    })
})

module.exports = router