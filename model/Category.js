const mongoose = require('mongoose')
const {Schema} = mongoose;

const categorySchema = new Schema({
    value : {type: String, required: true , unique:true},
    label : {type : String, requried: true , unique:true},
    checked : {type : Boolean}
},{
    toJSON:{
        versionKey: false,
        virtuals: true,
        transform: function (doc, ret) {
            delete ret._id;
        }
    }
})


exports.Category = mongoose.model('Category',categorySchema)

categorySchema.virtual('id').get(function(){
    return this._id;
})