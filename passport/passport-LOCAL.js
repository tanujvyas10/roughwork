'use strict'

const passport=require('passport')
const Customer=require("../models/customer")

const LocalStrategy=require("passport-local").Strategy;

passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        done(err,user);//if no error (err==null)then user data return as an object inside user else the error will be return (err)
    })
})

passport.use("local-signup",new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true//it means all the user data will pass to the callback if false that means no data will be pass to the user hence we cannot able to access or manipulate the data if needed to
},(req,email,password,done)=>{//email is the "email" above
    User.findOne({'email':email},(err,user)=>{
        if(err)
        {
           return done(err)
           console.log(err)
        }  
        if(user){
           console.log("user already exist")
               return done(null,false,req.flash("error","User with email already exist"))
         
            }
          
           const Customer=new User();
           newUser.username=req.body.username;
           newUser.password=newUser.encryptPassword(req.body.password);
           newUser.email=req.body.email;
           newUser.save((err)=>{
               done(null,newUser)
               console.log("THE DATA IS :----------",newUser)
           })
    })
}))//making the middleware (Could be local.signup)



passport.use("local-login",new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true//it means all the user data will pass to the callback if false that means no data will be pass to the user hence we cannot able to access or manipulate the data if needed to
},(req,email,password,done)=>{//email is the "email" above
    User.findOne({'email':email},(err,user)=>{
        // console.log("the user detail is :",email)
        if(err)
        {
            console.log(err)
           return done(err)
         
        }  
       const messages=[];
       if(!user|| !user.validUserPassword(password))
       {
           messages.push('email does not exist or password is invalid');
           console.log("Email doesn't exist or password must be invalid")
          return done(null,false,req.flash("error",messages))
       }
     
    })
}))