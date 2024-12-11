const mongoose = require("mongoose");
const { Schema } = mongoose;

const brandSchema = new Schema(
  {
    value: { type: String, required: true, unique: true },
    label: { type: String, requried: true, unique: true },
    checked: { type: Boolean },
  },
  {
    toJSON: {
      versionKey: false,
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
      },
    },
    timestamps: true,
  }
);

exports.Brand = mongoose.model("Brand", brandSchema);

brandSchema.virtual("id").get(function () {
  return this._id;
});
