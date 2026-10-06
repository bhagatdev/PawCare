import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Package,
  TrendingDown,
  RefreshCw,
  Truck,
  CheckCircle2,
  Building2,
  Phone,
  ShieldAlert,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

const INITIAL_LOW_STOCK = [
  {
    id: 'med-01',
    name: 'Bravecto 500mg Chewable Tablet (10-20kg)',
    category: 'Ectoparasiticide / Flea & Tick',
    currentStock: 2,
    threshold: 12,
    unitPrice: '₹1,850.00',
    supplier: 'MSD Animal Health Eastern Depot (Kolkata C&F)',
    supplierContact: '+91 33 2456 7890',
    urgency: 'critical', // 'critical' | 'warning'
    leadTime: '24 Hours'
  },
  {
    id: 'med-02',
    name: 'Melonex Pet Oral Suspension 1.5mg/ml (10ml)',
    category: 'NSAID / Anti-inflammatory',
    currentStock: 3,
    threshold: 20,
    unitPrice: '₹145.00',
    supplier: 'Intas Pharmaceuticals C&F Ranchi',
    supplierContact: '+91 651 234 5678',
    urgency: 'critical',
    leadTime: 'Same Day'
  },
  {
    id: 'med-03',
    name: 'Savavet Kiwof Plus Broad Spectrum Dewormer (4 Tabs)',
    category: 'Anthelmintic / Dewormer',
    currentStock: 5,
    threshold: 25,
    unitPrice: '₹210.00',
    supplier: 'Sava Healthcare Regional Distribution',
    supplierContact: '+91 98351 09876',
    urgency: 'warning',
    leadTime: '48 Hours'
  },
  {
    id: 'med-04',
    name: 'Ceff Pet (Cephalexin 300mg Tablets - Strip of 6)',
    category: 'Antibiotic Formulation',
    currentStock: 4,
    threshold: 18,
    unitPrice: '₹240.00',
    supplier: 'Lupin Animal Health Dhanbad Agency',
    supplierContact: '+91 94311 22334',
    urgency: 'critical',
    leadTime: '24 Hours'
  },
  {
    id: 'med-05',
    name: 'Pet Derm Medicated Shampoo (200ml)',
    category: 'Dermatological Antifungal',
    currentStock: 6,
    threshold: 15,
    unitPrice: '₹395.00',
    supplier: 'Zoetis India Hub Jamshedpur',
    supplierContact: '+91 657 222 4455',
    urgency: 'warning',
    leadTime: 'Same Day'
  }
];

export default function InventoryAlerts({ onRestockNotification }) {
  const [alerts, setAlerts] = useState(INITIAL_LOW_STOCK);
  const [restockingId, setRestockingId] = useState(null);
  const [restockedIds, setRestockedIds] = useState([]);

  const handleRestock = (item) => {
    setRestockingId(item.id);

    // Simulate Purchase Order generation to Indian C&F distributor
    setTimeout(() => {
      setRestockingId(null);
      setRestockedIds((prev) => [...prev, item.id]);
      
      // Update local stock to safe threshold
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === item.id
            ? { ...alert, currentStock: alert.threshold + 15, urgency: 'safe' }
            : alert
        )
      );

      if (onRestockNotification) {
        onRestockNotification(
          `Automated PO #PO-JSR-${Math.floor(1000 + Math.random() * 9000)} dispatched to ${item.supplier} for ${item.name}!`
        );
      }
    }, 1200);
  };

  const criticalCount = alerts.filter((a) => a.urgency === 'critical').length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Dispensary Stock & Safety Alerts
              </h3>
              {criticalCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse">
                  {criticalCount} Critical
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active inventory falling below statutory drug dispensary reorder thresholds
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          Jamshedpur Central Cold-Chain Unit
        </span>
      </div>

      {/* Low Stock Items List */}
      <div className="space-y-3">
        <AnimatePresence>
          {alerts.map((item) => {
            const isRestocked = restockedIds.includes(item.id);
            const isCritical = item.urgency === 'critical';
            const percentRemaining = Math.min(
              100,
              Math.round((item.currentStock / item.threshold) * 100)
            );

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative rounded-2xl p-4 border transition-all ${
                  isRestocked
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                    : isCritical
                    ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 shadow-xs'
                    : 'bg-amber-50/30 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {item.name}
                      </h4>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                        {item.category}
                      </span>
                    </div>

                    {/* Supplier details */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {item.supplier}
                      </span>
                      <span>•</span>
                      <span className="text-cyan-700 dark:text-cyan-400 font-medium">
                        Transit: {item.leadTime}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        MRP: {item.unitPrice}
                      </span>
                    </div>

                    {/* Stock Bar Meter */}
                    <div className="pt-1 max-w-md">
                      <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                        <span className={isCritical ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}>
                          Current: {item.currentStock} units left
                        </span>
                        <span className="text-slate-500">
                          Reorder Threshold: {item.threshold} units
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentRemaining}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            isRestocked
                              ? 'bg-emerald-500'
                              : isCritical
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right: Restock Action Button */}
                  <div className="shrink-0 flex items-center">
                    {isRestocked ? (
                      <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>PO Dispatched</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRestock(item)}
                        disabled={restockingId === item.id}
                        className={`min-h-[44px] px-4 py-2.5 rounded-xl font-bold text-xs text-white flex items-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer ${
                          isCritical
                            ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
                            : 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
                        }`}
                      >
                        {restockingId === item.id ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Generating PO...</span>
                          </>
                        ) : (
                          <>
                            <Truck className="w-4 h-4" />
                            <span>Restock via Supplier</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
