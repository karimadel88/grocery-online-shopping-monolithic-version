import { autoIncrementPlugin } from "app/utils";
import mongoose, { Schema } from "mongoose";

const AddressSchema = new Schema({
  postalCode: String,
  street: String,
  city: String,
  country: String,
  id: { type: Number, unique: true },
});

autoIncrementPlugin(AddressSchema);
const Address = mongoose.model("addresses", AddressSchema);
export default Address;
