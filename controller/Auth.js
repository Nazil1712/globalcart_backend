const { User } = require("../model/User")

exports.createUserAPI = async(req,res) => {
    try{
        const user = new User(req.body)
        const response = await user.save()
        res.status(200).json(response)
    }catch(error) {
        res.status(400).json(error)
    }
}

exports.checkUserAPI = async(req,res) =>{
    const params_id = req.params_id;

    try{
        const user = await User.findOne({email : req.body.email})

        if(!user) {
            res.status(401).json({message : "No such user exists!"})
        }else if(user.password === req.body.password) {
            res.status(200).json({role: user.role, id:user.id})
        }else{
            res.status(401).json({message: "Invalid credentials"})
        }
    }catch(error) {
        res.status(400).json(error)
    }
} 