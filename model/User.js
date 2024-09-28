const mongoose = require('mongoose')
const {Schema} = mongoose;

const userSchema = new Schema({
    email : {type: String, required: true , unique:true},
    password : {type : Buffer, requried: true },
    addresses : {type: [Schema.Types.Mixed], required: true},
    name:{type:String},
    role : {type : String, default:'user'},
    salt : Buffer
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