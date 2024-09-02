const express = require('express')
const app = express()
const router = express.Router()
const {createProductAPI, fetchProductsAPI, insertMany, fetchProductByIdAPI, updateProductAPI} = require('../controller/Product')


/* => "/products" is already added in base path */
router
    .post('/',createProductAPI)
    .get('/',fetchProductsAPI)
    .get('/:id',fetchProductByIdAPI)
    .post('/insert',insertMany)
    .patch('/:id',updateProductAPI)


module.exports = router
