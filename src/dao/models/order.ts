import { autoIncrementPlugin } from "app/utils";
import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    id: { type: Number, unique: true },
    customerId: Number,
    amount: Number,
    status: String,
    txnId: String,
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        unit: { type: Number, require: true },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  },
);

autoIncrementPlugin(OrderSchema);
const Order = mongoose.model("orders", OrderSchema);
export default Order;
