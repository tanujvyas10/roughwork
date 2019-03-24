var express= require("express")
var app=express();


// const client = require('socket.io').listen(3000).sockets;

const mailer = require('./misc/mailer');
var secretToken;

var socket =require("socket.io");

var bodyParser=require("body-parser")
var randomstring=require("randomstring")
var methodOverride=require("method-override");
var mongoose=require("mongoose")
var passport=require("passport"),
LocalStrategy =require("passport-local"),
passportLocalMongoose=require("passport-local-mongoose");
app.set("view engine","ejs")
var Contact=require("./models/contactUs")
var Customer=require("./models/customer")


var upload=require("express-fileupload")
var middleware=require("./middleware/index")

app.use(upload())
app.use(methodOverride("_method"));
var User=require("./models/user")
app.use(bodyParser.urlencoded({extend:true}));
app.use(express.static("public"))
var Student=require("./models/student")
//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"this is thess project",
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())
var pass;

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// passport.use(new LocalStrategy(Customer.authenticate()))
// passport.serializeUser(Customer.serializeUser())
// passport.deserializeUser(Customer.deserializeUser())



app.use(function(req,res,next){

    res.locals.currentUser=req.user;
    // res.locals.error=req.flash("error");
    // res.locals.success=req.flash("success")
    next();
})

mongoose.connect("mongodb://localhost/project2_db",function(err,err){
    var chatSchema=mongoose.Schema({
        nick:String,
        ref:String,
        msg:String,
        created:{type:Date,default:Date.now}
    })

app.get("/",function(req,res){
    res.render("welcome")
})

app.get("/welcome",function(req,res){
    res.render("welcome")
})

/*--------USER LOGIN-------- */
app.get("/login",function(req,res){
    res.render("login")
})

/*-------USER LOGIN LOGIC-------- */
app.post("/login",passport.authenticate("local",{
   successRedirect:"/welcome",
   failureRedirect:"/login" 
}),function(req,res){ 
})

/*--------USER SIGNUP-------- */
app.get("/signup",function(req,res){
    res.render("signup")
})

/*--------USER SIGNUP LOGIC-------- */

app.post("/signup",function(req,res){
    console.log(req.body)
    var newUser=new User({username:req.body.username})
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err)
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/welcome")
        })
    })
})


/*--------**********CONTACT ********-------- */

app.get("/contacthome",function(req,res){
    Contact.find({},function(err,Data){
        if(err)
           console.log(err)
     else{
         res.render("contact/contacthome.ejs",{Data:Data})
     }
     }) 
})

app.get("/addcontact",middleware.checkLoggedIn,function(req,res){
        res.render("contact/addcontact.ejs")
})


/*--------CONTACT ADDING LOGIC-------- */
app.post("/addcontact",function(req,res){
console.log(req.body.data)
Contact.create(req.body.data,function(err,newData){
  if(err)
     console.log(err)
     else{
         res.redirect("/contacthome")
     }
})
})

/*--------CONTACT DISPLAY -------- */
 app.get("/contact/:id/edit",middleware.checkLoggedIn,function(req,res){
     console.log(req.params.id)
     Contact.findById(req.params.id,function(err,foundContact){
         if(err){
             console.log(err);
         }
         else{
             res.render("contact/contactEdit",{data:foundContact})
         }
     })
 })


/*--------CONTACT EDIT-------- */
 app.put("/contact/:id/edit",function(req,res){
     Contact.findByIdAndUpdate(req.params.id,req.body.data,function(err,updateData){
        if(err){
            console.log(err)
        } 
        else{
            res.redirect("/contacthome")
        }
     })
 })

/*--------CONTACT DELETE-------- */
 app.delete("/contact/:id/delete",function(req,res){
     Contact.findByIdAndRemove(req.params.id,function(err){
        if(err)
          console.log(err)
        else{
            res.redirect("/contacthome")
        }
        
        })
 })

 /*  ----------*****ABOUT US**------ */
app.get("/aboutUs",function(req,res){
    res.render("about/aboutUs")
})

 /*  ----------*****STUDENT**------ */
 app.get("/student",middleware.checkLoggedIn,function(req,res){
     Student.find({},function(err,data){
         if(err)
         {
             console.log(err)
         }
         else{
             res.render("student/studenthome",{data:data})
         }
     })
   
 })

//  app.get("/student/addstudent",function(req,res){
//     res.render("student/addstudent")
// })
app.get("/student/addstudent",middleware.checkLoggedIn,function(req,res){
    res.sendFile(__dirname+"/addstudent.html")
})

app.post("/student/addstudent",function(req,res){
  if(req.files){
    console.log(req.body)
    console.log(req.files)
    var file=req.files.receipt,filename=file.name;
    file.mv("./upload/"+filename,function(err){
        if(err)
        {
            console.log(err)
            res.send(err)
        }
       
    })
  }

  var name=req.body.name;
     var admission=req.body.admission
  var roll=req.body.roll
  var email=req.body.email
 var receipt=req.files.receipt.name;

 //creating the secretToken
//  var secretToken = randomstring.generate();
//  console.log('secretToken', secretToken);


   var obj={name:name,roll:roll,admission:admission,email:email,receipt:receipt}
  console.log(obj)
  
  Student.create(obj,function(err,studentData){
      if(err){
          console.log(err)
      }
      else{
          console.log("data is created-----------------");
          console.log(studentData)
          res.redirect("/student")
      }

  })

  
  
})


/*  ++++++++++++****student data delete****+++++++++++ */
app.get("/student/:id/delete",function(req,res){
    Student.findByIdAndRemove(req.params.id,function(err){
       if(err)
         console.log(err)
       else{
           res.redirect("/student")
       }
       
       })
})
/* ----------***STUDENT COMPLETE DETAIL***---------*/

app.get("/student/:id/detail",function(req,res){
    Student.findById(req.params.id,function(err,foundDetail)
    {
        if(err)
        {
            res.redirect(err); 
        }
        else{
         
              res.render("student/studentpage",{data:foundDetail}); 
         }
        console.log(foundDetail)
    })

    
})


app.get("/student/:id/edit",middleware.checkLoggedIn,function(req,res){
    Student.findById(req.params.id,function(err,foundData){
        if(err){
            console.log(err)
        }
        else{
            console.log(foundData)
            res.render("student/studentEdit",{data:foundData})
        }
    })
   
})

// app.post("/student/:id/fee_receipt",function(req,res){
//    Student.findById(req.params.id,function(err,foundData){
//        if(err)
//        {console.log("ERROR----------")
//          console.log(err)
//    }else{
//             res.sendFile("C:/xampp/htdocs/jsexercise/roughwork/fee_receipt.html",{data:foundData})

//         } 
//    })

// })


app.get("/download/:id",function(req,res){

    Student.findById(req.params.id,function(err,foundData)
    {
        if(err)
        {
            console.log(err)
            res.redirect("/student/addstudent")
        }
        else{
             res.download(__dirname+'/upload/'+foundData.receipt,foundData.receipt);
console.log(foundData.receipt)

        }
    })
   })

   app.get("/logout",function(req,res){
    req.logout();
  
    res.redirect("/")
})




/* -----------STUDENT PERSONAL DETAIL VIA 2FA----------*/

app.get("/student_personal_detail",function(req,res){
    res.render("student_personal");
})

app.post("/student_personal_detail",function(req,res){
   console.log(req.body);
   Student.findOne({"email":req.body.user_email},async function(err,data){
   if(err)
   {
       console.log(err)
   }
   else{
       try{
    console.log("your personal data is:=======",data)
 //  var secretToken = randomstring.generate();
  secretToken=randomstring.generate(5);
  console.log(secretToken)

      // Compose email
      const html = `Hi there,
      <br/>
      Thank you for registering!
      <br/><br/>
      Please verify your email by typing the following token:
      <br/>
      Token: <b>${secretToken}</b>
      <br/>
      On the following page:
      <a href="http://localhost:3000/${data._id}/verify">verify your email</a>
      <br/><br/>
      Have a pleasant day.` 

      // Send email
       await mailer.sendEmail('aflatoon@gmail.com',data.email , 'Please verify your email!', html);

       console.log("email has send to:",data.email)
   }catch(error){
    console.log(error)
}
}
})


})

app.get("/:id/verify",function(req,res){
    Student.findById(req.params.id,function(err,foundData){
   if(err)
   {
       console.log(err)

   }else{
    res.render("verif_email",{data:foundData});
   }
    })
})


app.post("/:id/verify",function(req,res){
    Student.findById(req.params.id,function(err,foundData){
        if(err)
        {
            console.log(err)
     
        }else{
            if(secretToken==req.body.secret)
            {
       console.log(foundData.secretToken);
       console.log(req.body.secret)
       res.render("student_detail",{data:foundData});
        }
    }
         })
    
})


// *****+++++++customer care chat system registration+++++++*********


app.get("/customer_care",function(req,res){
    res.render("customerCareRegister");
})



/*********++++customer care chatpage login++++************ */


app.get("/customer_care_login",function(req,res){
    res.render("customerCareLogin")
})
var bcrypt=require("bcrypt-nodejs")

app.post("/customer_care_login",function(req,res){
    Customer.findOne({email:req.body.email},function(err,user){
        if(err)
        {
            
            console.log(err)
        }else{
           
         if(bcrypt.compareSync(req.body.password,user.password)){
            console.log("user data",user) 
           res.render("chattingPage",{data:user.username})
    //  res.sendFile(__dirname+"/chattingPage.html")
         }else{
             console.log("password is incorrect")
         }

         
        }
    
     })
  })
app.post("/customer_care_register",function(req,res){
   

   

    var customer=new Customer()
       var username=req.body.username;
       var password=customer.encryptPassword(req.body.password)
       var email=req.body.email
    
       var obj={username:username,password:password,email:email}
       console.log(obj)
    
       Customer.create(obj,async function(err,savedData){
           if(err)
              console.log(err)
           else{
               try{
                console.log("the saved data is:",savedData)
                
    const html = `Hi there ${req.body.username},
    <br/>
    Thank you for registering!
    <br/><br/>
    Please verify your email by typing the following token:
    <br/>
 
    <br/>

    <a href="http://localhost:3000/${savedData._id}/customer_care_chatPage">click here to visit our customer care executive</a>
    <br/><br/>
   
    Have a pleasant day.` 

    // Send email
     await mailer.sendEmail('aflatoon@gmail.com',req.body.email , 'Please verify your email!', html);

     console.log("email has send to:",req.body.email)

    }catch(error){
  console.log(error)
  }
         }   
       })


 

})


/*****VISITING THE CUSTOMER CARE CHAT PAGE********* */
app.get("/:id/customer_care_chatPage",function(req,res){
console.log(req.params.id)
Customer.findById(req.params.id,function(err,data){
    if(err)
      console.log(err)
     else{
      
         console.log("customer passed")
         res.render("chattingPage",{data:data.username})
     } 
})

})


app.get("/chatPage",function(req,res){
    res.render("chattingPage")
})

/*********++++chat box from customer side+++++******* */

app.get("/:id/:name/customer-chatbox",function(req,res){
    Chat.findOne({nick:req.params.name},function(err,Cdata){
        console.log("------/:id/:name/customer-chatbox-------",Cdata)
if(Cdata==null)
{
    pass=Cdata
    console.log("NULLLL")
}
else{
    pass=Cdata.ref
}
//         pass=Cdata.ref;
// if(pass==null){
//     console.log("TRUEEEEE")
// }    
  })
    res.render("chattingPage",{data:"CustomerCare"})
})


app.get("/admin/customer",function(req,res){
    Customer.find({},function(err,data){
        if(err)
           console.log(err)
        else{
            res.render("chatting-customer-list",{list:data});
        }
    })
})


// var server=app.listen(3000,function(){
//     console.log("Server connected")
// })


var server=require("http").createServer(app)
var io=require("socket.io").listen(server)


server.listen(3000,function(){
    console.log("server is start..")
})

var users={};



app.get("/chatt",function(req,res){
    res.sendFile(__dirname+"/chattingPage.html")
})


mongoose.connect("mongodb://localhost/chat-history",function(err){

if(err)
{
    console.log(err)
}else{
    console.log('connected to chat db...')
}
})





var Ref=randomstring.generate(10);

var Chat=mongoose.model('Messages',chatSchema)//creatiom of collection


io.sockets.on("connection",function(socket){
 console.log("passssss",pass)
    // if(pass==null)
    // {
    //     var query= Chat.find({});
    //     query.sort('-created').limit(100).exec(function(err,docs){
    //          if(err) throw err;
    //          console.log("all previous chats are::-----",docs)
    //    console.log("sending old ,msg")
    //          socket.emit("load old msgs",docs);
    //      })
    // }
    if(pass!=null){
        console.log("inside console.log loading old msg++++++++",pass)
        var query= Chat.find({ref:pass});
       query.sort('-created').limit(100).exec(function(err,docs){
            if(err) throw err;
            console.log("all previous chats are::-----",docs)
      console.log("sending old ,msg")
            socket.emit("load old msgs",docs);
        })
    }

    socket.on("new user",function(data,callback){
        if(data in users){
            callback(false)
        }else{
            callback(true);
            socket.nickname=data;
            users[socket.nickname]=socket;
            updateNickname();
        }
    })

    function updateNickname(){
        io.sockets.emit("username",Object.keys(users));
    }

    socket.on("send message",function(data,callback){
      
        var msg=data.trim();
        if(msg.substr(0,3)==='/w '){
            msg=msg.substr(3)
          var ind=msg.indexOf(' ');
           if(ind!==-1){
          var name=msg.substring(0,ind)
          var msg=msg.substring(ind+1)
          if(name in users)
          {   users[name].emit("whisper",{msg:msg,nick:socket.nickname})
            console.log("whisper");
          }else{
   callback("error enter a valid user")
          }
      }else{
    callback("error pls enter the msg for your whisperer")
      }
        }else{
            
            var newMsg=new Chat({msg:msg,nick:socket.nickname,ref:Ref})
            newMsg.save(function(err){
                if(err) throw err;
                io.sockets.emit("new message",{msg:msg,nick:socket.nickname})
            })   
        }
       
    })

    socket.on("disconnect",function(req,res){
        if(!socket.nickname) return;
        delete users[socket.nickname];
        updateNickname();
    })
})






});