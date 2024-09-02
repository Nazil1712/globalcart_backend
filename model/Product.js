const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: {
      type: Number,
      min: [0.1, "Wrong min price"],
      max: [1000000, "Wrong Max Price"],
    },
    discountPercentage: {
      type: Number,
      min: [0, "Wrong min discount"],
      max: [99, "Wrong Max discount"],
    },
    rating: {
      type: Number,
      min: [0, "Wrong min rating"],
      max: [5, "Wrong max rating"],
      default: 0,
    },
    stock: { type: Number, min: [0, "Wrong min stock"], default: 0 },
    brand: { type: String},
    images: { type: [String] },
    thumbnail: { type: String, required: true },
    deleted: { type: Boolean, default: false },
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

exports.Product = mongoose.model("Product", productSchema);

productSchema.virtual("id").get(function () {
  return this._id;
});
