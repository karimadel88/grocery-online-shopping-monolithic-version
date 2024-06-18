import CustomerRepository from "app/dao/repositories/customer-repository";
import {
  comparePassword,
  formatData,
  generateSalt,
  generateSignature,
  hashPassword,
} from "app/utils";
import { APIError } from "app/utils/errors/app-errors";

// All Business logic will be here
class CustomerService {
  private repository: CustomerRepository;
  constructor() {
    this.repository = new CustomerRepository();
  }

  async signIn(userInputs: any) {
    const { email, password } = userInputs;

    try {
      const existingCustomer = await this.repository.findCustomerByEmail(email);

      if (existingCustomer) {
        const validPassword = await comparePassword(
          password,
          existingCustomer.password as string,
          existingCustomer.salt as string,
        );

        if (validPassword) {
          const token = await generateSignature({
            email: existingCustomer.email,
            _id: existingCustomer._id,
            id: existingCustomer.id,
          });

          return formatData({ id: existingCustomer.id, token });
        }
      }

      return formatData(null);
    } catch (err: any) {
      throw new APIError("Data Not found");
    }
  }

  async signUp(userInputs: any) {
    const { email, password, phone } = userInputs;

    try {
      // create salt
      let salt = await generateSalt();

      let userPassword = await hashPassword(password, salt);

      const existingCustomer = await this.repository.create({
        email,
        password: userPassword,
        phone,
        salt,
      });

      const token = await generateSignature({
        email: email,
        _id: existingCustomer._id,
        id: existingCustomer.id,
      });

      return formatData({ id: existingCustomer.id, token });
    } catch (err: any) {
      throw new APIError("Data Not found");
    }
  }

  async addNewAddress(id: any, userInputs: any) {
    const { street, postalCode, city, country } = userInputs;

    try {
      const addressResult = await this.repository.createAddress({
        id,
        street,
        postalCode,
        city,
        country,
      });
      return formatData(addressResult);
    } catch (err: any) {
      throw new APIError("Data Not found", err);
    }
  }

  async getProfile(id: any) {
    try {
      const existingCustomer = await this.repository.findCustomerById(id);
      return formatData(existingCustomer);
    } catch (err: any) {
      throw new APIError("Data Not found", err);
    }
  }

  async getShoppingDetails(id: any) {
    try {
      const existingCustomer = await this.repository.findCustomerById(id);

      if (existingCustomer) {
        return formatData(existingCustomer);
      }
      return formatData({ msg: "Error" });
    } catch (err: any) {
      throw new APIError("Data Not found", err);
    }
  }

  async getWishList(customerId: any) {
    try {
      const wishListItems = await this.repository.userWishlist(customerId);
      return formatData(wishListItems);
    } catch (err: any) {
      throw new APIError("Data Not found", err);
    }
  }

  async addToWishlist(customerId: any, product: any) {
    try {
      const wishlistResult = await this.repository.addWishlistItem(
        customerId,
        product,
      );
      return formatData(wishlistResult);
    } catch (err: any) {
      throw new APIError("Data Not found", err);
    }
  }

  async manageCart(customerId: any, product: any, qty: any, isRemove: any) {
    try {
      const cartResult = await this.repository.addCartItem(
        customerId,
        product,
        qty,
        isRemove,
      );
      return formatData(cartResult);
    } catch (err: any) {
      throw new APIError("Data Not found", err);
    }
  }

  async manageOrder(customerId: any, order: any) {
    try {
      const orderResult = await this.repository.addOrderToProfile(
        customerId,
        order,
      );
      return formatData(orderResult);
    } catch (err: any) {
      throw new APIError("Data Not found", err);
    }
  }

  async SubscribeEvents(payload: any) {
    const { event, data } = payload;

    const { userId, product, order, qty } = data;

    switch (event) {
      case "ADD_TO_WISHLIST":
      case "REMOVE_FROM_WISHLIST":
        this.addToWishlist(userId, product);
        break;
      case "ADD_TO_CART":
        this.manageCart(userId, product, qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.manageCart(userId, product, qty, true);
        break;
      case "CREATE_ORDER":
        this.manageOrder(userId, order);
        break;
      default:
        break;
    }
  }
}

export default CustomerService;
