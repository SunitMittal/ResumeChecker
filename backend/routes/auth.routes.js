const express = require('express')
const router = express.Router()

const {registerUserController, loginUserController, logoutUserController, getMeController} = require("../controllers/auth.controller")
const {authUser} = require("../middlewares/auth.middleware")


router.post("/register", registerUserController)

router.post("/login", loginUserController)

router.get("/logout", logoutUserController)

router.get("/get-me", authUser, getMeController)


module.exports = router