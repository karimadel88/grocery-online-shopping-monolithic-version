import { autoIncrementPlugin } from "app/utils";
import mongoose, { Schema } from "mongoose";

const CustomerSchema = new Schema(
  {
    id: { type: Number, unique: true },
    email: String,
    password: String,
    salt: String,
    phone: String,
    addresses: [
      { type: Schema.Types.ObjectId, ref: "addresses", require: true },
    ],
    cart: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "products",
          require: true,
        },
        unit: { type: Number, require: true },
      },
    ],
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "products",
        require: true,
      },
    ],
    orders: [{ type: Schema.Types.ObjectId, ref: "orders", require: true }],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
      },
    },
    timestamps: true,
  },
);

autoIncrementPlugin(CustomerSchema);
const Customer = mongoose.model("customers", CustomerSchema);
export default Customer;
