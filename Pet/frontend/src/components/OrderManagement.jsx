import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  IndianRupee,
  MapPin,
  Phone,
  User,
  ChevronDown,
  Sparkles,
  ExternalLink
} from 'lucide-react';

const INITIAL_ORDERS = [
  {
    id: 'ORD-JSR-7712',
    customerName: 'Ananya Sengupta',
    phone: '+91 94311 02819',
    items: [
      { name: 'Melonex Pet Oral Suspension (10ml)', qty: 1, price: 145 },
      { name: 'Savavet Kiwof Plus Dewormer', qty: 2, price: 420 }
    ],
    totalPrice: 565,
    zone: 'Bistupur',
    landmark: 'Near Gopal Maidan, Main Road',
    status: 'Processing', // 'Processing' | 'Out for Delivery' | 'Delivered'
    orderTime: '10:45 AM',
    prescriptionVerified: true
  },
  {
    id: 'ORD-JSR-7713',
    customerName: 'Rahul Verma',
    phone: '+91 98765 43210',
    items: [
      { name: 'Bravecto 500mg Chewable Tablet (10-20kg)', qty: 1, price: 1850 }
    ],
    totalPrice: 1850,
    zone: 'Kadma',
    landmark: 'Uliyan Block C, Near Ram Janaki Mandir',
    status: 'Out for Delivery',
    orderTime: '11:15 AM',
    prescriptionVerified: true
  },
  {
    id: 'ORD-JSR-7714',
    customerName: 'Priya Nair',
    phone: '+91 98220 11984',
    items: [
      { name: 'Pet Derm Medicated Shampoo (200ml)', qty: 1, price: 395 },
      { name: 'EarKleen Otic Cleanser (50ml)', qty: 1, price: 280 }
    ],
    totalPrice: 675,
    zone: 'Sakchi',
    landmark: 'Kalimati Road, Near Jubilee Park Gate',
    status: 'Processing',
    orderTime: '11:30 AM',
    prescriptionVerified: true
  },
  {
    id: 'ORD-JSR-7715',
    customerName: 'Dr. Vikram Sen',
    phone: '+91 98300 45678',
    items: [
      { name: 'Ceff Pet 300mg Tablets (Strip of 6)', qty: 2, price: 480 },
      { name: 'Himalaya Liv.52 Pet Liquid (110ml)', qty: 1, price: 175 }
    ],
    totalPrice: 655,
    zone: 'Bistupur',
    landmark: 'Circuit House Area, Road No. 4',
    status: 'Out for Delivery',
    orderTime: '09:20 AM',
    prescriptionVerified: true
  },
  {
    id: 'ORD-JSR-7716',
    customerName: 'Sunita Murmu',
    phone: '+91 94711 55670',
    items: [
      { name: 'Vivaldis Samolin Gut Probiotics (Pack of 10)', qty: 1, price: 360 },
      { name: 'Intas Melonex Oral Suspension', qty: 1, price: 145 }
    ],
    totalPrice: 505,
    zone: 'Mango',
    landmark: 'Dimna Road, Near Blue Bells School',
    status: 'Out for Delivery',
    orderTime: '09:05 AM',
    prescriptionVerified: true
  },
  {
    id: 'ORD-JSR-7717',
    customerName: 'Rajesh Patel',
    phone: '+91 98351 77210',
    items: [
      { name: 'Himalaya Immunol Pet Liquid (100ml)', qty: 2, price: 380 }
    ],
    totalPrice: 380,
    zone: 'Sakchi',
    landmark: 'Straight Mile Road, SNP Area',
    status: 'Delivered',
    orderTime: '08:30 AM',
    prescriptionVerified: true
  }
];

export default function OrderManagement({ onStatusUpdateToast }) {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [statusFilter, setStatusFilter] = useState('All');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Track order ID that recently changed for background pulse animation
  const [recentlyUpdatedId, setRecentlyUpdatedId] = useState(null);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    // Trigger visual feedback pulse
    setRecentlyUpdatedId(orderId);
    setTimeout(() => setRecentlyUpdatedId(null), 1800);

    if (onStatusUpdateToast) {
      onStatusUpdateToast(`Order #${orderId} marked as "${newStatus}"!`);
    }
  };

  // Filtered dataset
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesZone = zoneFilter === 'All' || order.zone === zoneFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.phone.includes(q) ||
      order.items.some((item) => item.name.toLowerCase().includes(q));

    return matchesStatus && matchesZone && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Out for Delivery':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
      {/* Controls & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Live Medicine Orders & Dispense Queue
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time digital prescriptions and OTC pet pharmaceuticals for Jamshedpur zones
          </p>
        </div>

        {/* Search & Zone Dropdown */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Order ID, customer, drug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>

          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none min-h-[38px]"
          >
            <option value="All">All Jamshedpur Zones</option>
            <option value="Bistupur">Bistupur</option>
            <option value="Sakchi">Sakchi</option>
            <option value="Kadma">Kadma</option>
            <option value="Mango">Mango</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Processing', 'Out for Delivery', 'Delivered'].map((status) => {
          const count =
            status === 'All'
              ? orders.length
              : orders.filter((o) => o.status === status).length;
          const isActive = statusFilter === status;

          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all min-h-[36px] cursor-pointer ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{status}</span>
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4">Order ID & Time</th>
              <th className="py-3 px-4">Customer & Contact</th>
              <th className="py-3 px-4">Prescribed Items</th>
              <th className="py-3 px-4">Total (INR)</th>
              <th className="py-3 px-4">Delivery Zone</th>
              <th className="py-3 px-4 text-center">Fulfillment Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                  <p className="font-semibold">No matching pharmacy orders found.</p>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const isRecentlyUpdated = recentlyUpdatedId === order.id;

                return (
                  <motion.tr
                    key={order.id}
                    animate={
                      isRecentlyUpdated
                        ? {
                            backgroundColor: [
                              'rgba(6, 182, 212, 0.15)',
                              'rgba(16, 185, 129, 0.15)',
                              'transparent'
                            ]
                          }
                        : {}
                    }
                    transition={{ duration: 1.5 }}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Order ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-1.5">
                        <span className="text-cyan-600 dark:text-cyan-400">#{order.id}</span>
                      </div>
                      <span className="text-[11px] font-sans font-normal text-slate-400 block mt-0.5">
                        {order.orderTime}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {order.customerName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        {order.phone}
                      </div>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="text-slate-800 dark:text-slate-200 truncate flex items-center justify-between gap-2"
                          >
                            <span className="truncate">{item.name}</span>
                            <span className="text-[11px] font-bold text-slate-500 shrink-0">
                              x{item.qty}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total Price */}
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white text-sm">
                      ₹{order.totalPrice.toLocaleString('en-IN')}
                    </td>

                    {/* Delivery Zone */}
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                        <span>{order.zone}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate max-w-[150px] mt-0.5">
                        {order.landmark}
                      </p>
                    </td>

                    {/* Status Dropdown Controller */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="relative inline-block text-left">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`appearance-none font-bold text-xs pl-3 pr-7 py-1.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all ${getStatusColor(
                            order.status
                          )}`}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 pointer-events-none text-current opacity-70" />
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
