import type { CoffeeMenuItem } from "../types/coffee";

export function calcMenuTotal(items: CoffeeMenuItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calcDeliveryPerPerson(deliveryFee: number, count: number): number {
  if (count === 0) return 0;
  return Math.ceil(deliveryFee / count);
}

export function calcPersonTotal(item: CoffeeMenuItem, deliveryShare: number): number {
  return item.price * item.quantity + deliveryShare;
}

export function calcGrandTotal(items: CoffeeMenuItem[], deliveryFee: number): number {
  return calcMenuTotal(items) + deliveryFee;
}
