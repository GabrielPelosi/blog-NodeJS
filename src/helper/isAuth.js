module.exports = {
    isAuth: function (req,res,next){
        if(req.isAuthenticated()){
            return next()
        }
        req.flash("error_msg", "Você precisa de uma conta para acessar aqui :(")
        return res.redirect("/")
    }


}
