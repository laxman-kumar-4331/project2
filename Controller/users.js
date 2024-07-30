const User = require("../models/users.js");

module.exports.pageSign= (req,res) =>{
    res.render("user/signup.ejs");
}

module.exports.signUp=async (req,res,next) =>{
    try{
     let {username,email,password}= req.body;
     let newUser = new User({username,email});
     let registeredUser = await User.register(newUser,password);
     console.log(registeredUser);
     req.login(registeredUser,(err)=>{
         if(err){
             return next(err);
         }
         req.flash("success","Logged in to Wanderlust");
         return res.redirect("/listings");
     })
     
     }  catch(err){
         req.flash("error",err.message);
     }
     
 }

 module.exports.pageLogin=(req,res) =>{
    res.render("user/login.ejs");
}

module.exports.Login=async (req,res) =>{
    req.flash("success",`Welcome to WanderLust!`);
    let redirectUrl=res.locals.redirectUrl|| "/listings";
    res.redirect(redirectUrl);
}

module.exports.pageLogout=(req,res,next) =>{
    req.logout((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out");
        res.redirect("/listings");
        })
}