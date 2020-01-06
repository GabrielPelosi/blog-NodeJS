const moongose = require("mongoose")
const Schema = moongose.Schema

const Usuario = new Schema({
    nome:{
        type:String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    isAdm:{
        type: Number,
        default: 0
    },
    senha:{
        type: String,
        required: true
    },
    createdAt:{
        type:Date,
        default: Date.now()
    }
})


moongose.model("usuario",Usuario , "usuarios")
