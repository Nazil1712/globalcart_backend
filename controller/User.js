const { User } = require("../model/User")

exports.updateUserAPI = async(req,res) =>{
    const {id} = req.params;
    console.log(req.body)

    try{
        const response = await User.findOneAndUpdate({_id:id},req.body,{new:true})
        res.status(200).json(response)
    }catch(error) {
        res.status(400).json(error)
    }
}