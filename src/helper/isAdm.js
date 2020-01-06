module.exports = {
    isAdm: function (req,res,next){
        if(req.isAuthenticated() && req.user.isAdm === 1){
            return next()
        }
        req.flash("error_msg", "Você deve ser adm para entrar aqui >(")
       return res.redirect("/")
    }


}
