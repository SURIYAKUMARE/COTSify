"use client";
import { useState } from "react";
import { Component } from "@/lib/api";
import {
  Cpu, Code, Bookmark, BookmarkCheck, ExternalLink, Zap,
  ShoppingCart, Check, CircuitBoard, Wifi, Activity,
  Settings, Battery, Layers, Package,
} from "lucide-react";
import { addToCart } from "@/components/ShoppingCart";
import WiringDiagramModal from "@/components/WiringDiagramModal";
import ComponentBadge from "@/components/ComponentBadge";
import { CATALOG_DATA } from "@/lib/catalog-data";

interface Props {
  component: Component;
  bookmarked: boolean;
  onToggleBookmark: (name: string) => void;
  onCompare: (component: Component) => void;
  projectTitle?: string;
}

const HARDWARE_UNIT_COST = 350;

// Map component name keywords → icon + gradient for the image area
function getComponentVisual(name: string): { icon: React.ReactNode; gradient: string } {
  const n = name.toLowerCase();
  if (n.includes("arduino") || n.includes("esp") || n.includes("raspberry") || n.includes("stm32") || n.includes("attiny") || n.includes("jetson") || n.includes("pico"))
    return { icon: <CircuitBoard className="w-10 h-10" />, gradient: "from-cyan-900 to-blue-900 text-cyan-400" };
  if (n.includes("wifi") || n.includes("bluetooth") || n.includes("hc-05") || n.includes("hc-06") || n.includes("nrf") || n.includes("lora") || n.includes("rf") || n.includes("gsm") || n.includes("gps"))
    return { icon: <Wifi className="w-10 h-10" />, gradient: "from-sky-900 to-blue-900 text-sky-400" };
  if (n.includes("sensor") || n.includes("dht") || n.includes("bmp") || n.includes("bme") || n.includes("mpu") || n.includes("pir") || n.includes("ultrasonic") || n.includes("ldr") || n.includes("mq-") || n.includes("rfid") || n.includes("soil") || n.includes("flame") || n.includes("rain") || n.includes("sound"))
    return { icon: <Activity className="w-10 h-10" />, gradient: "from-green-900 to-teal-900 text-green-400" };
  if (n.includes("motor") || n.includes("servo") || n.includes("stepper") || n.includes("l298") || n.includes("l293") || n.includes("driver") || n.includes("relay") || n.includes("pump"))
    return { icon: <Settings className="w-10 h-10" />, gradient: "from-orange-900 to-amber-900 text-orange-400" };
  if (n.includes("battery") || n.includes("charger") || n.includes("regulator") || n.includes("buck") || n.includes("boost") || n.includes("lm78") || n.includes("tp40") || n.includes("18650"))
    return { icon: <Battery className="w-10 h-10" />, gradient: "from-amber-900 to-yellow-900 text-amber-400" };
  if (n.includes("oled") || n.includes("lcd") || n.includes("tft") || n.includes("display") || n.includes("matrix") || n.includes("segment"))
    return { icon: <Layers className="w-10 h-10" />, gradient: "from-purple-900 to-violet-900 text-purple-400" };
  if (n.includes("breadboard") || n.includes("jumper") || n.includes("solder") || n.includes("multimeter") || n.includes("logic") || n.includes("usb") || n.includes("dupont"))
    return { icon: <Package className="w-10 h-10" />, gradient: "from-amber-900 to-orange-900 text-amber-400" };
  if (n.includes("chassis") || n.includes("wheel") || n.includes("arm") || n.includes("standoff"))
    return { icon: <Settings className="w-10 h-10" />, gradient: "from-emerald-900 to-green-900 text-emerald-400" };
  // hardware default
  return { icon: <Cpu className="w-10 h-10" />, gradient: "from-cyan-900 to-blue-900 text-cyan-400" };
}

// Look up catalog image for this component by name match
function getCatalogImage(name: string): string | null {
  const n = name.toLowerCase();
  const match = CATALOG_DATA.find(p =>
    p.name.toLowerCase().includes(n) ||
    n.includes(p.name.toLowerCase().split(" ").slice(0, 2).join(" ").toLowerCase())
  );
  if (match && match.image_url && !match.image_url.includes("placehold.co")) {
    return match.image_url;
  }
  return null;
}

function HardwareImage({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { icon, gradient } = getComponentVisual(name);
  const imageUrl = getCatalogImage(name);

  const showIcon = !imageUrl || failed;

  return (
    <div className={`w-full h-28 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br ${gradient} relative`}>
      {showIcon ? (
        <div className="flex flex-col items-center gap-1.5 opacity-80">
          {icon}
          <span className="text-xs font-medium text-center px-3 leading-tight opacity-70 line-clamp-2">{name}</span>
        </div>
      ) : (
        <>
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-80">
              {icon}
            </div>
          )}
          <img
            src={imageUrl!}
            alt={name}
            className={`w-full h-full object-contain p-2 transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        </>
      )}
    </div>
  );
}

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

        {/* Image area — hardware only */}
        {isHardware && <HardwareImage name={component.name} />}

        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg flex-shrink-0 ${isHardware ? "bg-cyan-950 text-cyan-400" : "bg-purple-950 text-purple-400"}`}>
              {isHardware ? <Cpu className="w-4 h-4" /> : <Code className="w-4 h-4" />}
            </span>
            <div>
              <h3 className="text-white font-medium text-sm leading-tight group-hover:text-cyan-300 transition-colors">{component.name}</h3>
              <ComponentBadge
                label={component.category}
                variant={isHardware ? "hardware" : "software"}
                size="xs"
                className="mt-0.5"
              />
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
