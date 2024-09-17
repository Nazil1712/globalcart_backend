const express = require('express')
const { fetchAllCategoriesAPI, createCategoryAPI } = require('../controller/Category')
const app = express()
const router = express.Router()



router
    .get('/',fetchAllCategoriesAPI)
    .post('/',createCategoryAPI)

module.exports = router