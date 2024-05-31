const Books = require("../models/books")
const User = require('../models/user')
const fs = require("node:fs")
const path = require("node:path")
const csvParser = require('csv-parser');


function authenticateUser(user){
     if(user.role === "SELLER"){
        return true;
     }
     return false;
}

async function addBooks(req,res){
    try{
        if(!authenticateUser(req.user)){
            return res.status(403).json({msg:"Not authorized to upload",id:req.user})
        }
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

       const bookData = []
       const sellerId = req.user._id;

       fs.createReadStream(path.resolve(req.file.path))
       .pipe(csvParser())
       .on("data",(row)=>{
          const {title,author,publishedDate,price} = row
          bookData.push({
            title,
            author,
            publishedDate: new Date(publishedDate),
            price: parseFloat(price),
            sellerId
          })

       })
       .on("end",async ()=>{
          try{
           await Books.insertMany(bookData)
           return res.status(200).json({message:"Message uploaded successfully !!"})
          }
          catch(error){
            res.status(400).json({ error: 'Error uploading books' });
          }
          finally{
            fs.unlinkSync(req.file.path); // Clean up the uploaded file
          }
       })
    }
    catch(error){ 
       console.log("There is some error")
       return res.status(500).json({msg:error})
    }
}

async function getAllBookCreatedBySeller(req,res){
    try{
         const id = req.params.id;

         if(!id){
            return res.status(404).json({message:"No Id is provided!! "})
         }
         const user = await Books.find({sellerId:id})
         console.log(user)
         return res.status(200).json({msg:user})
    }
    catch(error){
        console.log("There is some error",error)
        return res.status(500).json({mgs:error})
    }
}

async function updateBookById(req,res){
     try{
          const id = req.params.id;
           const {title,author} = req.body;

           if(!title || !author){
            return res.status(404).json({msg:"Information incomplete"})
           }

          if(!id){
            return res.stutus(404).json({message:"Information incomplete"})
          }
          
          if(!authenticateUser(req.user)){
            console.log("Not authorized!!")
            return res.status(403).json({message:"User is not authorized to updated !!"})
          }

          const bookData = await Books.findById(id);
         
           //using toString because it is returing an object value
          if (bookData.sellerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "User is not authorized to update!!", user: req.user });
          }

          const updatedBook = await Books.findByIdAndUpdate(id,{
            title:title,
            author:author
          })
          console.log(updatedBook)

          return res.status(200).json({msg:"Books updated successfully",book:updatedBook})
     }
     catch(error){
        console.log("There is some error",error)
        return res.status(500).json({message:error})
     }
}

async function deleteBookInformationById(req,res){
     try{
        const id = req.params.id;

       if(!id){
         return res.stutus(404).json({message:"Information incomplete"})
       }
       
       if(!authenticateUser(req.user)){
         console.log("Not authorized!!")
         return res.status(403).json({message:"User is not authorized to updated !!"})
       }

       const bookData = await Books.findById(id);
      
        //using toString because it is returing an object value
       if (bookData.sellerId.toString() !== req.user.id) {
         return res.status(403).json({ message: "User is not authorized to update!!", user: req.user });
       }

       const updatedBook = await Books.findByIdAndDelete(id)
       console.log(updatedBook)

       return res.status(200).json({msg:"Books Deleted  successfully"})
     }
     catch(error){
        console.log("There is some error")
        return res.status(500).json({msg:error})
     }
}


async function getAllBooksInformation(req,res){
    try{
        if(!authenticateUser(req.user)){
           const booksInformation = await Books.find({});

           if(!booksInformation || booksInformation.length===0){
            return res.status(404).json({msg:"No Data is available"})
           }
           return res.status(200).json(booksInformation)
        }
        else{
           const id = req.user.id;
           console.log("Requested user id",id)

           const booksInformation2 = await Books.find({sellerId:id})
           
           if(!booksInformation2 || booksInformation2.length === 0){
            return res.status(404).json({msg:"No Data is available",user:req.user})
           }
           return res.status(200).json(booksInformation2)
        }
    }
    catch(error){
      console.log("There is some error",error)
      return res.status(500).json({msg:"Internal Server error",error})
    }
}


async function addBooksTwo(req,res){
   try{
      if(!authenticateUser(req.user)){
        return res.status(403).json({msg:"Not Authorized to upload"})
      }
      
      if(!res.file){
        return res.status(400).json({msg:"NO file uploaded"})
      }
      const bookData = []
      const sellerId = req.user._id;

      fs.createReadStream(path.resolve(req.file.path))
      .pipe(csvParser())
      .on("data",(row)=>{
        const {title,author,publishDate,price } = row;

        bookData.push({
           title,
           author,
           publishDate:new Date(publishDate),
           price:parseFloat(price)
        })
      })
      .on("end",async ()=>{
         try{
             await Books.insertMany(bookData)
             return res.status(20).json({msg:"Data uploaded successfully !!"})
         }
         catch(error){
          console.log("Errro while uploading the information ")
           return res.status(500).json({msg:"Internal Sever Error",error})
         }
         finally{
          fs.unlinkSync(req.file.path)
         }
      })
   }
    catch(error){
         console.log("There is some error")
         return res.status(500).json({msg:"Internal Server error"})
    }
}

module.exports = {
    addBooks,
    getAllBookCreatedBySeller,
    updateBookById,
    deleteBookInformationById,
    getAllBooksInformation
}