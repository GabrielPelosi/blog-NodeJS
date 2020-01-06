module.exports = {
    isNotAuth: function (req,res,next){
        if(!(req.isAuthenticated())){
            return next()
        }
        req.flash("error_msg", "Você ja está logado!!")
        return res.redirect("/")
    }


}

