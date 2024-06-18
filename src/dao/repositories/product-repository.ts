import { APIError, STATUS_CODES } from "app/utils/errors/app-errors";
import { Product } from "../models";

//Dealing with data base operations
class ProductRepository {
  async createProduct({
    name,
    desc,
    type,
    unit,
    price,
    available,
    supplier,
    banner,
  }: any) {
    try {
      const product = new Product({
        name,
        desc,
        type,
        unit,
        price,
        available,
        supplier,
        banner,
      });

      const productResult = await product.save();
      return productResult;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Product",
      );
    }
  }

  async getProducts() {
    try {
      return await Product.find();
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Get Products",
      );
    }
  }

  async findById(id: string | number) {
    try {
      return await Product.findOne({ _id: id });
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Product",
      );
    }
  }

  async findByCategory(category: string) {
    try {
      const products = await Product.find({ type: category });
      return products;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Category",
      );
    }
  }

  async findSelectedProducts(selectedIds: string[] | number[]) {
    try {
      const products = await Product.find()
        .where("id")
        .in(selectedIds.map(id => id))
        .exec();
      return products;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Product",
      );
    }
  }
}

export default ProductRepository;
