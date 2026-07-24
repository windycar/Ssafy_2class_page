import { useEffect, useState } from "react";
import { ShoppingBag, Plus, Trash2, Edit2, Check, X, Copy, RotateCcw, Clock, Users, AlertCircle, CreditCard, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { STUDENTS } from "../data/students";
import { calcMenuTotal, calcDeliveryPerPerson, calcGrandTotal } from "../utils/coffeeCalculator";
import { formatCurrency } from "../utils/formatCurrency";
import { formatTimeLeft } from "../utils/formatDate";
import { copyToClipboard } from "../utils/copyToClipboard";
import { createId } from "../utils/createId";
import { PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from "../config/constants";
import type { CoffeeOrder, CoffeeMenuItem, PaymentStatus, OrderCategory } from "../types/coffee";
import { supabase } from "../lib/supabase";
import {
  closeCoffeeOrder,
  createCoffeeMenuItem,
  createCoffeeOrder,
  deleteCoffeeMenuItem,
  deleteCoffeeOrder,
  getActiveCoffeeOrder,
  updateCoffeeMenuItem,
} from "../services/coffeeStorage";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_CYCLE: PaymentStatus[] = ["unpaid", "paid", "ordered", "received"];

const ORDER_CATEGORIES: { value: OrderCategory; label: string; emoji: string }[] = [
  { value: "coffee", label: "커피·음료", emoji: "☕" },
  { value: "food", label: "음식·배달", emoji: "🍱" },
  { value: "snack", label: "간식·편의점", emoji: "🍫" },
  { value: "goods", label: "물품·용품", emoji: "📦" },
  { value: "etc", label: "기타", emoji: "🛒" },
];

const BANKS = [
  "카카오뱅크", "토스뱅크", "케이뱅크",
  "국민은행", "신한은행", "우리은행", "하나은행",
  "농협은행", "기업은행", "SC제일은행", "직접입력",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nextStatus(current: PaymentStatus): PaymentStatus {
  const idx = STATUS_CYCLE.indexOf(current);
  return STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
}

function categoryInfo(cat: OrderCategory) {
  return ORDER_CATEGORIES.find((c) => c.value === cat) ?? ORDER_CATEGORIES[4];
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface MenuFormState {
  participantName: string;
  menuName: string;
  options: string;
  quantity: number;
  price: string;
  note: string;
}

interface OrderFormState {
  title: string;
  category: OrderCategory;
  storeName: string;
  storeLink: string;
  deadline: string;
  minOrderAmount: string;
  deliveryFee: string;
  notice: string;
  accountBank: string;
  accountBankCustom: string;
  accountNumber: string;
  accountHolder: string;
}

const EMPTY_MENU: MenuFormState = {
  participantName: "",
  menuName: "",
  options: "",
  quantity: 1,
  price: "",
  note: "",
};

const EMPTY_ORDER: OrderFormState = {
  title: "",
  category: "coffee",
  storeName: "",
  storeLink: "",
  deadline: "",
  minOrderAmount: "",
  deliveryFee: "",
  notice: "",
  accountBank: "",
  accountBankCustom: "",
  accountNumber: "",
  accountHolder: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function CoffeeOrderView() {
  const [order, setOrder] = useState<CoffeeOrder | null>(null);
  const [items, setItems] = useState<CoffeeMenuItem[]>([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [menuForm, setMenuForm] = useState<MenuFormState>(EMPTY_MENU);
  const [orderForm, setOrderForm] = useState<OrderFormState>(EMPTY_ORDER);
  const [showAccount, setShowAccount] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    getActiveCoffeeOrder()
      .then(({ order: activeOrder, items: activeItems }) => {
        setOrder(activeOrder);
        setItems(activeItems);
      })
      .catch(() => toast.error("공동구매 정보를 불러오지 못했습니다."));
  }, []);

  const ensureSupabase = () => {
    if (supabase) return true;
    toast.error("Supabase 설정이 필요합니다.");
    return false;
  };

  const menuTotal = calcMenuTotal(items);
  const deliveryShare = order ? calcDeliveryPerPerson(order.deliveryFee, items.length) : 0;
  const grandTotal = order ? calcGrandTotal(items, order.deliveryFee) : 0;
  const paidCount = items.filter((i) => i.paymentStatus !== "unpaid").length;

  const resolvedBank =
    orderForm.accountBank === "직접입력" ? orderForm.accountBankCustom : orderForm.accountBank;

  // ── Order actions ──────────────────────────────────────────

  const handleStartOrder = async () => {
    if (!orderForm.title.trim()) { toast.error("공구 제목을 입력해 주세요."); return; }
    if (!orderForm.storeName.trim()) { toast.error("매장/상품명을 입력해 주세요."); return; }
    const newOrder: CoffeeOrder = {
      id: createId("order"),
      title: orderForm.title,
      category: orderForm.category,
      storeName: orderForm.storeName,
      storeLink: orderForm.storeLink,
      deadline: orderForm.deadline || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      minOrderAmount: parseInt(orderForm.minOrderAmount) || 0,
      deliveryFee: parseInt(orderForm.deliveryFee) || 0,
      notice: orderForm.notice,
      accountBank: resolvedBank,
      accountNumber: orderForm.accountNumber,
      accountHolder: orderForm.accountHolder,
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    if (!ensureSupabase()) return;
    try {
      await createCoffeeOrder(newOrder);
    } catch {
      toast.error("공동구매를 저장하지 못했습니다.");
      return;
    }
    setOrder(newOrder);
    setItems([]);
    setShowOrderForm(false);
    setOrderForm(EMPTY_ORDER);
    toast.success("공구가 시작되었습니다!");
  };

  // ── Menu actions ───────────────────────────────────────────

  const handleAddMenu = async () => {
    if (!menuForm.participantName) { toast.error("참여자를 선택해 주세요."); return; }
    if (!menuForm.menuName.trim()) { toast.error("상품/메뉴명을 입력해 주세요."); return; }
    if (!menuForm.price || parseInt(menuForm.price) <= 0) { toast.error("금액을 입력해 주세요."); return; }
    if (editingItemId) {
      const existingItem = items.find((item) => item.id === editingItemId);
      if (!existingItem || !ensureSupabase()) return;
      const updatedItem: CoffeeMenuItem = {
        ...existingItem,
        ...menuForm,
        price: parseInt(menuForm.price),
        quantity: menuForm.quantity,
      };
      try {
        await updateCoffeeMenuItem(updatedItem);
      } catch {
        toast.error("메뉴를 수정하지 못했습니다.");
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItemId
            ? { ...item, ...menuForm, price: parseInt(menuForm.price), quantity: menuForm.quantity }
            : item
        )
      );
      toast.success("항목이 수정되었습니다.");
      setEditingItemId(null);
    } else {
      const newItem: CoffeeMenuItem = {
        id: createId("item"),
        orderId: order?.id ?? "",
        ...menuForm,
        price: parseInt(menuForm.price),
        paymentStatus: "unpaid",
      };
      if (!ensureSupabase()) return;
      try {
        await createCoffeeMenuItem(newItem);
      } catch {
        toast.error("메뉴를 추가하지 못했습니다.");
        return;
      }
      setItems((prev) => [...prev, newItem]);
      toast.success("항목이 추가되었습니다.");
    }
    setMenuForm(EMPTY_MENU);
    setShowMenuForm(false);
  };

  const handleEditItem = (item: CoffeeMenuItem) => {
    setMenuForm({
      participantName: item.participantName,
      menuName: item.menuName,
      options: item.options,
      quantity: item.quantity,
      price: String(item.price),
      note: item.note,
    });
    setEditingItemId(item.id);
    setShowMenuForm(true);
  };

  const handleDeleteItem = async (id: string) => {
    if (!ensureSupabase()) return;
    try {
      await deleteCoffeeMenuItem(id);
    } catch {
      toast.error("메뉴를 삭제하지 못했습니다.");
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("삭제되었습니다.");
  };

  const handleToggleStatus = async (id: string) => {
    const currentItem = items.find((item) => item.id === id);
    if (!currentItem || !ensureSupabase()) return;
    const updatedItem = { ...currentItem, paymentStatus: nextStatus(currentItem.paymentStatus) };
    try {
      await updateCoffeeMenuItem(updatedItem);
    } catch {
      toast.error("결제 상태를 저장하지 못했습니다.");
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, paymentStatus: nextStatus(i.paymentStatus) } : i))
    );
  };

  // ── Copy actions ───────────────────────────────────────────

  const handleCopyOrder = async () => {
    if (!order) return;
    const accountLine =
      order.accountNumber
        ? `\n💳 입금 계좌: ${order.accountBank} ${order.accountNumber} (${order.accountHolder})`
        : "";
    const text = [
      `📦 ${order.title} — ${order.storeName}`,
      `⏰ 마감: ${formatTimeLeft(order.deadline)}`,
      `🚚 배달비: ${formatCurrency(order.deliveryFee)} (1인 ${formatCurrency(deliveryShare)})`,
      accountLine,
      "",
      ...items.map(
        (i, idx) =>
          `${idx + 1}. ${i.participantName} — ${i.menuName}${i.options ? ` (${i.options})` : ""} x${i.quantity} = ${formatCurrency(i.price * i.quantity)}`
      ),
      "",
      `합계: ${formatCurrency(grandTotal)}`,
    ]
      .filter((l) => l !== undefined)
      .join("\n");
    const ok = await copyToClipboard(text);
    ok ? toast.success("주문 내용이 복사되었습니다!") : toast.error("복사에 실패했습니다.");
  };

  const handleCopyAccount = async () => {
    if (!order?.accountNumber) return;
    const text = `${order.accountBank} ${order.accountNumber} (${order.accountHolder})`;
    const ok = await copyToClipboard(text);
    ok ? toast.success("계좌번호가 복사되었습니다!") : toast.error("복사에 실패했습니다.");
  };

  const handleClose = async () => {
    if (!window.confirm("공구를 마감할까요?")) return;
    if (!order || !ensureSupabase()) return;
    try {
      await closeCoffeeOrder(order.id);
    } catch {
      toast.error("공동구매를 마감하지 못했습니다.");
      return;
    }
    setOrder(null);
    setItems([]);
    toast.success("공구가 마감되었습니다.");
  };

  const handleReset = async () => {
    if (!window.confirm("전체 초기화할까요?")) return;
    if (!order || !ensureSupabase()) return;
    try {
      await deleteCoffeeOrder(order.id);
    } catch {
      toast.error("공동구매를 초기화하지 못했습니다.");
      return;
    }
    setOrder(null);
    setItems([]);
    toast.success("초기화되었습니다.");
  };

  // ── Render ─────────────────────────────────────────────────

  const catInfo = order ? categoryInfo(order.category) : null;

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-md shadow-amber-200">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">같이 공구</h1>
          <p className="text-sm text-gray-500">커피, 음식, 물품 등 뭐든 함께 주문해요.</p>
        </div>
      </div>

      {/* ── No active order ── */}
      {!order ? (
        <div className="bg-white rounded-2xl border border-border shadow-sm">
          {!showOrderForm ? (
            <div className="p-16 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4 text-3xl">
                🛒
              </div>
              <h3 className="text-base font-bold text-gray-400 mb-1">
                현재 진행 중인 공구가 없습니다.
              </h3>
              <p className="text-sm text-gray-300 mb-6">새로운 공구를 시작해 보세요.</p>
              <button
                onClick={() => setShowOrderForm(true)}
                className="flex items-center gap-2 bg-amber-500 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-amber-600 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                공구 시작하기
              </button>
            </div>
          ) : (
            /* ── New order form ── */
            <div className="p-6 space-y-5">
              <h2 className="font-extrabold text-gray-800">새 공구 만들기</h2>

              {/* Category selector */}
              <div>
                <label className="text-sm font-semibold text-gray-600 block mb-2">공구 종류 *</label>
                <div className="flex flex-wrap gap-2">
                  {ORDER_CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setOrderForm((p) => ({ ...p, category: cat.value }))}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all ${
                        orderForm.category === cat.value
                          ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                          : "bg-white text-gray-500 border-border hover:border-amber-300 hover:text-amber-600"
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-gray-600 block mb-1">공구 제목 *</label>
                  <input
                    value={orderForm.title}
                    onChange={(e) => setOrderForm((p) => ({ ...p, title: e.target.value }))}
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    placeholder="예: 메가커피 공구, 편의점 과자 공구"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-1">매장 / 상품명 *</label>
                  <input
                    value={orderForm.storeName}
                    onChange={(e) => setOrderForm((p) => ({ ...p, storeName: e.target.value }))}
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    placeholder="예: 메가MGC커피, 쿠팡"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-1">링크 (선택)</label>
                  <input
                    value={orderForm.storeLink}
                    onChange={(e) => setOrderForm((p) => ({ ...p, storeLink: e.target.value }))}
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-1">배달비 (원)</label>
                  <input
                    type="number"
                    value={orderForm.deliveryFee}
                    onChange={(e) => setOrderForm((p) => ({ ...p, deliveryFee: e.target.value }))}
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    placeholder="3000"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-1">최소 주문 금액 (원)</label>
                  <input
                    type="number"
                    value={orderForm.minOrderAmount}
                    onChange={(e) => setOrderForm((p) => ({ ...p, minOrderAmount: e.target.value }))}
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    placeholder="15000"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-gray-600 block mb-1">공지사항</label>
                  <input
                    value={orderForm.notice}
                    onChange={(e) => setOrderForm((p) => ({ ...p, notice: e.target.value }))}
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    placeholder="주문 시 주의사항을 입력해 주세요."
                  />
                </div>
              </div>

              {/* 계좌번호 */}
              <div className="bg-gray-50 border border-border rounded-2xl p-4 space-y-3">
                <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-500" />
                  입금 계좌 (선택)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">은행</label>
                    <select
                      value={orderForm.accountBank}
                      onChange={(e) => setOrderForm((p) => ({ ...p, accountBank: e.target.value }))}
                      className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white"
                    >
                      <option value="">선택</option>
                      {BANKS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                    {orderForm.accountBank === "직접입력" && (
                      <input
                        value={orderForm.accountBankCustom}
                        onChange={(e) => setOrderForm((p) => ({ ...p, accountBankCustom: e.target.value }))}
                        className="mt-2 w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                        placeholder="은행명 입력"
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">계좌번호</label>
                    <input
                      value={orderForm.accountNumber}
                      onChange={(e) => setOrderForm((p) => ({ ...p, accountNumber: e.target.value }))}
                      className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                      placeholder="3333-01-1234567"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">예금주</label>
                    <input
                      value={orderForm.accountHolder}
                      onChange={(e) => setOrderForm((p) => ({ ...p, accountHolder: e.target.value }))}
                      className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                      placeholder="홍길동"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleStartOrder}
                  className="flex items-center gap-2 bg-amber-500 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-amber-600 transition-colors text-sm"
                >
                  <Check className="w-4 h-4" />
                  공구 시작하기
                </button>
                <button
                  onClick={() => { setShowOrderForm(false); setOrderForm(EMPTY_ORDER); }}
                  className="flex items-center gap-2 bg-white border border-border text-gray-600 font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  <X className="w-4 h-4" />
                  취소
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* ── Active order status card ── */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-lg">{catInfo?.emoji}</span>
                  <span className="text-xs font-semibold bg-amber-500 text-white px-2.5 py-0.5 rounded-full">
                    주문 모집 중
                  </span>
                  <h2 className="font-extrabold text-gray-800">{order.title}</h2>
                </div>
                <p className="text-sm text-gray-500 mb-3">{order.storeName}</p>
                {order.notice && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-100 rounded-xl px-3 py-2 w-fit">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {order.notice}
                  </div>
                )}
                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold">{formatTimeLeft(order.deadline)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Users className="w-4 h-4 text-amber-500" />
                    <span>{items.length}명 참여 · {paidCount}명 입금</span>
                  </div>
                </div>
              </div>

              {/* Payment summary */}
              <div className="bg-white rounded-xl border border-amber-200 px-4 py-3 text-sm space-y-1.5 min-w-[190px] flex-shrink-0">
                <div className="flex justify-between text-gray-600">
                  <span>상품 합계</span>
                  <span className="font-semibold">{formatCurrency(menuTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>배달비</span>
                  <span className="font-semibold">{formatCurrency(order.deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-xs">
                  <span>1인당 배달비</span>
                  <span>{formatCurrency(deliveryShare)}</span>
                </div>
                <div className="flex justify-between text-gray-800 font-extrabold border-t border-amber-100 pt-1.5 mt-1">
                  <span>총합계</span>
                  <span className="text-amber-600">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Account info */}
            {order.accountNumber && (
              <div className="bg-white border border-amber-200 rounded-xl px-4 py-3">
                <button
                  onClick={() => setShowAccount((v) => !v)}
                  className="w-full flex items-center justify-between text-sm font-semibold text-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-500" />
                    입금 계좌
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showAccount ? "rotate-180" : ""}`} />
                </button>
                {showAccount && (
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-extrabold text-gray-800 font-mono tracking-wide">
                        {order.accountNumber}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {order.accountBank} · {order.accountHolder}
                      </p>
                    </div>
                    <button
                      onClick={handleCopyAccount}
                      className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      복사
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Participant list ── */}
          <div className="bg-white rounded-2xl border border-border shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-extrabold text-gray-800">
                주문 명단
                <span className="text-sm font-semibold text-gray-400 ml-2">({items.length}명)</span>
              </h2>
              <button
                onClick={() => { setMenuForm(EMPTY_MENU); setEditingItemId(null); setShowMenuForm(true); }}
                className="flex items-center gap-2 bg-amber-500 text-white font-semibold px-3.5 py-2 rounded-xl hover:bg-amber-600 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                항목 추가
              </button>
            </div>

            {/* Add / edit menu form */}
            {showMenuForm && (
              <div className="p-5 bg-amber-50 border-b border-amber-100 space-y-3">
                <h3 className="text-sm font-bold text-gray-700">
                  {editingItemId ? "항목 수정" : "항목 추가"}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">참여자 *</label>
                    <select
                      value={menuForm.participantName}
                      onChange={(e) => setMenuForm((p) => ({ ...p, participantName: e.target.value }))}
                      className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white"
                    >
                      <option value="">선택</option>
                      {STUDENTS.map((s) => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">상품 / 메뉴 *</label>
                    <input
                      value={menuForm.menuName}
                      onChange={(e) => setMenuForm((p) => ({ ...p, menuName: e.target.value }))}
                      className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                      placeholder="아이스 아메리카노"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">옵션</label>
                    <input
                      value={menuForm.options}
                      onChange={(e) => setMenuForm((p) => ({ ...p, options: e.target.value }))}
                      className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                      placeholder="얼음 적게"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">가격 (원) *</label>
                    <input
                      type="number"
                      value={menuForm.price}
                      onChange={(e) => setMenuForm((p) => ({ ...p, price: e.target.value }))}
                      className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                      placeholder="2000"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">수량</label>
                    <input
                      type="number"
                      value={menuForm.quantity}
                      min={1}
                      max={99}
                      onChange={(e) => setMenuForm((p) => ({ ...p, quantity: parseInt(e.target.value) || 1 }))}
                      className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">요청사항</label>
                    <input
                      value={menuForm.note}
                      onChange={(e) => setMenuForm((p) => ({ ...p, note: e.target.value }))}
                      className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                      placeholder="달게 해주세요"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddMenu}
                    className="flex items-center gap-1.5 bg-amber-500 text-white font-semibold px-4 py-2 rounded-xl text-sm hover:bg-amber-600 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {editingItemId ? "수정 완료" : "추가하기"}
                  </button>
                  <button
                    onClick={() => { setShowMenuForm(false); setEditingItemId(null); setMenuForm(EMPTY_MENU); }}
                    className="flex items-center gap-1.5 bg-white border border-border text-gray-600 font-semibold px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    취소
                  </button>
                </div>
              </div>
            )}

            {/* Items list */}
            {items.length === 0 ? (
              <div className="p-10 text-center text-sm text-gray-400">
                아직 항목이 없습니다. 위 버튼으로 추가해 보세요.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                      {item.participantName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-800">{item.participantName}</span>
                        <span className="text-sm text-gray-600">{item.menuName}</span>
                        {item.options && (
                          <span className="text-xs text-gray-400">({item.options})</span>
                        )}
                        {item.quantity > 1 && (
                          <span className="text-xs text-gray-400">×{item.quantity}</span>
                        )}
                      </div>
                      {item.note && (
                        <p className="text-xs text-gray-400 mt-0.5">{item.note}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <span className="text-sm font-bold text-gray-700">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => handleToggleStatus(item.id)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors cursor-pointer ${PAYMENT_STATUS_COLORS[item.paymentStatus]}`}
                        title="클릭하여 상태 변경"
                      >
                        {PAYMENT_STATUS_LABELS[item.paymentStatus]}
                      </button>
                      <button
                        onClick={() => handleEditItem(item)}
                        className="text-gray-300 hover:text-blue-500 transition-colors"
                        aria-label="수정"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                        aria-label="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action bar */}
            <div className="flex flex-wrap gap-2.5 p-4 border-t border-border">
              <button
                onClick={handleCopyOrder}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-border text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                <Copy className="w-4 h-4" />
                주문 내용 복사
              </button>
              <button
                onClick={handleClose}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-amber-200 text-amber-600 rounded-xl text-sm font-semibold hover:bg-amber-50 transition-colors"
              >
                공구 마감
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors ml-auto"
              >
                <RotateCcw className="w-4 h-4" />
                초기화
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
