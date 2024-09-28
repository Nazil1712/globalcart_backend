const { User } = require("../model/User")

exports.updateUserAPI = async(req,res) =>{
    const {id} = req.params;

    try{
        const response = await User.findOneAndUpdate({_id:id},req.body,{new:true})
        res.status(200).json(response)
    }catch(error) {
        res.status(400).json(error)
    }
}


exports.fetchLoggedInUser = async(req,res) =>{
    const {id} = req.user;

    try{
        const user = await User.findById(id);
        res.status(200).json({email:user.email, role:user.role, addresses:user.addresses, id:user.id})
    }catch(error) {
        res.status(400).json(error)
    }
}