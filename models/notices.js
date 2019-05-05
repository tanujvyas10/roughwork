var mongoose = require("mongoose");
var NoticeSchema=new mongoose.Schema({
    Notice:String,
    description:String,
    created:{type:Date,default:Date.now}
})

module.exports=mongoose.model("Notices",NoticeSchema)