export type CreateCustomerDto = {
  email?: string;
  password: string;
  phone: string;
  salt: string;
};

export type CreateAddressDto = {
  id: number | string;
  postalCode: string;
  street: string;
  city: string;
  country: string;
};
