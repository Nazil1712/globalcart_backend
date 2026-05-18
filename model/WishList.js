const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        delete ret._id;
      },
    },
    timestamps: true,
  },
);

// Prevent duplicate wishlist items
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

exports.WishList = mongoose.model("WishList", wishlistSchema);

wishlistSchema.virtual("id").get(function () {
  return this._id;
});
