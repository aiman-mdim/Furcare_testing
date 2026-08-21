import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations/i18n";
import {
  ShoppingCart,
  Trash2,
  FileText,
  CheckCircle2,
} from "lucide-react";

export const CartCheckoutPage: React.FC = () => {
  const { language, cart, removeFromCart, clearCart, addToast, setActivePage, requireAuth } = useApp();

  // Form State
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState<any | null>(null);

  // Pricing calculation matching defaults (Tk 60 Delivery Fee)
  const subtotal = cart.reduce((acc, item) => acc + item.product.priceTk * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 60 : 0; 
  const totalAmount = subtotal + deliveryFee;

  const handleReviewPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth()) return;
    if (cart.length === 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      const order = {
        order_id: "FC-ORDER-" + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString(),
        customerEmail,
        customerPhone,
        deliveryAddress,
        items: [...cart],
        subtotal,
        deliveryFee,
        totalAmount,
      };

      setInvoiceOrder(order);
      clearCart();
      setIsProcessing(false);
      addToast(
        language === "bn"
          ? "অর্ডার সফল হয়েছে! ইনভয়েস পাঠানো হয়েছে।"
          : "Order Successful! Invoice generated and sent to email.",
        "success"
      );
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-emerald-50/40 py-10 px-4 sm:px-6 lg:px-8 space-y-12 text-slate-800">
      
      {/* Title Header */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 font-display">
          Your Cart
        </h1>
      </div>

      {invoiceOrder ? (
        /* Completed Official Invoice View */
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-xl border border-emerald-100 space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
            <div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full flex items-center gap-1 w-fit">
                <CheckCircle2 className="w-3.5 h-3.5" /> CONFIRMED
              </span>
              <h2 className="text-2xl font-black text-emerald-950 font-display mt-2">
                FurCare Official Invoice
              </h2>
              <p className="text-xs text-slate-500">Order ID: #{invoiceOrder.order_id}</p>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold text-slate-800">Date: {invoiceOrder.date}</p>
              <p className="text-slate-500">Sent to: {invoiceOrder.customerEmail || "N/A"}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-800">Order Summary:</h3>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {invoiceOrder.items.map((item: any) => (
                <div key={item.product.product_id} className="p-3 flex items-center justify-between">
                  <div className="font-medium text-slate-900">
                    {language === "bn" ? item.product.nameBn : item.product.nameEn} (x{item.quantity})
                  </div>
                  <div className="font-bold font-mono text-emerald-700">
                    Tk {item.product.priceTk * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-right pt-2 text-xs">
              <p className="text-slate-500">Sub-Total: Tk {invoiceOrder.subtotal}</p>
              <p className="text-slate-500">Delivery Charge: Tk {invoiceOrder.deliveryFee}</p>
              <p className="text-lg font-black text-emerald-900 font-display">
                Total: Tk {invoiceOrder.totalAmount}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setInvoiceOrder(null)}
              className="px-5 py-2.5 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-900 transition-colors"
            >
              Back to Store
            </button>
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>
      ) : (
        /* Cart Items & Delivery Section Grid */
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-7 space-y-3">
            {cart.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-slate-400 space-y-3 border border-emerald-100 shadow-sm">
                <ShoppingCart className="w-12 h-12 mx-auto text-emerald-300" />
                <p className="text-sm font-semibold">{getTranslation(language, "emptyCartMsg")}</p>
                <button
                  onClick={() => setActivePage("store")}
                  className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Browse Pet Supermarket
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.product_id}
                  className="flex items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                      <ShoppingCart className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm truncate">
                        {language === "bn" ? item.product.nameBn : item.product.nameEn}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Tk {item.product.priceTk} X {item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <span className="font-bold text-sm text-slate-800 min-w-[60px] text-right">
                      Tk {item.product.priceTk * item.quantity}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product.product_id)}
                      className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Column: Delivery and Invoice Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-emerald-100 space-y-5">
              <h3 className="font-bold text-slate-900 text-center text-base">
                Delivery and Invoice
              </h3>

              <form onSubmit={handleReviewPayment} className="space-y-3">
                <input
                  type="email"
                  placeholder="Email....."
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />

                <input
                  type="tel"
                  placeholder="Phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />

                <textarea
                  placeholder="Delivery Address"
                  rows={3}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none"
                />

                {/* Price Breakdown */}
                <div className="space-y-2 pt-2 text-xs font-medium text-slate-700">
                  <div className="flex justify-between">
                    <span>Sub-Total</span>
                    <span className="font-bold text-slate-900">Tk {subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span className="font-bold text-slate-900">Tk {deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-100">
                    <span>Total</span>
                    <span className="text-emerald-700">Tk {totalAmount}</span>
                  </div>
                </div>

                {/* Review Payment & Address Button */}
                <button
                  type="submit"
                  disabled={cart.length === 0 || isProcessing}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-md transition-colors mt-2"
                >
                  {isProcessing ? "Processing..." : "Review Payment & Address"}
                </button>

                <p className="text-[10px] text-center text-slate-400 font-medium pt-1">
                  Cash On Delivery Or Bkash . Invoice emailed instantly
                </p>
              </form>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
