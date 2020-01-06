
const jwt = require('jsonwebtoken')
const authConfig = require("./authConfig")

module.exports = (req, res, next) => {

    const authHeader = req.headers.authorization
    if(! authHeader){
        req.flash("error_msg", "Sessao expirada")
        return res.redirect("/")
    }

    const parts = authHeader.split(' ')

    if(!parts.length === 2) {
        req.flash("error_msg", "Sessao expirada")
        return res.redirect("/")
    }
    const [ scheme, token] = parts

    if(!/^Bearer$/) {
        req.flash("error_msg", "Sessao expirada")
        return res.redirect("/")
    }
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
            req.flash("error_msg", "Sessao expirada")
            return res.redirect("/")
        }
        req.userId = decoded.id
        return next()
    })
}


//validation adn generetion token
/*
    try{
        const email = req.body.email
        const senha = req.body.senha
        const user = await Usuario.findOne({email})

        if(!user) {
            req.flash("error_msg", "credenciais invalidas")
            res.redirect("/usuario/login")
        }

        if(!await bcrypt.compare(senha, user.senha)){
            req.flash("error_msg", "credenciais invalidas")
            res.redirect("/usuario/login")
        }
        const token = await generateToken({id: user.id})

        req.flash("success_msg", "Login efetuado com sucesso")
        res.redirect("/")

    }catch (e) {
        req.flash("error_msg", "erros inesperados, por favor tente novamente")
        res.redirect("/usuario/login")
    }
*/
