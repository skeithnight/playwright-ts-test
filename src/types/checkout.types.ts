export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface OrderSummary {
  itemTotal: number;
  tax: number;
  total: number;
}
