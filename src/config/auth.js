const localStratefy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")


//Model usuario
require("../models/usuario")
const Usuario = mongoose.model("usuario")

module.exports = function (passport) {
    passport.use(new localStratefy({usernameField: "email", passwordField: "senha"}, (email, senha, done)=>{
        Usuario.findOne({email: email}).then((user)=>{
            if (!user){
                return done(null, false, {error: "Usuario não existe"})
            }

            bcrypt.compare(senha, user.senha, (erro, batem)=>{
                if (batem){
                    return done(null, user)
                }else{
                    return done(null, false, {error: "senha incorreta"} )
                }
            })
        })
    }))


    passport.serializeUser((user,done)=>{
        done(null,user.id)
    })

    passport.deserializeUser((id, done)=>{
        Usuario.findById(id, (err, user)=>{
            done(err, user)
        })
    })
}



