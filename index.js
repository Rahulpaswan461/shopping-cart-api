const express = require("express")
const {connectMongoDB} = require("./connection")
const userRoute = require("./routes/user")
const cookieParser = require("cookie-parser")
const {checkForAuthenticateUser} = require("./middleware/authentication")
const bookRoute = require("./routes/books")

connectMongoDB('mongodb://127.0.0.1:27017/shopping')
.then(()=>console.log("MongoDB is connected"))
.catch((error)=>console.log("Ther is some error while connecting"))

const app = express()
const PORT  = process.env.PORT || 8000;

app.use(express.urlencoded({extended:false}))

app.get("/",(req,res)=>{
    return res.send("from the server")
})
app.use(cookieParser())
app.use(checkForAuthenticateUser("token"))

app.use('/user',userRoute)
app.use('/api/books',bookRoute)

app.listen(PORT,()=>{
    console.log("Server is running at 8000")
})