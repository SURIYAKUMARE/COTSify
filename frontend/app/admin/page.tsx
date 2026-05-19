"use client";
import { useState, useEffect } from "react";
import { CATALOG_DATA } from "@/lib/catalog-data";
import { CatalogProduct } from "@/lib/catalog-types";
import {
  Shield, LogOut, Package, Users, BarChart3, MapPin, Edit3,
  Save, X, Plus, Trash2, Eye, TrendingUp, Cpu, Search,
  CheckCircle2, AlertCircle, Store, Star, Phone, Globe,
  Activity, Layers, ShoppingCart, Zap,
} from "lucide-react";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@cotsify.com";
const ADMIN_PASS  = process.env.NEXT_PUBLIC_ADMIN_PASS  || "Cotsify@Admin2025";
const ADMIN_SESSION_KEY = "cotsify_admin_session";
const OVERRIDES_KEY = "admin_catalog_overrides";
const SHOPS_KEY = "admin_shops";

interface Shop {
  id: string; name: string; address: string; city: string;
  phone: string; maps_url: string; rating: number; category: string; active: boolean;
}

function getOverrides(): Record<string, Partial<CatalogProduct>> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(OVERRIDES_KEY) || "{}"); } catch { return {}; }
}
function saveOverride(id: string, data: Partial<CatalogProduct>) {
  const o = getOverrides(); o[id] = { ...o[id], ...data };
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(o));
}
function getShops(): Shop[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(SHOPS_KEY) || "[]"); } catch { return []; }
}
function saveShops(shops: Shop[]) { localStorage.setItem(SHOPS_KEY, JSON.stringify(shops)); }

type Tab = "overview" | "components" | "shops" | "users" | "analytics";

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loginErr, setLoginErr] = useState("");
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(ADMIN_SESSION_KEY) === "1") setLoggedIn(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
      localStorage.setItem(ADMIN_SESSION_KEY, "1");
      setLoggedIn(true);
    } else setLoginErr("Invalid credentials. Check the hint card above.");
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setLoggedIn(false);
  };

  if (!loggedIn) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-red-500/30">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">COTsify Administration Dashboard</p>
        </div>

        {/* Credentials hint card */}
        <div className="bg-amber-950/40 border border-amber-800/50 rounded-2xl p-4 mb-5">
          <p className="text-amber-400 text-xs font-semibold mb-2 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Default Admin Credentials
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-900/60 rounded-xl p-2.5">
              <p className="text-gray-500 mb-0.5">Email</p>
              <p className="text-white font-mono font-bold">admin@cotsify.com</p>
            </div>
            <div className="bg-gray-900/60 rounded-xl p-2.5">
              <p className="text-gray-500 mb-0.5">Password</p>
              <p className="text-white font-mono font-bold">Cotsify@Admin2025</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col gap-4">
          {loginErr && (
            <div className="flex items-center gap-2 bg-red-950/50 border border-red-800 text-red-400 text-sm rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{loginErr}
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Admin Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
              placeholder="admin@cotsify.com" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Password</label>
            <div className="relative">
              <input type={showPass ? "text" : "password"} value={pass} onChange={e => setPass(e.target.value)} required
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors pr-12"
                placeholder="••••••••••••••" />
              <button type="button" onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-xs px-1">
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-500/20 hover:scale-[1.02]">
            Sign In as Admin
          </button>
          <div className="text-center text-xs text-gray-600 border-t border-gray-800 pt-3">
            This panel is for administrators only. Unauthorized access is prohibited.
          </div>
        </form>
      </div>
    </div>
  );

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "components", label: "Components", icon: <Cpu className="w-4 h-4" /> },
    { id: "shops", label: "Shops", icon: <Store className="w-4 h-4" /> },
    { id: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
    { id: "analytics", label: "Analytics", icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Admin Navbar */}
      <nav className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur border-b border-red-900/50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">COTsify Admin</span>
            <span className="text-xs bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded-full">Administrator</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tab bar */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 mb-6 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${tab === t.id ? "bg-red-950 text-red-400 border border-red-800" : "text-gray-500 hover:text-gray-300"}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && <OverviewTab />}
        {tab === "components" && <ComponentsTab />}
        {tab === "shops" && <ShopsTab />}
        {tab === "users" && <UsersTab />}
        {tab === "analytics" && <AnalyticsTab />}
      </div>
    </div>
  );
}

function OverviewTab() {
  const overrides = getOverrides();
  const shops = getShops();
  const projects = (() => { try { return JSON.parse(localStorage.getItem("cotsify_projects") || "[]"); } catch { return []; } })();
  const stats = [
    { label: "Total Components", value: CATALOG_DATA.length, icon: <Cpu className="w-5 h-5" />, color: "from-cyan-500 to-blue-600", bg: "bg-cyan-950/50", border: "border-cyan-800/50", text: "text-cyan-400" },
    { label: "Price Overrides", value: Object.keys(overrides).length, icon: <Edit3 className="w-5 h-5" />, color: "from-orange-500 to-red-600", bg: "bg-orange-950/50", border: "border-orange-800/50", text: "text-orange-400" },
    { label: "Registered Shops", value: shops.length, icon: <Store className="w-5 h-5" />, color: "from-green-500 to-emerald-600", bg: "bg-green-950/50", border: "border-green-800/50", text: "text-green-400" },
    { label: "Saved Projects", value: projects.length, icon: <Layers className="w-5 h-5" />, color: "from-purple-500 to-pink-600", bg: "bg-purple-950/50", border: "border-purple-800/50", text: "text-purple-400" },
  ];
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className={`relative overflow-hidden ${s.bg} border ${s.border} rounded-2xl p-5`}>
            <div className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br ${s.color} rounded-full opacity-10`} />
            <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${s.color} mb-3 shadow-lg`}>
              <div className="text-white">{s.icon}</div>
            </div>
            <div className={`text-3xl font-bold ${s.text} mb-1`}>{s.value}</div>
            <div className="text-gray-400 text-xs">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Package className="w-4 h-4 text-cyan-400" /> Category Breakdown</h3>
          {["Electrical", "Mechanical", "Tools"].map(cat => {
            const count = CATALOG_DATA.filter(p => p.category === cat).length;
            const pct = Math.round((count / CATALOG_DATA.length) * 100);
            return (
              <div key={cat} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{cat}</span>
                  <span className="text-white font-medium">{count} items ({pct}%)</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-cyan-400" /> Quick Actions</h3>
          {[
            { label: "Add New Shop", desc: "Register electronics store", href: "#shops" },
            { label: "Edit Component Prices", desc: "Update catalog pricing", href: "#components" },
            { label: "View All Users", desc: "See registered users", href: "#users" },
            { label: "View Analytics", desc: "Usage statistics", href: "#analytics" },
          ].map(a => (
            <div key={a.label} className="flex items-center justify-between p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl mb-2 cursor-pointer group transition-colors">
              <div>
                <p className="text-white text-sm font-medium group-hover:text-cyan-300 transition-colors">{a.label}</p>
                <p className="text-gray-500 text-xs">{a.desc}</p>
              </div>
              <Zap className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComponentsTab() {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<CatalogProduct>>({});
  const [overrides, setOverrides] = useState(getOverrides());
  const [saved, setSaved] = useState<string | null>(null);

  const products = CATALOG_DATA.map(p => ({ ...p, ...overrides[p.id] }));
  const filtered = products.filter(p =>
    search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.subcategory.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (p: CatalogProduct) => { setEditing(p.id); setEditData({ price_inr: p.price_inr, availability: p.availability, stock_qty: p.stock_qty, name: p.name }); };
  const handleSave = (id: string) => {
    saveOverride(id, editData);
    setOverrides(getOverrides());
    setEditing(null);
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-xl font-bold text-white">Components ({CATALOG_DATA.length})</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search components..."
            className="bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-600 w-64" />
        </div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-xs">
                <th className="text-left px-4 py-3">ID</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-right px-4 py-3">Price (₹)</th>
                <th className="text-center px-4 py-3">Stock</th>
                <th className="text-center px-4 py-3">Status</th>
                <th className="text-center px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-gray-800/50 last:border-0 hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{p.id}</td>
                  <td className="px-4 py-3">
                    {editing === p.id ? (
                      <input value={editData.name || ""} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))}
                        className="bg-gray-800 border border-cyan-700 rounded-lg px-2 py-1 text-white text-xs w-48 focus:outline-none" />
                    ) : (
                      <span className="text-white font-medium">{p.name}</span>
                    )}
                    {overrides[p.id] && <span className="ml-2 text-xs text-orange-400 bg-orange-950/50 border border-orange-800/50 px-1.5 py-0.5 rounded-full">edited</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{p.subcategory}</td>
                  <td className="px-4 py-3 text-right">
                    {editing === p.id ? (
                      <input type="number" value={editData.price_inr || ""} onChange={e => setEditData(d => ({ ...d, price_inr: Number(e.target.value) }))}
                        className="bg-gray-800 border border-cyan-700 rounded-lg px-2 py-1 text-cyan-400 text-xs w-24 text-right focus:outline-none" />
                    ) : (
                      <span className="text-cyan-400 font-bold">{p.price_inr ? `₹${p.price_inr.toLocaleString()}` : "POA"}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {editing === p.id ? (
                      <input type="number" value={editData.stock_qty || ""} onChange={e => setEditData(d => ({ ...d, stock_qty: Number(e.target.value) }))}
                        className="bg-gray-800 border border-cyan-700 rounded-lg px-2 py-1 text-white text-xs w-20 text-center focus:outline-none" />
                    ) : (
                      <span className="text-gray-300">{p.stock_qty || "—"}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {editing === p.id ? (
                      <select value={editData.availability || "in_stock"} onChange={e => setEditData(d => ({ ...d, availability: e.target.value }))}
                        className="bg-gray-800 border border-cyan-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none">
                        <option value="in_stock">In Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                        <option value="limited">Limited</option>
                      </select>
                    ) : (
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${p.availability === "in_stock" ? "bg-green-950 text-green-400 border-green-800" : p.availability === "limited" ? "bg-yellow-950 text-yellow-400 border-yellow-800" : "bg-red-950 text-red-400 border-red-800"}`}>
                        {p.availability === "in_stock" ? "In Stock" : p.availability === "limited" ? "Limited" : "Out of Stock"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {editing === p.id ? (
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleSave(p.id)} className="p-1.5 bg-green-950 text-green-400 border border-green-800 rounded-lg hover:bg-green-900 transition-colors"><Save className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setEditing(null)} className="p-1.5 bg-gray-800 text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        {saved === p.id && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                        <button onClick={() => handleEdit(p)} className="p-1.5 bg-gray-800 text-gray-400 border border-gray-700 rounded-lg hover:border-cyan-700 hover:text-cyan-400 transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ShopsTab() {
  const [shops, setShopsState] = useState<Shop[]>(getShops());
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Partial<Shop>>({});

  const refresh = () => setShopsState(getShops());

  const handleSave = () => {
    const current = getShops();
    if (editing) {
      const updated = current.map(s => s.id === editing ? { ...s, ...form } : s);
      saveShops(updated);
    } else {
      const newShop: Shop = {
        id: crypto.randomUUID(), name: form.name || "", address: form.address || "",
        city: form.city || "", phone: form.phone || "", maps_url: form.maps_url || "",
        rating: Number(form.rating) || 4.0, category: form.category || "Electronics", active: true,
      };
      saveShops([...current, newShop]);
    }
    setEditing(null); setAdding(false); setForm({}); refresh();
  };

  const handleDelete = (id: string) => { saveShops(getShops().filter(s => s.id !== id)); refresh(); };

  const openEdit = (s: Shop) => { setEditing(s.id); setAdding(true); setForm(s); };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-white">Electronics Shops ({shops.length})</h2>
        <button onClick={() => { setAdding(true); setEditing(null); setForm({}); }}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all">
          <Plus className="w-4 h-4" /> Add Shop
        </button>
      </div>

      {adding && (
        <div className="bg-gray-900 border border-cyan-800/50 rounded-2xl p-5 mb-5">
          <h3 className="text-white font-semibold mb-4">{editing ? "Edit Shop" : "Add New Shop"}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { key: "name", label: "Shop Name", placeholder: "e.g. Electronics Hub" },
              { key: "address", label: "Address", placeholder: "Street address" },
              { key: "city", label: "City", placeholder: "e.g. Chennai" },
              { key: "phone", label: "Phone", placeholder: "+91 98765 43210" },
              { key: "maps_url", label: "Google Maps URL", placeholder: "https://maps.google.com/..." },
              { key: "category", label: "Category", placeholder: "Electronics / Robotics / Tools" },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs text-gray-400 mb-1">{f.label}</label>
                <input value={(form as any)[f.key] || ""} onChange={e => setForm(d => ({ ...d, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-600" />
              </div>
            ))}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Rating (1-5)</label>
              <input type="number" min="1" max="5" step="0.1" value={form.rating || ""} onChange={e => setForm(d => ({ ...d, rating: Number(e.target.value) }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-600" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold px-5 py-2 rounded-xl text-sm transition-all">
              <Save className="w-4 h-4" /> {editing ? "Update" : "Add Shop"}
            </button>
            <button onClick={() => { setAdding(false); setEditing(null); setForm({}); }}
              className="px-4 py-2 bg-gray-800 text-gray-300 border border-gray-700 rounded-xl text-sm hover:bg-gray-700 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {shops.length === 0 ? (
        <div className="text-center py-16 bg-gray-900/50 border border-dashed border-gray-800 rounded-2xl">
          <Store className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-white font-medium mb-1">No shops registered</p>
          <p className="text-gray-500 text-sm">Click "Add Shop" to register an electronics store</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shops.map(shop => (
            <div key={shop.id} className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-2xl p-5 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(shop)} className="p-1.5 bg-gray-800 text-gray-400 border border-gray-700 rounded-lg hover:border-cyan-700 hover:text-cyan-400 transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(shop.id)} className="p-1.5 bg-gray-800 text-gray-400 border border-gray-700 rounded-lg hover:border-red-700 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <h3 className="text-white font-bold text-sm mb-1">{shop.name}</h3>
              <p className="text-gray-400 text-xs mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{shop.address}</p>
              <p className="text-gray-500 text-xs mb-2">{shop.city}</p>
              <div className="flex items-center gap-3 text-xs">
                {shop.phone && <span className="flex items-center gap-1 text-gray-400"><Phone className="w-3 h-3" />{shop.phone}</span>}
                <span className="flex items-center gap-1 text-yellow-400"><Star className="w-3 h-3 fill-yellow-400" />{shop.rating}</span>
              </div>
              {shop.maps_url && (
                <a href={shop.maps_url} target="_blank" rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-1.5 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 py-2 rounded-xl transition-colors">
                  <Globe className="w-3.5 h-3.5" /> View on Maps
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UsersTab() {
  const users: any[] = [];
  if (typeof window !== "undefined") {
    const guest = localStorage.getItem("cotsify_guest_user");
    const supa = localStorage.getItem("cotsify_supabase_user");
    if (guest) { try { users.push({ ...JSON.parse(guest), type: "Guest" }); } catch {} }
    if (supa) { try { users.push({ ...JSON.parse(supa), type: "Supabase" }); } catch {} }
  }
  const projects = (() => { try { return JSON.parse(localStorage.getItem("cotsify_projects") || "[]"); } catch { return []; } })();

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-5">Users ({users.length})</h2>
      {users.length === 0 ? (
        <div className="text-center py-16 bg-gray-900/50 border border-dashed border-gray-800 rounded-2xl">
          <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-white font-medium mb-1">No users found</p>
          <p className="text-gray-500 text-sm">Users appear here after signing in</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {users.map((u, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-gray-950 font-bold text-lg">
                  {(u.full_name || u.email || "U")[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-bold">{u.full_name || u.email?.split("@")[0] || "Unknown"}</p>
                  <p className="text-gray-400 text-sm">{u.email || "No email"}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${u.type === "Supabase" ? "bg-blue-950 text-blue-400 border-blue-800" : "bg-gray-800 text-gray-400 border-gray-700"}`}>{u.type}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Projects", value: projects.length },
                  { label: "Completed", value: projects.filter((p: any) => p.status === "completed").length },
                  { label: "In Progress", value: projects.filter((p: any) => p.status === "in_progress").length },
                ].map(s => (
                  <div key={s.label} className="bg-gray-800/50 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-cyan-400">{s.value}</div>
                    <div className="text-gray-500 text-xs">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AnalyticsTab() {
  const projects = (() => { try { return JSON.parse(localStorage.getItem("cotsify_projects") || "[]"); } catch { return []; } })();
  const history = (() => { try { return JSON.parse(localStorage.getItem("cotsify_search_history") || "[]"); } catch { return []; } })();
  const catCounts: Record<string, number> = {};
  CATALOG_DATA.forEach(p => { catCounts[p.category] = (catCounts[p.category] || 0) + 1; });
  const subCounts: Record<string, number> = {};
  CATALOG_DATA.forEach(p => { subCounts[p.subcategory] = (subCounts[p.subcategory] || 0) + 1; });
  const topSubs = Object.entries(subCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const statusCounts = { planning: 0, in_progress: 0, completed: 0 };
  projects.forEach((p: any) => { const s = p.status || "planning"; (statusCounts as any)[s]++; });

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Analytics</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {[
          { label: "Total Searches", value: history.length, color: "text-cyan-400", bg: "bg-cyan-950/40" },
          { label: "Total Projects", value: projects.length, color: "text-purple-400", bg: "bg-purple-950/40" },
          { label: "Catalog Items", value: CATALOG_DATA.length, color: "text-green-400", bg: "bg-green-950/40" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border border-gray-800 rounded-2xl p-5 text-center`}>
            <div className={`text-4xl font-bold ${s.color} mb-1`}>{s.value}</div>
            <div className="text-gray-400 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        {/* Category distribution */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-cyan-400" /> Catalog by Category</h3>
          {Object.entries(catCounts).map(([cat, count]) => {
            const pct = Math.round((count / CATALOG_DATA.length) * 100);
            const colors: Record<string, string> = { Electrical: "from-cyan-500 to-blue-600", Mechanical: "from-green-500 to-emerald-600", Tools: "from-amber-500 to-orange-600" };
            return (
              <div key={cat} className="mb-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-300 font-medium">{cat}</span>
                  <span className="text-gray-500">{count} items · {pct}%</span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${colors[cat] || "from-gray-600 to-gray-500"} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Project status */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-cyan-400" /> Project Status</h3>
          {[
            { key: "planning", label: "Planning", color: "from-gray-600 to-gray-500", text: "text-gray-400" },
            { key: "in_progress", label: "In Progress", color: "from-blue-500 to-indigo-600", text: "text-blue-400" },
            { key: "completed", label: "Completed", color: "from-green-500 to-emerald-600", text: "text-green-400" },
          ].map(s => {
            const count = (statusCounts as any)[s.key] || 0;
            const total = projects.length || 1;
            return (
              <div key={s.key} className="mb-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className={`font-medium ${s.text}`}>{s.label}</span>
                  <span className="text-gray-500">{count} projects</span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${s.color} rounded-full`} style={{ width: `${(count / total) * 100}%` }} />
                </div>
              </div>
            );
          })}
          {projects.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No projects saved yet</p>}
        </div>
      </div>

      {/* Top subcategories */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-5">
        <h3 className="text-white font-semibold mb-4">Top Component Subcategories</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {topSubs.map(([sub, count], i) => (
            <div key={sub} className="flex items-center gap-3 bg-gray-800/50 rounded-xl p-3">
              <span className="text-gray-600 text-xs font-bold w-5">{i + 1}</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-white text-xs font-medium">{sub}</span>
                  <span className="text-cyan-400 text-xs font-bold">{count}</span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" style={{ width: `${(count / topSubs[0][1]) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent searches */}
      {history.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Search className="w-4 h-4 text-cyan-400" /> Recent Searches ({history.length})</h3>
          <div className="flex flex-wrap gap-2">
            {history.map((q: string, i: number) => (
              <span key={i} className="text-xs bg-gray-800 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-full">{q}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
