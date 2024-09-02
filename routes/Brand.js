const express = require('express')
const app = express()
const router = express.Router()
const {fetchAllBrands, createBrand} = require('../controller/Brand')


router
    .get('/',fetchAllBrands)
    .post('/',createBrand)

module.exports = router