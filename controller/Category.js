const { Category } = require("../model/Category")


exports.fetchAllCategories = async(req,res) =>{
    try{
        const response = await Category.find({})
        res.status(200).json(response)
    }catch(error) {
        res.status(400).json(error)
    }
} 


exports.createCategory = async(req,res) => {
    try{
        const category = new Category(req.body)
        const response = await category.save()
        res.status(200).json(response)
    }catch(error) {
        res.status(400).json(error)
    }
}