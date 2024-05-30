const mongoose = require("mongoose")
const {createHmac,randomBytes} = require("node:crypto");
const { generateTokenForThUser } = require("../services/authentication");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,

    },
    role:{
        type:String,
        enum: ['BUYER', 'SELLER'],
        required:true,
    },
    salt:{
        type:String,
    }

},{timestamps:true})

userSchema.pre("save", function(next){
    const user = this;
    const salt = randomBytes(16).toString()

    const hashedPassword = createHmac("sha256",salt)
    .update(user.password)
    .digest("hex")

    this.salt = salt;
    this.password = hashedPassword
    
    next()
})

userSchema.static("matchPasswordAndGenerateToken",async function(email,password){
      const user = await this.findOne({email})

      const salt = user.salt;
      const hashedPassword = user.password;

      const newHahsedPassword = createHmac("sha256",salt)
      .update(password)
      .digest('hex')

      if(newHahsedPassword !== hashedPassword) throw new Error("Wrong email and password")

      const token = generateTokenForThUser(user)

      return token;
})

const User = mongoose.model("user",userSchema)

module.exports = User