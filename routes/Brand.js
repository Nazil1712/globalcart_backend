const express = require('express')
const app = express()
const router = express.Router()
const {fetchAllBrandsAPI, createBrandAPI} = require('../controller/Brand')


router
    .get('/',fetchAllBrandsAPI)
    .post('/',createBrandAPI)

module.exports = router