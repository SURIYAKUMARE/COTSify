"use client";
import { useState, useEffect } from "react";
import { ShoppingCart as CartIcon, X, Trash2, ExternalLink, Package, IndianRupee, Download } from "lucide-react";

export interface CartItem {
  name: string;
  category: "hardware" | "software";
  quantity: number;
  estimatedPrice: number;
  searchQuery: string;
  projectTitle: string;
}

const CART_KEY = "cotsify_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return []; }
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const idx = cart.findIndex(c => c.name.toLowerCase() === item.name.toLowerCase());
  if (idx >= 0) {
    cart[idx].quantity += item.quantity;
  } else {
    cart.push(item);
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export function removeFromCart(name: string) {
  const cart = getCart().filter(c => c.name !== name);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export function clearCart() {
  localStorage.setItem(CART_KEY, JSON.stringify([]));
  window.dispatchEvent(new Event("cart-updated"));
}

export default function ShoppingCartPanel() {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const refresh = () => setCart(getCart());

  useEffect(() => {
    refresh();
    window.addEventListener("cart-updated", refresh);
    return () => window.removeEventListener("cart-updated", refresh);
  }, []);

  const total = cart.reduce((s, c) => s + c.estimatedPrice * c.quantity, 0);
  const hw = cart.filter(c => c.category === "hardware");
  const sw = cart.filter(c => c.category === "software");

  const handleExportCart = () => {
    const lines = [
      "# COTsify Shopping Cart",
      `Generated: ${new Date().toLocaleDateString("en-IN")}`,
      `Total Estimated: ₹${total.toLocaleString()}`,
      "",
      "## Hardware Components",
      ...hw.map(c => `- ${c.name} ×${c.quantity} — ₹${(c.estimatedPrice * c.quantity).toLocaleString()} (from: ${c.projectTitle})`),
      "",
      "## Software / Tools",
      ...sw.map(c => `- ${c.name} ×${c.quantity} (from: ${c.projectTitle})`),
      "",
      "## Buy Links",
      ...cart.map(c => `- ${c.name}: https://www.amazon.in/s?k=${encodeURIComponent(c.searchQuery)}`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "COTsify_Cart.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Floating cart button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-12 h-12 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-cyan-600 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 group"
        title="Shopping Cart"
      >
        <CartIcon className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 text-gray-950 text-xs font-bold rounded-full flex items-center justify-center">
            {cart.length > 9 ? "9+" : cart.length}
          </span>
        )}
      </button>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-sm bg-gray-950 border-l border-gray-800 flex flex-col h-full shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-gradient-to-r from-cyan-950/50 to-blue-950/50">
              <div className="flex items-center gap-2">
                <CartIcon className="w-5 h-5 text-cyan-400" />
                <h2 className="text-white font-bold">Shopping Cart</h2>
                <span className="text-xs bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full">{cart.length} items</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white transition-colors p-1.5 hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center">
                    <CartIcon className="w-7 h-7 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Cart is empty</p>
                    <p className="text-gray-500 text-sm">Add components from the Search page</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Hardware */}
                  {hw.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5" /> Hardware ({hw.length})
                      </p>
                      {hw.map(item => (
                        <CartItemRow key={item.name} item={item} onRemove={() => { removeFromCart(item.name); }} />
                      ))}
                    </div>
                  )}
                  {/* Software */}
                  {sw.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2 mt-2">
                        Software ({sw.length})
                      </p>
                      {sw.map(item => (
                        <CartItemRow key={item.name} item={item} onRemove={() => { removeFromCart(item.name); }} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-800 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Estimated Total</span>
                  <span className="text-2xl font-bold text-cyan-400">₹{total.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://www.amazon.in/s?k=${encodeURIComponent(cart[0]?.searchQuery || "electronics")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-700/50 text-orange-400 text-xs font-semibold py-2.5 rounded-xl transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Amazon
                  </a>
                  <a
                    href={`https://robu.in/?s=${encodeURIComponent(cart[0]?.searchQuery || "electronics")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-700/50 text-green-400 text-xs font-semibold py-2.5 rounded-xl transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Robu.in
                  </a>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleExportCart}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-semibold py-2.5 rounded-xl transition-all">
                    <Download className="w-3.5 h-3.5" /> Export List
                  </button>
                  <button onClick={() => { clearCart(); }}
                    className="flex items-center justify-center gap-1.5 bg-red-950/50 hover:bg-red-950 border border-red-900/50 text-red-400 text-xs font-semibold px-3 py-2.5 rounded-xl transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function CartItemRow({ item, onRemove }: { item: CartItem; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl p-3 mb-2 group">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.category === "hardware" ? "bg-cyan-950 text-cyan-400" : "bg-purple-950 text-purple-400"}`}>
        <Package className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-medium truncate">{item.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-gray-500 text-xs">×{item.quantity}</span>
          {item.estimatedPrice > 0 && (
            <span className="text-cyan-400 text-xs font-semibold">₹{(item.estimatedPrice * item.quantity).toLocaleString()}</span>
          )}
          <span className="text-gray-600 text-xs truncate">{item.projectTitle}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <a href={`https://www.amazon.in/s?k=${encodeURIComponent(item.searchQuery)}`}
          target="_blank" rel="noopener noreferrer"
          className="p-1.5 text-gray-600 hover:text-cyan-400 transition-colors rounded-lg hover:bg-gray-800">
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <button onClick={onRemove} className="p-1.5 text-gray-600 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-800">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
