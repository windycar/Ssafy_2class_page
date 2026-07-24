export type PaymentStatus = "unpaid" | "paid" | "ordered" | "received";

export type OrderCategory = "coffee" | "food" | "snack" | "goods" | "etc";

export interface CoffeeOrder {
  id: string;
  title: string;
  category: OrderCategory;
  storeName: string;
  storeLink: string;
  deadline: string;
  minOrderAmount: number;
  deliveryFee: number;
  notice: string;
  accountBank: string;
  accountNumber: string;
  accountHolder: string;
  createdAt: string;
  isActive: boolean;
}

export interface CoffeeMenuItem {
  id: string;
  orderId: string;
  participantName: string;
  menuName: string;
  options: string;
  quantity: number;
  price: number;
  note: string;
  paymentStatus: PaymentStatus;
}
