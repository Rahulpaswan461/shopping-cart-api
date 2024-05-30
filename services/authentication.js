const JWT = require("jsonwebtoken")
const secret = "rahul@1234"

function generateTokenForThUser(user){
    const payload={
        id:user.id,
        name:user.name,
        email:user.name,
        role:user.role
    }
    const token = JWT.sign(payload,secret)
    console.log("Generated token value is",token)


    return token;
}

function verifyTokenForUser(token){
    return JWT.verify(token,secret)
}

module.exports= {
     generateTokenForThUser,
     verifyTokenForUser
}