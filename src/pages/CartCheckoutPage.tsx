import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations/i18n";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Mail,
  MapPin,
  Lock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const CartCheckoutPage: React.FC = () => {
  const { language, cart, updateCartQty, removeFromCart, clearCart, addToast, setActivePage } = useApp();

  // Form State
  const [customerName, setCustomerName] = useState("Anisur Rahman");
  const [customerEmail, setCustomerEmail] = useState("anisur.petcare@gmail.com");
  const [customerPhone, setContactPhone] = useState("+880 1712-345678");
  const [deliveryAddress, setDeliveryAddress] = useState("House 42, Road 11, Banani, Dhaka");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bkash" | "cod">("card");

  // Stripe Card Mock Fields
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");

  const [isProcessing, setIsProcessing] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState<any | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.product.priceTk * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 80 : 0; // 80 Tk delivery fee in BD
  const totalAmount = subtotal + deliveryFee;

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      const order = {
        order_id: "FC-ORDER-" + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString(),
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        items: [...cart],
        subtotal,
        deliveryFee,
        totalAmount,
        paymentMethod: paymentMethod.toUpperCase(),
      };

      setInvoiceOrder(order);
      clearCart();
      setIsProcessing(false);
      addToast(
        language === "bn"
          ? "পেমেন্ট সফল হয়েছে! ইনভয়েস পাঠানো হয়েছে।"
          : "Payment Successful! Invoice generated and sent to email.",
        "success"
      );
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Title */}
      <div className="max-w-4xl mx-auto text-center space-y-2">
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase rounded-full">
          Secure Stripe Checkout
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          {getTranslation(language, "cartTitle")}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          {getTranslation(language, "cartSub")}
        </p>
      </div>

      {invoiceOrder ? (
        /* Completed Official Invoice View */
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                PAID & CONFIRMED
              </span>
              <h2 className="text-2xl font-black text-slate-900 font-display mt-2">
                FurCare Official Invoice
              </h2>
              <p className="text-xs text-slate-500">Order ID: #{invoiceOrder.order_id}</p>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold text-slate-800">Date: {invoiceOrder.date}</p>
              <p className="text-slate-500">Sent to: {invoiceOrder.customerEmail}</p>
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
                  <div className="font-bold font-mono">
                    ৳{item.product.priceTk * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-right pt-2 text-xs">
              <p className="text-slate-500">Subtotal: ৳{invoiceOrder.subtotal}</p>
              <p className="text-slate-500">Delivery Fee: ৳{invoiceOrder.deliveryFee}</p>
              <p className="text-lg font-black text-slate-900 font-display">
                Total Paid: ৳{invoiceOrder.totalAmount}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setInvoiceOrder(null)}
              className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
            >
              Back to Home
            </button>
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>
      ) : (
        /* Cart Items & Payment Form Grid */
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm font-display flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-600" />
                  <span>Selected Items ({cart.length})</span>
                </h3>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-rose-600 font-bold hover:underline"
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-3">
                  <ShoppingCart className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="text-xs font-bold">{getTranslation(language, "emptyCartMsg")}</p>
                  <button
                    onClick={() => setActivePage("store")}
                    className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                  >
                    Browse Pet Supermarket
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.product.product_id}
                      className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.nameEn}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />

                      <div className="flex-1 space-y-1">
                        <h4 className="font-bold text-slate-900 text-xs line-clamp-1">
                          {language === "bn" ? item.product.nameBn : item.product.nameEn}
                        </h4>
                        <p className="text-xs font-extrabold text-emerald-700">
                          ৳{item.product.priceTk} each
                        </p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQty(item.product.product_id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-xs"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-xs font-mono">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQty(item.product.product_id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.product_id)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Checkout Payment Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm font-display flex items-center gap-2 border-b border-slate-100 pb-3">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>Payment & Invoice Details</span>
              </h3>

              <form onSubmit={handlePayNow} className="space-y-3 text-xs">
                
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email for Automated Invoice</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Delivery Address in BD</label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                {/* Stripe Card Elements */}
                <div className="p-3 bg-slate-900 text-white rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span className="font-bold">Stripe Card Gateway</span>
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-xs"
                    />
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Pricing Calculation */}
                <div className="space-y-1 border-t border-slate-100 pt-3">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span>৳{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery Fee:</span>
                    <span>৳{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between font-black text-slate-900 text-sm pt-1">
                    <span>Total Amount:</span>
                    <span>৳{totalAmount}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={cart.length === 0 || isProcessing}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-extrabold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isProcessing ? "Processing Stripe..." : `Pay ৳${totalAmount} Now`}</span>
                </button>

              </form>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
