"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CatalogProduct } from "@/lib/catalog-types";
import { CATALOG_DATA } from "@/lib/catalog-data";
import RouteGuard from "@/components/RouteGuard";
import Link from "next/link";
import {
  GitCompare, ArrowLeft, Check, X, Star, ExternalLink,
  ShoppingCart, Cpu, Zap, Package, AlertCircle, Trophy, TrendingDown
} from "lucide-react";

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idsParam = searchParams.get("ids");
  
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!idsParam) { setLoading(false); return; }
    // Use local catalog data — no backend needed
    const ids = idsParam.split(",");
    const overrides: Record<string, Partial<CatalogProduct>> = (() => {
      try { return JSON.parse(localStorage.getItem("admin_catalog_overrides") || "{}"); } catch { return {}; }
    })();
    const found = CATALOG_DATA
      .filter(p => ids.includes(p.id))
      .map(p => ({ ...p, ...overrides[p.id] }));
    setProducts(found);
    setLoading(false);
  }, [idsParam]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 text-gray-400">
        <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm">Loading comparison data...</p>
      </div>
    );
  }

  if (!idsParam || products.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="text-center py-20 px-6 max-w-md bg-gray-900/50 border border-gray-800 rounded-2xl">
          <div className="w-16 h-16 bg-cyan-950/50 border border-cyan-800/50 rounded-full flex items-center justify-center mx-auto mb-5">
            <GitCompare className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Nothing to compare</h2>
          <p className="text-gray-400 text-sm mb-6">Select components from the catalog to see their side-by-side comparison.</p>
          <Link href="/catalog" className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-all">
            Go to Catalog
          </Link>
        </div>
      </div>
    );
  }

  // Get all unique specification keys across all products
  const allSpecKeys = Array.from(new Set(products.flatMap(p => Object.keys(p.specifications))));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-white rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white">Compare Components</h1>
          </div>
          <p className="text-gray-400 text-sm">Detailed side-by-side technical comparison</p>
        </div>
      </div>

      {/* Winner banner */}
      {products.length >= 2 && products.some(p => p.price_inr) && (() => {
        const priced = products.filter(p => p.price_inr);
        const cheapest = priced.reduce((a, b) => (a.price_inr || 0) < (b.price_inr || 0) ? a : b);
        const highestRated = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
        return (
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 bg-green-950/40 border border-green-800/50 rounded-2xl px-4 py-3">
              <TrendingDown className="w-5 h-5 text-green-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Best Price</p>
                <p className="text-white font-semibold text-sm">{cheapest.name}</p>
                <p className="text-green-400 font-bold">₹{cheapest.price_inr?.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-yellow-950/40 border border-yellow-800/50 rounded-2xl px-4 py-3">
              <Trophy className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Highest Rated</p>
                <p className="text-white font-semibold text-sm">{highestRated.name}</p>
                <p className="text-yellow-400 font-bold">{highestRated.rating} ★</p>
              </div>
            </div>
          </div>
        );
      })()}

      {error && (
        <div className="flex items-center gap-2 bg-red-950/50 border border-red-800 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="overflow-x-auto pb-6">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr>
              <th className="w-48 bg-gray-950 border-b border-gray-800 p-4 text-left z-10 sticky left-0">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Features & Specs</span>
              </th>
              {products.map(p => (
                <th key={p.id} className="min-w-[280px] w-[280px] bg-gray-900/50 border border-gray-800 p-6 align-top rounded-t-2xl">
                  <div className="relative">
                    <button 
                      onClick={() => {
                        const newIds = products.filter(x => x.id !== p.id).map(x => x.id).join(",");
                        router.replace(`/compare?ids=${newIds}`);
                      }}
                      className="absolute -top-2 -right-2 p-1.5 bg-gray-800 hover:bg-red-950 text-gray-400 hover:text-red-400 rounded-lg transition-colors border border-gray-700 hover:border-red-800"
                      title="Remove from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-center h-40 mb-4 border border-gray-700/50 overflow-hidden">
                      <img src={p.image_url} alt={p.name}
                        className="max-h-32 max-w-full object-contain"
                        onError={e => {
                          const el = e.target as HTMLImageElement;
                          el.style.display = "none";
                          const parent = el.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="flex flex-col items-center gap-2 opacity-60"><svg xmlns='http://www.w3.org/2000/svg' class='w-12 h-12 text-cyan-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18'/></svg><span class='text-xs text-gray-400 text-center px-2'>${p.name}</span></div>`;
                          }
                        }} />
                    </div>
                    <div className="text-xs text-cyan-400 font-medium mb-1">{p.manufacturer}</div>
                    <h3 className="text-white font-bold text-lg mb-1 leading-tight">{p.name}</h3>
                    <p className="text-gray-500 text-xs mb-3">Part: {p.part_number}</p>
                    
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-2xl font-bold text-cyan-400">{p.price_inr ? `₹${p.price_inr.toLocaleString()}` : "POA"}</span>
                    </div>

                    <a href={Object.values(p.buy_urls)[0]} target="_blank" rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20">
                      <ShoppingCart className="w-4 h-4" /> View Details
                    </a>
                  </div>
                </th>
              ))}
              {/* Fill remaining space if less than 3 products */}
              {Array.from({ length: Math.max(0, 3 - products.length) }).map((_, i) => (
                <th key={`empty-${i}`} className="min-w-[280px] w-[280px] bg-transparent border-b border-gray-800 p-6 align-top">
                  <Link href="/catalog" className="h-full w-full flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-800 rounded-2xl p-8 hover:border-cyan-800 hover:bg-cyan-950/10 transition-colors group">
                    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Package className="w-5 h-5 text-gray-500 group-hover:text-cyan-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-500 group-hover:text-cyan-400">Add Component</span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Basic Info */}
            <tr className="bg-gray-950/80">
              <td colSpan={products.length + 1 + Math.max(0, 3 - products.length)} className="py-3 px-4 font-bold text-white text-sm border-y border-gray-800 sticky left-0 z-10 flex items-center gap-2">
                <Package className="w-4 h-4 text-cyan-400" /> General Info
              </td>
            </tr>
            <tr>
              <td className="py-4 px-4 text-sm text-gray-400 border-b border-gray-800 sticky left-0 bg-gray-950 z-10 font-medium">Category</td>
              {products.map(p => (
                <td key={p.id} className="py-4 px-6 text-sm text-white border border-gray-800 bg-gray-900/30">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-800 text-xs border border-gray-700">
                    {p.category}
                  </span>
                </td>
              ))}
              {Array.from({ length: Math.max(0, 3 - products.length) }).map((_, i) => <td key={`e-${i}`} className="border-b border-gray-800"></td>)}
            </tr>
            <tr>
              <td className="py-4 px-4 text-sm text-gray-400 border-b border-gray-800 sticky left-0 bg-gray-950 z-10 font-medium">Availability</td>
              {products.map(p => (
                <td key={p.id} className="py-4 px-6 text-sm border border-gray-800 bg-gray-900/30">
                  {p.availability === "in_stock" 
                    ? <span className="flex items-center gap-1.5 text-green-400"><Check className="w-4 h-4" /> In Stock</span>
                    : <span className="flex items-center gap-1.5 text-red-400"><X className="w-4 h-4" /> Out of Stock</span>
                  }
                </td>
              ))}
              {Array.from({ length: Math.max(0, 3 - products.length) }).map((_, i) => <td key={`e-${i}`} className="border-b border-gray-800"></td>)}
            </tr>
            <tr>
              <td className="py-4 px-4 text-sm text-gray-400 border-b border-gray-800 sticky left-0 bg-gray-950 z-10 font-medium">Rating</td>
              {products.map(p => (
                <td key={p.id} className="py-4 px-6 text-sm text-white border border-gray-800 bg-gray-900/30">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold">{p.rating || "N/A"}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </div>
                </td>
              ))}
              {Array.from({ length: Math.max(0, 3 - products.length) }).map((_, i) => <td key={`e-${i}`} className="border-b border-gray-800"></td>)}
            </tr>

            {/* Technical Specifications */}
            <tr className="bg-gray-950/80 mt-4">
              <td colSpan={products.length + 1 + Math.max(0, 3 - products.length)} className="py-3 px-4 font-bold text-white text-sm border-y border-gray-800 sticky left-0 z-10 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" /> Technical Specs
              </td>
            </tr>
            {allSpecKeys.map((key, index) => (
              <tr key={key} className={index % 2 === 0 ? "bg-gray-900/10" : "bg-gray-900/30"}>
                <td className="py-4 px-4 text-sm text-gray-400 border-b border-gray-800 sticky left-0 bg-gray-950 z-10 font-medium capitalize">
                  {key.replace(/_/g, ' ')}
                </td>
                {products.map(p => (
                  <td key={p.id} className="py-4 px-6 text-sm text-white border border-gray-800">
                    {p.specifications[key] ? (
                      <span className="font-medium text-gray-300">{p.specifications[key]}</span>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                ))}
                {Array.from({ length: Math.max(0, 3 - products.length) }).map((_, i) => <td key={`e-${i}`} className="border-b border-gray-800"></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <RouteGuard>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <CompareContent />
      </Suspense>
    </RouteGuard>
  );
}
