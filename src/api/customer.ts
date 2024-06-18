import { Application, NextFunction, Request, Response } from "express";
import CustomerService from "../services/customer-service";
import UserAuth from "./middlewares/auth";

const customerRoutes = (app: Application) => {
  const service = new CustomerService();

  app.post(
    "/customer/signup",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password, phone } = req.body;
        const { data } = await service.signUp({ email, password, phone });
        return res.json(data);
      } catch (err) {
        next(err);
      }
    },
  );

  app.post(
    "/customer/login",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = req.body;
        const { data } = await service.signIn({ email, password });
        return res.json(data);
      } catch (err) {
        next(err);
      }
    },
  );

  app.post(
    "/customer/address",
    UserAuth,
    async (req: any, res: Response, next: NextFunction) => {
      try {
        const { id } = req.user;
        const { street, postalCode, city, country } = req.body;
        const { data } = await service.addNewAddress(id, {
          street,
          postalCode,
          city,
          country,
        });
        return res.json(data);
      } catch (err) {
        next(err);
      }
    },
  );

  app.get(
    "/customer/profile",
    UserAuth,
    async (req: any, res: Response, next: NextFunction) => {
      try {
        const { id } = req.user;
        const { data } = await service.getProfile(id);
        return res.json(data);
      } catch (err) {
        return next(err);
      }
    },
  );

  app.get(
    "/customer/shopping-details",
    UserAuth,
    async (req: any, res: Response, next: NextFunction) => {
      try {
        const { id } = req.user;
        const { data } = await service.getShoppingDetails(id);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    },
  );

  app.get(
    "/customer/wishlist",
    UserAuth,
    async (req: any, res: Response, next: NextFunction) => {
      try {
        const { id } = req.user;
        const { data } = await service.getWishList(id);
        return res.status(200).json(data);
      } catch (err) {
        next(err);
      }
    },
  );
};

export default customerRoutes;
