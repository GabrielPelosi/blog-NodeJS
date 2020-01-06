const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/categoria.js")
const Categoria = mongoose.model("categorias")

require("../models/postagem")
const Postagem = mongoose.model("postagens")

require("../models/usuario")
const Usuario = mongoose.model("usuario")

router.get("/", (req,res) => {
    res.render("admin/index");
});

router.get("/posts", (req,res)=>{
    res.send("posts");
});

router.get("/categorias", (req,res)=> {
    Categoria.find().sort({nome: "asc"}).then((categorias)=>{
        res.render("admin/categorias", {cat: categorias});
    }).catch((er)=>{
        req.flash("error_msg", "erro ao listar as categorias")
        res.redirect("/admin")
    })
});
router.get("/categorias/add", (req, res) => {
    res.render("admin/addcategoria");
})

router.post("/categorias/nova",(req,res)=>{
    const novaCatgoria = {
        nome: req.body.nome, //fazem referncia aos nomes das "input views"
        slug: req.body.slug
    }
    new Categoria(novaCatgoria).save().then(()=>{
        req.flash("success_msg", "Categoria criada com sucesso")
        res.redirect("/admin/categorias")
    }).catch((er)=>{
        req.flash("error_msg", "Erro ao criar categoria")
        res.redirect("/admin/categorias")
    })
})

router.get("/categorias/edit/:id", (req, res)=>{
    Categoria.findOne({_id: req.params.id}).then((categorias)=>{
        res.render("admin/editcategorias", {cat: categorias})
    }).catch((er)=>{
        req.flash("error_msg", "Erro ao editar categoria!")
        res.redirect("/admin/categorias")
    })
})


router.post("/categorias/edit", (req, res)=>{
    Categoria.findOne({_id: req.body.id}).then((cat)=>{
        cat.nome = req.body.nome
        cat.slug = req.body.slug
        cat.save().then(()=>{
            req.flash("success_msg", "Categoria editada com sucesso")
            res.redirect("/admin/categorias")
        })
    }).catch((er)=>{
        req.flash("error_msg", "Erro ao editar categoria")
        res.redirect("/admin/categorias")
    })
})


router.post("/categorias/deletar", (req, res)=>{
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash("success_msg", "Categoria deletada com sucesso")
        res.redirect("/admin/categorias")
    }).catch((er)=>{
        req.flash("error_msg", "Erro ao deletar a categoria")
        res.redirect("/admin/categorias")
    })
})

router.get("/postagem", (req, res)=>{
    Postagem.find().populate("autor").populate("categoria").then((postagens)=>{
        res.render("admin/postagens", {postagens: postagens})
    })

})

router.get("/postagem/add", (req, res)=>{
    Categoria.find().populate("categoria").sort({date: "desc"}).then((categorias)=>{

        res.render("admin/addPostagem", {categorias: categorias})
    }).catch(()=>{
        req.flash("error_msg", "Erros inesperados")
        res.redirect("/admin")
    })
})

router.post("/postagem/nova", (req,res)=>{
        console.log(req.body.categoria)
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
            res.redirect("/admin/postagem")
        }).catch((err)=>{
           req.flash("error_msg", "Erro ao criar postagem")
           res.redirect("/admin/postagem")
        })
})

router.post("/postagem/deletar", (req, res)=>{
    Postagem.remove({_id: req.body.id}).then(()=>{
        req.flash("success_msg", "Postagem deletada com sucesso")
        res.redirect("/admin/postagem")
    }).catch((er)=>{
        req.flash("error_msg", "Erro ao deletar a postagem")
        res.redirect("/admin/postagem")
    })
})

module.exports = router;
