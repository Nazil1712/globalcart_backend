const express = require('express')
const app = express()
const router = express.Router()
const {createProductAPI, fetchProductsAPI, insertManyAPI, fetchProductByIdAPI, updateProductAPI} = require('../controller/Product')


/* => "/products" is already added in base path */
router
    .post('/',createProductAPI)
    .get('/',fetchProductsAPI)
    .get('/:id',fetchProductByIdAPI)
    .post('/insert',insertManyAPI)
    .patch('/:id',updateProductAPI)


module.exports = router
