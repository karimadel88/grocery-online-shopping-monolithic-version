import { APIError, STATUS_CODES } from "app/utils/errors/app-errors";
import { Customer, Order } from "../models";

class ShoppingRepository {
  /**
   * Get user orders
   * @param customerId
   * @returns
   */
  public async getOrders(customerId: string | number) {
    try {
      const orders = await Order.find({ customerId }).populate("items.product");
      return orders;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Orders",
      );
    }
  }

  public async createNewOrder(
    customerId: string | number,
    txnId: string | number,
  ) {
    //check transaction for payment Status

    try {
      const profile = await Customer.findOne({
        id: customerId,
      }).populate("cart.product");

      if (profile) {
        let amount = 0;

        let cartItems = profile.cart;

        if (cartItems.length > 0) {
          //process Order
          cartItems.map(item => {
            amount += parseInt(item.product.price) * parseInt(item.unit);
          });

          const order = new Order({
            customerId,
            amount,
            txnId,
            status: "received",
            items: cartItems,
          });

          profile.cart = [];

          await order.populate("items.product");

          const orderResult = await order.save();

          profile.orders.push(orderResult as any);

          await profile.save();

          return orderResult;
        }
      }

      return {};
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Category",
      );
    }
  }
}

export default ShoppingRepository;
