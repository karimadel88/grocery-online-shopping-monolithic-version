import { CreateAddressDto, CreateCustomerDto } from "app/dto/customer-dto";
import { APIError, STATUS_CODES } from "app/utils/errors/app-errors";
import { Address, Customer } from "../models";

class CustomerRepository {
  /**
   * Create new customer
   * @param data
   * @returns
   */
  public async create(data: CreateCustomerDto) {
    try {
      const customer = await Customer.create({
        ...data,
        addresses: [],
      });

      return customer;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Customer",
      );
    }
  }

  public async createAddress(data: CreateAddressDto) {
    try {
      const customer = await Customer.findOne({ id: data.id });
      if (customer) {
        const newAddress = new Address(data);
        await newAddress.save();

        customer.addresses.push(newAddress._id);
        await customer.save();
      }

      return customer;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Address",
      );
    }
  }

  /**
   * Get Customer by email
   * @param email
   * @returns
   */
  public async findCustomerByEmail(email: string) {
    try {
      const existingCustomer = await Customer.findOne({ email: email });
      return existingCustomer;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Customer",
      );
    }
  }

  /**
   * Find customer by id
   * @param id
   * @returns
   */
  public async findCustomerById(id: string | number) {
    try {
      const existingCustomer = await Customer.findOne({ id })
        .populate("addresses")
        .populate("wishlist")
        .populate("orders")
        .populate("cart.product");
      return existingCustomer;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Customer",
      );
    }
  }

  /**
   * Get user wishlist
   * @param customerId
   * @returns
   */
  public async userWishlist(customerId: string | number) {
    try {
      const profile = await Customer.findOne({
        id: customerId,
      }).populate("wishlist");

      return profile?.wishlist;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Get Wishlist ",
      );
    }
  }

  /**
   * add product to wishlist
   * @param customerId
   * @param product
   * @returns
   */
  public async addWishlistItem(customerId: string | number, product: any) {
    try {
      const profile = await Customer.findOne({
        id: customerId,
      }).populate("wishlist");

      if (!profile) {
        throw new APIError(
          "API Error",
          STATUS_CODES.INTERNAL_ERROR,
          "Unable to Add to WishList",
        );
      }

      let wishlist = profile.wishlist;

      if (wishlist.length > 0) {
        let isExist = false;
        wishlist.map(item => {
          if (item._id.toString() === product._id.toString()) {
            const index = wishlist.indexOf(item);
            wishlist.splice(index, 1);
            isExist = true;
          }
        });

        if (!isExist) {
          wishlist.push(product);
        }
      } else {
        wishlist.push(product);
      }

      profile.wishlist = wishlist;

      const profileResult = await profile.save();

      return profileResult.wishlist;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Add to WishList",
      );
    }
  }

  /**
   * Add product to cart
   * @param customerId
   * @param product
   * @param qty
   * @param isRemove
   * @returns
   */
  public async addCartItem(
    customerId: number | string,
    product: any,
    qty: number,
    isRemove: boolean,
  ) {
    try {
      const profile = await Customer.findOne({ id: customerId }).populate(
        "cart.product",
      );

      if (profile) {
        const cartItem = {
          product,
          unit: qty,
        };

        let cartItems = profile.cart;

        if (cartItems.length > 0) {
          let isExist = false;
          cartItems.map(item => {
            if (item.product._id.toString() === product._id.toString()) {
              if (isRemove) {
                cartItems.splice(cartItems.indexOf(item), 1);
              } else {
                item.unit = qty;
              }
              isExist = true;
            }
          });

          if (!isExist) {
            cartItems.push(cartItem);
          }
        } else {
          cartItems.push(cartItem);
        }

        profile.cart = cartItems;

        const cartSaveResult = await profile.save();

        return cartSaveResult.cart;
      }

      throw new Error("Unable to add to cart!");
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Customer",
      );
    }
  }

  /**
   * Create order
   * @param customerId
   * @param order
   * @returns
   */
  public async addOrderToProfile(customerId: number | string, order: any) {
    try {
      const profile = await Customer.findOne({
        id: customerId,
      });

      if (profile) {
        if (profile.orders == undefined) {
          profile.orders = [];
        }
        profile.orders.push(order);

        profile.cart = [];

        const profileResult = await profile.save();

        return profileResult;
      }

      throw new Error("Unable to add to order!");
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Customer",
      );
    }
  }
}
export default CustomerRepository;
