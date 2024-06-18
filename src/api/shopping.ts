import ShoppingService from "app/services/shopping-service";
import { Application, NextFunction, Response } from "express";
import CustomerService from "../services/customer-service";
import UserAuth from "./middlewares/auth";

const shoppingRoutes = (app: Application) => {
  const service = new ShoppingService();
  const userService = new CustomerService();

  app.post(
    "/shopping/order",
    UserAuth,
    async (req: any, res: Response, next: NextFunction) => {
      const { id } = req.user;
      const { txnNumber } = req.body;

      try {
        const { data } = await service.placeOrder({ id, txnNumber });
        return res.status(200).json(data);
      } catch (err) {
        next(err);
      }
    },
  );

  app.get(
    "/shopping/orders",
    UserAuth,
    async (req: any, res: Response, next: NextFunction) => {
      const { id } = req.user;

      try {
        const { data } = await userService.getShoppingDetails(id);
        return res.status(200).json(data.orders);
      } catch (err) {
        next(err);
      }
    },
  );

  app.get(
    "/shopping/cart",
    UserAuth,
    async (req: any, res: Response, next: NextFunction) => {
      const { id } = req.user;

      try {
        const { data } = await userService.getShoppingDetails(id);
        return res.status(200).json(data.cart);
      } catch (err) {
        next(err);
      }
    },
  );
};

export default shoppingRoutes;
