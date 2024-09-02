const express = require('express')
const { fetchAllCategories, createCategory } = require('../controller/Category')
const app = express()
const router = express.Router()



router
    .get('/',fetchAllCategories)
    .post('/',createCategory)

module.exports = router