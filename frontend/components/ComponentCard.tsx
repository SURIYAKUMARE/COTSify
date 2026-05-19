"use client";
import { useState } from "react";
import { Component } from "@/lib/api";
import { Cpu, Code, Bookmark, BookmarkCheck, ExternalLink, Zap, ShoppingCart, Plus, Check } from "lucide-react";
import { addToCart } from "@/components/ShoppingCart";
import WiringDiagramModal from "@/components/WiringDiagramModal";

interface Props {
  component: Component;
  bookmarked: boolean;
  onToggleBookmark: (name: string) => void;
  onCompare: (component: Component) => void;
  projectTitle?: string;
}

const HARDWARE_UNIT_COST = 350;

export default function ComponentCard({ component, bookmarked, onToggleBookmark, onCompare, projectTitle = "" }: Props) {
  const isHardware = component.category === "hardware";
  const [addedToCart, setAddedToCart] = useState(false);
  const [wiringOpen, setWiringOpen] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      name: component.name,
      category: component.category,
      quantity: component.quantity || 1,
      estimatedPrice: isHardware ? HARDWARE_UNIT_COST : 0,
      searchQuery: component.search_query,
      projectTitle,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-3 hover:border-cyan-800 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 group">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg flex-shrink-0 ${isHardware ? "bg-cyan-950 text-cyan-400" : "bg-purple-950 text-purple-400"}`}>
              {isHardware ? <Cpu className="w-4 h-4" /> : <Code className="w-4 h-4" />}
            </span>
            <div>
              <h3 className="text-white font-medium text-sm leading-tight group-hover:text-cyan-300 transition-colors">{component.name}</h3>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${isHardware ? "bg-cyan-950 text-cyan-400" : "bg-purple-950 text-purple-400"}`}>
                {component.category}
              </span>
            </div>
          </div>
          <button
            onClick={() => onToggleBookmark(component.name)}
            className="text-gray-500 hover:text-yellow-400 transition-colors flex-shrink-0"
            title={bookmarked ? "Remove bookmark" : "Bookmark"}
          >
            {bookmarked ? <BookmarkCheck className="w-4 h-4 text-yellow-400" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        <p className="text-gray-400 text-xs leading-relaxed">{component.description}</p>

        {/* Qty + price estimate */}
        <div className="flex items-center justify-between">
          {component.quantity > 1 && (
            <span className="text-xs text-gray-500">Qty: <span className="text-gray-300">{component.quantity}</span></span>
          )}
          {isHardware && (
            <span className="text-xs text-cyan-500 ml-auto">~₹{(HARDWARE_UNIT_COST * (component.quantity || 1)).toLocaleString()}</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-auto grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onCompare(component)}
            className="col-span-1 flex items-center justify-center gap-1 text-xs bg-gray-800 hover:bg-cyan-900 text-gray-400 hover:text-cyan-300 border border-gray-700 hover:border-cyan-700 rounded-lg py-2 transition-all"
            title="Compare prices"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {isHardware && (
            <button
              onClick={() => setWiringOpen(true)}
              className="col-span-1 flex items-center justify-center gap-1 text-xs bg-gray-800 hover:bg-blue-900 text-gray-400 hover:text-blue-300 border border-gray-700 hover:border-blue-700 rounded-lg py-2 transition-all"
              title="Wiring guide"
            >
              <Zap className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleAddToCart}
            className={`${isHardware ? "col-span-1" : "col-span-2"} flex items-center justify-center gap-1 text-xs rounded-lg py-2 transition-all border ${
              addedToCart
                ? "bg-green-950 text-green-400 border-green-800"
                : "bg-gray-800 hover:bg-green-900 text-gray-400 hover:text-green-300 border-gray-700 hover:border-green-700"
            }`}
            title="Add to cart"
          >
            {addedToCart ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            {addedToCart ? "Added" : "Cart"}
          </button>
        </div>
      </div>

      <WiringDiagramModal
        componentName={wiringOpen ? component.name : null}
        onClose={() => setWiringOpen(false)}
      />
    </>
  );
}
