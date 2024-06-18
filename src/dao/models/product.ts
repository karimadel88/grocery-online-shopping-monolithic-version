import { autoIncrementPlugin } from "app/utils";
import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema({
  id: { type: Number, unique: true },
  name: String,
  desc: String,
  banner: String,
  type: String,
  unit: Number,
  price: Number,
  available: Boolean,
  supplier: String,
});

autoIncrementPlugin(ProductSchema);
const Product = mongoose.model("products", ProductSchema);

export default Product;
