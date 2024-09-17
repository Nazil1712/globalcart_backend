const express = require('express')
const { checkUserAPI } = require('../controller/Auth')
const { updateUserAPI } = require('../controller/User')
const app = express()
const router = express.Router()


router
    .get('/:id',checkUserAPI)
    .put('/:id',updateUserAPI)

module.exports = router