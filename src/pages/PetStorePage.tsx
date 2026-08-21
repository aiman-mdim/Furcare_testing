import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations/i18n";
import { mockProducts } from "../data/mockData";
import { Product } from "../types";
import {
  Store,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Star,
  Check,
  Filter,
} from "lucide-react";

export const PetStorePage: React.FC = () => {
  const { language, cart, addToCart, updateCartQty, removeFromCart, setActivePage } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSpecies, setSelectedSpecies] = useState<string>("all");

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nameBn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSpecies = selectedSpecies === "all" || product.targetSpecies === "all" || product.targetSpecies === selectedSpecies;
    return matchesSearch && matchesCategory && matchesSpecies;
  });

  const getCartQuantity = (productId: string) => {
    const item = cart.find((i) => i.product.product_id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Title */}
      <div className="max-w-4xl mx-auto text-center space-y-2">
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase rounded-full">
          Pet Supermarket BD
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          {getTranslation(language, "storeTitle")}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          {language === "bn"
            ? "রয়েল ক্যানিন, রিফ্লেক্স, অক্সবো ও অন্যান্য বিশ্বমানের পেট ব্র্যান্ডের খাবার ও অ্যাক্সেসরিজ অনলাইনে অর্ডার করুন।"
            : "Order authentic pet food, toys, grooming tools, and accessories. Fast home delivery across Bangladesh."}
        </p>
      </div>

      {/* Supermarket Search & Filter Header Bar */}
      <div className="max-w-6xl mx-auto bg-white p-4 rounded-3xl shadow-md border border-slate-200 space-y-4" id="store-supermarket-bar">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 flex items-center gap-2 w-full">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search food, salmon, harness, toys, hay..."
              className="w-full text-xs text-slate-800 bg-transparent focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700"
            >
              <option value="all">All Species</option>
              <option value="dog">Dogs (কুকুর)</option>
              <option value="cat">Cats (বিড়াল)</option>
              <option value="rabbit">Rabbits (খরগোশ)</option>
            </select>

            <button
              onClick={() => setActivePage("cart")}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
            </button>
          </div>

        </div>

        {/* Category Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-3">
          {[
            { id: "all", key: "allProducts" },
            { id: "food", key: "foodCategory" },
            { id: "accessories", key: "accessoriesCategory" },
            { id: "toys", key: "toysCategory" },
            { id: "grooming", key: "groomingCategory" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {getTranslation(language, cat.key as any)}
            </button>
          ))}
        </div>
      </div>

      {/* Product Supermarket Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const qtyInCart = getCartQuantity(product.product_id);

          return (
            <div
              key={product.product_id}
              className="bg-white rounded-3xl p-5 shadow-md border border-slate-200 hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                
                {/* Image & Price Tag */}
                <div className="relative rounded-2xl overflow-hidden h-48 bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.nameEn}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  {product.originalPriceTk && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-rose-500 text-white text-[10px] font-extrabold rounded-md shadow-xs">
                      SAVE ৳{product.originalPriceTk - product.priceTk}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-slate-900/80 text-white backdrop-blur-md rounded-lg text-xs font-black">
                    ৳{product.priceTk}
                  </span>
                </div>

                {/* Rating & Stock */}
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating} ({product.reviewsCount})</span>
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">
                    {getTranslation(language, "inStock")} ({product.stock})
                  </span>
                </div>

                {/* Product Name & Description */}
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-display leading-snug line-clamp-2">
                    {language === "bn" ? product.nameBn : product.nameEn}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {language === "bn" ? product.descriptionBn : product.descriptionEn}
                  </p>
                </div>

              </div>

              {/* Quantity Increase / Decrease / Add to Cart Controls */}
              <div className="pt-2 border-t border-slate-100">
                {qtyInCart > 0 ? (
                  <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                    <button
                      onClick={() => updateCartQty(product.product_id, qtyInCart - 1)}
                      className="w-8 h-8 rounded-xl bg-white text-slate-800 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center font-bold shadow-xs"
                    >
                      {qtyInCart === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                    </button>

                    <span className="font-black text-slate-900 text-xs">
                      {qtyInCart} in Cart
                    </span>

                    <button
                      onClick={() => updateCartQty(product.product_id, qtyInCart + 1)}
                      className="w-8 h-8 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center font-bold shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{getTranslation(language, "addToCartBtn")}</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

  </div>
  );
};
