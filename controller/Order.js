const {Order} = require("../model/Order")

exports.fetchOrderByUserAPI = async(req,res) =>{
    const {user} = req.query;

    console.log("user",user)
    console.log("fetchOrders",req.query)
    try{
        const orderItems = await Order.find({user:user})
        console.log(orderItems)
        res.status(200).json(orderItems)
    }catch(error) {
        res.status(400).json(error)
    }
} 

// exports.fetchUserOrdersAPI = async(req,res) =>{
//     const {user} = req.query;


//     try{
//         const orderItems = await Order.find({user:user})
//         res.status(200).json(orderItems)
//     }catch(error) {
//         res.status(400).json(error)
//     }
// }

exports.createOrderAPI = async(req,res) => {
    try{
        const order = new Order(req.body)
        const response = await order.save()
        res.status(200).json(response)
    }catch(error) {
        res.status(400).json(error)
    }
}

exports.deleteOrderAPI = async(req,res) => {
    const {id} = req.params;

    try{
        const response = await Order.findByIdAndDelete(id)
        res.status(200).json(response)
    }catch(error) {
        res.status(400).json(error)
    }
}

exports.updateOrderAPI = async(req,res) => {
    const {id} = req.params;
    console.log(req.body)

    try{
        const response = await Order.findOneAndUpdate({_id:id},req.body,{new:true})
        res.status(200).json(response)
    }catch(error) {
        res.status(400).json(error)
    }
}