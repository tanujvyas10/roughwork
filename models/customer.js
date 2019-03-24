var mongoose=require("mongoose")
var bcrypt=require("bcrypt-nodejs")
var passportLocalMongoose=require("passport-local-mongoose")
var CustomerSchema=new mongoose.Schema({
  username:String,
  email:String,
  password:String
})




CustomerSchema.methods.encryptPassword=(password)=>{
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10))
}

CustomerSchema.methods.validUserPassword=(password)=>{
    return bcrypt.compareSync(password,this.password);//comparing the passwords enter by the logging user and the password saved in the database
}

CustomerSchema.plugin(passportLocalMongoose);


module.exports=mongoose.model("Customer",CustomerSchema)

