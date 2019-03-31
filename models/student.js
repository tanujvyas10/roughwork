var mongoose=require("mongoose");
var StudentSchema=new mongoose.Schema({
    name:String,
    roll:String,
    Father:String,
    Mother:String,
    Course:String,
    BloodG:String,
    Semester:String,
    admission:String,
    receipt:String,
    email:String,
    Percentage:String,
    Contact:String,
   

})
module.exports=mongoose.model("Student",StudentSchema);