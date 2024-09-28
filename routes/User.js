const express = require('express')
const { updateUserAPI, fetchLoggedInUser } = require('../controller/User')
const app = express()
const router = express.Router()


router
    .get('/own', fetchLoggedInUser)
    .put('/:id',updateUserAPI)

module.exports = router