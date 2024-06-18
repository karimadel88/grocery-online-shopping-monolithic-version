import { verifySignature } from "app/utils";
import { NextFunction, Response } from "express";

const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  const user = await verifySignature(authorization as string);

  console.log("User: ", user);
  if (user) {
    req.user = user;
    return next();
  }
  return res.status(403).json({ message: "Not Authorized" });
};

export default authMiddleware;
