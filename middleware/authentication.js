const { verifyTokenForUser } = require("../services/authentication");

function checkForAuthenticateUser(cookie){
    return (req,res,next)=>{
           const token = req.cookies[cookie]

           if(!token){
            return next();
           }

           try{
              const payload = verifyTokenForUser(token);
              if(!payload)throw new Error("There is some error")
                

                req.user = payload;
                return next();
           }
           catch(error){
             console.log("Usr is not a valid ")
             return next();
           }
    }
}

module.exports = {
    checkForAuthenticateUser
}