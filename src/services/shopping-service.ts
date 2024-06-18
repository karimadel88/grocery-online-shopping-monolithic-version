import ShoppingRepository from "app/dao/repositories/shopping-repository";
import { formatData } from "app/utils";
import { APIError } from "app/utils/errors/app-errors";

class ShoppingService {
  private repository: ShoppingRepository;
  constructor() {
    this.repository = new ShoppingRepository();
  }

  async placeOrder(userInput: any) {
    const { id, txnNumber } = userInput;

    // Verify the txn number with payment logs

    try {
      const orderResult = await this.repository.createNewOrder(id, txnNumber);
      return formatData(orderResult);
    } catch (err: any) {
      throw new APIError("Data Not found", err);
    }
  }

  async getOrders(customerId: any) {
    try {
      const orders = await this.repository.getOrders(customerId);
      return formatData(orders);
    } catch (err: any) {
      throw new APIError("Data Not found", err);
    }
  }
}

export default ShoppingService;
