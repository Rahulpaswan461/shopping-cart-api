const User  = require("../models/user")
const Books = require("../models/books")



async function hanldeSignupUser(req,res){
  try{

        const body = req.body;
        console.log("user request",body)
        if(!body.name || !body.email || !body.password || !body.role){
            return res.status(403).json({msg:"Fields are required"})
        }
        const result =  await User.create({
            name:body.name,
            email:body.email,
            password:body.password,
            role:body.role,
        })
        console.log(result)
        return res.status(200).json({msg:"Data inserted successfully !"})

   }
    catch(error){
        console.log("Error while signup process",error)
        return res.status(500).json({message:"Internal server errror"})
    }
}

async function hanldeSigninUser(req,res){
   try{
       const {email,password } = req.body;

       if(!email || !password){
        return res.status(401).json({message:"Fields are required"})
       }
       const token = await User.matchPasswordAndGenerateToken(email,password)
       if(!token){
        return res.status(401).json({message:"User is not authorized"})
       }

       return res.cookie("token",token).json({message:"User is a valid"})

   }
   catch(error){
     console.log(error)
     return res.status(500).json({message:"Internal server error"})
   }
}

async function getTheuserWithCorrespondId(req,res){
    try{
       const id = req.params.id;
       const user = await User.findById(id)

       if(!user){
         return res.status(403).json({msg:"No user found with the provided id"})
       }
       return res.status(200).json({message:user})

    }
    catch(error){
        console.log("There is some error",error)
        return res.status(500).json({msg:"Internal server error"})
    }
}



module.exports = {
    hanldeSignupUser,
    hanldeSigninUser,
    getTheuserWithCorrespondId,
}