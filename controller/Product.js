const { Product } = require("../model/Product")

exports.createProductAPI = async(req,res)=>{
    try{
        const product = new Product(req.body)
        const response = await product.save()
        res.status(201).json(response)
    }catch(error) {
        res.status(400).json(error)
    }
}

// fetchAllProductsAPI + fetchProductsByFIlterAPI = fetchProductsAPI
exports.fetchProductsAPI = async (req,res) =>{
    let query = Product.find({})

    if(req.query.category) {
        query = query.find({category : req.query.category})
    }

    if(req.query.brand) {
        query = query.find({brand : req.query.brand})
    }

    if(req.query._sort && req.query._order) {
        query = query.sort({[req.query._sort]:req.query._order=='asc'? 1:-1})
    }

    let totalDocs;
    try{
        totalDocs = await query.clone().countDocuments() // Use .clone() to avoid modifying the original query
        console.log(totalDocs)
    }catch(error) {
        res.status(400).json(error)
    }
    

    if(req.query._page && req.query._limit) {
        const pageSize = req.query._limit;
        const page = req.query._page;
        query = query.skip(pageSize * (page-1)).limit(pageSize)
    }

    try{
        const response = await query.exec()
        res.set('X-Total-Count',totalDocs)
        res.status(200).json(response)
    }catch(error) {
        res.status(400).json(error)
    }
}

exports.fetchProductByIdAPI = async(req,res) =>{
    const params_id = req.params.id;
    try{
        const response = await Product.findOne({_id : params_id})
        res.status(200).json(response)
    }catch(error) {
        res.status(400).json(error)
    }
}

exports.insertManyAPI = async(req,res) =>{
    try{
        const response = await Product.insertManyAPI(req.body,{ordered:false, rawResult:true})
        res.status(200).json(response)
    }catch(error) {
        res.status(400).json(error)
    }
}

exports.updateProductAPI = async(req,res)=>{
    const params_id = req.params.id;

    try{
        const response = await Product.findOneAndUpdate({_id:params_id},req.body,{returnDocument:'after'})
        res.status(201).json(response)
    }catch(error) {
        res.status(400).json(error)
    }
}