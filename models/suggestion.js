var mongoose=require("mongoose");
var SuggestionSchema=new mongoose.Schema({
    submitter:{type:String,default:" "},
    suggestion:{type:String,default:" "}
})

module.exports=mongoose.model("Suggestion",SuggestionSchema);