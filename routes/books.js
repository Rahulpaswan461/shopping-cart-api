const express = require("express")
const {addBooks,getAllBookCreatedBySeller,updateBookById,deleteBookInformationById,getAllBooksInformation} =require("../controllers/books")
const router = express()

router.post('/',addBooks)
router.get('/:id',getAllBookCreatedBySeller);
router.patch('/:id',updateBookById)
router.delete('/:id',deleteBookInformationById)
router.get("/",getAllBooksInformation)

module.exports = router