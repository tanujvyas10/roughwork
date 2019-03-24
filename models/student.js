var mongoose=require("mongoose");
var StudentSchema=new mongoose.Schema({
    name:String,
    roll:String,
    admission:String,
    receipt:String,
    email:String,
    secretToken:String

})
module.exports=mongoose.model("Student",StudentSchema);