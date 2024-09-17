const mongoose = require('mongoose')
const {Schema} = mongoose;

const userSchema = new Schema({
    email : {type: String, required: true , unique:true},
    password : {type : String, requried: true },
    addresses : {type: [Schema.Types.Mixed], required: true},
    role : {type : String, default:'user'}
},{
    toJSON:{
        versionKey: false,
        virtuals: true,
        transform: function (doc, ret) {
            delete ret._id;
        }
    }
})


exports.User = mongoose.model('User',userSchema)

userSchema.virtual('id').get(function(){
    return this._id;
})