import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { ordersApi } from "../services/orders";
import {
  ShoppingCart,
  Trash2,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Banknote,
  HeartHandshake,
  Stethoscope,
  Scissors,
  Crown,
  Store,
  Loader2,
} from "lucide-react";
import { PaymentMethod } from "../types";

type PaymentCard = "visa" | "mastercard" | "american_express";

export const CartCheckoutPage: React.FC = () => {
  const {
    language,
    cart,
    removeFromCart,
    clearCart,
    addToast,
    setActivePage,
    requireAuth,
  } = useApp();

  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cash");

  const [cardType, setCardType] =
    useState<PaymentCard>("visa");

  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [bkashNumber, setBkashNumber] = useState("");
  const [bkashTransactionId, setBkashTransactionId] =
    useState("");

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [completedOrder, setCompletedOrder] =
    useState<any | null>(null);

  const hasAdoption = cart.some(
    (item) => item.type === "adoption"
  );

  const hasPaidItems = cart.some(
    (item) => item.type !== "adoption"
  );

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum +
          item.product.priceTk *
            item.quantity,
        0
      ),
    [cart]
  );

  /*
   * Adoption requests are free.
   *
   * Delivery fee is only applied to actual
   * store purchases.
   */
  const hasStoreProduct = cart.some(
    (item) => item.type === "product"
  );

  const deliveryFee =
    hasStoreProduct && subtotal > 0
      ? 60
      : 0;

  const totalAmount =
    subtotal + deliveryFee;

  const isAdoptionOnly =
    cart.length > 0 &&
    cart.every(
      (item) => item.type === "adoption"
    );

  const getItemIcon = (
    type: string
  ) => {
    switch (type) {
      case "adoption":
        return (
          <HeartHandshake className="w-5 h-5 text-rose-500" />
        );

      case "vet_appointment":
        return (
          <Stethoscope className="w-5 h-5 text-blue-500" />
        );

      case "grooming_service":
        return (
          <Scissors className="w-5 h-5 text-purple-500" />
        );

      case "premium_plan":
        return (
          <Crown className="w-5 h-5 text-amber-500" />
        );

      default:
        return (
          <Store className="w-5 h-5 text-emerald-500" />
        );
    }
  };

  const validatePayment = (): boolean => {
    if (isAdoptionOnly) {
      return true;
    }

    if (!paymentMethod) {
      addToast(
        "Please select a payment method.",
        "warning"
      );
      return false;
    }

    if (
      paymentMethod === "visa" ||
      paymentMethod === "mastercard" ||
      paymentMethod ===
        "american_express"
    ) {
      if (
        !cardHolder.trim() ||
        !cardNumber.trim() ||
        !expiry.trim() ||
        !cvv.trim()
      ) {
        addToast(
          "Please complete all card fields.",
          "warning"
        );
        return false;
      }

      const cleanNumber =
        cardNumber.replace(/\s/g, "");

      if (
        !/^\d{13,19}$/.test(
          cleanNumber
        )
      ) {
        addToast(
          "Enter a valid demo card number.",
          "warning"
        );
        return false;
      }

      if (!/^\d{3,4}$/.test(cvv)) {
        addToast(
          "Enter a valid CVV.",
          "warning"
        );
        return false;
      }
    }

    if (paymentMethod === "bkash") {
      if (
        !bkashNumber.trim() ||
        !bkashTransactionId.trim()
      ) {
        addToast(
          "Enter bKash number and transaction ID.",
          "warning"
        );
        return false;
      }
    }

    return true;
  };

  const handleCheckout = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!requireAuth()) {
      return;
    }

    if (cart.length === 0) {
      return;
    }

    if (!validatePayment()) {
      return;
    }

    setIsProcessing(true);

    try {
      let finalPaymentMethod:
        PaymentMethod = paymentMethod;

      if (isAdoptionOnly) {
        finalPaymentMethod = "none";
      }

      const orderItems = cart.map(
        (item) => ({
          itemId:
            item.id ||
            `${item.type}-${item.product.product_id}`,

          productId:
            item.product.product_id,

          name:
            language === "bn"
              ? item.product.nameBn
              : item.product.nameEn,

          quantity:
            item.quantity,

          priceTk:
            item.product.priceTk,

          type:
            item.type,

          customData:
            item.customData || {},
        })
      );

      const order =
        await ordersApi.createOrder({
          items: orderItems,

          subtotal,

          deliveryFee,

          totalAmount,

          paymentMethod:
            finalPaymentMethod,

          customerEmail,

          customerPhone,

          deliveryAddress,
        });

      setCompletedOrder(order);

      clearCart();

      addToast(
        isAdoptionOnly
          ? "Adoption request submitted successfully."
          : "Payment successful and order confirmed.",
        "success"
      );
    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      addToast(
        error instanceof Error
          ? error.message
          : "Checkout failed. Please try again.",
        "warning"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="min-h-screen bg-emerald-50/40 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-emerald-100 p-8">

          <div className="text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />

            <h1 className="text-3xl font-black text-emerald-950">
              {completedOrder.items?.some(
                (item: any) =>
                  item.type === "adoption"
              )
                ? "Adoption Request Submitted"
                : "Payment Successful"}
            </h1>

            <p className="text-sm text-slate-500">
              Order ID:
              {" "}
              <strong>
                {completedOrder.orderId}
              </strong>
            </p>
          </div>

          <div className="mt-8 border rounded-2xl divide-y">
            {completedOrder.items?.map(
              (item: any, index: number) => (
                <div
                  key={`${item.productId}-${index}`}
                  className="p-4 flex justify-between"
                >
                  <div>
                    <p className="font-bold">
                      {item.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <strong>
                    ৳
                    {item.priceTk *
                      item.quantity}
                  </strong>
                </div>
              )
            )}
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <strong>
                ৳{completedOrder.subtotal}
              </strong>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <strong>
                ৳{completedOrder.deliveryFee}
              </strong>
            </div>

            <div className="flex justify-between text-lg font-black border-t pt-3">
              <span>Total</span>
              <strong className="text-emerald-600">
                ৳{completedOrder.totalAmount}
              </strong>
            </div>

            <div className="flex justify-between">
              <span>Payment</span>
              <strong>
                {completedOrder.paymentStatus ===
                "not_required"
                  ? "Not Required"
                  : completedOrder.paymentMethod}
              </strong>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() =>
                setActivePage("dashboard")
              }
              className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold"
            >
              View My Orders
            </button>

            <button
              onClick={() =>
                setCompletedOrder(null)
              }
              className="flex-1 py-3 bg-slate-100 rounded-xl font-bold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/40 py-10 px-4">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-black text-emerald-950 text-center mb-8">
          Cart & Checkout
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <ShoppingCart className="w-14 h-14 mx-auto text-emerald-300" />

            <p className="mt-4 font-bold text-slate-500">
              Your cart is empty.
            </p>

            <button
              onClick={() =>
                setActivePage("store")
              }
              className="mt-5 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold"
            >
              Browse Store
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleCheckout}
            className="grid grid-cols-1 lg:grid-cols-7 gap-8"
          >

            {/* CART */}
            <div className="lg:col-span-4 space-y-4">

              {cart.map((item) => (
                <div
                  key={
                    item.id ||
                    `${item.type}-${item.product.product_id}`
                  }
                  className="bg-white rounded-2xl border p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center">
                        {getItemIcon(item.type)}
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900">
                          {language === "bn"
                            ? item.product.nameBn
                            : item.product.nameEn}
                        </h3>

                        <p className="text-xs text-slate-500">
                          {item.type.replace(
                            "_",
                            " "
                          )}
                        </p>

                        {item.customData &&
                          item.type ===
                            "vet_appointment" && (
                            <p className="text-xs text-blue-600">
                              {item.customData.date}
                              {" • "}
                              {item.customData.time}
                            </p>
                          )}

                        {item.customData &&
                          item.type ===
                            "grooming_service" && (
                            <p className="text-xs text-purple-600">
                              {
                                item.customData
                                  .groomingType
                              }
                            </p>
                          )}
                      </div>
                    </div>

                    <div className="text-right">

                      <p className="font-black">
                        ৳
                        {item.product.priceTk *
                          item.quantity}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(
                            item.product.product_id
                          )
                        }
                        className="mt-2 text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </div>
                </div>
              ))}

            </div>

            {/* CHECKOUT */}
            <div className="lg:col-span-3">

              <div className="bg-white rounded-3xl border shadow-md p-6 space-y-5">

                <h2 className="font-black text-xl">
                  Checkout
                </h2>

                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={customerEmail}
                  onChange={(e) =>
                    setCustomerEmail(
                      e.target.value
                    )
                  }
                  className="w-full p-3 rounded-xl border bg-slate-50 text-sm"
                />

                <input
                  type="tel"
                  required
                  placeholder="Phone"
                  value={customerPhone}
                  onChange={(e) =>
                    setCustomerPhone(
                      e.target.value
                    )
                  }
                  className="w-full p-3 rounded-xl border bg-slate-50 text-sm"
                />

                {!isAdoptionOnly && (
                  <textarea
                    required={hasStoreProduct}
                    placeholder="Delivery Address"
                    value={deliveryAddress}
                    onChange={(e) =>
                      setDeliveryAddress(
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full p-3 rounded-xl border bg-slate-50 text-sm"
                  />
                )}

                {isAdoptionOnly ? (
                  <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4">

                    <div className="flex items-center gap-2 text-rose-700 font-black">
                      <HeartHandshake className="w-5 h-5" />
                      Adoption Request
                    </div>

                    <p className="text-xs text-rose-600 mt-2">
                      No payment is required for pet adoption.
                      Submit the request for review.
                    </p>

                  </div>
                ) : (
                  <>
                    <h3 className="font-bold">
                      Payment Method
                    </h3>

                    {/* CASH */}
                    <button
                      type="button"
                      onClick={() =>
                        setPaymentMethod("cash")
                      }
                      className={`w-full p-3 rounded-xl border text-left ${
                        paymentMethod === "cash"
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-slate-200"
                      }`}
                    >
                      <Banknote className="inline w-5 h-5 mr-2" />
                      Cash
                    </button>

                    {/* CARD */}
                    <div className="space-y-2">

                      <p className="text-xs font-bold text-slate-500">
                        CARD
                      </p>

                      {[
                        [
                          "visa",
                          "Visa",
                        ],
                        [
                          "mastercard",
                          "Mastercard",
                        ],
                        [
                          "american_express",
                          "American Express",
                        ],
                      ].map(
                        ([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => {
                              setPaymentMethod(
                                value as PaymentMethod
                              );
                              setCardType(
                                value as PaymentCard
                              );
                            }}
                            className={`w-full p-3 rounded-xl border text-left ${
                              paymentMethod ===
                              value
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200"
                            }`}
                          >
                            <CreditCard className="inline w-5 h-5 mr-2" />
                            {label}
                          </button>
                        )
                      )}

                    </div>

                    {(paymentMethod === "visa" ||
                      paymentMethod ===
                        "mastercard" ||
                      paymentMethod ===
                        "american_express") && (
                      <div className="space-y-3 p-4 bg-slate-50 rounded-2xl">

                        <p className="text-xs font-bold">
                          Demo {cardType} Payment
                        </p>

                        <input
                          placeholder="Card Holder Name"
                          value={cardHolder}
                          onChange={(e) =>
                            setCardHolder(
                              e.target.value
                            )
                          }
                          className="w-full p-3 rounded-xl border"
                        />

                        <input
                          placeholder="Card Number"
                          value={cardNumber}
                          onChange={(e) =>
                            setCardNumber(
                              e.target.value
                            )
                          }
                          maxLength={19}
                          className="w-full p-3 rounded-xl border"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={(e) =>
                              setExpiry(
                                e.target.value
                              )
                            }
                            className="p-3 rounded-xl border"
                          />

                          <input
                            placeholder="CVV"
                            type="password"
                            value={cvv}
                            onChange={(e) =>
                              setCvv(
                                e.target.value
                              )
                            }
                            className="p-3 rounded-xl border"
                          />
                        </div>

                        <p className="text-[10px] text-slate-500">
                          University project demo only.
                          No real card payment is processed.
                        </p>
                      </div>
                    )}

                    {/* BKASH */}
                    <button
                      type="button"
                      onClick={() =>
                        setPaymentMethod("bkash")
                      }
                      className={`w-full p-3 rounded-xl border text-left ${
                        paymentMethod === "bkash"
                          ? "border-pink-500 bg-pink-50"
                          : "border-slate-200"
                      }`}
                    >
                      <Smartphone className="inline w-5 h-5 mr-2" />
                      bKash
                    </button>

                    {paymentMethod === "bkash" && (
                      <div className="space-y-3 p-4 bg-pink-50 rounded-2xl">

                        <input
                          placeholder="bKash Number"
                          value={bkashNumber}
                          onChange={(e) =>
                            setBkashNumber(
                              e.target.value
                            )
                          }
                          className="w-full p-3 rounded-xl border"
                        />

                        <input
                          placeholder="Transaction ID"
                          value={
                            bkashTransactionId
                          }
                          onChange={(e) =>
                            setBkashTransactionId(
                              e.target.value
                            )
                          }
                          className="w-full p-3 rounded-xl border"
                        />

                        <p className="text-[10px] text-slate-500">
                          Simulated bKash payment for university project.
                        </p>
                      </div>
                    )}
                  </>
                )}

                <div className="border-t pt-4 space-y-2">

                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <strong>৳{subtotal}</strong>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Delivery</span>
                    <strong>৳{deliveryFee}</strong>
                  </div>

                  <div className="flex justify-between text-xl font-black">
                    <span>Total</span>
                    <strong className="text-emerald-600">
                      ৳{totalAmount}
                    </strong>
                  </div>

                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl font-black flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : isAdoptionOnly ? (
                    "Confirm Adoption Request"
                  ) : (
                    `Pay ৳${totalAmount}`
                  )}
                </button>

              </div>

            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default CartCheckoutPage; 
