import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck,
  Navigation,
  MapPin,
  Clock,
  User,
  Phone,
  CheckCircle2,
  Package,
  ArrowRight,
  Send,
  Zap,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const DELIVERY_PARTNERS = [
  {
    id: 'dp-1',
    name: 'Ramesh Yadav',
    phone: '+91 98351 90211',
    vehicle: 'Hero Electric Optima (Cold Box)',
    rating: 4.9,
    status: 'Available'
  },
  {
    id: 'dp-2',
    name: 'Suraj Singh',
    phone: '+91 97712 34567',
    vehicle: 'Bajaj Pulsar 150 (Insulated Pannier)',
    rating: 4.8,
    status: 'On Route'
  },
  {
    id: 'dp-3',
    name: 'Amit Kumar',
    phone: '+91 94313 88120',
    vehicle: 'Honda Activa 6G (Medical Carrier)',
    rating: 4.9,
    status: 'Available'
  }
];

const INITIAL_ROUTES = [
  {
    id: 'route-bistupur',
    zoneName: 'Bistupur Route',
    assignedPartnerId: 'dp-1',
    totalStops: 4,
    estimatedMinutes: 32,
    totalValue: 2470,
    status: 'Dispatched', // 'Preparing' | 'Dispatched' | 'Completed'
    stops: [
      {
        orderId: 'ORD-JSR-7712',
        customer: 'Ananya Sengupta',
        address: '14/B, Contractors Area, Main Road, Bistupur',
        parcel: 'Melonex Pet 10ml, Savavet Kiwof Plus x 2',
        delivered: true
      },
      {
        orderId: 'ORD-JSR-7715',
        customer: 'Dr. Vikram Sen',
        address: 'Bungalow 7, Circuit House Area, Road No. 4',
        parcel: 'Ceff Pet 300mg x 2, Liv.52 Pet Liquid',
        delivered: false
      },
      {
        orderId: 'ORD-JSR-7719',
        customer: 'Harpreet Singh',
        address: 'Flat 302, Regent Enclave, Bistupur Outer',
        parcel: 'Bravecto 500mg Chewable',
        delivered: false
      },
      {
        orderId: 'ORD-JSR-7722',
        customer: 'Deepak Agarwal',
        address: 'Shop 8, Kamani Centre, Bistupur Market',
        parcel: 'Pet Derm Medicated Shampoo 200ml',
        delivered: false
      }
    ]
  },
  {
    id: 'route-sakchi',
    zoneName: 'Sakchi Route',
    assignedPartnerId: 'dp-2',
    totalStops: 3,
    estimatedMinutes: 25,
    totalValue: 1820,
    status: 'Dispatched',
    stops: [
      {
        orderId: 'ORD-JSR-7714',
        customer: 'Priya Nair',
        address: 'Flat 12, Kalimati Towers, Sakchi Market Rd',
        parcel: 'Pet Derm Shampoo, EarKleen Otic Cleanser',
        delivered: true
      },
      {
        orderId: 'ORD-JSR-7717',
        customer: 'Rajesh Patel',
        address: 'House 45, Straight Mile Road, SNP Area',
        parcel: 'Himalaya Immunol Pet Liquid',
        delivered: true
      },
      {
        orderId: 'ORD-JSR-7725',
        customer: 'Manoj Tripathy',
        address: 'Opp. Jubilee Park Gate 2, Sakchi Boulevard',
        parcel: 'Savavet Kiwof Plus 4 Tabs',
        delivered: false
      }
    ]
  },
  {
    id: 'route-kadma',
    zoneName: 'Kadma Route',
    assignedPartnerId: 'dp-3',
    totalStops: 2,
    estimatedMinutes: 20,
    totalValue: 2240,
    status: 'Preparing',
    stops: [
      {
        orderId: 'ORD-JSR-7713',
        customer: 'Rahul Verma',
        address: 'Plot 22, Uliyan Block C, Near Ram Janaki Mandir',
        parcel: 'Bravecto 500mg Chewable Tablet (10-20kg)',
        delivered: false
      },
      {
        orderId: 'ORD-JSR-7728',
        customer: 'Nandita Roy',
        address: 'B/12, Farm Area Road, Kadma',
        parcel: 'Melonex Pet Drops, Samolin Gut Probiotics',
        delivered: false
      }
    ]
  },
  {
    id: 'route-mango',
    zoneName: 'Mango Route',
    assignedPartnerId: 'dp-1',
    totalStops: 2,
    estimatedMinutes: 35,
    totalValue: 1450,
    status: 'Preparing',
    stops: [
      {
        orderId: 'ORD-JSR-7716',
        customer: 'Sunita Murmu',
        address: 'Dimna Road, Near Blue Bells School, Mango',
        parcel: 'Vivaldis Samolin Gut Probiotics x 1',
        delivered: false
      },
      {
        orderId: 'ORD-JSR-7731',
        customer: 'Gautam Soren',
        address: 'Old Purulia Road, Near Post Office, Mango',
        parcel: 'Savavet Kiwof Plus Dewormer x 2',
        delivered: false
      }
    ]
  }
];

export default function DeliveryRouting({ onDispatchNotification }) {
  const [routes, setRoutes] = useState(INITIAL_ROUTES);

  const handleAssignPartner = (routeId, partnerId) => {
    setRoutes((prev) =>
      prev.map((r) =>
        r.id === routeId ? { ...r, assignedPartnerId: partnerId } : r
      )
    );
  };

  const handleToggleDispatch = (routeId) => {
    setRoutes((prev) =>
      prev.map((r) => {
        if (r.id === routeId) {
          const nextStatus =
            r.status === 'Preparing'
              ? 'Dispatched'
              : r.status === 'Dispatched'
              ? 'Completed'
              : 'Preparing';

          const partner = DELIVERY_PARTNERS.find(
            (dp) => dp.id === r.assignedPartnerId
          );

          if (onDispatchNotification) {
            onDispatchNotification(
              `${r.zoneName} updated to "${nextStatus}"! Assigned Rider: ${partner?.name}`
            );
          }

          return { ...r, status: nextStatus };
        }
        return r;
      })
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Hyperlocal Delivery Routing & Fleet Control
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Jamshedpur urban zones: Bistupur, Sakchi, Kadma, Mango Cold-Chain Dispatch
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
            <span>98.4% On-Time SLA</span>
          </span>
        </div>
      </div>

      {/* Routes Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {routes.map((route) => {
          const partner = DELIVERY_PARTNERS.find(
            (dp) => dp.id === route.assignedPartnerId
          );
          const completedStops = route.stops.filter((s) => s.delivered).length;

          return (
            <motion.div
              key={route.id}
              layout
              className="bg-slate-50/80 dark:bg-slate-850/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs"
            >
              {/* Route Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {route.zoneName}
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                        route.status === 'Dispatched'
                          ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800'
                          : route.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {route.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      ~{route.estimatedMinutes} mins transit
                    </span>
                    <span>•</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      ₹{route.totalValue.toLocaleString('en-IN')} cargo
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleDispatch(route.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                    route.status === 'Preparing'
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                      : route.status === 'Dispatched'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {route.status === 'Preparing' && (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch</span>
                    </>
                  )}
                  {route.status === 'Dispatched' && (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Complete</span>
                    </>
                  )}
                  {route.status === 'Completed' && (
                    <>
                      <span>Re-open</span>
                    </>
                  )}
                </button>
              </div>

              {/* Delivery Partner Assignment Selector */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-600" />
                    Assigned Fleet Partner:
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    ★ {partner?.rating}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <select
                    value={route.assignedPartnerId}
                    onChange={(e) => handleAssignPartner(route.id, e.target.value)}
                    className="w-full sm:w-auto flex-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none"
                  >
                    {DELIVERY_PARTNERS.map((dp) => (
                      <option key={dp.id} value={dp.id}>
                        {dp.name} ({dp.vehicle.split(' ')[0]})
                      </option>
                    ))}
                  </select>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {partner?.phone}
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 truncate">
                  Vehicle: {partner?.vehicle}
                </p>
              </div>

              {/* Stop by Stop Checklist */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span>
                    Stops Progress ({completedStops}/{route.stops.length})
                  </span>
                  <span className="text-[11px] text-cyan-600 dark:text-cyan-400">
                    Live Route Sheet
                  </span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {route.stops.map((stop, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border text-xs flex items-start justify-between gap-2.5 ${
                        stop.delivered
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/80 text-slate-700 dark:text-slate-300'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white truncate">
                            {stop.customer}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            (#{stop.orderId.replace('ORD-JSR-', '')})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate pl-5">
                          {stop.address}
                        </p>
                        <p className="text-[10px] text-cyan-700 dark:text-cyan-400 truncate pl-5">
                          {stop.parcel}
                        </p>
                      </div>

                      <div className="shrink-0 mt-0.5">
                        {stop.delivered ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                            Delivered
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium text-[10px]">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
