const express = require("express")
const {addBooks,getAllBookCreatedBySeller,updateBookById,deleteBookInformationById,getAllBooksInformation} =require("../controllers/books")
const router = express()
const multer = require("multer")

const storage = multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,'./uploads/')
    },
    filename:function(req,file,cb){
      cb(null,'./uploads/csv_datas')
    }
})

const upload = multer({storage})


router.post('/',upload.single("file"),addBooks)
router.get('/:id',getAllBookCreatedBySeller);
router.patch('/:id',updateBookById)
router.delete('/:id',deleteBookInformationById)
router.get("/",getAllBooksInformation)

module.exports = router