const moongose = require("mongoose")
const Schema = moongose.Schema

const Postagem = new Schema({
    autor:{
      type:  Schema.Types.ObjectID,
        ref: "usuario",
        required: true
    },
    titulo:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true
    },
    descricao:{
        type: String,
        required: true
    },
    conteudo:{
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectID,
        ref: "categorias",
        required: true
    },
    data:{
        type: Date,
        default: Date.now()
    }
})

moongose.model("postagens", Postagem)
