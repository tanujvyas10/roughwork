var middleware={};


middleware.checkLoggedIn=function(req,res,next){
if(req.isAuthenticated()){
    return next();//here next is any function or decision
}
// req.flash("error","Please login first")
 res.redirect("/")
}

module.exports=middleware;