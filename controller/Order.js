const {Order} = require("../model/Order")

exports.fetchOrderByUserAPI = async(req,res) =>{
    
    const {id} = req.user
    console.log("OrderByUser",id)

    try{
        const orderItems = await Order.find({user:id})
        console.log("OrderItems",orderItems)
        res.status(200).json(orderItems)
    }catch(error) {
        res.status(400).json(error)
    }
} 

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

    try{
        const response = await Order.findOneAndUpdate({_id:id},req.body,{new:true})
        res.status(200).json(response)
    }catch(error) {
        res.status(400).json(error)
    }
}


// Admin order panel
exports.fetchAllOrdersAPI = async(req,res) =>{
    let query = Order.find()

    if(req.query._sort && req.query._order) {
        query = query.sort({[req.query._sort]:req.query._order=='asc'? 1:-1})
    }

    let totalDocs;
    try{
        totalDocs = await query.clone().countDocuments() // Use .clone() to avoid modifying the original query
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