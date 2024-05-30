const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
     title:{
        type:String,
        required:true,
     },
     author:{
        type:String,
        required:true,
     },
     publishingDate:{
        type:Date,
        required:true,
     },
     price:{
        type:Number,
        required:true,
     },
     sellerId:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'user',
         required:true,
     }

},{timestamps:true})

const Books = mongoose.model("Books",bookSchema)

module.exports = Books