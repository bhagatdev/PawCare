import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building,
  CheckCircle2,
  Lock,
  IndianRupee,
  Sparkles
} from 'lucide-react';

export default function CartDrawer({
  isOpen = false,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onOrderSuccess,
}) {
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cod'
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  // Subtotal in INR
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price_inr || item.price) || 0) * (item.quantity || 1),
    0
  );

  // Free delivery across Jamshedpur for orders >= ₹499
  const deliveryFee = subtotal >= 499 || subtotal === 0 ? 0 : 49;
  const grandTotal = subtotal + deliveryFee;

  const totalItemCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const handleSimulateRazorpayPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const fakeOrder = {
        orderId: `ORD-JSR-${Math.floor(1000 + Math.random() * 9000)}`,
        razorpayPaymentId: `pay_JSR_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        items: [...cartItems],
        totalAmount: grandTotal,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        deliveryZone: 'Bistupur Hub to Sakchi / Kadma Route',
        status: 'Dispatched',
      };
      setOrderConfirmed(fakeOrder);
      if (onOrderSuccess) {
        onOrderSuccess(fakeOrder);
      }
    }, 1200);
  };

  const handleCloseAll = () => {
    setIsRazorpayModalOpen(false);
    setOrderConfirmed(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Sliding Side Drawer */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between text-left"
              role="dialog"
              aria-modal="true"
              aria-label="Shopping Cart"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                      Medicine Basket
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} • Jamshedpur Express
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                {cartItems.length === 0 ? (
                  <div className="py-20 text-center text-slate-400 space-y-3">
                    <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">Your basket is empty</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Explore our authentic Indian veterinary pharmaceuticals to add syrups, antibiotics, and supplements.
                    </p>
                  </div>
                ) : (
                  cartItems.map((item) => {
                    const price = Number(item.price_inr || item.price) || 0;
                    const quantity = item.quantity || 1;

                    return (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-200 transition-colors flex items-center justify-between gap-3"
                      >
                        {/* Medicine Thumbnail */}
                        <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                          {item.image_url || item.image ? (
                            <img
                              src={item.image_url || item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src =
                                  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200';
                              }}
                            />
                          ) : (
                            <ShoppingBag className="w-5 h-5 text-slate-300" />
                          )}
                        </div>

                        {/* Name & Pricing */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs font-extrabold text-teal-700 mt-0.5">
                            ₹{price.toFixed(2)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity &&
                                onUpdateQuantity(item.id, Math.max(0, quantity - 1))
                              }
                              className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors text-xs cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>

                            <span className="text-xs font-bold text-slate-800 px-1">
                              {quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity &&
                                onUpdateQuantity(item.id, quantity + 1)
                              }
                              className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors text-xs cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Remove Button & Line Total */}
                        <div className="text-right flex flex-col justify-between items-end h-14">
                          {onRemoveItem && (
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.id)}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <span className="text-xs font-bold text-slate-900">
                            ₹{(price * quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer Section */}
              {cartItems.length > 0 && (
                <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-4">
                  {/* Delivery Perk Banner */}
                  <div className="flex items-center justify-between text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Free Jamshedpur Delivery &gt; ₹499
                    </span>
                    <span className="font-bold text-slate-800">
                      {deliveryFee === 0 ? 'Qualified' : `Add ₹${(499 - subtotal).toFixed(0)} more`}
                    </span>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Medicines Subtotal</span>
                      <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Express Delivery (Bistupur Hub)</span>
                      <span className="font-semibold text-emerald-700">
                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                      <span>Total Payable</span>
                      <span className="text-base font-extrabold text-teal-800">
                        ₹{grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Trigger Razorpay Checkout Modal */}
                  <button
                    type="button"
                    onClick={() => setIsRazorpayModalOpen(true)}
                    className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-600 hover:to-emerald-500 text-white font-bold text-sm shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <span>Proceed to Pay (₹{grandTotal.toFixed(2)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.aside>
          </div>

          {/* ========================================================= */}
          {/* RAZORPAY CHECKOUT MODAL PLACEHOLDER                       */}
          {/* ========================================================= */}
          <AnimatePresence>
            {isRazorpayModalOpen && (
              <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left"
                >
                  {/* Razorpay Branded Top Header */}
                  <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 text-white flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                          Razorpay Trusted Checkout
                        </span>
                        <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                      <h3 className="text-lg font-extrabold mt-0.5">PawCare Dispensary Jamshedpur</h3>
                      <p className="text-[11px] text-slate-300">GSTIN: 20AABCP1330F1Z5 • Bistupur Hub</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-300 block uppercase">Amount</span>
                      <span className="text-lg font-black text-white">₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {orderConfirmed ? (
                    /* Payment Success View */
                    <div className="p-6 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Payment Successful!</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Payment ID: <span className="font-mono font-bold text-slate-700">{orderConfirmed.razorpayPaymentId}</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Order No: <span className="font-mono font-bold text-teal-700">{orderConfirmed.orderId}</span>
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-800 text-left space-y-1">
                        <div className="flex items-center gap-1.5 font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                          <span>Delivery Dispatched to Local Route</span>
                        </div>
                        <p className="text-[11px] text-teal-700">
                          Assigned to Ramesh Yadav (Cold Box Carrier). ETA 30 mins to Bistupur/Sakchi zone.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleCloseAll}
                        className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs shadow-md transition-colors"
                      >
                        Track Delivery in Dashboard
                      </button>
                    </div>
                  ) : (
                    /* Indian Payment Modes Selector */
                    <div className="p-5 sm:p-6 space-y-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          Select Indian Payment Method
                        </label>

                        {/* UPI */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('upi')}
                          className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-colors ${
                            paymentMethod === 'upi'
                              ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                              <Smartphone className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-bold block">UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
                              <span className="text-[10px] text-slate-400">Instant refund & zero surcharge</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-indigo-600">Fastest</span>
                        </button>

                        {/* Credit/Debit Cards */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-colors ${
                            paymentMethod === 'card'
                              ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                              <CreditCard className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-bold block">Cards (Visa, Mastercard, RuPay)</span>
                              <span className="text-[10px] text-slate-400">All Indian domestic & international cards</span>
                            </div>
                          </div>
                        </button>

                        {/* Netbanking */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('netbanking')}
                          className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-colors ${
                            paymentMethod === 'netbanking'
                              ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                              <Building className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-bold block">Net Banking</span>
                              <span className="text-[10px] text-slate-400">SBI, HDFC, ICICI, Axis, PNB</span>
                            </div>
                          </div>
                        </button>
                      </div>

                      {/* UPI ID input if UPI chosen */}
                      {paymentMethod === 'upi' && (
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                          <label className="text-[11px] font-semibold text-slate-600 block">
                            Enter VPA / UPI ID or scan QR
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="e.g. mobile@upi or name@oksbi"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-indigo-600"
                            />
                            <button
                              type="button"
                              onClick={() => setUpiId('9876543210@paytm')}
                              className="px-2.5 py-1 text-[11px] bg-indigo-100 text-indigo-700 rounded-xl font-bold hover:bg-indigo-200"
                            >
                              Auto-Fill
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsRazorpayModalOpen(false)}
                          disabled={isProcessing}
                          className="flex-1 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSimulateRazorpayPayment}
                          disabled={isProcessing}
                          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-bold shadow-md shadow-blue-800/20 flex items-center justify-center gap-1.5"
                        >
                          {isProcessing ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Securing Payment...</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-4 h-4" />
                              <span>Pay ₹{grandTotal.toFixed(2)}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
