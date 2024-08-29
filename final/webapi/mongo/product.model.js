// kết nối collection categories

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, require: true },
  img: { type: String, require: true },
  price: { type: Number, require: true },
  quantity: { type: Number, require: true },
  view: { type: Number, require: true },
  description: { type: String, require: true },
  hot: { type: Number, require: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories",
    required: true,
  },
});

const Product = mongoose.model("pros", productSchema);

module.exports = Product;
