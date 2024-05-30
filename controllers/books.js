const Books = require("../models/books")
const User = require('../models/user')

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

       const bookData = req.body;
       if(!bookData){
        return res.status(404).json({message:"Fields are required "})
       }
      const result =  await Books.create({
           title:bookData.title,
           author:bookData.author,
           publishingData:bookData.publishingData,
           price:bookData.price,
           sellerId:req.user.id,
       })
       console.log("requested user",result)

       return res.status(200).json({msg:"Book uploaded successfully !!"})
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
module.exports = {
    addBooks,
    getAllBookCreatedBySeller,
    updateBookById,
    deleteBookInformationById,
    getAllBooksInformation
}