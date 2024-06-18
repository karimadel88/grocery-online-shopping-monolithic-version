import { Application, NextFunction, Request, Response } from "express";
import CustomerService from "../services/customer-service";
import ProductService from "../services/product-service";
import UserAuth from "./middlewares/auth";

const productRoutes = (app: Application) => {
  const service = new ProductService();
  const customerService = new CustomerService();

  app.post(
    "/product/create",
    async (req: any, res: Response, next: NextFunction) => {
      try {
        const { name, desc, type, unit, price, available, supplier, banner } =
          req.body;
        const { data } = await service.createProduct({
          name,
          desc,
          type,
          unit,
          price,
          available,
          supplier,
          banner,
        });
        return res.json(data);
      } catch (err) {
        next(err);
      }
    },
  );

  app.get(
    "/category/:type",
    async (req: any, res: Response, next: NextFunction) => {
      const type = req.params.type;

      try {
        const { data } = await service.getProductsByCategory(type);
        return res.status(200).json(data);
      } catch (err) {
        next(err);
      }
    },
  );

  app.get("/:id", async (req: any, res: Response, next: NextFunction) => {
    const productId = req.params.id;

    try {
      const { data } = await service.getProductDescription(productId);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/ids", async (req: any, res: Response, next: NextFunction) => {
    try {
      const { ids } = req.body;
      const products = await service.getSelectedProducts(ids);
      return res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  });

  app.put(
    "/wishlist",
    UserAuth,
    async (req: any, res: Response, next: NextFunction) => {
      const { id } = req.user;

      try {
        const product = await service.getProductById(req.body.id);
        const wishList = await customerService.addToWishlist(id, product);
        return res.status(200).json(wishList);
      } catch (err) {
        next(err);
      }
    },
  );

  app.put(
    "/cart",
    UserAuth,
    async (req: any, res: Response, next: NextFunction) => {
      const { id, qty } = req.body;

      try {
        const product = await service.getProductById(id);
        const result = await customerService.manageCart(
          req.user._id,
          product,
          qty,
          false,
        );
        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  app.delete(
    "/cart/:id",
    UserAuth,
    async (req: any, res: Response, next: NextFunction) => {
      const { id } = req.user;

      try {
        const product = await service.getProductById(req.params.id);
        const result = await customerService.manageCart(id, product, 0, true);
        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  app.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = await service.getProducts();
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });
};

export default productRoutes;
