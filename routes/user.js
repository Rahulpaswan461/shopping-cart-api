const express = require("express")
const {hanldeSignupUser,hanldeSigninUser,getTheuserWithCorrespondId} = require("../controllers/user")
const router = express.Router()

router.post("/signup",hanldeSignupUser)
router.post("/signin",hanldeSigninUser)
router.get('/:id',getTheuserWithCorrespondId)
// router.get('/books',getAllBooks);

module.exports = router