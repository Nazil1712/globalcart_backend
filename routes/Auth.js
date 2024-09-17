const express = require('express')
const { createUserAPI } = require('../controller/Auth')
const { checkUserAPI } = require('../controller/Auth')
const app = express()
const router = express.Router()


router
    .post('/signup',createUserAPI)
    .post('/login',checkUserAPI)

module.exports = router