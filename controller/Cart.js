const {Cart} = require("../model/Cart")

exports.fetchCartByUserAPI = async(req,res) =>{
    const {id} = req.user;

    try{
        const cartItems = await Cart.find({user:id}).populate('user').populate('product')
        res.status(200).json(cartItems)
    }catch(error) {
        res.status(400).json(error)
    }
} 

exports.addToCartAPI = async(req,res) => {
    const {id} = req.user

    try{
        const cart = new Cart({...req.body, user:id})
        const result = await cart.populate('product')
        const response = await cart.save()
        res.status(200).json(result)
    }catch(error) {
        res.status(400).json(error)
    }
}

exports.deleteFromCartAPI = async(req,res) => {
    const {id} = req.params;

    try{
        const response = await Cart.findByIdAndDelete(id)
        res.status(200).json(response)
    }catch(error) {
        res.status(400).json(error)
    }
}

exports.updateCartAPI = async(req,res) => {
    const {id} = req.params;

    try{
        const doc = await Cart.findOneAndUpdate({_id:id},req.body,{new:true})
        const response = await doc.populate('product')
        res.status(200).json(response)
    }catch(error) {
        res.status(400).json(error)
    }
}