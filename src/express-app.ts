import cors from "cors";
import express, { Application } from "express";
import { customerRoutes, productRoutes, shoppingRoutes } from "./api";
import ErrorHandler from "./utils/errors/errorr-handler";

export default async function expressApp(app: Application) {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));

  //   //api
  customerRoutes(app);
  productRoutes(app);
  shoppingRoutes(app);

  app.use(ErrorHandler);
}
