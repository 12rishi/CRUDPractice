import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productDetail: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  createdAT: {
    type: Date,
    default: Date.now,
  },
  productImage: [{ data: String, contentType: String, public_id: String }],
});
const Product = mongoose.model("Product", ProductSchema);
export default Product;
