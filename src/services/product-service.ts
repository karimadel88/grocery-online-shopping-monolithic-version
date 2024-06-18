import ProductRepository from "app/dao/repositories/product-repository";
import { formatData } from "app/utils";
import { APIError } from "app/utils/errors/app-errors";

// All Business logic will be here
class ProductService {
  private repository: ProductRepository;
  constructor() {
    this.repository = new ProductRepository();
  }

  async createProduct(productInputs: any) {
    try {
      const productResult = await this.repository.createProduct(productInputs);
      return formatData(productResult);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async getProducts() {
    try {
      const products = await this.repository.getProducts();

      let categories = {} as any;

      products.map(product => {
        const type = product.type;
        if (type) categories[type] = type;
      });

      return formatData({
        products,
        categories: Object.keys(categories),
      });
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async getProductDescription(productId: number) {
    try {
      const product = await this.repository.findById(productId);
      return formatData(product);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async getProductsByCategory(category: string) {
    try {
      const products = await this.repository.findByCategory(category);
      return formatData(products);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async getSelectedProducts(selectedIds: any) {
    try {
      const products = await this.repository.findSelectedProducts(selectedIds);
      return formatData(products);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async getProductById(productId: number | string) {
    try {
      return await this.repository.findById(productId);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }
}

export default ProductService;
