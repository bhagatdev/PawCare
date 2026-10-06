import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Package,
  CheckCircle2,
  Clock,
  IndianRupee,
  ShieldCheck,
  AlertTriangle,
  Search,
  Plus,
  Truck,
  TrendingUp,
  Boxes,
  FileText,
  LogOut,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  RefreshCw,
  Bell,
  Sliders,
  DollarSign
} from 'lucide-react';
import OrderManagement from './OrderManagement';
import InventoryAlerts from './InventoryAlerts';
import DeliveryRouting from './DeliveryRouting';

export default function PharmacyDashboard({ onLogout, userRole = 'PHARMACY_ADMIN' }) {
  // Desktop Sidebar Collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Active Navigation Tab: 'orders' | 'alerts' | 'logistics' | 'inventory'
  const [activeTab, setActiveTab] = useState('orders');

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row font-sans selection:bg-cyan-500/20">
      
      {/* ========================================================================= */}
      {/* 1. DESKTOP COLLAPSIBLE SIDEBAR */}
      {/* ========================================================================= */}
      <motion.aside
        animate={{ width: isSidebarCollapsed ? 80 : 260 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 sticky top-0 h-screen z-30 select-none shadow-xs"
      >
        {/* Brand & Dispensary Identity */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-700 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-teal-700/20 shrink-0">
              <Store className="w-5 h-5" />
            </div>
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                    Apollo<span className="text-teal-600 dark:text-teal-400">Vet</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300">
                    Pharma
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">Bistupur Hub • JSR</p>
              </motion.div>
            )}
          </div>

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Pharmacy License & GSTIN Badge */}
        {!isSidebarCollapsed && (
          <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-850/40">
            <div className="text-[11px] text-slate-500 space-y-0.5">
              <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Drug Lic: JH-JSR-2022-2910</span>
              </div>
              <p className="font-mono text-[10px] text-slate-400">
                GSTIN: 20AAAAA0000A1Z5
              </p>
            </div>
          </div>
        )}

        {/* Sidebar Nav Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {[
            { id: 'orders', label: 'Order Tracking', icon: Package, count: 18 },
            { id: 'alerts', label: 'Low Stock Alerts', icon: AlertTriangle, count: 4, isAlert: true },
            { id: 'logistics', label: 'Delivery Routing', icon: Truck, count: '4 Routes' },
            { id: 'inventory', label: 'Drug Master & GST', icon: Boxes, count: null },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all min-h-[44px] cursor-pointer ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800/80 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                title={item.label}
              >
                <Icon className={`w-4 h-4 shrink-0 ${
                  isActive
                    ? 'text-teal-600 dark:text-teal-400'
                    : item.isAlert
                    ? 'text-amber-500'
                    : 'text-slate-400'
                }`} />
                {!isSidebarCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!isSidebarCollapsed && item.count && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.isAlert
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom User Actions */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer ${
              isSidebarCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Log Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* ========================================================================= */}
      {/* 2. MAIN APPLICATION CONTENT AREA */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="md:hidden w-9 h-9 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold text-sm">
              AV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  Apollo Vet Chemist & Dispensary
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  <ShieldCheck className="w-3 h-3 text-teal-600" />
                  Bistupur Hub
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>East Singhbhum, Jamshedpur • Cold-Chain Compliant</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  Wednesday, 30 Sep 2026
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              onClick={() => showToast('Syncing live with Central MySQL Medicine Database...')}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Sync Inventory</span>
            </button>

            <button
              onClick={() => showToast('Supplier Purchase Order generation panel opened!')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-700 to-cyan-600 hover:from-teal-600 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-98 min-h-[40px] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Supplier PO</span>
            </button>
          </div>
        </header>

        {/* Overview Metrics Cards (Framer Motion Animated KPI Cards) */}
        <section className="px-4 sm:px-6 pt-5 pb-3">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            
            {/* KPI 1: Today's Revenue */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs"
            >
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>Today's Revenue</span>
                <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  ₹24,500
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  +18%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                42 Orders Dispatched Today
              </p>
            </motion.div>

            {/* KPI 2: Pending Orders */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs"
            >
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>Pending Orders</span>
                <Package className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">
                  18
                </span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300">
                  6 in Pack
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                12 Awaiting Delivery Partner
              </p>
            </motion.div>

            {/* KPI 3: Critical Stock Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs"
            >
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>Critical Stock Alerts</span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400">
                  4
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300">
                  Action Required
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Bravecto, Melonex & Ceff Pet low
              </p>
            </motion.div>

            {/* KPI 4: Active Delivery Routes */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs"
            >
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>Active Routes</span>
                <Truck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-teal-700 dark:text-teal-300">
                  4
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  11 Stops
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Bistupur, Sakchi, Kadma, Mango
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tab View Switcher (Desktop secondary toolbar) */}
        <section className="px-4 sm:px-6 pt-2 pb-1">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            {[
              { id: 'orders', label: 'Order Tracking & Dispense', icon: Package },
              { id: 'alerts', label: 'Stock Alerts & Suppliers', icon: AlertTriangle },
              { id: 'logistics', label: 'Local Delivery Logistics', icon: Truck },
              { id: 'inventory', label: 'Drug Master & GST Rates', icon: Boxes },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Main Content Modules */}
        <main className="px-4 sm:px-6 flex-1 pt-3 space-y-6">
          {activeTab === 'orders' && (
            <OrderManagement onStatusUpdateToast={showToast} />
          )}

          {activeTab === 'alerts' && (
            <InventoryAlerts onRestockNotification={showToast} />
          )}

          {activeTab === 'logistics' && (
            <DeliveryRouting onDispatchNotification={showToast} />
          )}

          {activeTab === 'inventory' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Statutory Indian Drug Master & GSTIN Schedule
                  </h3>
                  <p className="text-xs text-slate-500">
                    Compliant with HSN code 3004 and Indian GST Veterinary schedules
                  </p>
                </div>
                <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl font-bold">
                  HSN: 3004.90 (Medicaments for Vet Use)
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase font-bold">
                    <tr>
                      <th className="p-3.5">Medicine Name</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Dispensary Stock</th>
                      <th className="p-3.5">GST Rate</th>
                      <th className="p-3.5">MRP (INR)</th>
                      <th className="p-3.5 text-right">Batch No.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {[
                      { name: 'NexGard Spectra Large Dog (30-60kg)', category: 'Flea & Tick', stock: '45 units', gst: '12%', price: '₹1,850.00', batch: 'NGS-2026-09' },
                      { name: 'Cosequin Joint Health Tabs (80 Tabs)', category: 'Supplements', stock: '28 units', gst: '18%', price: '₹1,450.00', batch: 'CSQ-2026-04' },
                      { name: 'Apoquel 16mg Anti-Itch (20 Tablets)', category: 'Dermatology', stock: '12 units', gst: '12%', price: '₹2,800.00', batch: 'APQ-2026-11' },
                      { name: 'Melonex Pet 10ml Oral Suspension', category: 'NSAID', stock: '3 units (Low)', gst: '12%', price: '₹145.00', batch: 'MLX-2026-08' },
                      { name: 'Savavet Kiwof Plus (4 Tablets)', category: 'Dewormer', stock: '5 units (Low)', gst: '12%', price: '₹210.00', batch: 'KWF-2026-02' }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">{row.name}</td>
                        <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-semibold">{row.category}</span></td>
                        <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">{row.stock}</td>
                        <td className="p-3.5 font-bold text-slate-600 dark:text-slate-400">{row.gst}</td>
                        <td className="p-3.5 font-extrabold text-teal-700 dark:text-teal-400">{row.price}</td>
                        <td className="p-3.5 text-right font-mono text-[11px] text-slate-400">{row.batch}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 3. MOBILE BOTTOM NAVIGATION */}
      {/* ========================================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-1 flex items-center justify-around shadow-lg">
        {[
          { id: 'orders', label: 'Orders', icon: Package },
          { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
          { id: 'logistics', label: 'Routes', icon: Truck },
          { id: 'inventory', label: 'Stock', icon: Boxes },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-1 min-h-[48px] min-w-[56px] transition-colors cursor-pointer ${
                isActive
                  ? 'text-teal-700 dark:text-teal-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ========================================================================= */}
      {/* 4. FLOATING TOAST NOTIFICATION */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-16 md:bottom-6 right-4 sm:right-6 z-50 bg-slate-900 text-white border border-slate-700/80 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs max-w-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span className="leading-snug">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
