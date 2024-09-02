const { Brand } = require("../model/Brand")

exports.fetchAllBrands = async(req,res) =>{
    try{
        const response = await Brand.find({})
        res.status(200).json(response)
    }catch(error) {
        res.status(400).json(error)
    }
} 


exports.createBrand = async(req,res) => {
    try{
        const brand = new Brand(req.body)
        const response = await brand.save()
        res.status(200).json(response)
    }catch(error) {
        res.status(400).json(error)
    }
}
