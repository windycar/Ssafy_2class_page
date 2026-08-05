import type { CoffeeMenuItem, CoffeeOrder, OrderCategory, PaymentStatus } from "../types/coffee";
import { requireSupabase } from "../lib/supabase";

type OrderRow = {
  id: string;
  title: string;
  category: OrderCategory;
  store_name: string;
  store_link: string;
  deadline: string;
  min_order_amount: number;
  delivery_fee: number;
  notice: string;
  account_bank: string;
  account_number: string;
  account_holder: string;
  created_at: string;
  is_active: boolean;
  created_by: string | null;
  created_by_member_id: number | null;
  creator_name: string | null;
};

type ItemRow = {
  id: string;
  order_id: string;
  participant_name: string;
  menu_name: string;
  options: string;
  quantity: number;
  price: number;
  note: string;
  payment_status: PaymentStatus;
  participant_user_id: string | null;
  participant_member_id: number | null;
  created_at: string;
};

const toOrder = (order: OrderRow): CoffeeOrder => ({
  id: order.id,
  title: order.title,
  category: order.category,
  storeName: order.store_name,
  storeLink: order.store_link,
  deadline: order.deadline,
  minOrderAmount: order.min_order_amount,
  deliveryFee: order.delivery_fee,
  notice: order.notice,
  accountBank: order.account_bank,
  accountNumber: order.account_number,
  accountHolder: order.account_holder,
  createdAt: order.created_at,
  isActive: order.is_active,
  createdBy: order.created_by,
  createdByMemberId: order.created_by_member_id,
  creatorName: order.creator_name,
});

const toItem = (item: ItemRow): CoffeeMenuItem => ({
  id: item.id,
  orderId: item.order_id,
  participantName: item.participant_name,
  menuName: item.menu_name,
  options: item.options,
  quantity: item.quantity,
  price: item.price,
  note: item.note,
  paymentStatus: item.payment_status,
  participantUserId: item.participant_user_id,
  participantMemberId: item.participant_member_id,
  createdAt: item.created_at,
});

const orderPayload = (order: CoffeeOrder) => ({
  id: order.id,
  title: order.title,
  category: order.category,
  store_name: order.storeName,
  store_link: order.storeLink,
  deadline: order.deadline,
  min_order_amount: order.minOrderAmount,
  delivery_fee: order.deliveryFee,
  notice: order.notice,
  account_bank: order.accountBank,
  account_number: order.accountNumber,
  account_holder: order.accountHolder,
  created_at: order.createdAt,
  is_active: order.isActive,
  created_by: order.createdBy,
  created_by_member_id: order.createdByMemberId,
  creator_name: order.creatorName,
});

const itemPayload = (item: CoffeeMenuItem) => ({
  id: item.id,
  order_id: item.orderId,
  participant_name: item.participantName,
  menu_name: item.menuName,
  options: item.options,
  quantity: item.quantity,
  price: item.price,
  note: item.note,
  payment_status: item.paymentStatus,
  participant_user_id: item.participantUserId,
  participant_member_id: item.participantMemberId,
});

export async function getActiveCoffeeOrder() {
  const client = requireSupabase();
  const { data: orderRow, error: orderError } = await client
    .from("coffee_orders")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (orderError) throw orderError;
  if (!orderRow) return { order: null, items: [] as CoffeeMenuItem[] };

  const { data: itemRows, error: itemError } = await client
    .from("coffee_order_items")
    .select("*")
    .eq("order_id", orderRow.id)
    .order("participant_name", { ascending: true });

  if (itemError) throw itemError;
  return { order: toOrder(orderRow as OrderRow), items: (itemRows as ItemRow[] ?? []).map(toItem) };
}

export async function createCoffeeOrder(order: CoffeeOrder) {
  const { error } = await requireSupabase().from("coffee_orders").insert(orderPayload(order));
  if (error) throw error;
}

export async function createCoffeeMenuItem(item: CoffeeMenuItem) {
  const { error } = await requireSupabase().from("coffee_order_items").insert(itemPayload(item));
  if (error) throw error;
}

export async function updateCoffeeMenuItem(item: CoffeeMenuItem) {
  const { error } = await requireSupabase().from("coffee_order_items").update({
    menu_name: item.menuName,
    options: item.options,
    quantity: item.quantity,
    price: item.price,
    note: item.note,
    payment_status: item.paymentStatus,
  }).eq("id", item.id);
  if (error) throw error;
}

export async function deleteCoffeeMenuItem(id: string) {
  const { error } = await requireSupabase().from("coffee_order_items").delete().eq("id", id);
  if (error) throw error;
}

export async function closeCoffeeOrder(id: string) {
  const { error } = await requireSupabase().from("coffee_orders").update({ is_active: false }).eq("id", id);
  if (error) throw error;
}

export async function deleteCoffeeOrder(id: string) {
  const { error } = await requireSupabase().from("coffee_orders").delete().eq("id", id);
  if (error) throw error;
}
