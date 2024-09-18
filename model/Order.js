const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    items: {type: [Schema.Types.Mixed], required: true},
    totalAmount: {type : Number, required:true, default:0},
    totalItems: {type : Number, required:true, default:0},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    paymentMethod: {type: String, required:true, default:"cash"},
    status:{type: String, default:"pending"},
    selectedAddress: {type: Schema.Types.Mixed, required:true}
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        delete ret._id;
      },
    },
  }
);

exports.Order = mongoose.model("Order", orderSchema);

orderSchema.virtual("id").get(function () {
  return this._id;
});
