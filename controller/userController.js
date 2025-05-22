const router = require("express").Router()

const {register, login, logOut, userDetails} = require("../services/userService")
const authMiddleWare = require("../middleware/authMiddleWare")

router.post("/register",register)
router.post("/login",login)
router.post("/logout", logOut)
router.get('/userDetails', authMiddleWare ,userDetails)

module.exports = router