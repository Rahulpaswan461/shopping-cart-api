const mongoose = require("mongoose")

function connectMongoDB(filePath){
    return mongoose.connect(filePath)
}

module.exports = {
    connectMongoDB
}