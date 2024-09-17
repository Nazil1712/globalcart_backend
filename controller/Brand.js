const { Brand } = require("../model/Brand")

exports.fetchAllBrandsAPI = async(req,res) =>{
    try{
        const response = await Brand.find({})
        res.status(200).json(response)
    }catch(error) {
        res.status(400).json(error)
    }
} 


exports.createBrandAPI = async(req,res) => {
    try{
        const brand = new Brand(req.body)
        const response = await brand.save()
        res.status(200).json(response)
    }catch(error) {
        res.status(400).json(error)
    }
}
