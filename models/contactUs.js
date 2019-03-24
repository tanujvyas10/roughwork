
var mongoose=require("mongoose");
var ContactSchema=new mongoose.Schema({
   contactNo:String,
   email:String
})

var blog=mongoose.model("Contact",ContactSchema);
module.exports=blog;